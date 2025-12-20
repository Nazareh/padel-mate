import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "@/constants/GlobalStyles";

const MOCK_PLAYERS = [
  { id: "p0", name: "Select Player..." },
  { id: "p1", name: "John Doe" },
  { id: "p2", name: "Sarah Connor" },
  { id: "p3", name: "Mike Ross" },
  { id: "p4", name: "Emily White" },
  { id: "p5", name: "David Lee" },
  { id: "p6", name: "Maria Garcia" },
];

type Props = {
  label: string;
  playerId: string;
  onChange: (value: string) => void;
  excluding: string[];
};

export default function PlayerSelector(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}> {props.label} </Text>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={props.playerId}
          onValueChange={props.onChange}
        >
          {MOCK_PLAYERS.filter(
            (player) => !props.excluding.includes(player.id),
          ).map((player) => (
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent:'flex-start'
    
  },
  label: {
    fontSize: 14,
    minWidth: 50,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 5,
    marginLeft: 5,
  },
  labelWrapper: {
    justifyContent: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.card,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    height: 30,
    flexGrow: 1,
    justifyContent: "center",
  },
  picker: {
    height: "100%",
    color: COLORS.text,
  },
});
