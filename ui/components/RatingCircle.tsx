import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle, } from 'react-native-svg';

const ratingValue = 5.42;
const topPct = 15;
const trendValue = -158;

export default function HeaderProfile() {
    return (
        <View style={styles.heroSection}>
            <View style={styles.ratingCircleContainer}>
                <Svg height="180" width="180" viewBox="0 0 100 100">
                    <Circle
                        cx="50" cy="50" r="46"
                        stroke={COLORS.primaryShade}
                        strokeWidth="4"
                        fill="none"
                    />
                    <Circle
                        cx="50" cy="50" r="46"
                        stroke={COLORS.primary} strokeWidth="4" fill="none"
                        strokeDasharray="150"
                        strokeDashoffset="85"
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={styles.ratingTextContainer}>
                    <Text style={styles.ratingValue}>{ratingValue}</Text>
                    <Text style={styles.ratingLabel}>RATING</Text>
                </View>
            </View>
            <Text style={styles.regionText}>Top {topPct}% in your region</Text>

            {trendValue >= 0 && (
                <View style={styles.trendContainer}>
                    <MaterialIcons name="trending-up" size={FONT_SIZE.sm} color={COLORS.primary} />
                    <Text style={styles.upTrendText}>{trendValue} last 10 games</Text>
                </View>)
            }
            {trendValue < 0 && (
                <View style={styles.trendContainer}>
                    <MaterialIcons name="trending-down" size={FONT_SIZE.sm} color={COLORS.red} />
                    <Text style={styles.downTrendText}>{Math.abs(trendValue)} last 10 games</Text>
                </View>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    heroSection: { alignItems: 'center', marginVertical: SPACING.sm },
    ratingCircleContainer: {
        justifyContent: 'center', alignItems: 'center',
        width: 180, height: 180, backgroundColor: COLORS.backgroundDark,
        borderRadius: BORDER_RADIUS.full, borderWidth: 6, borderColor: COLORS.sufaceDark,
    },
    ratingTextContainer: { position: 'absolute', alignItems: 'center' },
    ratingValue: { color: 'white', fontSize: FONT_SIZE.xxxl, fontWeight: 'bold' },
    ratingLabel: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    regionText: { color: COLORS.textLight, fontSize: 14, marginTop: 15 },

    trendContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    upTrendText: { color: COLORS.primary, fontSize: 12, fontWeight: '600', marginLeft: 4 },
    downTrendText: { color: COLORS.red, fontSize: 12, fontWeight: '600', marginLeft: 4 },
})