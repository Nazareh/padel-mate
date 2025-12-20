import PlayerSelector from "@/components/PlayerSelector";
import ScoreInput from "@/components/ScoreInput";
import { COLORS, globalStyles } from "@/constants/GlobalStyles";
import { SetStateAction, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function UploadResults() {
  const [playerA1, setPlayerA1] = useState("p0");
  const [playerA2, setPlayerA2] = useState("p0");
  const [playerB1, setPlayerB1] = useState("p0");
  const [playerB2, setPlayerB2] = useState("p0");
  const [selectedPlayers, setSelectedPlayers] = useState([""]);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.teamSection}>
        <Text style={globalStyles.sectionTitle}> Select Team A</Text>
        <PlayerSelector
          label="Player 1"
          playerId={playerA1}
          onChange={(value: string) => {
            setPlayerA1(value);
          }}
          excluding={selectedPlayers}
        />
        <PlayerSelector
          label="Player 2"
          playerId={playerA2}
          onChange={(value: string) => {
            setPlayerA2(value);
          }}
          excluding={selectedPlayers}
        />
      </View>
      <View style={styles.teamSection}>
        <Text style={globalStyles.sectionTitle}> Select Team B</Text>
        <PlayerSelector
          label="Player 1"
          playerId={playerB1}
          onChange={(value: string) => {
            setPlayerB1(value);
          }}
          excluding={selectedPlayers}
        />
        <PlayerSelector
          label="Player 2"
          playerId={playerB2}
          onChange={(value: string) => {
            setPlayerB2(value);
          }}
          excluding={selectedPlayers}
        />
      </View>
      <View style={styles.teamSection}>
        <Text style={globalStyles.sectionTitle}>
          {" "}
          Match Score (Games per Set){" "}
        </Text>
        <View style={styles.scoreGrid}>
          <View style={styles.scoreHeader}>
            <View style={{ width: 100 }} />
            <Text style={styles.scoreHeaderText}>Set 1</Text>
            <Text style={styles.scoreHeaderText}>Set 2</Text>
            <Text style={styles.scoreHeaderText}>Set 3</Text>
          </View>
          {/* Team A Scores */}
          <View style={styles.scoreRow}>
            <Text style={styles.teamLabel}>Team A</Text>
            <ScoreInput
              set={1}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
            <ScoreInput
              set={2}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
            <ScoreInput
              set={3}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
          </View>

          {/* Team B Scores */}
          <View style={styles.scoreRow}>
            <Text style={styles.teamLabel}>Team B</Text>
            <ScoreInput
              set={1}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
            <ScoreInput
              set={2}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
            <ScoreInput
              set={3}
              value={0}
              onChangeText={() => {}}
              placeholder={0}
            />
          </View>
        </View>
      </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {}}
            >
              <Text style={styles.submitButtonText}>Upload Match Result</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  teamSection: {
    paddingHorizontal: 16,
    borderRadius: 8,
    paddingBottom: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: COLORS.card,
  },
  scoreGrid: {
    marginTop: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    elevation: 5
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scoreHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.primary,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  teamLabel: {
    width: 100,
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 14,
    marginRight: 10,
  },
    submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
