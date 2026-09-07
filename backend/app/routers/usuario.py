"""Gestión de usuarios."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.deps import require_permiso

router = APIRouter(prefix="/usuarios", tags=["Usuarios"], dependencies=[Depends(require_permiso("usuarios.ver"))])


@router.get("", response_model=list[schemas.UsuarioResponse])
def listar(db: Session = Depends(get_db)):
    return [crud.serializar_usuario(u, db) for u in crud.listar_usuarios(db)]


@router.get("/{usuario_id}", response_model=schemas.UsuarioResponse)
def detalle(usuario_id: int, db: Session = Depends(get_db)):
    u = crud.obtener_usuario_por_id(db, usuario_id)
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    return crud.serializar_usuario(u, db)


@router.put("/{usuario_id}", response_model=schemas.UsuarioResponse, dependencies=[Depends(require_permiso("usuarios.editar"))])
def actualizar(usuario_id: int, data: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    u = crud.obtener_usuario_por_id(db, usuario_id)
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    u = crud.actualizar_usuario(db, u, data)
    return crud.serializar_usuario(u, db)
