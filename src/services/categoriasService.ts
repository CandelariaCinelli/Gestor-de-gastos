import { obtenerDB } from "../database/database";
import type { Categoria, TipoMovimiento } from "../types";

export async function listarCategorias(): Promise<Categoria[]> {
  const db = await obtenerDB();

  return db.getAllAsync<Categoria>(
    "SELECT id, nombre, tipo FROM categorias ORDER BY nombre ASC"
  );
}

export async function crearCategoria(
  nombre: string,
  tipo: TipoMovimiento
): Promise<void> {
  const db = await obtenerDB();

  const nombreLimpio = nombre.trim();

  if (nombreLimpio.length === 0) {
    throw new Error("El nombre de la categoría es obligatorio");
  }

  await db.runAsync(
    "INSERT INTO categorias (nombre, tipo) VALUES (?, ?)",
    nombreLimpio,
    tipo
  );
}

export async function eliminarCategoria(id: number): Promise<void> {
  const db = await obtenerDB();

  const uso = await db.getFirstAsync<{ cantidad: number }>(
    "SELECT COUNT(*) AS cantidad FROM movimientos WHERE categoria_id = ?",
    id
  );

  if (uso && uso.cantidad > 0) {
    throw new Error(
      "No se puede eliminar una categoría que tiene movimientos asociados"
    );
  }

  await db.runAsync(
    "DELETE FROM categorias WHERE id = ?",
    id
  );
}