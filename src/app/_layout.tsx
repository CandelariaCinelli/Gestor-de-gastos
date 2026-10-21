
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Inicio", headerShown: false }}
      />

      <Stack.Screen
        name="movimientos"
        options={{ title: "Mis movimientos" }}
      />

      <Stack.Screen
        name="nuevo-movimiento"
        options={{ title: "Movimiento" }}
      />

      <Stack.Screen
        name="categorias"
        options={{ title: "Categorías" }}
      />

      <Stack.Screen
        name="explore"
        options={{ title: "Explorar" }}
      />
    </Stack>
  );
}
