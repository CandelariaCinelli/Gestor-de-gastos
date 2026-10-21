//operaciones CRUD: crear, leer, actualizar y eliminar registros, calcular saldo
import { obtenerDB } from "../database/database";
import type {
    Movimiento,
    NuevoMovimiento,
} from "../types";

export async function listarMovimientos(): Promise<Movimiento[]> {
  const db = await obtenerDB();

  return db.getAllAsync<Movimiento>(`
    SELECT
      m.id,
      m.descripcion,
      m.importe,
      m.tipo,
      m.fecha,
      m.categoria_id
    FROM movimientos m
    ORDER BY m.fecha DESC, m.id DESC
  `);
}

export async function crearMovimiento(
  movimiento: NuevoMovimiento
): Promise<void> {
  const db = await obtenerDB();

  await db.runAsync(
    `INSERT INTO movimientos
      (descripcion, importe, tipo, fecha, categoria_id)
     VALUES (?, ?, ?, ?, ?)`,
    movimiento.descripcion,
    movimiento.importe,
    movimiento.tipo,
    movimiento.fecha,
    movimiento.categoria_id
  );
}

export async function editarMovimiento(
  id: number,
  movimiento: NuevoMovimiento
): Promise<void> {
  const db = await obtenerDB();

  await db.runAsync(
    `UPDATE movimientos
     SET descripcion = ?,
         importe = ?,
         tipo = ?,
         fecha = ?,
         categoria_id = ?
     WHERE id = ?`,
    movimiento.descripcion,
    movimiento.importe,
    movimiento.tipo,
    movimiento.fecha,
    movimiento.categoria_id,
    id
  );
}

export async function eliminarMovimiento(
  id: number
): Promise<void> {
  const db = await obtenerDB();

  await db.runAsync(
    "DELETE FROM movimientos WHERE id = ?",
    id
  );
}

export async function calcularSaldo(): Promise<number> {
  const db = await obtenerDB();

  const resultado = await db.getFirstAsync<{
    saldo_inicial: number;
    ingresos: number;
    gastos: number;
  }>(`
    SELECT
      c.saldo_inicial,
      COALESCE(
        SUM(CASE WHEN m.tipo = 'ingreso'
          THEN m.importe ELSE 0 END), 0
      ) AS ingresos,
      COALESCE(
        SUM(CASE WHEN m.tipo = 'gasto'
          THEN m.importe ELSE 0 END), 0
      ) AS gastos
    FROM configuracion c
    LEFT JOIN movimientos m ON 1 = 1
    WHERE c.id = 1
    GROUP BY c.id
  `);
  if (resultado === null) {
    return 0;
  }

  return resultado.saldo_inicial +
    resultado.ingresos -
    resultado.gastos;
}
  

  export async function obtenerMovimiento(
  id: number
): Promise<Movimiento | null> {
  const db = await obtenerDB();

  return db.getFirstAsync<Movimiento>(
    `SELECT id, descripcion, importe, tipo, fecha, categoria_id
     FROM movimientos
     WHERE id = ?`,
    id
  );
}