import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Pressable, Modal, Alert } from "react-native";
import { useLocalSearchParams, Stack, router} from "expo-router";
import { styles } from "../../styles";
import { Ionicons } from "@expo/vector-icons"; 
import { useExercises } from "../../context/ExerciseContext";

export default function ExerciseDetailScreen() {
  // Catch the [id] parameter from the URL path
  const { id } = useLocalSearchParams();
  const { exercises, deleteExercise } = useExercises();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [deleteExerciseConfirm, setDeleteExerciseConfirm] = useState<boolean>(false);

  const exercise = exercises.find((ex) => ex.id === id);

  const handleMoreOptions = () => {
    setShowOptions(true);
  }

  const handleEditExercise = () => {
    setShowOptions(false);
  }

  const handleDeleteExercise = () => {
    setShowOptions(false);
    setDeleteExerciseConfirm(true);
  }

  const deleteExerciseFromList = () => {
    setDeleteExerciseConfirm(false);
    deleteExercise(id);
    router.back()
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Exercice introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
	<Pressable onPress={() => router.back()}>
	  <Ionicons name="arrow-back-circle-outline" size={35} color={"#1b3022"}/>
	</Pressable>
	<Text style={styles.headerTitle}>{exercise.name}</Text>
	<Pressable onPress={() => handleMoreOptions()}>
	  <Ionicons name="ellipsis-horizontal-outline" size={35} color={"#1b3022"}/>
	</Pressable>
      </View>
      {/* More options modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable 
          style={styles.optionModalBackdrop} 
          onPress={() => setShowOptions(false)}
        >
	  {/* <View style={styles.modalOverlay}> */}
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={() => handleEditExercise()}>
              <Ionicons name="create-outline" size={20} color="#1b3022" />
              <Text style={styles.menuText}>Modifier</Text>
            </Pressable>

            <View style={styles.separator} />

            <Pressable style={styles.menuItem} onPress={() => handleDeleteExercise()}>
              <Ionicons name="trash-outline" size={20} color="#d9534f" />
              <Text style={[styles.menuText, { color: "#d9534f" }]}>Supprimer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal
	visible={deleteExerciseConfirm}
	transparent={true}
	animationType="fade"
	onRequestClose={() => setDeleteExerciseConfirm(false)}
      >
	<Pressable style={styles.deleteModalBackdrop} onPress={() => setDeleteExerciseConfirm(false)}>
	  <View style={styles.deleteModalContainer}>
	    <Text style={styles.deleteModalTitle}> Supprimer l'exercice ? </Text>   
	    <View style={styles.deleteModalButtonsContainer}>
	      <Pressable style={styles.deleteModalButton} onPress={() => setDeleteExerciseConfirm(false)}>
		<Ionicons name="close-outline" size={20} color="#ffffff" />
		<Text style={styles.deleteModalButtonText}>Annuler</Text>
	      </Pressable>
	      <Pressable style={[styles.deleteModalButton, {backgroundColor: "#d9534f"}]} onPress={() => deleteExerciseFromList()}>
		<Ionicons name="trash-outline" size={20} color="#ffffff" />
		<Text style={styles.deleteModalButtonText}>Supprimer</Text>
	      </Pressable>
	    </View>
	  </View>
	</Pressable>
      </Modal>

    </View>
  );  

}
