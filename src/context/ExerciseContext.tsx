import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getExercises, saveExercises, Exercise } from "../db/storage";
import {AddStatus} from "../types.tsx";


interface ExerciseContextType {
  exercises: Exercise[];
  loading: boolean;
  addExercise: (name: string) => Promise<AddStatus>;
  updateExercise: (id: string, name: string, categories: Category[]) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load exercises when the app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const data = await getExercises();
    setExercises(data);
    setLoading(false);
  };

  const addExercise = async (name: string, categories: string[], notes: string): Promise<AddStatus> => {
    const cleanedName = name.trim();
    if (!cleanedName) return "fieldEmpty";

    const generatedId = cleanedName.toLowerCase().replace(/\s+/g, "_");
    const alreadyExists = Boolean(exercises.find((ex) => ex.id === generatedId));
    if (alreadyExists) return "idExists";

    const newEx: Exercise = { id: generatedId, name: cleanedName, categories: categories, notes: notes };
    const updatedExercises = [...exercises, newEx];

    setExercises(updatedExercises);
    await saveExercises(updatedExercises);
    return "success";
  };

  const updateExercise = async (id: string, name: string, categories: Category[], notes: string) => {
    const cleanedName = name.trim();
    if (!cleanedName) return;

    const updatedExercises = exercises.map((ex) => {
      if (ex.id === id) {
        return { ...ex, name: cleanedName, categories: categories, notes: notes };
      }
      return ex;
    });

    setExercises(updatedExercises);
    await saveExercises(updatedExercises);
  };

  const deleteExercise = async (id: string) => {
    const updatedExercises = exercises.filter((ex) => ex.id !== id);
    setExercises(updatedExercises);
    await saveExercises(updatedExercises);
  };
  
  return (
    <ExerciseContext.Provider value={{ exercises, loading, addExercise, updateExercise, deleteExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercises() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error("useExercises must be used within an ExerciseProvider");
  }
  return context;
}
