import React, { useState } from "react";
import { Text, View, FlatList, TextInput, Pressable, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 
import { styles } from "../../styles";
import { usePrograms } from "../../context/ProgramContext";
import {NewProgramModal } from "../../components/NewProgramModal.tsx"

export default function ProgrammesScreen() {
  const { programs, addEmptyProgram, deleteProgram } = usePrograms();

  const [isAddingProgram, setIsAddingProgram] = useState<boolean>(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramNameExistsError, setNewProgramNameExistsError] = useState<boolean>(false);
  const [newProgramNameEmptyError, setNewProgramNameEmptyError] = useState<boolean>(false);

  const handleAddProgram = () => {
    setIsAddingProgram(true);
  }
  
  const acceptNewProgram = async () => {
    setNewProgramNameExistsError(false);
    setNewProgramNameEmptyError(false);
    const newProgramId = await addEmptyProgram(newProgramName);
    if (newProgramId === "fieldEmpty") {
      setNewProgramNameEmptyError(true);
      return
    }
    if (newProgramId === "idExists") {
      setNewProgramNameExistsError(true);
      return
    }
    setIsAddingProgram(false);
    setNewProgramName("");
    router.push(`/program/${newProgramId}/edit`);
  }

  const declineNewProgram = () => {
    setIsAddingProgram(false);
    setNewProgramName("");
    setNewProgramNameExistsError(false);
    setNewProgramNameEmptyError(false);
  }
  
  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
	<View>
	  <Text style={styles.headerTitle}>Mes programmes</Text>
	  <Text style={styles.subtitle}>{programs.length} programmes enregistrés</Text>
	</View>
	<Pressable style={styles.primaryButton} onPress={handleAddProgram}>
	  <Ionicons name="add-outline" size={24} color={"#ffffff"}/>
	</Pressable>
      </View>

      <FlatList
        data={programs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
	  <Pressable 
	    onPress={() => {console.log(item.id); router.push(`/program/${item.id}/details`)}}
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
      <NewProgramModal
	visible={isAddingProgram}
	onClose={declineNewProgram}
	onConfirm={acceptNewProgram}
	programName={newProgramName}
	setProgramName={setNewProgramName}
	programNameExistsError={newProgramNameExistsError}
	programNameEmptyError={newProgramNameEmptyError}
      />
    </View>
  );
}
