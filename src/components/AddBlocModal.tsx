import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "../../context/ExerciseContext.tsx";
import { styles as globalStyles } from "../styles.ts";
import { ExerciseSearchDropdown } from "./ExerciseSearchDropdown.tsx";

export interface BlocItem {
  instanceId: string;
  exercise: Exercise;
  reps: string;
  breakTime: string;
}

interface AddBlocModalProps {
  title: string;
  visible: boolean;
  blocItems: BlocItem[];
  setBlocItems: (data: BlocItem[]) => void;
  allExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onRemoveExercise: (instanceId: string) => void;
  onUpdateField: (instanceId: string, field: "reps" | "breakTime", value: string) => void;
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
  blocItems=[],
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
        <View style={globalStyles.modalContent}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Pressable onPress={onDecline}>
              <Ionicons name="close-circle-outline" size={35} color={"#1b3022"} />
            </Pressable>
            <Text style={globalStyles.headerTitle}>{title}</Text>
            <Pressable onPress={onAccept}>
              <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"} />
            </Pressable>
          </View>

          <View style={localStyles.rowContainer}>
            <Text style={globalStyles.inputTitle}>Nombre de repetitions du bloc: </Text>
            <View style={localStyles.textInput}>
              <TextInput style={globalStyles.input} keyboardType="numeric" value={nbRep} onChangeText={setNbRep} />
            </View>
          </View>

          <View style={localStyles.rowContainer}>
            <Text style={globalStyles.inputTitle}>Temps de pause entre repetitions (s): </Text>
            <View style={localStyles.textInput}>
              <TextInput style={globalStyles.input} keyboardType="numeric" value={repBreakTime} onChangeText={setRepBreakTime} />
            </View>
          </View>

          <View style={localStyles.rowContainer}>
            <Text style={globalStyles.inputTitle}>Temps de pause apres le bloc (s): </Text>
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

          <FlatList
            data={blocItems}
            keyExtractor={(item) => item.instanceId}
            renderItem={({ item, index }) => (
              <View style={[globalStyles.card, localStyles.exerciseRowCard]}>
                
                <View style={{ flexDirection: "column", marginRight: 8, justifyContent: "center" }}>
                  <Pressable onPress={() => handleMoveUp(index)} disabled={index === 0}>
                    <Ionicons 
                      name="chevron-up" 
                      size={16} 
                      color={index === 0 ? "#cbd5e1" : "#1b3022"} 
                    />
                  </Pressable>
                  <Pressable onPress={() => handleMoveDown(index)} disabled={index === blocItems.length - 1}>
                    <Ionicons 
                      name="chevron-down" 
                      size={16} 
                      color={index === blocItems.length - 1 ? "#cbd5e1" : "#1b3022"} 
                    />
                  </Pressable>
                </View>

                {/* Nom de l'exercice */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={globalStyles.cardTitle} numberOfLines={1}>{item.exercise.name}</Text>
                </View>

                {/* Input Répétitions */}
                <TextInput
                  style={localStyles.smallInput}
                  keyboardType="numeric"
                  placeholder="Reps"
                  placeholderTextColor="#8c9a92"
                  value={item.reps}
                  onChangeText={(val) => onUpdateField(item.instanceId, "reps", val)}
                />

                {/* Input Pause */}
                <TextInput
                  style={localStyles.smallInput}
                  keyboardType="numeric"
                  placeholder="Pause"
                  placeholderTextColor="#8c9a92"
                  value={item.breakTime}
                  onChangeText={(val) => onUpdateField(item.instanceId, "breakTime", val)}
                />

                {/* Bouton Supprimer */}
                <Pressable onPress={() => onRemoveExercise(item.instanceId)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={22} color={"#d9534f"} />
                </Pressable>
              </View>
            )}
          />

        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
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
});
