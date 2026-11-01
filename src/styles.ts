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
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7c73",
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
    padding: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent backdrop
  },
  modalContent: {
    backgroundColor: "#faf9f5",
    height: "75%",
    padding: 20,
    borderRadius: 10,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b3022",
    marginBottom: 5,
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

  // BUTTONS
  acceptButton: {
    backgroundColor: "#1b3022",
    borderRadius: 12,
    padding: 6,
    alignItems: "center",
  },
  discardButton: {
    backgroundColor: "#1b3022",
    borderRadius: 12,
    padding: 5,
    alignItems: "center",
  },
});
