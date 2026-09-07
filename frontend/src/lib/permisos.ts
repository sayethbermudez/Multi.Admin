import type { Usuario } from "@/types";

/**
 * Utilidades de RBAC en el frontend.
 *
 * Los permisos llegan desde el backend en `usuario.permisos` (lista de códigos
 * tipo "usuarios.ver", "finanzas.crear", ...), extraídos de la tabla
 * `rol_permisos` de PostgreSQL. Aquí se consultan para decidir qué mostrar
 * en el menú y qué rutas se pueden visitar.
 */

/**
 * ¿El usuario tiene un permiso concreto por código? (ej. "finanzas.ver").
 * Los roles con todos los permisos (super_admin/admin) se reconocen como
 * "acceso total" aunque la lista llegue de la BD, por robustez.
 */
export function tienePermiso(usuario: Usuario | null, codigo: string): boolean {
  if (!usuario) return false;
  // super_admin (1) y admin (2) tienen acceso total por diseño.
  if (rolEsAdmin(usuario)) return true;
  if (!Array.isArray(usuario.permisos)) return false;
  return usuario.permisos.includes(codigo);
}

/** ¿El rol es de administración (acceso total)? */
export function rolEsAdmin(usuario: Usuario | null): boolean {
  if (!usuario) return false;
  return usuario.rol_id === 1 || usuario.rol_id === 2;
}

/**
 * ¿Puede el usuario ver un módulo completo? Un módulo se considera
 * accesible si su rol tiene el permiso `<modulo>.ver`.
 */
export function puedeVerModulo(usuario: Usuario | null, modulo: string): boolean {
  return tienePermiso(usuario, `${modulo}.ver`);
}
