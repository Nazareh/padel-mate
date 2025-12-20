// PlayerSelector.js (Updated)

import { COLORS } from "@/components/styles";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

// Mock list of individual players (replace with your actual data fetching)
const MOCK_PLAYERS = [
  { id: "p0", name: "Select Player..." },
  { id: "p1", name: "John Doe" },
  { id: "p2", name: "Sarah Connor" },
  { id: "p3", name: "Mike Ross" },
  { id: "p4", name: "Emily White" },
  { id: "p5", name: "David Lee" },
  { id: "p6", name: "Maria Garcia" },
];

const PlayerSelector = ({
  playerLabel,
  selectedPlayerId,
  onPlayerChange,
}) => {
  return (
    <View style={selectorStyles.container}>
      <Text style={selectorStyles.label}>{playerLabel}</Text>
      <View style={selectorStyles.pickerWrapper}>
        <Picker
          selectedValue={selectedPlayerId}
          onValueChange={onPlayerChange}
          style={selectorStyles.picker}
          dropdownIconColor={COLORS.primary}
        >
          {MOCK_PLAYERS.map((player) => (
            <Picker.Item
              key={player.id}
              label={player.name}
              value={player.id}
              color={player.id === "p0" ? COLORS.placeholder : COLORS.text}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const selectorStyles = StyleSheet.create({
  container: {
    marginBottom:0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: COLORS.text,
  },
});

export default PlayerSelector;
