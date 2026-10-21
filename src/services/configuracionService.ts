import { obtenerDB } from "../database/database";

export async function obtenerSaldoInicial(): Promise<number> {
  const db = await obtenerDB();

  const resultado = await db.getFirstAsync<{
    saldo_inicial: number;
  }>(
    "SELECT saldo_inicial FROM configuracion WHERE id = 1"
  );

  return resultado?.saldo_inicial ?? 0;
}

export async function actualizarSaldoInicial(
  saldo: number
): Promise<void> {
  if (!Number.isFinite(saldo) || saldo < 0) {
    throw new Error("Ingresá un saldo inicial válido");
  }

  const db = await obtenerDB();

  await db.runAsync(
    "UPDATE configuracion SET saldo_inicial = ? WHERE id = 1",
    saldo
  );
}