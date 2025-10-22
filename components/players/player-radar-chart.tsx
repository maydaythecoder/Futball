"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayerAttributes } from "@/lib/mock-data/player-attributes";

interface PlayerRadarChartProps {
  attributes: PlayerAttributes;
  title?: string;
  description?: string;
}

export function PlayerRadarChart({ attributes, title, description }: PlayerRadarChartProps) {
  const data = [
    {
      attribute: "Pace",
      value: Math.round(attributes.pace),
      fullMark: 99,
    },
    {
      attribute: "Shooting",
      value: Math.round(attributes.shooting),
      fullMark: 99,
    },
    {
      attribute: "Passing",
      value: Math.round(attributes.passing),
      fullMark: 99,
    },
    {
      attribute: "Dribbling",
      value: Math.round(attributes.dribbling),
      fullMark: 99,
    },
    {
      attribute: "Defending",
      value: Math.round(attributes.defending),
      fullMark: 99,
    },
    {
      attribute: "Physical",
      value: Math.round(attributes.physical),
      fullMark: 99,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Player Attributes"}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={90} domain={[0, 99]} />
            <Radar
              name={attributes.playerName}
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
