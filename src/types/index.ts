export type TipoMovimiento = "ingreso" | "gasto";

export interface Categoria {
  id: number;
  nombre: string;
  tipo: TipoMovimiento;
}

export interface Movimiento {
  id: number;
  descripcion: string;
  importe: number;
  tipo: TipoMovimiento;
  fecha: string;
  categoria_id: number;
}

export interface NuevoMovimiento {
  descripcion: string;
  importe: number;
  tipo: TipoMovimiento;
  fecha: string;
  categoria_id: number;
}