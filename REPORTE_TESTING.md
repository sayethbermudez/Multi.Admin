# REPORTE DE TESTING — Multi-Administrador

**Fecha:** 2026-09-06
**Entorno:** Backend conectado a **PostgreSQL real** y **Redis real** en vivo. Frontend servido en `:3000` (dev) y build de producción generado.

---

## 1. Resumen de resultados

| Año | Método | Resultado |
|-----|--------|-----------|
| API (integración) | `pytest tests/test_api.py` — 20 pruebas | ✅ **20/20 passed** |
| Backend (unit) | `pytest tests/test_unit.py` — 8 pruebas | ✅ **8/8 passed** |
| Frontend | `tsc --noEmit` (strict) | ✅ **0 errores** |
| Frontend | `vite build` (producción) | ✅ **OK** |
| Recuperación de contraseña | end-to-end manual | ✅ **funciona** |
| Rutas SPA | 7 rutas | ✅ **todas 200** |
| Docker Compose | validación YAML | ✅ **válido** |
| **TOTAL backend** | 28 pruebas | ✅ **28/28** |

---

## 2. Backend — API (integración, contra PostgreSQL + Redis reales)

`backend/tests/test_api.py` — `pytest -v` → **20 passed**.

- `test_health` / `test_root` → servicio sano.
- `test_roles` → existen `super_admin`, `admin`, `residente`, etc.
- `test_login_correcto` → JWT emitido correctamente.
- `test_login_incorrecto` → credenciales erróneas rechazadas.
- `test_register_duplicado` → 400 si el correo existe.
- `test_logout_revoca_token` → token entra a la **blacklist de Redis**; reuso → **401**.
- `test_dashboard_stats`, `test_finanzas_resumen`, `test_finanzas_por_mes` → datos reales.
- `test_listar_propiedades`, `test_listar_residentes`, `test_crear_y_eliminar_propiedad` → CRUD.
- `test_mantenimiento_listar`, `test_documentos_listar`, `test_eventos_listar`, `test_usuarios_listar`.
- `test_chatbot_respuesta`, `test_chatbot_persiste_historial`, `test_chatbot_conceptos` → chatbot con datos reales y persistencia.

## 3. Backend — Unit tests

`backend/tests/test_unit.py` — ✅ **8 passed** (hashing bcrypt, JWT, detección de intents del chatbot, formato de moneda).

## 4. Recuperación de contraseña (end-to-end)

```
Solicitar enlace  → token guardado en BD (30 min)
  → POST /restablecer-password con el token
  → login con la NUEVA contraseña  ✅ ok
  → token de recuperación limpiado en BD ✅
```

## 5. Redis (verificado con `redis-cli`)

| Caso de uso | Clave | Estado |
|-------------|-------|--------|
| Caché de dashboard | `dashboard_stats` | ✅ con TTL |
| Caché finanzas | `finanzas_resumen`, `finanzas_por_mes` | ✅ |
| Revocación de sesión | `blacklist:<token>` | ✅ (rechaza 401) |
| Rate limiting | `rl:<ip>:login:...` | ✅ (HTTP 429 al exceder) |

## 6. Frontend

- **TypeScript strict** sin errores.
- **Build de producción** generado (`dist/`).
- Todas las rutas SPA responden **200** (landing, login, register, recuperar, dashboard y módulos).
- Login y registro reales contra la API.

## 7. Docker Compose

`docker-compose.yml` **válido** (estructura + servicios `db`, `redis`, `backend`, `frontend`).
Frontend expuesto en **`3000:80`**. El `db` monta `./db/init.sql` (esquema automático) y el backend usa `REDIS_URL=redis:6379`.

> ⚠️ **Nota del sandbox:** Docker no está disponible en este entorno, por lo que **no se pudo levantar `docker compose` aquí**; la validación fue estructural. Los 5 servicios ya fueron probados **de forma equivalente** corriendo nativamente (PostgreSQL 17 real, Redis 8 real, uvicorn, Vite), cubriendo el mismo stack.

## 8. Cómo ejecutar las pruebas

```bash
# Backend (API de integración + unit)
cd backend
.venv/bin/python -m pytest tests/ -v

# Frontend
cd ../frontend
npx tsc --noEmit        # typecheck estricto
npx vite build          # build producción
```

## 9. Editar / Eliminar / Descarga (nuevo, probado en vivo)

- **Editar y eliminar** disponibles en **todos** los módulos del dashboard:
  Usuarios, Residentes, Propiedades, Finanzas, Mantenimiento, Documentos y Eventos.
  Cada fila tiene botones ✏️ (editar, abre modal prellenado) y 🗑️ (eliminar con diálogo de confirmación).
- **Usuarios**: además se puede **activar/desactivar** (clic en el badge de estado).
- **Documentos**:
  - **Subir archivo real** (`POST /documentos/upload`, multipart) → se guarda en disco.
  - **Descargar** (`GET /documentos/{id}/descargar` → `FileResponse` con nombre del archivo).
  - **Editar** metadatos y **eliminar** (borra también el archivo físico).

**Verificado con `curl` real (PostgreSQL + Redis + disco):**
- Subir: id creado, `tamano=68`, `mime=text/plain` ✅
- Descargar: contenido devuelto + `Content-Disposition: filename=Reglamento de prueba` ✅
- Editar: título cambiado y visible en la lista ✅
- Eliminar: `204` y archivo físico borrado ✅
- Propiedades/Residentes/Eventos/Mantenimiento: crear→editar→eliminar → `204` ✅
- Usuarios: editar rol → `admin` ✅

## 10. Pendientes / recomendaciones

- Docker no pudo ejecutarse en este sandbox (validar `docker compose up --build -d` en una máquina con Docker).
- Se probó sin SMTP real (la recuperación guarda el token y no revela si el correo existe). Con credenciales SMTP en `.env` se envía el correo de verdad.
- Opcional: añadir CI (GitHub Actions) que corra estos tests automáticamente.
