"use client";

import { useState } from "react";
import { Transfer, Player } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface TransferModalProps {
  players: Player[];
  onSubmit: (transfer: Partial<Transfer>) => void;
}

export function TransferModal({ players, onSubmit }: TransferModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    playerId: "",
    fromTeam: "",
    toTeam: "",
    fee: "",
    transferDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPlayer = players.find(p => p.id === formData.playerId);
    
    // SECURITY: Input validation before submission
    if (!formData.playerId || !formData.toTeam) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      playerId: formData.playerId,
      playerName: selectedPlayer?.name,
      fromTeam: formData.fromTeam || selectedPlayer?.currentTeam || "",
      toTeam: formData.toTeam,
      fee: formData.fee ? parseFloat(formData.fee) : undefined,
      transferDate: new Date(formData.transferDate),
      status: "pending",
      createdAt: new Date(),
    });

    setFormData({
      playerId: "",
      fromTeam: "",
      toTeam: "",
      fee: "",
      transferDate: new Date().toISOString().split("T")[0],
    });
    setOpen(false);
  };

  const handlePlayerChange = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    setFormData(prev => ({
      ...prev,
      playerId,
      fromTeam: player?.currentTeam || "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button">
          <Plus className="h-4 w-4 mr-2" />
          New Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Transfer</DialogTitle>
            <DialogDescription>
              Initiate a new player transfer between teams
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="player" className="text-sm font-medium">
                Player *
              </label>
              <Select
                id="player"
                value={formData.playerId}
                onChange={(e) => handlePlayerChange(e.target.value)}
                required
              >
                <option value="">Select a player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} - {player.currentTeam}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="fromTeam" className="text-sm font-medium">
                From Team
              </label>
              <Input
                id="fromTeam"
                value={formData.fromTeam}
                onChange={(e) => setFormData({ ...formData, fromTeam: e.target.value })}
                placeholder="Current team"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="toTeam" className="text-sm font-medium">
                To Team *
              </label>
              <Input
                id="toTeam"
                value={formData.toTeam}
                onChange={(e) => setFormData({ ...formData, toTeam: e.target.value })}
                placeholder="Destination team"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="fee" className="text-sm font-medium">
                Transfer Fee (€)
              </label>
              <Input
                id="fee"
                type="number"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Transfer Date
              </label>
              <Input
                id="date"
                type="date"
                value={formData.transferDate}
                onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Transfer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

