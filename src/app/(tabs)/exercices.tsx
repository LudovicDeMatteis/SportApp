import React, { useState } from "react";
import { Text, View, FlatList, TextInput, Pressable, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 
import { styles } from "../../styles";
import { useExercises, AddStatus} from "../../context/ExerciseContext";

export default function BibliothequeScreen() {
  const { exercises, addExercise } = useExercises();
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  // Modal ajout
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseNameError, setNewExerciseNameError] = useState<boolean>(false);

  const handleAddExercise = async () => {
    setIsAddingExercise(true);
  };
   
  const acceptNewExercise = async (): undefined => {
    const addStatus: AddStatus = await addExercise(newExerciseName);
    if (addStatus === "fieldEmpty") {
      setNewExerciseNameError(true);
      return;
    }
    if (addStatus === "idExists") {
      return;
    }
    setNewExerciseNameError(false);
    setNewExerciseName("")
    setIsAddingExercise(false);
  };

  const declineNewExercise = async (): void => {
    setNewExerciseName("");
    setIsAddingExercise(false);
    setNewExerciseNameError(false);
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
	<View>
	  <Text style={styles.headerTitle}>Mes exercices</Text>
	  <Text style={styles.subtitle}>{exercises.length} exercices enregistrés</Text>
	</View>
	<Pressable style={styles.primaryButton} onPress={handleAddExercise}>
	  <Ionicons name="add-outline" size={24} color={"#ffffff"}/>
	</Pressable>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
	  <Pressable 
	    onPress={() => router.push(`/exercise/${item.id}`)}
	  >
	    <View style={styles.card}>
	      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
		<View>
		  <Text style={styles.cardTitle}>{item.name}</Text>
		</View>
		<Ionicons name="chevron-forward" size={20} color="#8c9a92" />
	      </View>
	    </View>
	  </Pressable>
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
		<Pressable onPress={() => declineNewExercise()}>
		  <Ionicons name="close-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
		<Text style={styles.headerTitle}>Ajouter un exercice</Text>
		<Pressable onPress={() => acceptNewExercise()}>
		  <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
	      </View>
	      <Text style={styles.inputTitle}>Nom de l'exercice*</Text>
	      <TextInput
		style={styles.input}
		placeholder="Squat, Pompe diamant, ..."
		placeholderTextColor="#8c9a92"
		value={newExerciseName}
		onChangeText={setNewExerciseName}
	      />
	      {newExerciseNameError && (<Text style={{color: "#ff0000"}}> Champ requis </Text>)}
	    </View>
	  </View>
      </Modal>
    </View>
  );
}
