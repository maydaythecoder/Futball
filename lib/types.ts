// SECURITY: Type definitions enforce data validation at compile time
export type UserRole = "admin" | "scout" | "coach";

export type PlayerStatus = "available" | "contracted" | "injured";

export type TransferStatus = "pending" | "completed" | "cancelled";

export type InjuryStatus = "active" | "recovered";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  photoURL?: string;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  dateOfBirth: Date;
  position: string;
  currentTeam: string;
  nationality: string;
  height: number;
  weight: number;
  status: PlayerStatus;
  overallRating: number;
  imageUrl?: string;
  createdAt: Date;
  updatedBy: string;
}

export interface PlayerStat {
  id: string;
  playerId: string;
  matchDate: Date;
  opponent: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
  rating: number;
  seasonId: string;
}

export interface Injury {
  id: string;
  playerId: string;
  type: string;
  startDate: Date;
  expectedReturnDate: Date;
  status: InjuryStatus;
  notes: string;
}

export interface TrainingSession {
  id: string;
  playerId: string;
  date: Date;
  type: string;
  performance: number;
  notes: string;
}

export interface Transfer {
  id: string;
  playerId: string;
  playerName?: string;
  fromTeam: string;
  toTeam: string;
  transferDate: Date;
  fee?: number;
  status: TransferStatus;
  initiatedBy: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalPlayers: number;
  availablePlayers: number;
  activeTransfers: number;
  averageRating: number;
}

