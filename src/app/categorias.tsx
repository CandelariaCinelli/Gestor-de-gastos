//Esta pantalla va a cumplir dos funciones: administrar las categorías y permitir modificar el saldo con el que comienza el usuario.
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../services/categoriasService";
import {
  actualizarSaldoInicial,
  obtenerSaldoInicial,
} from "../services/configuracionService";
import type { Categoria, TipoMovimiento } from "../types";
import { mostrarMensaje } from "../utils/notificaciones";

export default function CategoriasScreen() {
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoMovimiento>("gasto");
  const [saldo, setSaldo] = useState("0");
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      const [lista, saldoActual] = await Promise.all([
        listarCategorias(),
        obtenerSaldoInicial(),
      ]);

      setCategorias(lista);
      setSaldo(String(saldoActual));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los datos.");
      mostrarMensaje(
        "¡Error!",
        "No se pudieron cargar los datos."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  async function agregarCategoria() {
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      Alert.alert("Dato obligatorio", "Ingresá un nombre.");
      mostrarMensaje(
        "¡Error!",
        "Ingresá un nombre."
      );
      return;
    }

    const duplicada = categorias.some(
      (c) =>
        c.nombre.toLocaleLowerCase() ===
          nombreLimpio.toLocaleLowerCase() &&
        c.tipo === tipo
    );

    if (duplicada) {
      Alert.alert(
        "Categoría existente",
        "Ya existe una categoría con ese nombre y tipo."
      );
      mostrarMensaje(
        "¡Error!",
        "Ya existe una categoría con ese nombre y tipo."
      );
      return;
    }

    try {
      await crearCategoria(nombreLimpio, tipo);
      setNombre("");
      await cargarDatos();
      Alert.alert("Listo", "La categoría fue creada.");
      mostrarMensaje(
        "¡Éxito!",
        "La categoría fue creada."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear la categoría.");
      mostrarMensaje(
        "¡Error!",
        "No se pudo crear la categoría."
      );
    }
  }

  async function guardarSaldoInicial() {
    const valor = Number(saldo.replace(",", "."));

    if (
      saldo.trim() === "" ||
      !Number.isFinite(valor) ||
      valor < 0
    ) {
      Alert.alert(
        "Saldo inválido",
        "Ingresá un saldo inicial válido, igual o mayor que cero."
      );
      mostrarMensaje(
        "¡Error!",
        "Ingresá un saldo inicial válido, igual o mayor que cero."
      );
      return;
    }

    try {
      await actualizarSaldoInicial(valor);
      Alert.alert("Listo", "El saldo inicial fue actualizado.");
      mostrarMensaje(
        "¡Éxito!",
        "El saldo inicial fue actualizado."
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el saldo.");
      mostrarMensaje(
        "¡Error!",
        "No se pudo actualizar el saldo."
      );
    }
  }

  function confirmarEliminacion(categoria: Categoria) {
    Alert.alert(
      "Eliminar categoría",
      `¿Querés eliminar "${categoria.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarCategoria(categoria.id);
              await cargarDatos();
              Alert.alert("Listo", "Categoría eliminada.");
              mostrarMensaje(
                "¡Éxito!",
                "Categoría eliminada."
              );
            } catch (error) {
              Alert.alert(
                "No se puede eliminar",
                error instanceof Error
                  ? error.message
                  : "Ocurrió un error."
              );
              mostrarMensaje(
                "¡Error!",
                error instanceof Error
                  ? error.message
                  : "Ocurrió un error."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={estilos.fondo}
      contentContainerStyle={estilos.contenedor}
    >
      <Text style={estilos.titulo}>Categorías y configuración</Text>

      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>Saldo inicial</Text>
        <Text style={estilos.descripcion}>
          Es el dinero disponible al comenzar a usar la aplicación.
        </Text>

        <TextInput
          style={estilos.input}
          value={saldo}
          onChangeText={setSaldo}
          keyboardType="decimal-pad"
          placeholder="Ej.: 100000"
        />

        <Pressable
          style={estilos.boton}
          onPress={guardarSaldoInicial}
        >
          <Text style={estilos.textoBoton}>
            Guardar saldo inicial
          </Text>
        </Pressable>
      </View>

      <View style={estilos.tarjeta}>
        <Text style={estilos.subtitulo}>Nueva categoría</Text>

        <TextInput
          style={estilos.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre de la categoría"
          maxLength={50}
        />

        <View style={estilos.fila}>
          {(["ingreso", "gasto"] as const).map((opcion) => (
            <Pressable
              key={opcion}
              style={[
                estilos.botonTipo,
                tipo === opcion && estilos.tipoSeleccionado,
              ]}
              onPress={() => setTipo(opcion)}
            >
              <Text
                style={[
                  estilos.textoTipo,
                  tipo === opcion && estilos.textoSeleccionado,
                ]}
              >
                {opcion === "ingreso" ? "Ingreso" : "Gasto"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={estilos.boton}
          onPress={agregarCategoria}
        >
          <Text style={estilos.textoBoton}>Agregar categoría</Text>
        </Pressable>
      </View>

      <Text style={estilos.subtitulo}>Categorías existentes</Text>

      {cargando ? (
        <Text>Cargando categorías...</Text>
      ) : categorias.length === 0 ? (
        <Text>No hay categorías registradas.</Text>
      ) : (
        categorias.map((categoria) => (
          <View key={categoria.id} style={estilos.itemCategoria}>
            <View style={estilos.datosCategoria}>
              <Text style={estilos.nombreCategoria}>
                {categoria.nombre}
              </Text>
              <Text style={estilos.descripcion}>
                {categoria.tipo === "ingreso" ? "Ingreso" : "Gasto"}
              </Text>
            </View>

            <Pressable
              style={estilos.botonEliminar}
              onPress={() => confirmarEliminacion(categoria)}
            >
              <Text style={estilos.textoEliminar}>Eliminar</Text>
            </Pressable>
          </View>
        ))
      )}

      <Pressable
        style={estilos.botonVolver}
        onPress={() => router.replace("/")}
      >
        <Text style={estilos.textoVolver}>Volver al inicio</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "#F5F7FA" },
  contenedor: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#172554",
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 14,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  fila: { flexDirection: "row", gap: 12, marginVertical: 10 },
  botonTipo: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  tipoSeleccionado: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },
  textoTipo: { color: "#334155", fontWeight: "600" },
  textoSeleccionado: { color: "#FFFFFF" },
  boton: {
    backgroundColor: "#1D4ED8",
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 8,
  },
  textoBoton: { color: "#FFFFFF", fontWeight: "bold" },
  itemCategoria: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  datosCategoria: { flex: 1 },
  nombreCategoria: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  botonEliminar: {
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  textoEliminar: { color: "#B91C1C", fontWeight: "600" },
  botonVolver: { alignItems: "center", padding: 18 },
  textoVolver: { color: "#1D4ED8", fontWeight: "600" },
});
