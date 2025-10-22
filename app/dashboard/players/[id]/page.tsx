"use client";

import { useState } from "react";
import { MOCK_PLAYERS, MOCK_STATS, MOCK_INJURIES, MOCK_TRAINING } from "@/lib/mock-data/players";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerRadarChart } from "@/components/players/player-radar-chart";
import { PlayerComparisonChart } from "@/components/players/player-comparison-chart";
import { generatePlayerAttributes } from "@/lib/mock-data/player-attributes";
import { ArrowLeft, Edit, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PlayerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const player = MOCK_PLAYERS.find((p) => p.id === id);
  const playerStats = MOCK_STATS.filter((s) => s.playerId === id);
  const playerInjuries = MOCK_INJURIES.filter((i) => i.playerId === id);
  const playerTraining = MOCK_TRAINING.filter((t) => t.playerId === id);
  
  const [comparePlayerId, setComparePlayerId] = useState<string>("");
  const comparePlayer = MOCK_PLAYERS.find((p) => p.id === comparePlayerId);

  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Player not found</h2>
          <Link href="/dashboard/players">
            <Button>Back to Players</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: typeof player.status) => {
    switch (status) {
      case "available":
        return "success";
      case "contracted":
        return "default";
      case "injured":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const totalGoals = playerStats.reduce((sum, stat) => sum + stat.goals, 0);
  const totalAssists = playerStats.reduce((sum, stat) => sum + stat.assists, 0);
  const averageRating =
    playerStats.length > 0
      ? playerStats.reduce((sum, stat) => sum + stat.rating, 0) / playerStats.length
      : 0;

  const playerAttributes = generatePlayerAttributes(
    player.id,
    player.name,
    player.position,
    player.overallRating
  );

  const compareAttributes = comparePlayer
    ? generatePlayerAttributes(
        comparePlayer.id,
        comparePlayer.name,
        comparePlayer.position,
        comparePlayer.overallRating
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/players">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Player Details</h1>
          <p className="text-muted-foreground">View and manage player information</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Player
        </Button>
      </div>

      {/* Player Info Card with Enhanced Photo */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-40 w-40 rounded-lg overflow-hidden border-4 border-primary/20 shadow-lg">
                <Avatar className="h-full w-full rounded-lg">
                  <AvatarImage 
                    src={player.imageUrl} 
                    alt={player.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl rounded-lg bg-gradient-to-br from-primary to-primary/60">
                    {player.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {player.overallRating}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Overall</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{player.name}</h2>
                  <p className="text-lg text-muted-foreground">{player.position}</p>
                </div>
                <Badge variant={getStatusVariant(player.status)} className="text-sm">
                  {player.status.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="font-medium">{player.currentTeam}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{player.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{player.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{player.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium">{player.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{player.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{format(player.dateOfBirth, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{format(player.createdAt, "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalGoals}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {playerStats.length} matches played
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Assists</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAssists}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {playerStats.length > 0 ? (totalAssists / playerStats.length).toFixed(1) : 0} per match
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Match performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Player Attributes Radar Chart */}
      <PlayerRadarChart
        attributes={playerAttributes}
        title={`${player.name} - Performance Attributes`}
        description="Comprehensive breakdown of player skills across key performance areas"
      />

      {/* Player Comparison Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Compare with Another Player
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Select a player to compare attributes side-by-side
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <label htmlFor="comparePlayer" className="text-sm font-medium min-w-fit">
                Select Player:
              </label>
              <Select
                id="comparePlayer"
                value={comparePlayerId}
                onChange={(e) => setComparePlayerId(e.target.value)}
                className="max-w-md"
              >
                <option value="">Choose a player...</option>
                {MOCK_PLAYERS.filter((p) => p.id !== player.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.position} ({p.currentTeam})
                  </option>
                ))}
              </Select>
            </div>

            {comparePlayer && compareAttributes && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-500/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={player.imageUrl} alt={player.name} />
                          <AvatarFallback>
                            {player.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {player.position} • {player.currentTeam}
                          </p>
                          <Badge variant="default" className="mt-1">
                            Rating: {player.overallRating}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-green-500/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={comparePlayer.imageUrl} alt={comparePlayer.name} />
                          <AvatarFallback>
                            {comparePlayer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{comparePlayer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {comparePlayer.position} • {comparePlayer.currentTeam}
                          </p>
                          <Badge variant="default" className="mt-1">
                            Rating: {comparePlayer.overallRating}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <PlayerComparisonChart
                  player1={playerAttributes}
                  player2={compareAttributes}
                  title="Attribute Comparison"
                  description={`Detailed comparison between ${player.name} and ${comparePlayer.name}`}
                />

                {/* Attribute Breakdown Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attribute</TableHead>
                          <TableHead className="text-right">{player.name}</TableHead>
                          <TableHead className="text-right">{comparePlayer.name}</TableHead>
                          <TableHead className="text-right">Difference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Pace", p1: playerAttributes.pace, p2: compareAttributes.pace },
                          { name: "Shooting", p1: playerAttributes.shooting, p2: compareAttributes.shooting },
                          { name: "Passing", p1: playerAttributes.passing, p2: compareAttributes.passing },
                          { name: "Dribbling", p1: playerAttributes.dribbling, p2: compareAttributes.dribbling },
                          { name: "Defending", p1: playerAttributes.defending, p2: compareAttributes.defending },
                          { name: "Physical", p1: playerAttributes.physical, p2: compareAttributes.physical },
                        ].map((attr) => {
                          const diff = attr.p1 - attr.p2;
                          return (
                            <TableRow key={attr.name}>
                              <TableCell className="font-medium">{attr.name}</TableCell>
                              <TableCell className="text-right font-bold">{Math.round(attr.p1)}</TableCell>
                              <TableCell className="text-right font-bold">{Math.round(attr.p2)}</TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant={diff > 0 ? "success" : diff < 0 ? "destructive" : "secondary"}
                                >
                                  {diff > 0 ? "+" : ""}{Math.round(diff)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Match Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Match Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {playerStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Assists</TableHead>
                  <TableHead>Minutes</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{format(stat.matchDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{stat.opponent}</TableCell>
                    <TableCell>{stat.goals}</TableCell>
                    <TableCell>{stat.assists}</TableCell>
                    <TableCell>{stat.minutesPlayed}&apos;</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stat.rating}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No match statistics available</p>
          )}
        </CardContent>
      </Card>

      {/* Injuries */}
      <Card>
        <CardHeader>
          <CardTitle>Injury History</CardTitle>
        </CardHeader>
        <CardContent>
          {playerInjuries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerInjuries.map((injury) => (
                  <TableRow key={injury.id}>
                    <TableCell className="font-medium">{injury.type}</TableCell>
                    <TableCell>{format(injury.startDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(injury.expectedReturnDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={injury.status === "active" ? "destructive" : "success"}>
                        {injury.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{injury.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No injury records</p>
          )}
        </CardContent>
      </Card>

      {/* Training Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {playerTraining.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerTraining.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{format(session.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>{session.type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{session.performance}/10</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No training session records
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

