import { Stack } from 'expo-router';
import { ExerciseProvider } from "../context/ExerciseContext";
import { ProgramProvider } from "../context/ProgramContext";

export default function RootLayout() {
  return (
    <ExerciseProvider>
    <ProgramProvider>
      <Stack>
	<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ProgramProvider>
    </ExerciseProvider>
  );
}
