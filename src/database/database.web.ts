
import type { Database as SqlDatabase, SqlValue } from "sql.js";
// @ts-ignore: algunas versiones de @types/sql.js no declaran este submódulo.
import initSqlJs from "sql.js/dist/sql-asm.js";

import {
    CATEGORIAS_INICIALES,
    CREAR_TABLAS,
} from "./schema";

type BaseDatos = {
  execAsync: (sql: string) => Promise<void>;
  runAsync: (sql: string, ...params: unknown[]) => Promise<void>;
  getAllAsync: <T>(sql: string, ...params: unknown[]) => Promise<T[]>;
  getFirstAsync: <T>(
    sql: string,
    ...params: unknown[]
  ) => Promise<T | null>;
};

let conexion: Promise<BaseDatos> | null = null;

export async function obtenerDB(): Promise<BaseDatos> {
  if (!conexion) {
    conexion = inicializarDB();
  }

  return conexion;
}

async function inicializarDB(): Promise<BaseDatos> {
  const SQL = await initSqlJs();
  const db: SqlDatabase = new SQL.Database();

  const ejecutar = (sql: string, params: unknown[] = []) => {
    const statement = db.prepare(sql);

    try {
      statement.bind(params as SqlValue[]);

      const filas: Record<string, unknown>[] = [];

      while (statement.step()) {
        filas.push(statement.getAsObject());
      }

      return filas;
    } finally {
      statement.free();
    }
  };

  const base: BaseDatos = {
  async execAsync(sql: string): Promise<void> {
    db.run(sql);
  },

  async runAsync(
    sql: string,
    ...params: unknown[]
  ): Promise<void> {
    db.run(sql, params as SqlValue[]);
  },

  async getAllAsync<T>(
    sql: string,
    ...params: unknown[]
  ): Promise<T[]> {
    const filas = ejecutar(sql, params);
    return filas as T[];
  },

  async getFirstAsync<T>(
    sql: string,
    ...params: unknown[]
  ): Promise<T | null> {
    const filas = ejecutar(sql, params);
    return (filas[0] as T | undefined) ?? null;
  },
};

  await base.execAsync("PRAGMA foreign_keys = ON;");
  await base.execAsync(CREAR_TABLAS);

  for (const categoria of CATEGORIAS_INICIALES) {
    await base.runAsync(
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

  return base;
}
