// Type-safe Firestore query functions for players
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
} from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase/config";
import { Player } from "@/lib/types";
import { MOCK_PLAYERS } from "@/lib/mock-data/players";

const PLAYERS_COLLECTION = "players";

// SECURITY: Input sanitization helper
const sanitizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

/**
 * Get all players with optional filters
 */
export async function getPlayers(): Promise<Player[]> {
  if (useMockData) {
    return MOCK_PLAYERS;
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(playersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player));
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
}

/**
 * Get players by position
 */
export async function getPlayersByPosition(position: string): Promise<Player[]> {
  if (useMockData) {
    return MOCK_PLAYERS.filter((p) => p.position === position);
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(
      playersRef,
      where("position", "==", position),
      orderBy("overallRating", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player));
  } catch (error) {
    console.error("Error fetching players by position:", error);
    throw error;
  }
}

/**
 * Get available players
 */
export async function getAvailablePlayers(): Promise<Player[]> {
  if (useMockData) {
    return MOCK_PLAYERS.filter((p) => p.status === "available");
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(
      playersRef,
      where("status", "==", "available"),
      orderBy("overallRating", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player));
  } catch (error) {
    console.error("Error fetching available players:", error);
    throw error;
  }
}

/**
 * Get top performers
 */
export async function getTopPerformers(limitCount: number = 10): Promise<Player[]> {
  if (useMockData) {
    return MOCK_PLAYERS.sort((a, b) => b.overallRating - a.overallRating).slice(0, limitCount);
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(playersRef, orderBy("overallRating", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player));
  } catch (error) {
    console.error("Error fetching top performers:", error);
    throw error;
  }
}

/**
 * Get players by team
 */
export async function getPlayersByTeam(team: string): Promise<Player[]> {
  if (useMockData) {
    return MOCK_PLAYERS.filter((p) => p.currentTeam === team);
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const q = query(playersRef, where("currentTeam", "==", team));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Player));
  } catch (error) {
    console.error("Error fetching players by team:", error);
    throw error;
  }
}

/**
 * Search players by name, team, or nationality
 */
export async function searchPlayers(searchQuery: string): Promise<Player[]> {
  if (useMockData) {
    const query = sanitizeString(searchQuery);
    return MOCK_PLAYERS.filter(
      (p) =>
        sanitizeString(p.name).includes(query) ||
        sanitizeString(p.currentTeam).includes(query) ||
        sanitizeString(p.nationality).includes(query)
    );
  }

  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia or Firebase Extensions
  try {
    const players = await getPlayers();
    const query = sanitizeString(searchQuery);
    return players.filter(
      (p) =>
        sanitizeString(p.name).includes(query) ||
        sanitizeString(p.currentTeam).includes(query) ||
        sanitizeString(p.nationality).includes(query)
    );
  } catch (error) {
    console.error("Error searching players:", error);
    throw error;
  }
}

/**
 * Get a single player by ID
 */
export async function getPlayerById(playerId: string): Promise<Player | null> {
  if (useMockData) {
    return MOCK_PLAYERS.find((p) => p.id === playerId) || null;
  }

  try {
    const playerDoc = doc(db, PLAYERS_COLLECTION, playerId);
    const snapshot = await getDoc(playerDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Player;
    }
    return null;
  } catch (error) {
    console.error("Error fetching player:", error);
    throw error;
  }
}

/**
 * Add a new player
 */
export async function addPlayer(player: Omit<Player, "id">): Promise<string> {
  if (useMockData) {
    console.log("Mock mode: Would add player", player);
    return "mock-id";
  }

  try {
    const playersRef = collection(db, PLAYERS_COLLECTION);
    const docRef = await addDoc(playersRef, player);
    return docRef.id;
  } catch (error) {
    console.error("Error adding player:", error);
    throw error;
  }
}

/**
 * Update a player
 */
export async function updatePlayer(
  playerId: string,
  updates: Partial<Player>
): Promise<void> {
  if (useMockData) {
    console.log("Mock mode: Would update player", playerId, updates);
    return;
  }

  try {
    const playerDoc = doc(db, PLAYERS_COLLECTION, playerId);
    await updateDoc(playerDoc, updates);
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
}

/**
 * Delete a player
 */
export async function deletePlayer(playerId: string): Promise<void> {
  if (useMockData) {
    console.log("Mock mode: Would delete player", playerId);
    return;
  }

  try {
    const playerDoc = doc(db, PLAYERS_COLLECTION, playerId);
    await deleteDoc(playerDoc);
  } catch (error) {
    console.error("Error deleting player:", error);
    throw error;
  }
}

