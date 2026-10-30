import React, { useState } from "react";
import { Text, View, FlatList, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles";

interface Exercise {
  id: string;
  name: string;
}

export default function BibliothequeScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Squat" },
    { id: "2", name: "Fentes" },
    { id: "3", name: "Chaise" },
  ]);

  const [newExerciseName, setNewExerciseName] = useState("");

  // Fonction pour ajouter un exercice
  const handleAddExercise = () => {
    if (newExerciseName.trim() === "") return;
    
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
    };

    setExercises([...exercises, newEx]);
    setNewExerciseName(""); // Réinitialiser l'input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mes exercices</Text>
      <Text style={styles.subtitle}>{exercises.length} exercices enregistrés</Text>

      <View style={{ marginBottom: 15 }}>
        <TextInput
          style={styles.input}
          placeholder="Nom du nouvel exercice..."
          placeholderTextColor="#8c9a92"
          value={newExerciseName}
          onChangeText={setNewExerciseName}
        />
        <Pressable style={styles.primaryButton} onPress={handleAddExercise}>
          <Text style={styles.primaryButtonText}>+ Ajouter un exercice</Text>
        </Pressable>
      </View>

      {/* Liste des exercices */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8c9a92" />
            </View>
          </View>
        )}
      />
    </View>
  );
}
