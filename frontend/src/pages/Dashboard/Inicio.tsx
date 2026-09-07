import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Wallet,
  Wrench,
  FileText,
  TrendingUp,
  TrendingDown,
  Home,
  CalendarDays,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge, { estadoColor } from "@/components/ui/Badge";
import { useFetch } from "@/hooks/useFetch";
import { moneda, fecha } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import { tienePermiso } from "@/lib/permisos";
import type { DashboardStats, Movimiento } from "@/types";

export default function Inicio() {
  const { usuario } = useAuth();

  // RBAC: los reportes/finanzas solo se consultan si el rol lo permite.
  const puedeVerReportes = tienePermiso(usuario, "reportes.ver");
  const puedeVerFinanzas = tienePermiso(usuario, "finanzas.ver");

  const { data: stats, cargando } = useFetch<DashboardStats>(
    puedeVerReportes ? "/reportes/dashboard" : null,
  );
  const { data: serie } = useFetch<{ mes: string; valor: number }[]>(
    puedeVerReportes ? "/reportes/finanzas-por-mes" : null,
  );
  const { data: movs } = useFetch<Movimiento[]>(
    puedeVerFinanzas ? "/finanzas" : null,
  );
  // Contadores no financieros para roles sin reportes (filtrados por permisos en el backend).
  const { data: basico } = useFetch<Partial<DashboardStats> & { eventos_proximos?: number }>(
    !puedeVerReportes ? "/reportes/resumen-basico" : null,
  );
  const ve = (m: string) => tienePermiso(usuario, `${m}.ver`);

  const ultimos = movs?.slice(0, 6) ?? [];
  const maxSerie = Math.max(...(serie?.map((s) => s.valor) ?? [1]));

  // Vista para roles sin acceso a reportes/finanzas (residente, seguridad...).
  if (!puedeVerReportes) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
            <Home className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-100">
            ¡Bienvenido, {usuario?.nombre?.split(" ")[0] ?? "vecino"}!
          </h2>
          <p className="text-gray-500 mt-2">
            Tu rol <Badge color="info">{usuario?.nombre_rol}</Badge> tiene acceso
            a los módulos disponibles en el menú lateral. Los datos financieros
            del conjunto solo son visibles para roles autorizados.
          </p>
        </div>

        {/* Indicadores: solo de los módulos que el rol puede ver */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ve("propiedades") && (
            <StatCard titulo="Propiedades" valor={`${basico?.propiedades ?? 0}`} icono={Building2} color="success" indicador="Unidades" />
          )}
          {ve("residentes") && (
            <StatCard titulo="Residentes" valor={`${basico?.residentes ?? 0}`} icono={Users} color="primary" indicador="Activos" />
          )}
          {ve("mantenimiento") && (
            <StatCard titulo="Mantenimientos" valor={`${basico?.mantenimientos_pendientes ?? 0}`} icono={Wrench} color="danger" indicador="Pendientes" subida={false} />
          )}
          {ve("documentos") && (
            <StatCard titulo="Documentos" valor={`${basico?.documentos ?? 0}`} icono={FileText} color="primary" indicador="Publicados" />
          )}
          {ve("eventos") && (
            <StatCard titulo="Eventos" valor={`${basico?.eventos_proximos ?? 0}`} icono={CalendarDays} color="warning" indicador="Próximos" />
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-3">Dónde encontrar cada cosa</h3>
          <ul className="text-sm text-gray-500 space-y-2">
            {ve("eventos") && (<li className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary-500" /> Eventos y novedades del conjunto en "Eventos".
            </li>)}
            {ve("mantenimiento") && (<li className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary-500" /> {tienePermiso(usuario, "mantenimiento.crear") ? "Reporta fallas y solicitudes" : "Consulta las órdenes"} en "Mantenimiento".
            </li>)}
            {ve("documentos") && (<li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" /> Descarga documentos (actas, contratos) en "Documentos".
            </li>)}
            {ve("residentes") && (<li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" /> Consulta el directorio en "Residentes".
            </li>)}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard titulo="Residentes" valor={`${stats?.residentes ?? 0}`} icono={Users} color="primary" indicador="Activos" />
        <StatCard titulo="Propiedades" valor={`${stats?.propiedades ?? 0}`} icono={Building2} color="success" indicador="Unidades" />
        <StatCard titulo="Saldo" valor={moneda(stats?.saldo)} icono={Wallet} color="warning" indicador={stats && stats.saldo < 0 ? "En déficit" : "En superávit"} subida={(stats?.saldo ?? 0) >= 0} />
        <StatCard titulo="Mantenimientos" valor={`${stats?.mantenimientos_pendientes ?? 0}`} icono={Wrench} color="danger" indicador="Pendientes" subida={false} />
      </div>

      {/* Gráfica + resumen financiero */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Gráfica de ingresos por mes */}
        <div className="card lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ingresos por mes</h3>
            <Badge color="info">Últimos meses</Badge>
          </div>
          <div className="flex items-end gap-3 h-52">
            {serie?.length ? (
              serie.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2"
                  style={{ height: "100%", justifyContent: "flex-end" }}
                >
                  <span className="text-xs font-semibold text-gray-500">{moneda(s.valor)}</span>
                  <div
                    className="w-full rounded-t-md bg-primary-500 hover:bg-primary-600 transition"
                    style={{ height: `${(s.valor / maxSerie) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400">{s.mes}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">{cargando ? "Cargando..." : "Sin datos."}</p>
            )}
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-4">Resumen financiero</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-gray-500">Ingresos</span>
              </div>
              <span className="font-semibold text-success">{moneda(stats?.ingresos)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-danger" />
                <span className="text-sm text-gray-500">Gastos</span>
              </div>
              <span className="font-semibold text-danger">{moneda(stats?.gastos)}</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Pagos pendientes</span>
              <Badge color="warning">{stats?.pagos_pendientes ?? 0} movs.</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Pagos pagados</span>
              <Badge color="success">{stats?.pagos_pagados ?? 0} movs.</Badge>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                <span className="text-sm text-gray-500">Documentos</span>
              </div>
              <span className="font-semibold text-gray-700">{stats?.documentos ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos movimientos */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold mb-4">Últimos movimientos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">Concepto</th>
                <th className="py-2 font-medium">Propiedad</th>
                <th className="py-2 font-medium">Vencimiento</th>
                <th className="py-2 font-medium">Monto</th>
                <th className="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimos.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-2.5">{m.concepto_nombre}</td>
                  <td className="py-2.5 text-gray-500">{m.propiedad_desc ?? "—"}</td>
                  <td className="py-2.5 text-gray-500">{fecha(m.fecha_vencimiento)}</td>
                  <td className="py-2.5 font-semibold">{moneda(m.monto)}</td>
                  <td className="py-2.5"><Badge color={estadoColor(m.estado)}>{m.estado}</Badge></td>
                </tr>
              ))}
              {!ultimos.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    {cargando ? "Cargando..." : "Sin movimientos registrados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
