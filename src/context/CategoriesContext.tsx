import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCategories, saveCategories, Category } from "../db/storage";
import {AddStatus} from "../types.tsx";

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (name: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  importCategories: (categories: Category[]) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load the categories when the app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const addCategory = async (name: string): Promise<Category> => {
    const cleanedName = name.trim();
    const generatedId = cleanedName.toLowerCase().replace(/\s+/g, "_");

    const newCat: Category = { id: generatedId, name: cleanedName };
    const updatedCategories = [...categories, newCat];

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
    return newCat;
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter((ex) => ex.id !== id);
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const importCategories = async (importedCategories: Category[]) => {
    setCategories(importedCategories);
    await saveCategories(importedCategories);
  };

  return (
    <CategoryContext.Provider 
      value={{ 
	categories, 
	loading, 
	addCategory, 
	deleteCategory,
	importCategories,
      }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within an CategoriesProvider");
  }
  return context;
}
