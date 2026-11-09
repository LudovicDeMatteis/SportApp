import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../context/CategoriesContext.tsx";

interface CategoryBubblesProps {
  categories: Category[];
  onRemove?: (category: Category) => void;
}

export function CategoryBubbles({ categories, onRemove }: CategoryBubblesProps) {
  if (categories.length === 0) return null;
  return (
    <View style={styles.bubblesContainer}>
      {categories.map((item) => (
        <View key={item.id} style={styles.bubbleList}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.bubbleListItem} numberOfLines={1}>{item.name}</Text>
            {onRemove && <Pressable onPress={() => onRemove(item)} style={{ marginLeft: 4 }}>
                <Ionicons name="close-outline" size={14} color="#1b3022" />
              </Pressable>
            }
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubblesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  bubbleList: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eae8e1",
    overflow: "hidden",
  },
  bubbleListItem: {
    fontSize: 12,
    color: "#1b3022",
  },
});
