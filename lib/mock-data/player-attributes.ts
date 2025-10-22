// Player performance attributes for radar charts
export interface PlayerAttributes {
  playerId: string;
  playerName: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

// Generate realistic attributes based on player position and overall rating
export function generatePlayerAttributes(
  playerId: string,
  playerName: string,
  position: string,
  overallRating: number
): PlayerAttributes {
  const base = overallRating;
  const variance = 10;

  switch (position) {
    case "Forward":
      return {
        playerId,
        playerName,
        pace: Math.min(99, base + Math.random() * variance),
        shooting: Math.min(99, base + Math.random() * variance),
        passing: Math.min(99, base - variance / 2 + Math.random() * variance),
        dribbling: Math.min(99, base + Math.random() * variance),
        defending: Math.min(99, base - variance * 2 + Math.random() * variance),
        physical: Math.min(99, base - variance / 2 + Math.random() * variance),
      };
    case "Midfielder":
      return {
        playerId,
        playerName,
        pace: Math.min(99, base - variance / 2 + Math.random() * variance),
        shooting: Math.min(99, base - variance / 2 + Math.random() * variance),
        passing: Math.min(99, base + Math.random() * variance),
        dribbling: Math.min(99, base + Math.random() * variance),
        defending: Math.min(99, base - variance / 2 + Math.random() * variance),
        physical: Math.min(99, base - variance / 2 + Math.random() * variance),
      };
    case "Defender":
      return {
        playerId,
        playerName,
        pace: Math.min(99, base - variance / 2 + Math.random() * variance),
        shooting: Math.min(99, base - variance * 2 + Math.random() * variance),
        passing: Math.min(99, base - variance / 2 + Math.random() * variance),
        dribbling: Math.min(99, base - variance + Math.random() * variance),
        defending: Math.min(99, base + Math.random() * variance),
        physical: Math.min(99, base + Math.random() * variance),
      };
    case "Goalkeeper":
      return {
        playerId,
        playerName,
        pace: Math.min(99, base - variance * 2 + Math.random() * variance),
        shooting: Math.min(99, base - variance * 3 + Math.random() * variance),
        passing: Math.min(99, base - variance + Math.random() * variance),
        dribbling: Math.min(99, base - variance * 2 + Math.random() * variance),
        defending: Math.min(99, base + Math.random() * variance),
        physical: Math.min(99, base + Math.random() * variance),
      };
    default:
      return {
        playerId,
        playerName,
        pace: base,
        shooting: base,
        passing: base,
        dribbling: base,
        defending: base,
        physical: base,
      };
  }
}

