// ResultForm.js (Finalized structure for 4 players)

import PlayerSelector from "@/components/PlayerSelector";
import { COLORS } from "components/styles";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- ScoreInput component (Remains the same) ---
const ScoreInput = ({ set, value, onChangeText, placeholder }) => (
  <View style={formStyles.scoreContainer}>
    <Text style={formStyles.scoreLabel}>{`Set ${set}`}</Text>
    <TextInput
      style={formStyles.scoreInput}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || "0"}
      placeholderTextColor={COLORS.placeholder}
      maxLength={2}
    />
  </View>
);
// -------------------------------------------------

const ResultForm = ({ onSubmit }) => {
  // *** UPDATED STATE: Four individual player IDs ***
  const [playerA1, setPlayerA1] = useState("p0");
  const [playerA2, setPlayerA2] = useState("p0");
  const [playerB1, setPlayerB1] = useState("p0");
  const [playerB2, setPlayerB2] = useState("p0");

  // State for Scores (up to 3 sets)
  const [scoreA1, setScoreA1] = useState("");
  // ... (score state remains the same for simplicity in score input) ...
  const [scoreB1, setScoreB1] = useState("");
  const [scoreA2, setScoreA2] = useState("");
  const [scoreB2, setScoreB2] = useState("");
  const [scoreA3, setScoreA3] = useState("");
  const [scoreB3, setScoreB3] = useState("");

  const handleSubmission = () => {
    const playerIDs = [playerA1, playerA2, playerB1, playerB2];

    // Validation 1: Ensure all four players are selected
    if (playerIDs.includes("p0")) {
      Alert.alert(
        "Selection Required",
        "Please select all four players before submitting.",
      );
      return;
    }

    // Validation 2: Ensure all players are unique
    const uniqueIDs = new Set(playerIDs);
    if (uniqueIDs.size !== 4) {
      Alert.alert(
        "Error",
        "The same player cannot be selected for multiple slots.",
      );
      return;
    }

    const resultData = {
      teamA: [playerA1, playerA2],
      teamB: [playerB1, playerB2],
      scores: [
        { set: 1, A: scoreA1, B: scoreB1 },
        { set: 2, A: scoreA2, B: scoreB2 },
        { set: 3, A: scoreA3, B: scoreB3 },
      ],
    };
    onSubmit(resultData);
  };

  return (
    <View style={formStyles.card}>
      {/* --- Team A Selection --- */}
      <Text style={formStyles.teamHeader}>🏆 Team A (Winners)</Text>
      <View style={formStyles.playerRow}>
        <PlayerSelector
          playerLabel="Player 1"
          selectedPlayerId={playerA1}
          onPlayerChange={(itemValue) => setPlayerA1(itemValue)}
          slotNumber={1}
        />
        <PlayerSelector
          playerLabel="Player 2"
          selectedPlayerId={playerA2}
          onPlayerChange={(itemValue) => setPlayerA2(itemValue)}
          slotNumber={2}
        />
      </View>

      {/* --- Team B Selection --- */}
      <Text style={[formStyles.teamHeader, { marginTop: 10 }]}>
        🆚 Team B (Losers)
      </Text>
      <View style={formStyles.playerRow}>
        <PlayerSelector
          playerLabel="Player 3"
          selectedPlayerId={playerB1}
          onPlayerChange={(itemValue) => setPlayerB1(itemValue)}
          slotNumber={3}
        />
        <PlayerSelector
          playerLabel="Player 4"
          selectedPlayerId={playerB2}
          onPlayerChange={(itemValue) => setPlayerB2(itemValue)}
          slotNumber={4}
        />
      </View>

      <Text style={formStyles.sectionTitle}>Match Score (Games per Set)</Text>

      {/* Score Grid (remains the same) */}
      <View style={formStyles.scoreGrid}>
        {/* Header */}
            <View style={formStyles.scoreHeader}>
          <Text style={formStyles.scoreHeaderText}>Set 1</Text>
          <Text style={formStyles.scoreHeaderText}>Set 2</Text>
          <Text style={formStyles.scoreHeaderText}>Set 3</Text>
        </View>

        {/* Team A Scores */}
        <View style={formStyles.scoreRow}>
          <Text style={formStyles.teamLabel}>Team A</Text>
          <ScoreInput set={1} value={scoreA1} onChangeText={setScoreA1} />
          <ScoreInput set={2} value={scoreA2} onChangeText={setScoreA2} />
          <ScoreInput set={3} value={scoreA3} onChangeText={setScoreA3} />
        </View>

        {/* Team B Scores */}
        <View style={formStyles.scoreRow}>
          <Text style={formStyles.teamLabel}>Team B</Text>
          <ScoreInput set={1} value={scoreB1} onChangeText={setScoreB1} />
          <ScoreInput set={2} value={scoreB2} onChangeText={setScoreB2} />
          <ScoreInput set={3} value={scoreB3} onChangeText={setScoreB3} />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={formStyles.submitButton}
        onPress={handleSubmission}
      >
        <Text style={formStyles.submitButtonText}>Upload Match Result</Text>
      </TouchableOpacity>
    </View>
  );
};

const formStyles = StyleSheet.create({
  // ... (Keep the existing card, sectionTitle, submitButton styles)
  card: {
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    paddingLeft: 8,
  },
  teamHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, // Use gap for spacing between selectors
  },
  // To make selectors share the width equally
  // NOTE: You would need to update PlayerSelector.js `selectorStyles.container` if using this:
  // container: { flex: 1, marginBottom: 15, marginRight: 10 },

  // Score Grid styles (kept for completeness)
  scoreGrid: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
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
  scoreContainer: {
    flex: 1,
    alignItems: "center",
  },
  scoreInput: {
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
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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

export default ResultForm;
