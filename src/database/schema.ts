export const CREAR_TABLAS = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto'))
  );

  CREATE TABLE IF NOT EXISTS movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    importe REAL NOT NULL CHECK (importe > 0),
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
    fecha TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id)
      REFERENCES categorias(id)
  );

  CREATE TABLE IF NOT EXISTS configuracion (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    saldo_inicial REAL NOT NULL DEFAULT 0
  );

  INSERT OR IGNORE INTO configuracion (id, saldo_inicial)
  VALUES (1, 0);
`;

export const CATEGORIAS_INICIALES = [
  { nombre: "Sueldo", tipo: "ingreso" },
  { nombre: "Ventas", tipo: "ingreso" },
  { nombre: "Alimentos", tipo: "gasto" },
  { nombre: "Transporte", tipo: "gasto" },
  { nombre: "Servicios", tipo: "gasto" },
  { nombre: "Otros", tipo: "gasto" },
] as const;