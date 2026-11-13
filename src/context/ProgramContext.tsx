import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPrograms, savePrograms, Program, Bloc, BlocItem } from "../db/storage";

interface ProgramContextType {
  programs: Program[];
  loading: boolean;
  addEmptyProgram: (name: string) => Promise<string>;
  updateProgram: (id: string, updatedData: Partial<Program>) => Promise<void>;
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

  const addEmptyProgram = async (name: string) => {
    const cleanedName = name.trim();
    if (!cleanedName) return "fieldEmpty";

    const generatedId = cleanedName.toLowerCase().replace(/\s+/g, "_");
    const alreadyExists = Boolean(programs.find((prg) => prg.id === generatedId));
    if (alreadyExists) return "idExists";

    const newEx: Program = { id: generatedId, name: cleanedName, blocs: [], categories: [] };
    const updatedPrograms = [...programs, newEx];

    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
    return generatedId;
  };

  const updateProgram = async (id: string, updatedData: Partial<Program>) => {
    const updatedPrograms = programs.map((program) =>
      program.id === id ? { ...program, ...updatedData } : program
    );

    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
  };

  const deleteProgram = async (id: string) => {
    const updatedPrograms = programs.filter((ex) => ex.id !== id);
    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
  };

  return (
    <ProgramContext.Provider value={{ programs, loading, addEmptyProgram, deleteProgram, updateProgram }}>
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
