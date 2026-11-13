import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { styles } from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { useExercises } from "../../context/ExerciseContext";
import { OptionsModal } from "../../components/OptionsModal";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal.tsx";
import { AddExerciseModal } from "../../components/AddExerciseModal";
import { CategoryBubbles } from "../../components/CategoryBubbles";
import { useCategories, Category } from "../../context/CategoriesContext.tsx"
import { usePrograms } from "../../context/ProgramContext.tsx";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { exercises, deleteExercise, updateExercise } = useExercises();
  const { categories, addCategory, deleteCategory } = useCategories();
  const { programs } = usePrograms();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [deleteExerciseConfirm, setDeleteExerciseConfirm] = useState<boolean>(false);
  // Edit modal
  const [isEdittingExercise, setIsEdittingExercise] = useState<boolean>(false);
  const [newExerciseName, setNewExerciseName] = useState<string>("");
  const [newExerciseNameError, setNewExerciseNameError] = useState<boolean>("");
  const [newCategories, setNewCategories] = useState<Category[]>([]);
  const [newNotes, setNewNotes] = useState<string>("");

  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.headerTitle}>Exercice introuvable</Text>
      </View>
    );
  }

  const handleMoreOptions = () => {
    setShowOptions(true);
  };

  const handleEditExercise = () => {
    setShowOptions(false);
    setNewExerciseName(exercise.name);
    setNewCategories(exercise.categories);
    setNewNotes(exercise.notes);
    setIsEdittingExercise(true);
  };

  const handleDeleteExercise = () => {
    setShowOptions(false);
    setDeleteExerciseConfirm(true);
  };

  const deleteExerciseFromList = () => {
    setDeleteExerciseConfirm(false);
    const categoriesToCheck = exercise.categories;
    deleteExercise(id);
    categoriesToCheck.forEach((categoryToRemove) => {
      const isUsedElsewhere = exercises.some((ex) => 
	ex.id !== id && ex.categories.some((cat) => cat.id === categoryToRemove.id)
      );
      if (!isUsedElsewhere) {
	deleteCategory(categoryToRemove.id);
      }
    });
    router.back();
  };

  // Edit modal
  const acceptEditExercise = async () => {
    if (!newExerciseName.trim()) {
      setNewExerciseNameError(true);
      return;
    }
    setNewExerciseNameError(false);
    await updateExercise(exercise.id, newExerciseName, newCategories, newNotes);
    setIsEdittingExercise(false);
  };

  const declineEditExercise = () => {
    setNewExerciseNameError(false);
    setNewExerciseName(exercise.name);
    setNewCategories(exercise.categories);
    setNewNotes(exercise.notes);
    setIsEdittingExercise(false);
  };

  const handleSelectCategory = (categoryToAdd: Category) => {
    setNewCategories([...newCategories, categoryToAdd]);
  };

  const handleRemoveNewCategory = (categoryToRemove: Category) => {
    setNewCategories(
      newCategories.filter((cat) => cat.id !== categoryToRemove.id)
    );
    const isUsedInAnyExercise = exercises.some((ex) => 
      ex.categories.some((cat) => cat.id === categoryToRemove.id)
    );
    const isUsedInAnyProgram = programs.some((prg) => 
      prg.categories.some((cat) => cat.id === categoryToRemove.id)
    );
    if (!isUsedInAnyExercise && !isUsedInAnyProgram) {
      deleteCategory(categoryToRemove.id);
    }
  };

  const handleCreateCategory = async (query: string) => {
    const newCat: Category = await addCategory(query);
    handleSelectCategory(newCat);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={35} color={"#1b3022"} />
        </Pressable>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <Pressable onPress={handleMoreOptions}>
          <Ionicons name="ellipsis-horizontal-outline" size={35} color={"#1b3022"} />
        </Pressable>
      </View>

      <View style={{ marginBottom: 16, justifyContent: "center", alignItems: "center" }}>
        <CategoryBubbles categories={exercise.categories || []} />
      </View>

      <View style={styles.notesCard}>
	<Text style={styles.notesTitle}>Notes</Text>
	<Text style={styles.notesText}>{exercise.notes}</Text>
      </View>

      <OptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onEdit={handleEditExercise}
        onDelete={handleDeleteExercise}
      />

      <DeleteConfirmModal
        visible={deleteExerciseConfirm}
        onClose={() => setDeleteExerciseConfirm(false)}
        onConfirm={deleteExerciseFromList}
      />
      <AddExerciseModal
	title={"Modifier un exercice"}
        visible={isEdittingExercise}
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
        onAccept={acceptEditExercise}
        onDecline={declineEditExercise}
      />
    </View>
  );
}
