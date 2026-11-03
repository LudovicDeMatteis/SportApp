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
      { id: "squat", name: "Squat"},
      { id: "fente", name: "Fente"},
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

// Programs
export interface Program {
  id: string;
  name: string;
  exercise_list : string[];
}

export async function getPrograms(): Promise<Program[]> {
  try {
    const data = await AsyncStorage.getItem(PROGRAMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting programs", error);
    return [];
  }
}

export async function savePrograms(programs: Program[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
  } catch (error) {
    console.error("Error when saving programs", error);
  }
}

