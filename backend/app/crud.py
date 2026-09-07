"""Operaciones de autenticación, usuarios y recuperación de contraseña."""
import asyncio
import logging
import os
import secrets
from datetime import datetime, timedelta

from fastapi_mail import FastMail, MessageSchema, MessageType
from sqlalchemy.orm import Session

from app.models import Usuario, Rol, Permiso, RolPermiso
from app.email_config import conf, mail_configurado
from app.security import hashear_password, verificar_password

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# USUARIOS
# ---------------------------------------------------------------------------
def crear_usuario(db: Session, datos) -> Usuario:
    existe = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existe:
        raise ValueError("Ya existe un usuario registrado con ese correo.")

    nuevo = Usuario(
        nombre=datos.nombre,
        telefono=datos.telefono or "",
        correo=datos.correo,
        contrasena_hash=hashear_password(datos.contrasena),
        rol_id=datos.rol_id,
        activo=True,
        fecha_creacion=datetime.utcnow(),
        id_copropiedad=datos.id_copropiedad,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_rol(db: Session, rol_id: int):
    return db.query(Rol).filter(Rol.id == rol_id).first()


def obtener_permisos_rol(db: Session, rol_id: int) -> list[str]:
    """Devuelve la lista de códigos de permiso asignados al rol desde la BD."""
    filas = (
        db.query(Permiso.codigo)
        .join(RolPermiso, RolPermiso.permiso_id == Permiso.id)
        .filter(RolPermiso.rol_id == rol_id)
        .all()
    )
    return [fila[0] for fila in filas]


def listar_usuarios(db: Session):
    return db.query(Usuario).all()


def obtener_usuario_por_id(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()


def actualizar_usuario(db: Session, usuario: Usuario, datos) -> Usuario:
    if datos.nombre is not None:
        usuario.nombre = datos.nombre
    if datos.telefono is not None:
        usuario.telefono = datos.telefono
    if datos.correo is not None:
        usuario.correo = datos.correo
    if datos.rol_id is not None:
        usuario.rol_id = datos.rol_id
    if datos.activo is not None:
        usuario.activo = datos.activo
    db.commit()
    db.refresh(usuario)
    return usuario


def serializar_usuario(u: Usuario, db: Session) -> dict:
    rol = obtener_rol(db, u.rol_id)
    return {
        "id": u.id,
        "nombre": u.nombre,
        "telefono": u.telefono,
        "correo": u.correo,
        "rol_id": u.rol_id,
        "nombre_rol": rol.nombre if rol else "sin rol",
        "activo": u.activo,
        "id_copropiedad": u.id_copropiedad,
        "permisos": obtener_permisos_rol(db, u.rol_id),
    }


# ---------------------------------------------------------------------------
# LOGIN
# ---------------------------------------------------------------------------
def login_usuario(db: Session, correo: str, password: str):
    usuario = db.query(Usuario).filter(Usuario.correo == correo.strip()).first()
    if not usuario:
        return None
    if not usuario.activo:
        return None
    if not verificar_password(password, usuario.contrasena_hash):
        return None
    usuario.ultimo_acceso = datetime.utcnow()
    db.commit()
    return usuario


# ---------------------------------------------------------------------------
# RECUPERACIÓN DE CONTRASEÑA (envía correo real vía SMTP)
# ---------------------------------------------------------------------------
async def enviar_recuperacion(db: Session, correo: str) -> dict:
    """Genera token, lo guarda en BD y envía el correo con el enlace."""
    correo_limpio = correo.strip()
    usuario = db.query(Usuario).filter(Usuario.correo == correo_limpio).first()

    if not usuario:
        logger.info("[recuperacion] Solicitud para un correo no registrado")
        return {"enviado": False, "error": None}

    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if not frontend_url:
        return {"enviado": False, "error": "Falta configurar FRONTEND_URL"}

    token = secrets.token_urlsafe(32)
    usuario.token_recuperacion = token
    usuario.expira_token = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

    link = f"{frontend_url.rstrip('/')}/restablecer/{token}"

    if not mail_configurado():
        # Si no hay SMTP real, guardamos el enlace para poder probar.
        logger.warning("[recuperacion] SMTP no configurado; token guardado en BD.")
        return {"enviado": False, "sin_smtp": True, "link": link}

    mensaje = MessageSchema(
        subject="Recuperación de contraseña - Multi-Administrador",
        recipients=[correo_limpio],
        body=(
            f"Hola {usuario.nombre},\n\n"
            "Se solicitó recuperar tu contraseña.\n\n"
            f"Utiliza este enlace para establecer una nueva contraseña:\n{link}\n\n"
            "Este enlace expirará en 30 minutos.\n\n"
            "Si no solicitaste este cambio, puedes ignorar este correo.\n\n"
            "Equipo Multi-Administrador."
        ),
        subtype=MessageType.plain,
    )

    try:
        fast_mail = FastMail(conf)
        await asyncio.wait_for(fast_mail.send_message(mensaje), timeout=30)
        logger.info("[recuperacion] Correo enviado correctamente")
        return {"enviado": True, "error": None}
    except Exception as error:
        logger.exception("[recuperacion] Error al enviar el correo")
        return {"enviado": False, "error": f"{type(error).__name__}: {error}", "link": link}


def cambiar_password(db: Session, token: str, nueva_password: str) -> bool:
    usuario = db.query(Usuario).filter(Usuario.token_recuperacion == token).first()
    if not usuario:
        return False
    if not usuario.expira_token:
        return False
    if usuario.expira_token < datetime.utcnow():
        return False
    usuario.contrasena_hash = hashear_password(nueva_password)
    usuario.token_recuperacion = None
    usuario.expira_token = None
    db.commit()
    return True
