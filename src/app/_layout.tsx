import { Stack } from 'expo-router';
import { ExerciseProvider } from "../context/ExerciseContext";
import { ProgramProvider } from "../context/ProgramContext";
import { CategoryProvider } from "../context/CategoriesContext.tsx";

export default function RootLayout() {
  return (
    <ExerciseProvider>
    <ProgramProvider>
    <CategoryProvider>
      <Stack>
	<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </CategoryProvider>
    </ProgramProvider>
    </ExerciseProvider>
  );
}
