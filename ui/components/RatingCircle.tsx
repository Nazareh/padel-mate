import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, } from 'react-native-svg';


type RatingCircleProps = {
    latestRating: number;
    trendValue: number | null | undefined;
}

export default function RatingCircle({ latestRating, trendValue }: RatingCircleProps) {
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
                    <Text style={styles.ratingValue}>{latestRating}</Text>
                    <Text style={styles.ratingLabel}>RATING</Text>
                </View>
            </View>

            {trendValue && trendValue >= 0 && (
                <View style={styles.trendContainer}>
                    <MaterialIcons name="trending-up" size={FONT_SIZE.sm} color={COLORS.primary} />
                    <Text style={styles.upTrendText}>{trendValue} last 10 games</Text>
                </View>)
            }
            {trendValue && trendValue < 0 && (
                <View style={styles.trendContainer}>
                    <MaterialIcons name="trending-down" size={FONT_SIZE.sm} color={COLORS.red400} />
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
        borderRadius: BORDER_RADIUS.full, borderWidth: 6, borderColor: COLORS.surfaceDark,
    },
    ratingTextContainer: { position: 'absolute', alignItems: 'center' },
    ratingValue: { color: COLORS.textLight, fontSize: FONT_SIZE.xxxl, fontWeight: 'bold' },
    ratingLabel: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: 'bold', letterSpacing: 1 },
    regionText: { color: COLORS.textLight, fontSize: FONT_SIZE.sm, marginTop: SPACING.md },

    trendContainer: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs },
    upTrendText: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: '600', marginLeft: SPACING.xs },
    downTrendText: { color: COLORS.red400, fontSize: FONT_SIZE.sm, fontWeight: '600', marginLeft: SPACING.xs },
})