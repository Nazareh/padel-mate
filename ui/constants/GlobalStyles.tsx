import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#19e66b",
  red: "#ef4444",
  lightBlue: "#a4c4f6ff",
  primaryShade: "#19e66b33",
  backgroundLight: "#f6f8f7",
  backgroundDark: "#112117",
  sufaceDark: "#1a3224",
  surfaceBorder: "#346548",
  textLight: "#f6f8f7",
  textDark: "#93c8a8",


};
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const FONT_SIZE = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,
};

export const BORDER_RADIUS = {
  default: "1rem",
  lg: "2rem",
  xl: "3rem",
  full: 999,
};

export const fontFamily = {
  display: ["Lexend", "sans-serif"]
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  largeContainer: {
    padding: SPACING.lg,
    minHeight: 800,
  },
  mdContainer: {
    padding: SPACING.md,
    paddingBottom: 120,
  },

  xsContainer: {
    padding: SPACING.sm,
    paddingBottom: 20,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "rgba(25,230,107,0.2)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryShade,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder
  },

  socialIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 18,
  },
  title: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: COLORS.sufaceDark,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textLight,
    fontSize: SPACING.md,
  },
  form: {
    marginTop: 8,
    gap: 12,
  },
});