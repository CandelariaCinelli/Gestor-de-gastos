
import * as SQLite from "expo-sqlite";
import {
  CATEGORIAS_INICIALES,
  CREAR_TABLAS,
} from "./schema";

let conexion: Promise<SQLite.SQLiteDatabase> | null = null;

export async function obtenerDB(): Promise<SQLite.SQLiteDatabase> {
  if (!conexion) {
    conexion = inicializarDB();
  }

  return conexion;
}

async function inicializarDB(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("gestor_gastos.db");

  await db.execAsync("PRAGMA foreign_keys = ON;");

  await db.execAsync(CREAR_TABLAS);

  for (const categoria of CATEGORIAS_INICIALES) {
    await db.runAsync(
      `INSERT INTO categorias (nombre, tipo)
       SELECT ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM categorias
         WHERE nombre = ? AND tipo = ?
       )`,
      categoria.nombre,
      categoria.tipo,
      categoria.nombre,
      categoria.tipo
    );
  }

  return db;
}
