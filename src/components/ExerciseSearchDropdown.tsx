import React, { useState } from "react";
import { View, TextInput, FlatList, Pressable, Text, StyleSheet, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "../../context/ExercisesContext.tsx";

interface ExerciseSearchDropdownProps {
  exercises: Exercise[];
  selectedExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
}

export function ExerciseSearchDropdown({
  exercises,
  selectedExercises,
  onSelectExercise,
}: ExerciseSearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const existingIds = new Set(selectedExercises.map((item) => item.id));

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    const isNotAlreadyAdded = !existingIds.has(ex.id);
    return matchesSearch && isNotAlreadyAdded;
  });

  return (
    <View style={{ position: "relative", zIndex: 10, marginBottom: 10 }}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8c9a92" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un exercice..."
          placeholderTextColor="#8c9a92"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#8c9a92" />
          </Pressable>
        )}
      </View>

      {isFocused && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  onSelectExercise(item);
                  setSearchQuery("");
		  setIsFocused(false);
		  Keyboard.dismiss();
                }}
              >
                <Text style={styles.itemText}>{item.name}</Text>
                <Ionicons name="add-circle-outline" size={18} color="#1b3022" />
              </Pressable>
            )}
            ListEmptyComponent={
	      <Text style={styles.emptyText}>Aucun exercice trouvé</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1b3022",
  },
  dropdownContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100,
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  itemText: {
    fontSize: 15,
    color: "#1b3022",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#8c9a92",
    padding: 16,
    fontSize: 14,
  },
});
