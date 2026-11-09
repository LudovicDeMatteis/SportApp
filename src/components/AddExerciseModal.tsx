import React from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../context/CategoriesContext.tsx";
import { CategoryBubbles } from "./CategoryBubbles";
import { CategorySearchDropdown } from "./CategorySearchDropdown";
import { styles as globalStyles } from "../styles.ts";

interface AddExerciseModalProps {
  visible: boolean;
  exerciseName: string;
  setExerciseName: (name: string) => void;
  nameError: boolean;
  selectedCategories: Category[];
  allCategories: Category[];
  onSelectCategory: (category: Category) => void;
  onRemoveCategory: (category: Category) => void;
  onCreateCategory: (query: string) => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function AddExerciseModal({
  title,
  visible,
  exerciseName,
  setExerciseName,
  nameError,
  selectedCategories,
  allCategories,
  onSelectCategory,
  onRemoveCategory,
  onCreateCategory,
  onAccept,
  onDecline,
}: AddExerciseModalProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDecline}>
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Pressable onPress={onDecline}>
              <Ionicons name="close-circle-outline" size={35} color={"#1b3022"} />
            </Pressable>
            <Text style={globalStyles.headerTitle}>{title}</Text>
            <Pressable onPress={onAccept}>
              <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"} />
            </Pressable>
          </View>

          <Text style={globalStyles.inputTitle}>Nom de l'exercice*</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Squat, Pompe diamant, ..."
            placeholderTextColor="#8c9a92"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          {nameError && <Text style={{ color: "#ff0000", marginBottom: 8 }}>Champ requis</Text>}
          <Text style={globalStyles.inputTitle}>Categories</Text>
          <CategoryBubbles categories={selectedCategories} onRemove={onRemoveCategory} />
          <CategorySearchDropdown
            categories={allCategories}
            selectedCategories={selectedCategories}
            onSelectCategory={onSelectCategory}
            onCreateCategory={onCreateCategory}
          />
        </View>
      </View>
    </Modal>
  );
}
