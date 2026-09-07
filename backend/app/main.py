"""Punto de entrada de la API de Multi-Administrador (FastAPI)."""
import os
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
import app.models  # noqa: F401  (registra los modelos)
from app.routers import (
    auth, usuario, residente, propiedad, finanzas,
    mantenimiento, documento, evento, configuracion, reporte, chatbot,
    notificacion, admin,
)
from app.seed import ejecutar_seed
from app.permisos import sincronizar_permisos

logging.basicConfig(level=logging.INFO)

# Crea las tablas si no existen.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Administrador API",
    description="API del sistema de administración de conjuntos residenciales.",
    version="1.0.0",
)

# ----------------------------- CORS -----------------------------------------
_origenes_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000",
)
ALLOWED_ORIGINS = [o.strip() for o in _origenes_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------- Routers --------------------------------------
for r in [
    auth.router, usuario.router, residente.router, propiedad.router,
    finanzas.router, mantenimiento.router, documento.router, evento.router,
    configuracion.router, reporte.router, chatbot.router,
    notificacion.router, admin.router,
]:
    app.include_router(r)


@app.on_event("startup")
def arrancar():
    """Siembra datos iniciales si la base está vacía (idempotente)."""
    db: Session = SessionLocal()
    try:
        sincronizar_permisos(db)
        ejecutar_seed(db)
    finally:
        db.close()


@app.get("/")
def home():
    return {"mensaje": "Multi-Administrador API funcionando", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
