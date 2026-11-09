import React, { useState } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 
import { styles } from "../../styles";
import { useExercises } from "../../context/ExerciseContext";
import { useCategories, Category } from "../../context/CategoriesContext.tsx";
import { AddStatus } from "../../types.tsx";
import { CategoryBubbles } from "../../components/CategoryBubbles";
import { AddExerciseModal } from "../../components/AddExerciseModal";

export default function BibliothequeScreen() {
  const { exercises, addExercise } = useExercises();
  const { categories, addCategory, deleteCategory } = useCategories();
  
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseNameError, setNewExerciseNameError] = useState<boolean>(false);
  const [newCategories, setNewCategories] = useState<Category[]>([]);
  const [newNotes, setNewNotes] = useState<string>("");

  const acceptNewExercise = async () => {
    console.log(newNotes);
    const addStatus: AddStatus = await addExercise(newExerciseName, newCategories, newNotes);
    if (addStatus === "fieldEmpty") {
      setNewExerciseNameError(true);
      return;
    }
    if (addStatus === "idExists") {
      return;
    }
    setNewExerciseNameError(false);
    setNewExerciseName("");
    setNewCategories([]);
    setNewNotes("");
    setIsAddingExercise(false);
  };

  const declineNewExercise = () => {
    setNewExerciseNameError(false);
    setNewExerciseName("");
    setNewCategories([]);
    setNewNotes("");
    setIsAddingExercise(false);
  };

  const handleSelectCategory = (categoryToAdd: Category) => {
    setNewCategories([...newCategories, categoryToAdd]);
  };

  const handleRemoveNewCategory = (categoryToRemove: Category) => {
    setNewCategories(
      newCategories.filter((cat) => cat.id !== categoryToRemove.id)
    );
    const isUsedElsewhere = exercises.some((ex) => 
      ex.categories.some((cat) => cat.id === categoryToRemove.id)
    );
    if (!isUsedElsewhere) {
      deleteCategory(categoryToRemove.id);
    }
  };

  const handleCreateCategory = async (query: string) => {
    const newCat: Category = await addCategory(query);
    handleSelectCategory(newCat);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <View>
          <Text style={styles.headerTitle}>Mes exercices</Text>
          <Text style={styles.subtitle}>{exercises.length} exercices enregistrés</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setIsAddingExercise(true)}>
          <Ionicons name="add-outline" size={24} color={"#ffffff"}/>
        </Pressable>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/exercise/${item.id}`)}>
            <View style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexShrink: 1, marginRight: 10 }}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <View style={styles.exercisesCategoriesContainer}>
                  <CategoryBubbles categories={item.categories} />
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8c9a92" />
              </View>
            </View>
          </Pressable>
        )}
      />

      <AddExerciseModal
	title={"Ajouter un exercice"}
        visible={isAddingExercise}
        exerciseName={newExerciseName}
        setExerciseName={setNewExerciseName}
        nameError={newExerciseNameError}
        selectedCategories={newCategories}
        allCategories={categories}
        onSelectCategory={handleSelectCategory}
        onRemoveCategory={handleRemoveNewCategory}
        onCreateCategory={handleCreateCategory}
	notes={newNotes}
	setNotes={setNewNotes}
        onAccept={acceptNewExercise}
        onDecline={declineNewExercise}
      />
    </View>
  );
}
