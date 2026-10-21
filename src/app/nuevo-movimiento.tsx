//Crear / editar movimientos, validaciones, manejo de errores, navegación entre pantallas
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { listarCategorias } from "../services/categoriasService";
import {
  crearMovimiento,
  editarMovimiento,
  obtenerMovimiento,
} from "../services/movimientosService";
import type { Categoria, TipoMovimiento } from "../types";
import { mostrarMensaje } from "../utils/notificaciones";

export default function NuevoMovimientoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ? Number(params.id) : null;
  const modoEdicion = id !== null && Number.isInteger(id) && id > 0;

  const [tipo, setTipo] = useState<TipoMovimiento>("gasto");
  const [descripcion, setDescripcion] = useState("");
  const [importe, setImporte] = useState("");
  const [fecha, setFecha] = useState(
    obtenerFechaLocal()
  );
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function prepararFormulario() {
      try {
        const lista = await listarCategorias();
        setCategorias(lista);

        if (modoEdicion && id !== null) {
          const movimiento = await obtenerMovimiento(id);

          if (!movimiento) {
            Alert.alert("Error", "El movimiento no existe.");
            router.replace("../movimientos");
            return;
          }

          setDescripcion(movimiento.descripcion);
          setImporte(String(movimiento.importe));
          setTipo(movimiento.tipo);
          setFecha(movimiento.fecha);
          setCategoriaId(movimiento.categoria_id);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar el formulario.");
      } finally {
        setCargando(false);
      }
    }

    prepararFormulario();
  }, [id, modoEdicion, router]);

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipo
  );

  function cambiarTipo(nuevoTipo: TipoMovimiento) {
    setTipo(nuevoTipo);
    setCategoriaId(null);
  }

  async function guardarMovimiento() {
    const descripcionLimpia = descripcion.trim();
    const importeNumerico = Number(importe.replace(",", "."));

    if (!descripcionLimpia) {
      Alert.alert("Dato obligatorio", "Ingresá una descripción.");
      mostrarMensaje(
        "¡Error!",
        "Ingresá una descripción."
      );
      return;
    }

    if (
      importe.trim() === "" ||
      !Number.isFinite(importeNumerico) ||
      importeNumerico <= 0
    ) {
      Alert.alert("Importe inválido", "Ingresá un importe mayor que cero.");
      mostrarMensaje(
        "¡Error!",
        "Ingresá un importe mayor que cero."
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      Alert.alert("Fecha inválida", "Usá el formato AAAA-MM-DD.");
      mostrarMensaje(
        "¡Error!",
        "Usá el formato AAAA-MM-DD."
      );
      return;
    }

    if (categoriaId === null) {
      Alert.alert("Falta la categoría", "Seleccioná una categoría.");
      mostrarMensaje(
        "¡Error!",
        "Seleccioná una categoría."
      );
      return;
    }

    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria.id === categoriaId
    );

    if (!categoriaSeleccionada || categoriaSeleccionada.tipo !== tipo) {
      Alert.alert(
        "Categoría inválida",
        "Elegí una categoría del tipo de movimiento seleccionado."
      );
      mostrarMensaje(
        "¡Error!",
        "Elegí una categoría del tipo de movimiento seleccionado."
      );
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        descripcion: descripcionLimpia,
        importe: importeNumerico,
        tipo,
        fecha,
        categoria_id: categoriaId,
      };

      if (modoEdicion && id !== null) {
        await editarMovimiento(id, datos);
      } else {
        await crearMovimiento(datos);
      }
       
      mostrarMensaje(
      "¡Éxito!",
      "Movimiento actualizado correctamente"
       );

      Alert.alert(
        "Operación exitosa",
        modoEdicion
          ? "El movimiento se actualizó."
          : "El movimiento se guardó.",
        [
          {
            text: "Continuar",
            onPress: () => router.replace("../movimientos"),
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el movimiento.");
      
      mostrarMensaje(
      "¡Error!",
      "No se pudo guardar el movimiento."
    );
    
  } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando formulario...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={estilos.fondo}
      contentContainerStyle={estilos.contenedor}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={estilos.titulo}>
        {modoEdicion ? "Editar movimiento" : "Nuevo movimiento"}
      </Text>

      <Text style={estilos.etiqueta}>Tipo</Text>
      <View style={estilos.fila}>
        {(["ingreso", "gasto"] as const).map((opcion) => (
          <Pressable
            key={opcion}
            style={[
              estilos.botonTipo,
              tipo === opcion && estilos.tipoSeleccionado,
            ]}
            onPress={() => cambiarTipo(opcion)}
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

      <Text style={estilos.etiqueta}>Descripción</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej.: Compra de alimentos"
        value={descripcion}
        onChangeText={setDescripcion}
        maxLength={100}
      />

      <Text style={estilos.etiqueta}>Importe ($)</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej.: 15000"
        value={importe}
        onChangeText={setImporte}
        keyboardType="decimal-pad"
      />

      <Text style={estilos.etiqueta}>Fecha (AAAA-MM-DD)</Text>
      <TextInput
        style={estilos.input}
        value={fecha}
        onChangeText={setFecha}
        placeholder="2026-10-21"
      />

      <Text style={estilos.etiqueta}>Categoría</Text>
      {categoriasFiltradas.length === 0 ? (
        <Text style={estilos.aviso}>
          No hay categorías para este tipo de movimiento.
        </Text>
      ) : (
        <View style={estilos.categorias}>
          {categoriasFiltradas.map((categoria) => (
            <Pressable
              key={categoria.id}
              style={[
                estilos.categoria,
                categoriaId === categoria.id &&
                  estilos.categoriaSeleccionada,
              ]}
              onPress={() => setCategoriaId(categoria.id)}
            >
              <Text
                style={[
                  estilos.textoCategoria,
                  categoriaId === categoria.id &&
                    estilos.textoCategoriaSeleccionada,
                ]}
              >
                {categoria.nombre}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        style={estilos.botonGuardar}
        onPress={guardarMovimiento}
        disabled={guardando}
      >
        <Text style={estilos.textoGuardar}>
          {guardando
            ? "Guardando..."
            : modoEdicion
              ? "Guardar cambios"
              : "Guardar movimiento"}
        </Text>
      </Pressable>

      <Pressable
        style={estilos.botonVolver}
        onPress={() => router.back()}
      >
        <Text style={estilos.textoVolver}>Cancelar</Text>
      </Pressable>
    </ScrollView>
  );
}

function obtenerFechaLocal(): string {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "#F5F7FA" },
  contenedor: { padding: 22, paddingTop: 50, paddingBottom: 40 },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#172554",
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 9,
  },
  fila: { flexDirection: "row", gap: 12 },
  botonTipo: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  tipoSeleccionado: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },
  textoTipo: { color: "#334155", fontWeight: "600" },
  textoSeleccionado: { color: "#FFFFFF" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 14,
    fontSize: 16,
  },
  categorias: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoria: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  categoriaSeleccionada: {
    backgroundColor: "#DBEAFE",
    borderColor: "#1D4ED8",
  },
  textoCategoria: { color: "#334155" },
  textoCategoriaSeleccionada: {
    color: "#1D4ED8",
    fontWeight: "bold",
  },
  aviso: { color: "#B45309" },
  botonGuardar: {
    backgroundColor: "#1D4ED8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  textoGuardar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonVolver: { padding: 15, alignItems: "center", marginTop: 8 },
  textoVolver: { color: "#475569", fontWeight: "600" },
});

