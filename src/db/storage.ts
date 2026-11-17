// src/db/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const EXERCISES_KEY = "@sportapp_exercises";
const PROGRAMS_KEY = "@sportapp_programs";
const PLANNING_KEY = "@sportapp_planning";
const CATEGORIES_KEY = "@sportapp_categories";

export interface Exercise {
  id: string;
  name: string;
  categories: string[];
  notes: string;
}

// --- EXERCICES ---
export async function getExercises(): Promise<Exercise[]> {
  try {
    const data = await AsyncStorage.getItem(EXERCISES_KEY);
    return data ? JSON.parse(data) : [];
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
export interface BlocItem {
  instanceId: string;
  exercise: Exercise;
  reps: number;
  type: "reps" | "s";
  breakTime: number;
}

export interface Bloc {
  blocId: string;
  items: BlocItem[];
  reps: number;
  repsBreakTime: number;
  finalBreakTime: number;
}

export interface Program {
  id: string;
  name: string;
  blocs : Bloc[];
  categories: string[];
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

// Categories
export interface Category {
  id: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting categories", error);
    return [];
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error when saving categories", error);
  }
}


