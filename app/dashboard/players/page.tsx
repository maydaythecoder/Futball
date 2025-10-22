"use client";

import { useState } from "react";
import { MOCK_PLAYERS } from "@/lib/mock-data/players";
import { Player } from "@/lib/types";
import { PlayerCard } from "@/components/players/player-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const POSITIONS = ["All", "Forward", "Midfielder", "Defender", "Goalkeeper"];
const STATUSES = ["All", "available", "contracted", "injured"];

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [players, setPlayers] = useState(MOCK_PLAYERS);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.currentTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPosition = selectedPosition === "All" || player.position === selectedPosition;
    const matchesStatus = selectedStatus === "All" || player.status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const handleDelete = (playerId: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      setPlayers(players.filter((p) => p.id !== playerId));
    }
  };

  const handleEdit = (player: Player) => {
    alert(`Edit functionality for ${player.name} (Coming soon with Firebase integration)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">
            Manage and track all football talent
          </p>
        </div>
        <Button>Add Player</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, team, or nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full sm:w-48"
        >
          {POSITIONS.map((position) => (
            <option key={position} value={position}>
              {position === "All" ? "All Positions" : position}
            </option>
          ))}
        </Select>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPlayers.length} of {players.length} players
        </p>
      </div>

      {/* Players Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              userRole="admin"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No players found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}

