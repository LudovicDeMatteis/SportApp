import React, { useState } from "react";
import { Text, View, Pressable, TextInput, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { styles } from "../../../styles";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "../../../context/CategoriesContext.tsx";
import { usePrograms, Bloc, BlocItem } from "../../../context/ProgramContext.tsx";
import { useExercises, Exercise } from "../../../context/ExerciseContext.tsx";
import { AddBlocModal } from "../../../components/AddBlocModal.tsx";
import { CategoryBubbles } from "../../../components/CategoryBubbles";
import { CategorySearchDropdown } from "../../../components/CategorySearchDropdown";

export default function ProgramEditScreen() {
  const { id } = useLocalSearchParams();
  const { exercises } = useExercises();
  const { categories, deleteCategory, addCategory } = useCategories();
  const { programs, updateProgram, deleteProgram } = usePrograms();
  
  const program = programs.find((prg) => prg.id === id);
  if (!program) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.headerTitle}>Programme introuvable</Text>
      </View>
    );
  }

  const [programName, setProgramName] = useState<string>(program.name);
  const [programBlocs, setProgramBlocs] = useState<Bloc[]>(program.blocs);
  const [nextBlocId, setNextBlocId] = useState<number>(1);
  const [programNameExistsError, setProgramNameExistsError] = useState<boolean>(false);
  const [programNameEmptyError, setProgramNameEmptyError] = useState<boolean>(false);
  //
  const [newCategories, setNewCategories] = useState<Category[]>(program.categories);
  
  // États de la modale de création de bloc
  const [addBlocModalTitle, setAddBlocModalTitle] = useState<string>("");
  const [isAddingBloc, setIsAddingBloc] = useState<boolean>(false);
  //
  const [newBlocId, setNewBlocId] = useState<string>("");
  const [newBlocItems, setNewBlocItems] = useState<BlocItem[]>([]);
  const [newBlocReps, setNewBlocReps] = useState<number>(1);
  const [newBlocRepBreakTime, setNewBlocRepBreakTime] = useState<number>(0);
  const [newBlocBreakTime, setNewBlocBreakTime] = useState<number>(0);
  //
  const [nextBlocItemId, setNextBlocItemId] = useState<number>(1);

  const handleProgramEditAccept = () => {
    setProgramNameEmptyError(false);
    setProgramNameExistsError(false);
    const cleanedName = programName.trim();
    if (!cleanedName) {
      setProgramNameEmptyError(true);
      return;
    };
    const alreadyExists = Boolean(programs.find((prg) => (prg.name === cleanedName) && (prg.id !== id)));
    if (alreadyExists) {
      setProgramNameExistsError(true);
      return;
    };

    updateProgram(id as string, {
      name: programName,
      blocs: programBlocs,
      categories: newCategories,
    });
    router.back();
  };

  const handleProgramEditDecline = () => {
    router.back();
  };

  const handleButtonNewBloc = () => {
    setAddBlocModalTitle("Nouveau Bloc");

    setNewBlocId("");
    setNewBlocItems([]);
    setNewBlocReps(1);
    setNewBlocRepBreakTime(0);
    setNewBlocBreakTime(0);

    setIsAddingBloc(true);
  }
  
  const handleEditBloc = (item: Bloc) => {
    setAddBlocModalTitle("Modifier le bloc");
    
    setNewBlocId(item.blocId);
    setNewBlocItems(item.items);
    setNewBlocReps(item.reps);
    setNewBlocRepBreakTime(item.repsBreakTime);
    setNewBlocBreakTime(item.finalBreakTime);

    setIsAddingBloc(true);
  }
  
const handleNewBlocAccept = () => {
    const updatedBloc: Bloc = {
      blocId: (newBlocId === "") ? `bloc-${nextBlocId}` : newBlocId,
      items: newBlocItems,
      reps: newBlocReps,
      repsBreakTime: newBlocRepBreakTime,
      finalBreakTime: newBlocBreakTime,
    };

    if (newBlocId !== "") {
      setProgramBlocs(
        programBlocs.map((bloc) => (bloc.blocId === newBlocId ? updatedBloc : bloc))
      );
    } else {
      setProgramBlocs([...programBlocs, updatedBloc]);
      setNextBlocId(nextBlocId + 1);
    }

    setNewBlocId("");
    setNewBlocItems([]);
    setNewBlocReps(1);
    setNewBlocRepBreakTime(0);
    setNewBlocBreakTime(0);
    
    setIsAddingBloc(false);
  };

  const handleNewBlocDecline = () => {
    setNewBlocItems([]);
    setNewBlocReps("");
    setNewBlocRepBreakTime("");
    setNewBlocBreakTime("");
    setNextBlocItemId(1);
    setIsAddingBloc(false);
  };

  const handleNewBlocSelectExercise = (exerciseToAdd: Exercise) => {
    const newItem: BlocItem = {
      instanceId: `ex-${nextBlocItemId}`, 
      exercise: exerciseToAdd,
      reps: "",
      breakTime: "",
    };
    setNewBlocItems([...newBlocItems, newItem]);
    setNextBlocItemId(nextBlocItemId + 1);
  };
  
  const handleNewBlocRemoveExercise = (instanceIdToRemove: number) => {
    setNewBlocItems(newBlocItems.filter((item) => item.instanceId !== instanceIdToRemove));
  };

  const handleUpdateItemField = (instanceId: string, field: "reps" | "breakTime", value: string) => {
    setNewBlocItems(
      newBlocItems.map((item) => 
	item.instanceId === instanceId ? { ...item, [field]: value } : item
      )
    );
  };

 const handleMoveBlocUp = (index: number) => {
    if (index === 0) return; 
    const updatedBlocs = [...programBlocs];
    const [movedBloc] = updatedBlocs.splice(index, 1);
    updatedBlocs.splice(index - 1, 0, movedBloc);
    setProgramBlocs(updatedBlocs);
  };

  const handleMoveBlocDown = (index: number) => {
    if (index === programBlocs.length - 1) return; 
    const updatedBlocs = [...programBlocs];
    const [movedBloc] = updatedBlocs.splice(index, 1);
    updatedBlocs.splice(index + 1, 0, movedBloc);
    setProgramBlocs(updatedBlocs);
  };

  const handleDeleteBloc = (blocIdToRemove: string) => {
    console.log(`Deleting number ${blocIdToRemove}`)
    setProgramBlocs(programBlocs.filter((bloc) => bloc.blocId !== blocIdToRemove));
  };

  //
  const handleSelectCategory = (categoryToAdd: Category) => {
    setNewCategories([...newCategories, categoryToAdd]);
  };

  const handleRemoveCategory = (categoryToRemove: Category) => {
    setNewCategories(
      newCategories.filter((cat) => cat.id !== categoryToRemove.id)
    );
    const isUsedInAnyExercise = exercises.some((ex) => 
      ex.categories.some((cat) => cat.id === categoryToRemove.id)
    );
    const isUsedInAnyProgram = programs.some((prg) => 
      prg.categories.some((cat) => cat.id === categoryToRemove.id)
    );
    if (!isUsedInAnyExercise && !isUsedInAnyProgram) {
      deleteCategory(categoryToRemove.id);
    }
  };

  const handleCreateCategory = async (query: string) => {
    const newCat: Category = await addCategory(query);
    handleSelectCategory(newCat);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={handleProgramEditDecline}>
          <Ionicons name="close-circle-outline" size={35} color={"#1b3022"} />
        </Pressable>
        <Text style={styles.headerTitle}>{program.name}</Text>
        <Pressable onPress={handleProgramEditAccept}>
          <Ionicons name="checkmark-circle-outline" size={35} color={"#1b3022"} />
        </Pressable>
      </View>

      <Text style={styles.inputTitle}>Nom du programme*</Text>
      <TextInput
        style={styles.input}
        placeholder="Core complet"
        placeholderTextColor="#8c9a92"
        value={programName}
        onChangeText={setProgramName}
      />
      {programNameEmptyError && (<Text style={{color: "#ff0000"}}> Champ requis </Text>)}
      {programNameExistsError && (<Text style={{color: "#ff0000"}}> Ce nom existe deja </Text>)}

      <Text style={styles.inputTitle}>Categories</Text>
      <CategoryBubbles categories={newCategories} onRemove={handleRemoveCategory} />
      <CategorySearchDropdown
	categories={categories}
	selectedCategories={newCategories}
	onSelectCategory={handleSelectCategory}
	onCreateCategory={handleCreateCategory}
      />

      <Text style={styles.inputTitle}>Deroulement</Text>
      <View style={styles.addBlocModalButtonCenter}>
        <Pressable style={styles.addBlocModalButton} onPress={handleButtonNewBloc}>
          <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
          <Text style={styles.deleteModalButtonText}>Ajouter un bloc</Text>
        </Pressable>
      </View>

      {/* Liste des blocs sous forme de cartes */}
      <View style={{ flex: 1, marginBottom: 10 }}>
        <FlatList
          data={programBlocs}
          keyExtractor={(item) => item.blocId}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 8 }}>
              <View style={[styles.card, styles.blocCard]}>
                
                <View style={styles.blocCardActionsLeft}>
                  <View style={{ flexDirection: "column", marginRight: 8 }}>
                    <Pressable onPress={() => handleMoveBlocUp(index)} disabled={index === 0}>
                      <Ionicons name="chevron-up" size={16} color={index === 0 ? "#cbd5e1" : "#1b3022"} />
                    </Pressable>
                    <Pressable onPress={() => handleMoveBlocDown(index)} disabled={index === programBlocs.length - 1}>
                      <Ionicons name="chevron-down" size={16} color={index === programBlocs.length - 1 ? "#cbd5e1" : "#1b3022"} />
                    </Pressable>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
		  <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
		    <Text style={styles.blocCardTitle}> Bloc {index + 1} </Text>
		    <Ionicons name="reload-outline" size={16} color="#1b3022" />
		    <Text style={styles.blocCardTitle}> {item.reps} {Number(item.reps) > 1 ? "tours" : "tour"} </Text>
		    <Ionicons name="hourglass-outline" size={16} color="#1b3022" />
		    <Text style={styles.blocCardTitle}> {item.repsBreakTime} s </Text>
                  </View>

                  {item.items.map((exerciseItem, exIndex) => (
                    <View key={exerciseItem.instanceId || exIndex} style={styles.blocCardExerciseItemRow}>
                      <Text style={styles.blocCardExerciseName} numberOfLines={1}>
                        - {exerciseItem.exercise.name}
                      </Text>
                      <Text style={styles.blocCardExerciseDetails}>
                        {exerciseItem.reps ? `${exerciseItem.reps} reps` : ""} 
                        {exerciseItem.breakTime ? ` (pause: ${exerciseItem.breakTime}s)` : ""}
                      </Text>
                    </View>
                  ))}
                </View>

		<View style={{flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                  <Pressable onPress={() => handleEditBloc(item)}>
                    <Ionicons name="pencil-outline" size={20} color="#1b3022" />
                  </Pressable>

                  <Pressable onPress={() => handleDeleteBloc(item.blocId)}>
                    <Ionicons name="trash-outline" size={20} color="#d9534f" />
                  </Pressable>
		</View>
              </View>
            </View>
          )}
        />
      </View>

      <AddBlocModal
        title={addBlocModalTitle}
        visible={isAddingBloc}
        blocItems={newBlocItems}
        setBlocItems={setNewBlocItems}
        allExercises={exercises}
        onSelectExercise={handleNewBlocSelectExercise}
        onRemoveExercise={handleNewBlocRemoveExercise}
        onUpdateField={handleUpdateItemField}
        nbRep={newBlocReps}
        setNbRep={setNewBlocReps}
        repBreakTime={newBlocRepBreakTime}
        setRepBreakTime={setNewBlocRepBreakTime}
        blocBreakTime={newBlocBreakTime}
        setBlocBreakTime={setNewBlocBreakTime}
        onAccept={handleNewBlocAccept}
        onDecline={handleNewBlocDecline}
      />
    </View>
  );
}
