import React, { useState } from "react";
import { Text, View, Pressable, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "../../styles";
import { usePrograms } from "../../context/ProgramContext";
import { useExercises } from "../../context/ExerciseContext";
import { useCategories } from "../../context/CategoriesContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

export default function OptionsScreen() {
  const { programs } = usePrograms();
  const { exercises } = useExercises();
  const { categories } = useCategories();

  // --- EXPORTATION JSON ---
  const handleExportJSON = async () => {
    const databaseExport = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      programs,
      exercises,
      categories,
    };

    const jsonString = JSON.stringify(databaseExport, null, 2);

    if (Platform.OS === "web") {
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `workout_db_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      try {
        const fileUri = `${FileSystem.documentDirectory}workout_db_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
          return;
        }

        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Exporter la base de données",
          mimeType: "application/json",
          UTI: "public.json",
        });
      } catch (error) {
        console.error("Erreur export :", error);
        Alert.alert("Erreur", "Échec de l'exportation des données.");
      }
    }
  };

  // --- IMPORTATION JSON ---
  const processImportedJson = (jsonContent: string) => {
    try {
      const parsedData = JSON.parse(jsonContent);

      // Vérification basique de la structure du fichier
      if (!parsedData.programs && !parsedData.exercises && !parsedData.categories) {
        Alert.alert("Format invalide", "Ce fichier JSON ne contient pas de données d'entraînement valides.");
        return;
      }

      // TODO : Relier ici vos fonctions de mise à jour globale de vos contextes
      // Exemple :
      // if (parsedData.programs) importPrograms(parsedData.programs);
      // if (parsedData.exercises) importExercises(parsedData.exercises);
      // if (parsedData.categories) importCategories(parsedData.categories);

      console.log("Données importées avec succès :", parsedData);
      Alert.alert("Succès", "Les données ont été lues avec succès !");
    } catch (error) {
      console.error("Erreur de lecture JSON :", error);
      Alert.alert("Erreur", "Impossible de lire le fichier JSON.");
    }
  };

  const handleImportJSON = async () => {
    if (Platform.OS === "web") {
      // Création d'un sélecteur de fichier invisible sur le Web
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          processImportedJson(content);
        };
        reader.readAsText(file);
      };
      input.click();
    } else {
      // Sélecteur de document sur mobile (iOS / Android)
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["application/json", "public.json"],
          copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
          return;
        }

        const fileUri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        processImportedJson(content);
      } catch (error) {
        console.error("Erreur import :", error);
        Alert.alert("Erreur", "Impossible d'importer le fichier.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
        <Text style={styles.headerTitle}>Options</Text>
      </View>

      <Text style={styles.inputTitle}>Sauvegarde et restauration</Text>
      <Pressable
        style={styles.optionsButton}
        onPress={handleExportJSON}
      >
        <Ionicons name="download-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.deleteModalButtonText}>Exporter la DB (JSON)</Text>
      </Pressable>

      <Pressable
        style={[styles.optionsButton, { backgroundColor: "#2d5a3f"}]}
        onPress={handleImportJSON}
      >
        <Ionicons name="push-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.deleteModalButtonText}>Importer une DB (JSON)</Text>
      </Pressable>
    </View>
  );
}
