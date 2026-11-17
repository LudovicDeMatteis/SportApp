
import React from "react";
import {
  Text,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles";

import { usePrograms } from "../../context/ProgramContext";
import { useExercises } from "../../context/ExerciseContext";
import { useCategories } from "../../context/CategoriesContext";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

export default function OptionsScreen() {
  const { programs, importPrograms } = usePrograms();
  const { exercises, importExercises } = useExercises();
  const { categories, importCategories } = useCategories();

  const handleExportJSON = async () => {
    try {
      const databaseExport = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        programs,
        exercises,
        categories,
      };

      const jsonString = JSON.stringify(databaseExport, null, 2);

      const filename = `workout_db_${Date.now()}.json`;

      // EXPORT WEB
      if (Platform.OS === "web") {
        const blob = new Blob([jsonString], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        return;
      }

      // EXPORT ANDROID / IOS

      const file = new File(Paths.cache, filename);

      file.create();
      await file.write(jsonString);

      const sharingAvailable = await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        Alert.alert(
          "Erreur",
          "Le partage n'est pas disponible sur cet appareil."
        );
        return;
      }

      await Sharing.shareAsync(file.uri, {
        dialogTitle: "Exporter la base de données",
        mimeType: "application/json",
        UTI: "public.json",
      });

    } catch (error) {
      console.error("Erreur export JSON :", error);

      const message =
        error instanceof Error ? error.message : String(error);

      Alert.alert(
        "Erreur d'exportation",
        message
      );
    }
  };


  // --------------------------------------------------
  // TRAITEMENT DU JSON IMPORTE
  // --------------------------------------------------

  const processImportedJson = (jsonContent: string) => {
    try {
      const parsedData = JSON.parse(jsonContent);

      // Vérification du format général
      if (
        !parsedData ||
        typeof parsedData !== "object" ||
        Array.isArray(parsedData)
      ) {
        Alert.alert(
          "Format invalide",
          "Le fichier JSON ne contient pas un objet valide."
        );
        return;
      }

      // Vérification des données d'entraînement
      if (
        !parsedData.programs &&
        !parsedData.exercises &&
        !parsedData.categories
      ) {
        Alert.alert(
          "Format invalide",
          "Ce fichier JSON ne contient pas de données d'entraînement valides."
        );
        return;
      }

      // Importation des programmes
      if (parsedData.programs) {
        if (!Array.isArray(parsedData.programs)) {
          throw new Error("Le format des programmes est invalide.");
        }

        importPrograms(parsedData.programs);
      }

      // Importation des exercices
      if (parsedData.exercises) {
        if (!Array.isArray(parsedData.exercises)) {
          throw new Error("Le format des exercices est invalide.");
        }

        importExercises(parsedData.exercises);
      }

      // Importation des catégories
      if (parsedData.categories) {
        if (!Array.isArray(parsedData.categories)) {
          throw new Error("Le format des catégories est invalide.");
        }

        importCategories(parsedData.categories);
      }

      console.log(
        "Données importées avec succès :",
        parsedData
      );

      Alert.alert(
        "Succès",
        "Les données ont été importées avec succès !"
      );

    } catch (error) {
      console.error("Erreur traitement JSON :", error);

      const message =
        error instanceof Error ? error.message : String(error);

      Alert.alert(
        "Erreur de lecture JSON",
        message
      );
    }
  };


  // --------------------------------------------------
  // IMPORTATION JSON
  // --------------------------------------------------

  const handleImportJSON = async () => {

    // IMPORT WEB
    if (Platform.OS === "web") {
      const input = document.createElement("input");

      input.type = "file";
      input.accept = ".json,application/json";

      input.onchange = (event: any) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".json")) {
          Alert.alert(
            "Erreur",
            "Veuillez sélectionner un fichier au format JSON."
          );
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result;

          if (typeof content !== "string") {
            Alert.alert(
              "Erreur",
              "Impossible de lire le contenu du fichier."
            );
            return;
          }

          processImportedJson(content);
        };

        reader.onerror = () => {
          Alert.alert(
            "Erreur",
            "Impossible de lire le fichier sélectionné."
          );
        };

        reader.readAsText(file);
      };

      input.click();

      return;
    }


    // IMPORT ANDROID / IOS

    try {
      // Ouverture du sélecteur de fichiers
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      // Annulation par l'utilisateur
      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];

      console.log("Fichier sélectionné :", asset.name);
      console.log("URI du fichier :", asset.uri);
      console.log("Type MIME :", asset.mimeType);

      // Vérification de l'extension
      if (!asset.name?.toLowerCase().endsWith(".json")) {
        Alert.alert(
          "Format incorrect",
          "Veuillez sélectionner un fichier au format .json"
        );
        return;
      }

      // Lecture avec la nouvelle API Expo FileSystem
      const file = new File(asset.uri);

      const content = await file.text();

      // Vérification du contenu
      if (!content || content.trim().length === 0) {
        Alert.alert(
          "Fichier vide",
          "Le fichier JSON sélectionné ne contient aucune donnée."
        );
        return;
      }

      console.log("Contenu JSON récupéré avec succès.");

      // Traitement et importation
      processImportedJson(content);

    } catch (error) {
      console.error("Erreur détaillée import Android :", error);

      const message =
        error instanceof Error ? error.message : String(error);

      Alert.alert(
        "Erreur d'importation",
        `Impossible d'importer le fichier depuis l'appareil.\n\nDétail : ${message}`
      );
    }
  };


  return (
    <View style={styles.container}>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text style={styles.headerTitle}>
          Options
        </Text>
      </View>

      <Text style={styles.inputTitle}>
        Sauvegarde et restauration
      </Text>

      {/* EXPORTATION */}

      <Pressable
        style={styles.optionsButton}
        onPress={handleExportJSON}
      >
        <Ionicons
          name="download-outline"
          size={20}
          color="#ffffff"
          style={{ marginRight: 8 }}
        />

        <Text style={styles.deleteModalButtonText}>
          Exporter la DB (JSON)
        </Text>
      </Pressable>


      {/* IMPORTATION */}

      <Pressable
        style={[
          styles.optionsButton,
          { backgroundColor: "#2d5a3f" },
        ]}
        onPress={handleImportJSON}
      >
        <Ionicons
          name="push-outline"
          size={20}
          color="#ffffff"
          style={{ marginRight: 8 }}
        />

        <Text style={styles.deleteModalButtonText}>
          Importer une DB (JSON)
        </Text>
      </Pressable>

    </View>
  );
}

