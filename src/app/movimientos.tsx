//Pantalla de movimientos, listado, eliminar, editar, navegación entre pantallas
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { obtenerDB } from "../database/database";
import {
  eliminarMovimiento
} from "../services/movimientosService";
import type { Movimiento } from "../types";
import { mostrarMensaje } from "../utils/notificaciones";

type MovimientoConCategoria = Movimiento & {
  categoria_nombre: string;
};

export default function MovimientosScreen() {
  const router = useRouter();

  const [movimientos, setMovimientos] = useState<
    MovimientoConCategoria[]
  >([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarMovimientos = useCallback(async () => {
    try {
      setError("");

      const db = await obtenerDB();

      const lista = await db.getAllAsync<MovimientoConCategoria>(`
        SELECT
          m.id,
          m.descripcion,
          m.importe,
          m.tipo,
          m.fecha,
          m.categoria_id,
          c.nombre AS categoria_nombre
        FROM movimientos m
        INNER JOIN categorias c ON c.id = m.categoria_id
        ORDER BY m.fecha DESC, m.id DESC
      `);

      setMovimientos(lista);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los movimientos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarMovimientos();
    }, [cargarMovimientos])
  );

  function confirmarEliminacion(movimiento: Movimiento) {
    Alert.alert(
      "Eliminar movimiento",
      `¿Querés eliminar "${movimiento.descripcion}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarMovimiento(movimiento.id);
              await cargarMovimientos();
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "No se pudo eliminar el movimiento.");
            }
          },
        },
      ]
    );
    mostrarMensaje(
      "Eliminar movimiento",
      `¿Querés eliminar "${movimiento.descripcion}"?`
    );
  }

  const dinero = (importe: number) =>
    importe.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    });

  return (
    <ScrollView style={estilos.fondo}
      contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo}>Mis movimientos</Text>

      <Pressable
        style={estilos.boton}
        onPress={() => router.push("../nuevo-movimiento")}
      >
        <Text style={estilos.textoBoton}>+ Agregar movimiento</Text>
      </Pressable>

      {cargando && <Text>Cargando movimientos...</Text>}
      {error !== "" && <Text style={estilos.error}>{error}</Text>}

      {!cargando && movimientos.length === 0 && (
        <Text style={estilos.vacio}>
          Todavía no registraste movimientos.
        </Text>
      )}

      {movimientos.map((m) => (
        <View key={m.id} style={estilos.tarjeta}>
          <View style={estilos.encabezado}>
            <View style={estilos.datos}>
              <Text style={estilos.descripcion}>
                {m.descripcion}
              </Text>
              <Text style={estilos.secundario}>
                {m.categoria_nombre}
              </Text>
              <Text style={estilos.secundario}>{m.fecha}</Text>
            </View>

            <Text
              style={[
                estilos.importe,
                m.tipo === "ingreso"
                  ? estilos.ingreso
                  : estilos.gasto,
              ]}
            >
              {m.tipo === "ingreso" ? "+" : "-"}
              {dinero(m.importe)}
            </Text>
          </View>

          <View style={estilos.acciones}>
            <Pressable
              style={estilos.botonEditar}
              onPress={() =>
                router.push({
                  pathname: "../nuevo-movimiento",
                  params: { id: String(m.id) },
                })
              }
            >
              <Text style={estilos.textoEditar}>Editar</Text>
            </Pressable>

            <Pressable
              style={estilos.botonEliminar}
              onPress={() => confirmarEliminacion(m)}
            >
              <Text style={estilos.textoEliminar}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable
        style={estilos.volver}
        onPress={() => router.replace("/")}
      >
        <Text style={estilos.textoEditar}>Volver al inicio</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "#F5F7FA" },
  contenedor: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#172554",
    marginBottom: 20,
  },
  boton: {
    backgroundColor: "#1D4ED8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBoton: { color: "#FFFFFF", fontWeight: "bold" },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  datos: { flex: 1 },
  descripcion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },
  secundario: { color: "#64748B", marginTop: 5 },
  importe: { fontSize: 15, fontWeight: "bold", flexShrink: 1 },
  ingreso: { color: "#15803D" },
  gasto: { color: "#B91C1C" },
  acciones: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  botonEditar: {
    padding: 10,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
  },
  textoEditar: { color: "#1D4ED8", fontWeight: "600" },
  botonEliminar: {
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  textoEliminar: { color: "#B91C1C", fontWeight: "600" },
  vacio: { color: "#64748B", marginVertical: 20 },
  error: { color: "#B91C1C", marginBottom: 12 },
  volver: { alignItems: "center", padding: 16 },
});
