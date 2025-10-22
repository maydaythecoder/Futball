"use client";

import { use } from "react";
import { MOCK_PLAYERS, MOCK_STATS, MOCK_INJURIES, MOCK_TRAINING } from "@/lib/mock-data/players";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const player = MOCK_PLAYERS.find((p) => p.id === id);
  const playerStats = MOCK_STATS.filter((s) => s.playerId === id);
  const playerInjuries = MOCK_INJURIES.filter((i) => i.playerId === id);
  const playerTraining = MOCK_TRAINING.filter((t) => t.playerId === id);

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

      {/* Player Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={player.imageUrl} alt={player.name} />
              <AvatarFallback className="text-3xl">
                {player.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                  <p className="text-2xl font-bold text-primary">{player.overallRating}</p>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Assists</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAssists}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

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

