
import { Alert, Platform } from "react-native";

export function mostrarMensaje(
  titulo: string,
  mensaje: string
): void {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}
