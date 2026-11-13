import React from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as globalStyles } from "../styles";

interface NewProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function NewProgramModal({
  visible,
  onClose,
  onConfirm,
  programName,
  setProgramName,
  programNameExistsError,
  programNameEmptyError,
}: NewProgramModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={globalStyles.newProgramModalOverlay}>
	<View style={globalStyles.newProgramModalContainer}>
	  <Text style={globalStyles.newProgramModalTitle}> Nom du programme </Text>
	  <TextInput
	    style={globalStyles.input}
	    placeholder="Epaules, Core, Souplesse, ..."
	    placeholderTextColor="#8c9a92"
	    value={programName}
	    onChangeText={setProgramName}
	  />
	  {programNameEmptyError && (<Text style={{color: "#ff0000"}}> Champ requis </Text>)}
	  {programNameExistsError && (<Text style={{color: "#ff0000"}}> Ce nom existe deja </Text>)}
	<View style={globalStyles.newProgramModalButtonsContainer}>
	    <Pressable style={globalStyles.newProgramModalButton} onPress={onClose}>
	      <Ionicons name="close-outline" size={20} color="#ffffff" />
	      <Text style={globalStyles.newProgramModalButtonText}>Annuler</Text>
	    </Pressable>
	    <Pressable
	      style={[globalStyles.newProgramModalButton, { backgroundColor: "#1b3022" }]}
	      onPress={onConfirm}
	    >
	      <Text style={globalStyles.newProgramModalButtonText}>Suivant</Text>
	      <Ionicons name="chevron-forward-outline" size={20} color="#ffffff" />
	    </Pressable>
	  </View>
	</View>
      </View>
    </Modal>
  );
}
