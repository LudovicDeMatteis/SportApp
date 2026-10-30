import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f5",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b3022",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7c73",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eae8e1",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b3022",
  },
  primaryButton: {
    backgroundColor: "#1b3022",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 15,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eae8e1",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
  },
});
