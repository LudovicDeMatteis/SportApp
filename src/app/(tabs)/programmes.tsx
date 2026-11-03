import React, { useState } from "react";
import { Text, View, FlatList, TextInput, Pressable, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 
import { styles } from "../../styles";
import { usePrograms } from "../../context/ProgramContext";

export default function ProgrammesScreen() {
  const { programs, addProgram } = usePrograms();

  const [isAddingProgram, setIsAddingProgram] = useState<boolean>(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramNameError, setNewProgramNameError] = useState<boolean>(false);

  const handleAddProgram = () => {
    setIsAddingProgram(true);
  }
  
  const acceptNewProgram = () => {
  }

  const declineNewProgram = () => {
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
          visible={isAddingProgram}
          onRequestClose={() => {
            setIsAddingProgram(false);
          }}>
	  <View style={styles.modalOverlay}>
	    <View style={styles.modalContent}>
	      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
		<Pressable onPress={() => declineNewProgram()}>
		  <Ionicons name="close-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
		<Text style={styles.headerTitle}>Ajouter un programme</Text>
		<Pressable onPress={() => acceptNewProgram()}>
		  <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"}/>
		</Pressable>
	      </View>
	      <Text style={styles.inputTitle}>Nom du programme*</Text>
	      <TextInput
		style={styles.input}
		placeholder="Epaules, Core, Souplesse, ..."
		placeholderTextColor="#8c9a92"
		value={newProgramName}
		onChangeText={setNewProgramName}
	      />
	      {newProgramNameError && (<Text style={{color: "#ff0000"}}> Champ requis </Text>)}
	    </View>
	  </View>
      </Modal>
    </View>
  );
}
