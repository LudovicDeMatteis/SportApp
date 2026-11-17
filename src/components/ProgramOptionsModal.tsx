import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as globalStyles } from "../styles";

interface ProgramOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartProgram: () => void;
}

export function ProgramOptionsModal({
  visible,
  onClose,
  onEdit,
  onDelete,
  onStartProgram,
}: ProgramOptionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={globalStyles.optionModalBackdrop} onPress={onClose}>
        <View style={globalStyles.menuContainer}>
          <Pressable style={globalStyles.menuItem} onPress={onStartProgram}>
            <Ionicons name="stopwatch-outline" size={20} color="#1b3022" />
            <Text style={globalStyles.menuText}>Lancer</Text>
          </Pressable>
          <View style={globalStyles.separator} />
          <Pressable style={globalStyles.menuItem} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color="#1b3022" />
            <Text style={globalStyles.menuText}>Modifier</Text>
          </Pressable>
          <View style={globalStyles.separator} />
          <Pressable style={globalStyles.menuItem} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#d9534f" />
            <Text style={[globalStyles.menuText, { color: "#d9534f" }]}>Supprimer</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
