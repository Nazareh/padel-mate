import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4CAF50", // Padel Green (A vibrant green)
  secondary: "#FFC107", // Ball Yellow (A vibrant yellow)
  background: "#F5F5F5", // Light grey/off-white background
  card: "#FFFFFF", // Pure white for cards/forms
  text: "#212121", // Dark text
  placeholder: "#9E9E9E", // Grey for placeholders
  success: "#00C853", // For success messages
  error: "#D50000", // For error messages
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    paddingLeft: 8,
  },
});
