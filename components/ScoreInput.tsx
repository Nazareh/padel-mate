import { COLORS } from "@/constants/GlobalStyles";
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  set: number;
  value: number;
  onChangeText: () => void;
  placeholder: number;
};

export default function ScoreInput({
  set,
  value,
  onChangeText,
  placeholder,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`Set ${set}`}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={onChangeText}
        placeholder={placeholder.toExponential()|| "0"}
        placeholderTextColor={COLORS.placeholder}
        maxLength={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    width: 100,
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 14,
    marginRight: 10,
  },
  input: {
    width: "80%",
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
});
