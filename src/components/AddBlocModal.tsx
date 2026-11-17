import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "../../context/ExerciseContext.tsx";
import { styles as globalStyles } from "../styles.ts";
import { ExerciseSearchDropdown } from "./ExerciseSearchDropdown.tsx";

export interface BlocItem {
  instanceId: string;
  exercise: Exercise;
  reps: string;
  breakTime: string;
  type?: "reps" | "seconds";
  duration?: string;
}

interface AddBlocModalProps {
  title: string;
  visible: boolean;
  blocItems: BlocItem[];
  setBlocItems: (data: BlocItem[]) => void;
  allExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onRemoveExercise: (instanceId: string) => void;
  onUpdateField: (instanceId: string, field: "reps" | "breakTime" | "type" | "duration", value: string) => void;
  nbRep: string;
  setNbRep: (nbRep: string) => void;
  repBreakTime: string;
  setRepBreakTime: (repBreakTime: string) => void;
  blocBreakTime: string;
  setBlocBreakTime: (blocBreakTime: string) => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function AddBlocModal({
  title,
  visible,
  blocItems = [],
  setBlocItems,
  allExercises,
  onSelectExercise,
  onRemoveExercise,
  onUpdateField,
  nbRep,
  setNbRep,
  repBreakTime,
  setRepBreakTime,
  blocBreakTime,
  setBlocBreakTime,
  onAccept,
  onDecline,
}: AddBlocModalProps) {

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedItems = [...blocItems];
    const [movedItem] = updatedItems.splice(index, 1);
    updatedItems.splice(index - 1, 0, movedItem);
    setBlocItems(updatedItems);
  };

  const handleMoveDown = (index: number) => {
    if (!blocItems || index === blocItems.length - 1) return;
    const updatedItems = [...blocItems];
    const [movedItem] = updatedItems.splice(index, 1);
    updatedItems.splice(index + 1, 0, movedItem);
    setBlocItems(updatedItems);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDecline}>
      <View style={globalStyles.modalOverlay}>
        <View style={[globalStyles.modalContent, localStyles.fixedModal]}>
          {/* CORRECTION ICI : "height" pour Android permet de réduire la hauteur de la vue pour laisser place au clavier */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1, width: "100%" }}
          >
            <ScrollView 
              contentContainerStyle={{ paddingBottom: 150 }} // Espace important en bas pour pouvoir scroller au-dessus du clavier
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <Pressable onPress={onDecline}>
                  <Ionicons name="close-circle-outline" size={35} color={"#1b3022"} />
                </Pressable>
                <Text style={globalStyles.headerTitle}>{title}</Text>
                <Pressable onPress={onAccept}>
                  <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"} />
                </Pressable>
              </View>

              {/* Inputs principaux (Reps, pauses, etc.) */}
              <View style={localStyles.rowContainer}>
                <Text style={globalStyles.inputTitle}>Nombre de repetitions: </Text>
                <View style={localStyles.textInput}>
                  <TextInput style={globalStyles.input} keyboardType="numeric" value={nbRep} onChangeText={setNbRep} />
                </View>
              </View>

              <View style={localStyles.rowContainer}>
                <Text style={globalStyles.inputTitle}>Pause entre repetitions (s): </Text>
                <View style={localStyles.textInput}>
                  <TextInput style={globalStyles.input} keyboardType="numeric" value={repBreakTime} onChangeText={setRepBreakTime} />
                </View>
              </View>

              <View style={localStyles.rowContainer}>
                <Text style={globalStyles.inputTitle}>Pause apres le bloc (s): </Text>
                <View style={localStyles.textInput}>
                  <TextInput style={globalStyles.input} keyboardType="numeric" value={blocBreakTime} onChangeText={setBlocBreakTime} />
                </View>
              </View>

              <Text style={globalStyles.inputTitle}>Exercices : </Text>
              <ExerciseSearchDropdown
                exercises={allExercises}
                selectedExercises={[]}
                onSelectExercise={onSelectExercise}
              />

              <View style={{ marginTop: 10 }}>
                {blocItems.map((item, index) => {
                  const isSeconds = item.type === "seconds";

                  return (
                    <View key={item.instanceId} style={[globalStyles.card, localStyles.exerciseRowCard]}>
                      <View style={{ flexDirection: "column", marginRight: 6, justifyContent: "center" }}>
                        <Pressable onPress={() => handleMoveUp(index)} disabled={index === 0}>
                          <Ionicons name="chevron-up" size={16} color={index === 0 ? "#cbd5e1" : "#1b3022"} />
                        </Pressable>
                        <Pressable onPress={() => handleMoveDown(index)} disabled={index === blocItems.length - 1}>
                          <Ionicons name="chevron-down" size={16} color={index === blocItems.length - 1 ? "#cbd5e1" : "#1b3022"} />
                        </Pressable>
                      </View>

                      <View style={{ flex: 1, marginRight: 6 }}>
                        <Text style={globalStyles.cardTitle} numberOfLines={1}>{item.exercise.name}</Text>
                      </View>

                      <TextInput
                        style={localStyles.smallInput}
                        keyboardType="numeric"
                        placeholder={isSeconds ? "Sec" : "Reps"}
                        placeholderTextColor="#8c9a92"
                        value={item.reps}
                        onChangeText={(val) => {
                          onUpdateField(item.instanceId, "reps", val);
                        }}
                      />
                      
                      <Pressable 
                        style={localStyles.toggleBadge}
                        onPress={() => {
                          const newType = isSeconds ? "reps" : "seconds";
                          onUpdateField(item.instanceId, "type", newType);
                        }}
                      >
                        <Text style={localStyles.toggleText}>
                          {isSeconds ? " s" : " reps"}
                        </Text>
                      </Pressable>

                      <TextInput
                        style={localStyles.smallInput}
                        keyboardType="numeric"
                        placeholder="Pause"
                        placeholderTextColor="#8c9a92"
                        value={item.breakTime}
                        onChangeText={(val) => onUpdateField(item.instanceId, "breakTime", val)}
                      />

                      <Pressable onPress={() => onRemoveExercise(item.instanceId)} style={{ marginLeft: 6 }}>
                        <Ionicons name="trash-outline" size={20} color={"#d9534f"} />
                      </Pressable>
                    </View>
                  );
                })}
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  fixedModal: {
    width: "100%",
    height: "85%",
    maxHeight: "85%",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  keyboardView: {
    borderRadius: 16,
    overflow: "hidden",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  textInput: {
    width: 90,
  },
  exerciseRowCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  smallInput: {
    backgroundColor: "#f0f2f1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eae8e1",
    fontSize: 13,
    color: "#1b3022",
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: 50,
    textAlign: "center",
    marginHorizontal: 4,
  },
  toggleBadge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1b3022",
  },
});
