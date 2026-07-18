import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { COLORS } from '@/constants/GlobalStyles';
type RatingPoint = { date: string; rating: number };

type Props = { data: RatingPoint[] };

export default function RatingChart({ data }: Props) {
  const { width } = useWindowDimensions();

  // Layout constants
  const svgWidth = width - 64;
  const svgHeight = 150;
  const padLeft = 46;
  const padRight = 12;
  const padTop = 10;
  const padBottom = 28;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const ratings = data.map(d => d.rating);
  const minR = Math.min(...ratings) - 20;
  const maxR = Math.max(...ratings) + 20;

  const toX = (i: number) => padLeft + (i / (data.length - 1)) * plotW;
  const toY = (r: number) => padTop + plotH - ((r - minR) / (maxR - minR)) * plotH;

  const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.rating) }));

  // Smooth cubic bezier line
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const bottomY = padTop + plotH;
  const fillPath = `${linePath} L ${pts[pts.length - 1].x} ${bottomY} L ${pts[0].x} ${bottomY} Z`;

  // Y-axis: 3 reference lines
  const yRefs = [
    { label: Math.round(maxR).toString(), y: toY(maxR) },
    { label: Math.round((maxR + minR) / 2).toString(), y: toY((maxR + minR) / 2) },
    { label: Math.round(minR).toString(), y: toY(minR) },
  ];

  // X-axis: first, middle (deduplicated), last
  const xIdxs = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])];

  const ratingChange = data[data.length - 1].rating - data[0].rating;
  const changeColor = ratingChange >= 0 ? COLORS.primary : COLORS.red400;

  return (
    <View>
      <Svg width={svgWidth} height={svgHeight}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.25" />
            <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {yRefs.map((ref, i) => (
          <React.Fragment key={i}>
            <Line
              x1={padLeft} y1={ref.y}
              x2={svgWidth - padRight} y2={ref.y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <SvgText
              x={padLeft - 6} y={ref.y + 4}
              fontSize="9" fill={COLORS.textGray}
              textAnchor="end"
            >
              {ref.label}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Gradient fill */}
        <Path d={fillPath} fill="url(#grad)" />

        {/* Line */}
        <Path d={linePath} stroke={COLORS.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {pts.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="2.5" fill={COLORS.primary} opacity="0.7" />
        ))}

        {/* Highlight last point */}
        {(() => {
          const last = pts[pts.length - 1];
          return (
            <>
              <Circle cx={last.x} cy={last.y} r="6" fill={COLORS.primary} opacity="0.2" />
              <Circle cx={last.x} cy={last.y} r="3.5" fill={COLORS.primary} />
              <Circle cx={last.x} cy={last.y} r="1.5" fill={COLORS.backgroundDark} />
            </>
          );
        })()}

        {/* X-axis labels */}
        {xIdxs.map((i, pos) => (
          <SvgText
            key={pos}
            x={pts[i].x} y={svgHeight - 6}
            fontSize="9" fill={COLORS.textGray}
            textAnchor="middle"
          >
            {data[i].date}
          </SvgText>
        ))}
      </Svg>

      <Text style={[styles.change, { color: changeColor }]}>
        {ratingChange >= 0 ? '+' : ''}{ratingChange} pts since {data[0].date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  change: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
});
