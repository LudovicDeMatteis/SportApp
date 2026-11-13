import React, { useState, useEffect } from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { styles } from "../../../styles";
import { Ionicons } from "@expo/vector-icons";

import { usePrograms, Bloc, BlocItem } from "../../../context/ProgramContext.tsx";
import { OptionsModal } from "../../../components/OptionsModal";
import { DeleteConfirmModal } from "../../../components/DeleteConfirmModal.tsx";
import { CategoryBubbles } from "../../../components/CategoryBubbles";

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const { programs, updateProgram, deleteProgram } = usePrograms();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [deleteProgramConfirm, setDeleteProgramConfirm] = useState<boolean>(false);

  const program = programs.find((prg) => prg.id === id);
  if (!program) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.headerTitle}>Programme introuvable</Text>
      </View>
    );
  }

  const handleMoreOptions = () => {
    setShowOptions(true);
  };

  const handleEditProgram = () => {
    setShowOptions(false);
    router.push(`/program/${id}/edit`);
  };

  const handleDeleteProgram = () => {
    setShowOptions(false);
    setDeleteProgramConfirm(true);
  };

  const deleteProgramFromList = () => {
    setDeleteProgramConfirm(false);
    deleteProgram(id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={35} color={"#1b3022"} />
        </Pressable>
        <Text style={styles.headerTitle}>{program.name}</Text>
        <Pressable onPress={handleMoreOptions}>
          <Ionicons name="ellipsis-horizontal-outline" size={35} color={"#1b3022"} />
        </Pressable>
      </View>

      <View style={{ marginBottom: 16, justifyContent: "center", alignItems: "center" }}>
        <CategoryBubbles categories={program.categories || []} />
      </View>

      <Text style={styles.inputTitle}>Deroulement</Text>
      <View style={{ flex: 1, marginBottom: 10 }}>
        <FlatList
          data={program.blocs}
          keyExtractor={(item) => item.blocId}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 8 }}>
              <View style={[styles.card, styles.blocCard]}>
                <View style={{ flex: 1 }}>
		  <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
		    <Text style={styles.blocCardTitle}> Bloc {index + 1} </Text>
		    <Ionicons name="reload-outline" size={16} color="#1b3022" />
		    <Text style={styles.blocCardTitle}> {item.reps} {Number(item.reps) > 1 ? "tours" : "tour"} </Text>
		    <Ionicons name="hourglass-outline" size={16} color="#1b3022" />
		    <Text style={styles.blocCardTitle}> {item.repsBreakTime} s </Text>
                  </View>

                  {item.items.map((exerciseItem, exIndex) => (
                    <View key={exerciseItem.instanceId || exIndex} style={styles.exerciseItemRow}>
                      <Text style={styles.exerciseName} numberOfLines={1}>
                        - {exerciseItem.exercise.name}
                      </Text>
                      <Text style={styles.exerciseDetails}>
                        {exerciseItem.reps ? `${exerciseItem.reps} reps` : ""} 
                        {exerciseItem.breakTime ? ` (pause: ${exerciseItem.breakTime}s)` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <OptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onEdit={handleEditProgram}
        onDelete={handleDeleteProgram}
      />

      <DeleteConfirmModal
	title={"Supprimer le programme ?"}
        visible={deleteProgramConfirm}
        onClose={() => setDeleteExerciseConfirm(false)}
        onConfirm={deleteProgramFromList}
      />
    </View>
  );
}

