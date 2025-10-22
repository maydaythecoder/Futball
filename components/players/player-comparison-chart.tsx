"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayerAttributes } from "@/lib/mock-data/player-attributes";

interface PlayerComparisonChartProps {
  player1: PlayerAttributes;
  player2: PlayerAttributes;
  title?: string;
  description?: string;
}

export function PlayerComparisonChart({ 
  player1, 
  player2, 
  title = "Player Comparison",
  description = "Compare attributes between players"
}: PlayerComparisonChartProps) {
  const data = [
    {
      attribute: "Pace",
      [player1.playerName]: Math.round(player1.pace),
      [player2.playerName]: Math.round(player2.pace),
      fullMark: 99,
    },
    {
      attribute: "Shooting",
      [player1.playerName]: Math.round(player1.shooting),
      [player2.playerName]: Math.round(player2.shooting),
      fullMark: 99,
    },
    {
      attribute: "Passing",
      [player1.playerName]: Math.round(player1.passing),
      [player2.playerName]: Math.round(player2.passing),
      fullMark: 99,
    },
    {
      attribute: "Dribbling",
      [player1.playerName]: Math.round(player1.dribbling),
      [player2.playerName]: Math.round(player2.dribbling),
      fullMark: 99,
    },
    {
      attribute: "Defending",
      [player1.playerName]: Math.round(player1.defending),
      [player2.playerName]: Math.round(player2.defending),
      fullMark: 99,
    },
    {
      attribute: "Physical",
      [player1.playerName]: Math.round(player1.physical),
      [player2.playerName]: Math.round(player2.physical),
      fullMark: 99,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={data}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={90} domain={[0, 99]} />
            <Radar
              name={player1.playerName}
              dataKey={player1.playerName}
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Radar
              name={player2.playerName}
              dataKey={player2.playerName}
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.5}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
