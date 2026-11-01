import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TextInput, Pressable, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getExercises, saveExercises, Exercise } from "../../db/storage";
import { styles } from "../../styles";

export default function BibliothequeScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  // Modal ajout
  const [newExerciseName, setNewExerciseName] = useState("");

  // Charger les exercices au démarrage de l'écran
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getExercises();
    setExercises(data);
  };

  const handleAddExercise = async () => {
    setIsAddingExercise(true);
  };
   
  const acceptNewExercise = async () => {
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
    };
    setNewExerciseName("")
    const updatedExercises = [...exercises, newEx];
    setExercises(updatedExercises);
    await saveExercises(updatedExercises);
    setIsAddingExercise(false);
  };

  const declineNewExercice = async () => {
    setNewExerciseName("");
    setIsAddingExercise(false);
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
	<View>
	  <Text style={styles.headerTitle}>Mes exercices</Text>
	  <Text style={styles.subtitle}>{exercises.length} exercices enregistrés</Text>
	</View>
	<Pressable style={styles.primaryButton} onPress={handleAddExercise}>
	  <Text style={styles.primaryButtonText}> + </Text>
	</Pressable>
      </View>

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
      <Modal
          animationType="slide"
	  transparent={true}
          visible={isAddingExercise}
          onRequestClose={() => {
            setIsAddingExercise(false);
          }}>
	  <View style={styles.modalOverlay}>
	    <View style={styles.modalContent}>
	      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
		<Pressable onPress={() => acceptNewExercise()}>
		  <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
		<Text style={styles.headerTitle}>Ajouter un exercice</Text>
		<Pressable onPress={() => declineNewExercice()}>
		  <Ionicons name="close-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
	      </View>
	      <Text style={styles.inputTitle}>Nom de l'exercice</Text>
	      <TextInput
		style={styles.input}
		placeholder="Squat, Pompe diamant, ..."
		placeholderTextColor="#8c9a92"
		value={newExerciseName}
		onChangeText={setNewExerciseName}
	      />
	    </View>
	  </View>
      </Modal>
    </View>
  );
}
