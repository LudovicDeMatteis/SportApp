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
    padding: 10,
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

  // MODAL MORE OPTIONS
  optionModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 80,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1b3022",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    width: "100%",
  },

  // DELETE MODAL
  
  deleteModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 4,
    alignItems: "center",
  },
  deleteModalTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  deleteModalButtonsContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    gap: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  deleteModalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1b3022",
    borderRadius: 12,
  },
  deleteModalButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "800",
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
