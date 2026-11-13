import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as globalStyles } from "../styles";

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  title="Supprimer l'exercice ?",
  visible,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={globalStyles.deleteModalBackdrop} onPress={onClose}>
        <View style={globalStyles.deleteModalContainer}>
          <Text style={globalStyles.deleteModalTitle}> {title} </Text>
          <View style={globalStyles.deleteModalButtonsContainer}>
            <Pressable style={globalStyles.deleteModalButton} onPress={onClose}>
              <Ionicons name="close-outline" size={20} color="#ffffff" />
              <Text style={globalStyles.deleteModalButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[globalStyles.deleteModalButton, { backgroundColor: "#d9534f" }]}
              onPress={onConfirm}
            >
              <Ionicons name="trash-outline" size={20} color="#ffffff" />
              <Text style={globalStyles.deleteModalButtonText}>Supprimer</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
