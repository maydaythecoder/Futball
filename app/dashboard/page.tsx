"use client";

import { MOCK_PLAYERS } from "@/lib/mock-data/players";
import { MOCK_TRANSFERS } from "@/lib/mock-data/transfers";
import { StatCard } from "@/components/shared/stat-card";
import { PlayerCard } from "@/components/players/player-card";
import { Users, UserCheck, ArrowLeftRight, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const totalPlayers = MOCK_PLAYERS.length;
  const availablePlayers = MOCK_PLAYERS.filter((p) => p.status === "available").length;
  const activeTransfers = MOCK_TRANSFERS.filter((t) => t.status === "pending").length;
  const averageRating =
    MOCK_PLAYERS.reduce((sum, p) => sum + p.overallRating, 0) / MOCK_PLAYERS.length;

  const topPlayers = MOCK_PLAYERS.sort((a, b) => b.overallRating - a.overallRating).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your football talent management platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Players"
          value={totalPlayers}
          icon={Users}
          description="All registered players"
        />
        <StatCard
          title="Available Players"
          value={availablePlayers}
          icon={UserCheck}
          description="Ready for transfer"
        />
        <StatCard
          title="Active Transfers"
          value={activeTransfers}
          icon={ArrowLeftRight}
          description="Pending transfers"
        />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          icon={TrendingUp}
          description="Overall squad quality"
        />
      </div>

      {/* Top Players Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Rated Players</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} userRole="admin" />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Transfers</h2>
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            {MOCK_TRANSFERS.slice(0, 5).map((transfer) => (
              <div
                key={transfer.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transfer.playerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {transfer.fromTeam} → {transfer.toTeam}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transfer.fee ? `€${(transfer.fee / 1000000).toFixed(1)}M` : "Free"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{transfer.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

