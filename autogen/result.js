// ResultForm.js (Updated)

import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../.././components/styles";
import PlayerSelector from "../../components/PlayerSelector";

// ... ScoreInput component remains the same ...
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
// ...

const ResultForm = ({ onSubmit }) => {
  // *** UPDATED STATE: Store selected Player IDs (e.g., 'p1', 'p2') ***
  const [teamAId, setTeamAId] = useState("p0");
  const [teamBId, setTeamBId] = useState("p0");

  // State for Scores (up to 3 sets)
  const [scoreA1, setScoreA1] = useState("");
  const [scoreB1, setScoreB1] = useState("");
  const [scoreA2, setScoreA2] = useState("");
  const [scoreB2, setScoreB2] = useState("");
  const [scoreA3, setScoreA3] = useState("");
  const [scoreB3, setScoreB3] = useState("");

  const handleSubmission = () => {
    // Basic Validation: Ensure both teams have been selected
    if (teamAId === "p0" || teamBId === "p0") {
      Alert.alert(
        "Selection Required",
        "Please select both Team A and Team B before submitting.",
      );
      return;
    }

    // Validation: Ensure the teams are not the same (optional but good practice)
    if (teamAId === teamBId) {
      Alert.alert("Error", "Team A and Team B cannot be the same team.");
      return;
    }

    const resultData = {
      teamAId, // Submit ID instead of name
      teamBId, // Submit ID instead of name
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
      <View>
        <Text style={formStyles.sectionTitle}>Select Team A</Text>
        <PlayerSelector
          teamLabel="Team A Player"
          selectedPlayerId={teamAId}
          onPlayerChange={(itemValue) => setTeamAPlayer1(itemValue)}
        />
        <PlayerSelector
          teamLabel="Team A Player"
          selectedPlayerId={teamBId}
          onPlayerChange={(itemValue) => setTeamAPlayer2(itemValue)}
        />
      </View>
      <View>
        <Text style={formStyles.sectionTitle}>Select Team B</Text>
        <PlayerSelector
          teamLabel="Team A (Winners)"
          selectedPlayerId={teamAId}
          onPlayerChange={(itemValue) => setTeamAPlayer1(itemValue)}
        />
        <PlayerSelector
          teamLabel="Team B (Losers)"
          selectedPlayerId={teamBId}
          onPlayerChange={(itemValue) => setTeamAPlayer2(itemValue)}
        />
      </View>

      <Text style={formStyles.sectionTitle}>Match Score (Best of 3 Sets)</Text>

      {/* Score Grid (remains largely the same) */}
      <View style={formStyles.scoreGrid}>
        {/* Header */}
        <View style={formStyles.scoreHeader}>
          <View style={formStyles.teamLabelSpacer} />{" "}
          {/* <-- FIX: Spacer for Team Label */}
          <Text style={formStyles.scoreHeaderText}>Set 1</Text>
          <Text style={formStyles.scoreHeaderText}>Set 2</Text>
          <Text style={formStyles.scoreHeaderText}>Set 3</Text>
        </View>

        {/* Team A Scores */}
        <View style={formStyles.scoreRow}>
          {/* NOTE: We now show a placeholder since we only store the ID here */}
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

// ... formStyles remains the same as before, with minor tweaks to teamLabel if needed ...

const formStyles = StyleSheet.create({
  // ... (Keep the card, sectionTitle, submitButton styles)
  card: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 15,
    // marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    paddingLeft: 8,
  },
  // Removed 'input' style as it's no longer used for names
  // ... (Keep scoreGrid, scoreHeader, scoreHeaderText, scoreContainer, scoreInput styles)
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  teamLabel: {
    width: 50, // Fixed width for team name for alignment
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
    alignItems: "center",
  },
  teamLabelSpacer: {
    width: 50, // <-- FIX: Set spacer width equal to teamLabel width
    marginRight: 10, // <-- FIX: Set spacer margin equal to teamLabel margin
  },
  scoreHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.primary,
  },
  scoreContainer: {
    flex: 1,
    alignItems: "center",
  },
  scoreLabel: {
    display: "none",
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
});

export default ResultForm;
