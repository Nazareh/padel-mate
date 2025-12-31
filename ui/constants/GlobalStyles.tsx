import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#19e66b",
  secondary: "#244732",
  red200: "#fecaca",
  red300: "#f87171",
  red400: "#ef4444",
  red600: "#b91c1c",
  red700: "#7f1d1d",
  red900: "#520707ff",
  lightBlue: "#60a5fa",
  primaryShade: "#19e66b33",
  backgroundLight100: "#f6f8f7",
  backgroundLight200: "#cfcfcf",
  backgroundDark: "#112117",
  surfaceDark: "#1a3224",
  surfaceBorder: "#346548",
  textLight: "#f6f8f7",
  textLightGreen: "#93c8a8",
  textDark: '#112218'



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
  md: 20,
  lg: 35,
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
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "rgba(25,230,107,0.2)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: SPACING.md,
    gap: SPACING.md,
    flexWrap: 'wrap', // Allows inner content to flow
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
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
  labelTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLightGreen,
    fontWeight: "500",
    marginBottom: 2,
  },
  section: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: COLORS.secondary,
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
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.lg,
    backgroundColor: 'transparent',
  },
});