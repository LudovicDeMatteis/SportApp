import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPrograms, savePrograms, Program } from "../db/storage";

interface ProgramContextType {
  programs: Program[];
  loading: boolean;
  addProgram: (name: string) => Promise<boolean>;
  deleteProgram: (id: string) => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load programs when the app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const data = await getPrograms();
    setPrograms(data);
    setLoading(false);
  };

  const addProgram = async (name: string) => {
    const cleanedName = name.trim();
    if (!cleanedName) return false;

    const generatedId = cleanedName.toLowerCase().replace(/\s+/g, "_");
    const newEx: Program = { id: generatedId, name: cleanedName };
    const updatedPrograms = [...programs, newEx];

    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
    return true;
  };

  const deleteProgram = async (id: string) => {
    const updatedPrograms = programs.filter((ex) => ex.id !== id);
    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
  };

  return (
    <ProgramContext.Provider value={{ programs, loading, addProgram, deleteProgram }}>
      {children}
    </ProgramContext.Provider>
  );
}

export function usePrograms() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("usePrograms must be used within an ProgramProvider");
  }
  return context;
}
