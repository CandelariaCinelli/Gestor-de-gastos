
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { obtenerSaldoInicial } from "../services/configuracionService";
import { listarMovimientos } from "../services/movimientosService";
import type { Movimiento } from "../types";

export default function InicioScreen() {
  const router = useRouter();

  // Guardamos el saldo inicial y la lista de movimientos en el estado del componente
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      setError("");

      // Cargamos el saldo inicial y la lista de movimientos en paralelo
      const [saldo, lista] = await Promise.all([
        obtenerSaldoInicial(),
        listarMovimientos(),
      ]);

      setSaldoInicial(saldo);
      setMovimientos(lista);
    } catch (e) {
      console.error("Error al cargar el resumen:", e);
      setError("No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  // Usamos useFocusEffect para recargar los datos cada vez que la pantalla se vuelve a enfocar
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  // Calculamos el saldo actual sumando los ingresos y restando los gastos
  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((total, m) => total + m.importe, 0);

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((total, m) => total + m.importe, 0);

  const saldoActual = saldoInicial + ingresos - gastos;

  const formatoDinero = (importe: number) =>
    importe.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 2,
    });

  if (cargando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando resumen...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo}>Gestor de Gastos</Text>
      <Text style={estilos.subtitulo}>
        Resumen de tus finanzas personales
      </Text>

      {error !== "" && (
        <Text style={estilos.error}>{error}</Text>
      )}

      <View style={estilos.tarjetaSaldo}>
        <Text style={estilos.textoSaldo}>Saldo actual</Text>
        <Text style={estilos.importePrincipal}>
          {formatoDinero(saldoActual)}
        </Text>
      </View>

      <View style={estilos.tarjeta}>
        <Text style={estilos.etiqueta}>Saldo inicial</Text>
        <Text style={estilos.importe}>
          {formatoDinero(saldoInicial)}
        </Text>
      </View>

      <View style={estilos.fila}>
        <View style={[estilos.tarjeta, estilos.tarjetaMitad]}>
          <Text style={estilos.etiqueta}>Ingresos</Text>
          <Text style={estilos.ingreso}>
            {formatoDinero(ingresos)}
          </Text>
        </View>

        <View style={[estilos.tarjeta, estilos.tarjetaMitad]}>
          <Text style={estilos.etiqueta}>Gastos</Text>
          <Text style={estilos.gasto}>
            {formatoDinero(gastos)}
          </Text>
        </View>
      </View>

      <Pressable
        style={estilos.boton}
        onPress={() => router.push("/nuevo-movimiento")}
      >
        <Text style={estilos.textoBoton}>+ Nuevo movimiento</Text>
      </Pressable>

      <Pressable
        style={estilos.botonSecundario}
        onPress={() => router.push("/movimientos")}
      >
        <Text style={estilos.textoBotonSecundario}>
          Ver movimientos
        </Text>
      </Pressable>

      <Pressable
        style={estilos.botonSecundario}
        onPress={() => router.push("/categorias")}
      >
        <Text style={estilos.textoBotonSecundario}>
          Administrar categorías
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 55,
    backgroundColor: "#F5F7FA",
  },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#172554",
  },
  subtitulo: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 24,
  },
  tarjetaSaldo: {
    backgroundColor: "#1D4ED8",
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
  },
  textoSaldo: {
    color: "#DBEAFE",
    fontSize: 16,
  },
  importePrincipal: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 12,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    flex: 1,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
  },
  tarjetaMitad: {
    minWidth: 0,
  },
  etiqueta: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  importe: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0F172A",
  },
  ingreso: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#15803D",
  },
  gasto: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#B91C1C",
  },
  boton: {
    backgroundColor: "#1D4ED8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonSecundario: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 12,
  },
  textoBotonSecundario: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#B91C1C",
    marginBottom: 12,
  },
});
