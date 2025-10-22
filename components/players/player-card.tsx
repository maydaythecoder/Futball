"use client";

import { Player } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface PlayerCardProps {
  player: Player;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: string) => void;
  userRole?: "admin" | "scout" | "coach";
}

export function PlayerCard({ player, onEdit, onDelete, userRole = "scout" }: PlayerCardProps) {
  const getStatusVariant = (status: Player["status"]) => {
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

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "text-green-600";
    if (rating >= 75) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={player.imageUrl} alt={player.name} />
              <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-none mb-1">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.position}</p>
            </div>
          </div>
          <Badge variant={getStatusVariant(player.status)}>
            {player.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Team:</span>
            <p className="font-medium">{player.currentTeam}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Age:</span>
            <p className="font-medium">{player.age}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Nationality:</span>
            <p className="font-medium">{player.nationality}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Rating:</span>
            <p className={`font-bold text-lg ${getRatingColor(player.overallRating)}`}>
              {player.overallRating}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        <Link href={`/players/${player.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </Link>
        {(userRole === "admin" || userRole === "scout") && onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(player)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        {userRole === "admin" && onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(player.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

