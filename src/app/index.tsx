import { Redirect } from "expo-router";

export default function Index() {
  // Redirige directement vers l'onglet planning
  return <Redirect href="/planning" />;
}
