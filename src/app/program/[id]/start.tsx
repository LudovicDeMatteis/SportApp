import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable, StyleSheet, Modal } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { styles } from "../../../styles";
import { Ionicons } from "@expo/vector-icons";

import { usePrograms, Bloc, BlocItem } from "../../../context/ProgramContext.tsx";

export default function ProgramStartScreen() {
  const { id } = useLocalSearchParams();
  const { programs } = usePrograms();
  
  const [currentBlocIndex, setCurrentBlocIndex] = useState<number>(0);
  const [currentBlocRepsCounter, setCurrentBlocRepsCounter] = useState<number>(1);
  const [currentBlocItemIndex, setCurrentBlocItemIndex] = useState<number>(0);
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isOnExerciseBreak, setIsOnExerciseBreak] = useState<boolean>(false);
  const [isOnBlocBreak, setIsOnBlocBreak] = useState<boolean>(false);
  const [hasStartedProgram, setHasStartedProgram] = useState<boolean>(false); // Indique si le premier play a été lancé
  //
  const [showCongratsModal, setShowCongratsModal] = useState<boolean>(false);
  

  const intervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const program = programs.find((prg) => prg.id === id);
  if (!program) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.headerTitle}>Programme introuvable</Text>
      </View>
    );
  }
  
  const programBlocs: Bloc[] = program.blocs || [];
  const currentBloc = programBlocs[currentBlocIndex];
  const currentItem = currentBloc?.items[currentBlocItemIndex];

  // --- GESTION DU TEMPS SELON L'ÉTAT (EXERCICE OU PAUSE) ---
  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setHasStarted(false);

    let initialDuration = 0;

    if (isOnExerciseBreak) {
      initialDuration = currentItem.breakTime || 0;
      setTime(initialDuration);
    } else if (isOnBlocBreak) {
      const isLastTourOfBloc = currentBlocRepsCounter >= (currentBloc.reps || 1);
      initialDuration = isLastTourOfBloc 
        ? (currentBloc.finalBreakTime || 0) 
        : (currentBloc.repsBreakTime || 0);
      setTime(initialDuration);
    } else {
      if (currentItem.type === "seconds") {
        initialDuration = currentItem.reps || 0;
        setTime(initialDuration);
      } else {
        setTime(0);
      }
    }

    // Le timer se lance automatiquement SEULEMENT si le programme a déjà été démarré une première fois
    if (hasStartedProgram) {
      const isCountdown = isOnExerciseBreak || isOnBlocBreak || (currentItem.type === "seconds");
      const timer = setTimeout(() => {
        startTimer(initialDuration);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentBlocIndex, currentBlocItemIndex, currentBlocRepsCounter, isOnExerciseBreak, isOnBlocBreak]);

  const startTimer = (durationOverride?: number) => {
    if (intervalRef.current) return;

    // On marque le programme comme démarré dès le premier lancement
    setHasStartedProgram(true);

    // On a un decompte si on est en pause ou avec un exercise en secondes
    const isCountdown = isOnExerciseBreak || isOnBlocBreak || (currentItem.type === "seconds");
    const targetDuration = durationOverride !== undefined ? durationOverride : time; // Le temps initial 

    if (targetDuration <= 0 && isCountdown) return; // TODO check if I need to changeexercise

    startTimeRef.current = Date.now();
    const initialTime = time;

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (isCountdown) {
        const remaining = targetDuration - elapsed;
        if (remaining <= 0) {
          setTime(0);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          gotoNextExercise();
        } else {
          setTime(remaining);
        }
      } else {
        setTime(initialTime + elapsed);
      }
    }, 1000);

    setHasStarted(true);
    setIsRunning(true);
  };

  const onPressPlay = () => {
    startTimer();
  };

  const onPressPause = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const handleEndProgram = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setShowCongratsModal(true);
    console.log("End programme");
  };

  const gotoNextExercise = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);

    const isLastItemInBloc = currentBlocItemIndex === currentBloc.items.length - 1;
    const isLastBloc = currentBlocIndex === programBlocs.length - 1;
    const maxBlocReps = parseInt(currentBloc.reps, 10) || 1;
    const isLastRepOfBloc = currentBlocRepsCounter >= maxBlocReps;

    if (isLastItemInBloc && isLastBloc && isLastRepOfBloc) {
      handleEndProgram();
      return;
    }

    // Si on n'est PAS en pause, on demarre une pause
    if (!isOnExerciseBreak && !isOnBlocBreak) {
      if (isLastItemInBloc) {
        setIsOnBlocBreak(true);
      } else {
        setIsOnExerciseBreak(true);
      }
      return;
    }

    // Si on etati en pause, on passe a l'exo suivant
    if (isOnExerciseBreak) {
      setIsOnExerciseBreak(false);
      setCurrentBlocItemIndex(currentBlocItemIndex + 1);
      return;
    }

    if (isOnBlocBreak) {
      setIsOnBlocBreak(false);
      
      if (currentBlocRepsCounter < maxBlocReps) {
        // On recommence le bloc pour un tour de plus
        setCurrentBlocRepsCounter(currentBlocRepsCounter + 1);
        setCurrentBlocItemIndex(0);
      } else {
        // Le bloc est fini
        if (isLastBloc) {
          handleEndProgram();
        } else {
          setCurrentBlocIndex(currentBlocIndex + 1);
          setCurrentBlocRepsCounter(1);
          setCurrentBlocItemIndex(0);
        }
      }
    }
  };

  const gotoPreviousExercise = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setIsOnExerciseBreak(false);
    setIsOnBlocBreak(false);

    if (currentBlocIndex === 0 && currentBlocItemIndex === 0 && currentBlocRepsCounter === 1) return;

    if (currentBlocItemIndex > 0) {
      setCurrentBlocItemIndex(currentBlocItemIndex - 1);
    } else {
      const prevBlocIndex = currentBlocIndex - 1;
      const prevBloc = programBlocs[prevBlocIndex];

      if (currentBlocRepsCounter > 1) {
        setCurrentBlocRepsCounter(currentBlocRepsCounter - 1);
        setCurrentBlocItemIndex(currentBloc.items.length - 1);
      } else if (prevBlocIndex >= 0) {
        setCurrentBlocIndex(prevBlocIndex);
        setCurrentBlocRepsCounter(parseInt(prevBloc.reps, 10) || 1);
        setCurrentBlocItemIndex(prevBloc.items.length - 1);
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!currentItem) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.headerTitle}>Aucun exercice dans ce programme</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 30, gap: 20 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={35} color={"#1b3022"} />
        </Pressable>
        <Text style={[styles.headerTitle, { flex: 1 }]} numberOfLines={1}>{program.name}</Text>
      </View>

      {/* Informations de l'exercice ou de la pause en cours */}
      {(isOnBlocBreak || isOnExerciseBreak) ? (
        <View style={[localStyles.cardInfo]}>
          <Text style={localStyles.blocIndicator}>Bloc {currentBlocIndex + 1} (Tour {currentBlocRepsCounter}/{currentBloc.reps})</Text>
          <Text style={localStyles.exerciseName}>Pause</Text>
          <View style={localStyles.targetBadge}>
            <Text style={localStyles.targetText}>
              {isOnExerciseBreak ? "Pause entre les exercices" : "Pause de fin de bloc"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={localStyles.cardInfo}>
          <Text style={localStyles.blocIndicator}>Bloc {currentBlocIndex + 1} (Tour {currentBlocRepsCounter}/{currentBloc.reps})</Text>
          <Text style={localStyles.exerciseName}>{currentItem.exercise.name}</Text>
          <View style={localStyles.targetBadge}>
            <Text style={localStyles.targetText}>
              {currentItem.type === "seconds" 
                ? `Durée : ${currentItem.reps} s` 
                : `Répétitions : ${currentItem.reps}`}
            </Text>
          </View>
        </View>
      )}

      {/* Affichage du Chrono */}
      <View style={localStyles.timerContainer}>
        <Text style={localStyles.timerText}>
          {time}s
        </Text>
      </View>

      {/* Boutons de contrôle */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 30, marginTop: 40 }}>
        <Pressable onPress={gotoPreviousExercise} style={localStyles.controlButton}>
          <Ionicons name="play-skip-back-outline" size={28} color={"#1b3022"} />
        </Pressable>

        <Pressable onPress={isRunning ? onPressPause : onPressPlay} style={localStyles.playButton}>
          <Ionicons name={isRunning ? "pause" : "play"} size={36} color={"#fff"} />
        </Pressable>

        <Pressable onPress={gotoNextExercise} style={localStyles.controlButton}>
          <Ionicons name="play-skip-forward-outline" size={28} color={"#1b3022"} />
        </Pressable>
      </View>

      <Modal
	visible={showCongratsModal}
	transparent={true}
	animationType="fade"
	onRequestClose={() => setShowCongratsModal(false)}
      >
	<Pressable style={styles.congratsModalBackdrop} onPress={() => setShowCongratsModal(false)}>
	  <View style={styles.congratsModalContainer}>
	    <Text style={styles.congratsModalTitle}> Fin du programme ! </Text>
	    <Text style={styles.congratsModalTitle}> Bravo ! </Text>
	    <Pressable style={styles.congratsModalButton} onPress={() => { setShowCongratsModal(false); router.back(); }}>
	      <Ionicons name="close-outline" size={20} color="#ffffff" />
	      <Text style={styles.congratsModalButtonText}>Sortir</Text>
	    </Pressable>
	  </View>
	</Pressable>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  cardInfo: {
    backgroundColor: "#f0f2f1",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  blocIndicator: {
    fontSize: 14,
    color: "#8c9a92",
    fontWeight: "600",
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b3022",
    textAlign: "center",
    marginBottom: 10,
  },
  targetBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  targetText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b3022",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  timerText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#1b3022",
  },
  playButton: {
    backgroundColor: "#1b3022",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    padding: 10,
  },
});
