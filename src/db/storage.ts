// src/db/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const EXERCISES_KEY = "@sportapp_exercises";
const PROGRAMS_KEY = "@sportapp_programs";
const PLANNING_KEY = "@sportapp_planning";

export interface Exercise {
  id: string;
  name: string;
}

// --- EXERCICES ---
export async function getExercises(): Promise<Exercise[]> {
  try {
    const data = await AsyncStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : [
      { id: "1", name: "Squat"},
      { id: "2", name: "Fentes"},
    ]; // Données par défaut si vide
  } catch (error) {
    console.error("Erreur lecture exercices", error);
    return [];
  }
}

export async function saveExercises(exercises: Exercise[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error("Erreur sauvegarde exercices", error);
  }
}
