"""Autenticación: registro, login, recuperación y restablecimiento de contraseña."""
from fastapi import APIRouter, Depends, Request, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import crud, schemas
from app.auth_jwt import crear_token, segundos_restantes
from app.database import get_db
from app.rate_limit import limitar, resetear
from app.models import Rol
from app.deps import get_current_user
from app.redis_client import revocar_token

router = APIRouter(tags=["Autenticación"])


class LoginRequest(BaseModel):
    correo: str
    password: str


@router.get("/roles")
def listar_roles(db: Session = Depends(get_db)):
    return [{"id": r.id, "nombre": r.nombre} for r in db.query(Rol).all()]


@router.post("/register", response_model=schemas.UsuarioResponse)
def registrar(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    try:
        nuevo = crud.crear_usuario(db, usuario)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return crud.serializar_usuario(nuevo, db)


@router.post("/login")
def login(request: Request, datos: LoginRequest, db: Session = Depends(get_db)):
    limitar(request, "login", max_intentos=5, ventana_segundos=60)

    usuario = crud.login_usuario(db, datos.correo, datos.password)
    if not usuario:
        return {"ok": False, "mensaje": "Correo o contraseña incorrectos."}

    resetear(request, "login")

    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol_id})
    return {
        "ok": True,
        "access_token": token,
        "token_type": "bearer",
        "usuario": crud.serializar_usuario(usuario, db),
    }


@router.get("/me", response_model=schemas.UsuarioResponse)
def perfil_actual(
    usuario=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Devuelve el usuario autenticado con su listado de permisos (RBAC)."""
    return crud.serializar_usuario(usuario, db)


@router.post("/logout")
def logout(
    authorization: str = Header(None),
    usuario=Depends(get_current_user),
):
    """Cierra la sesión revocando el JWT vigente en Redis (lista negra)."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
        revocar_token(token, segundos_restantes(token))
    return {"ok": True, "mensaje": "Sesión cerrada correctamente."}


@router.post("/recuperar-password")
async def recuperar_password(
    request: Request,
    datos: schemas.RecuperarPassword,
    db: Session = Depends(get_db),
):
    limitar(request, "recuperar-password", max_intentos=3, ventana_segundos=300)
    result = await crud.enviar_recuperacion(db, datos.correo)

    # No se revela si el correo existe (anti-enumeración).
    respuesta = {"mensaje": "Si el correo existe, se envió un enlace de recuperación."}

    # Modo demo/desarrollo: sin SMTP configurado, devolvemos el enlace generado
    # para que el flujo completo se pueda probar (en producción se envía por correo).
    if result.get("sin_smtp") and result.get("link"):
        respuesta["modo"] = "demo"
        respuesta["link"] = result["link"]
    return respuesta


@router.post("/restablecer-password")
def restablecer_password(
    datos: schemas.NuevaPassword,
    db: Session = Depends(get_db),
):
    ok = crud.cambiar_password(db, datos.token, datos.nueva_password)
    return {
        "ok": ok,
        "mensaje": "Contraseña actualizada correctamente." if ok else "El enlace es inválido o ya expiró.",
    }
