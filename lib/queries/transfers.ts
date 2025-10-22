// Type-safe Firestore query functions for transfers
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, useMockData } from "@/lib/firebase/config";
import { Transfer } from "@/lib/types";
import { MOCK_TRANSFERS } from "@/lib/mock-data/transfers";

const TRANSFERS_COLLECTION = "transfers";

/**
 * Get all transfers
 */
export async function getTransfers(): Promise<Transfer[]> {
  if (useMockData) {
    return MOCK_TRANSFERS;
  }

  try {
    const transfersRef = collection(db, TRANSFERS_COLLECTION);
    const q = query(transfersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transfer));
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
}

/**
 * Get transfers by player ID
 */
export async function getTransfersByPlayer(playerId: string): Promise<Transfer[]> {
  if (useMockData) {
    return MOCK_TRANSFERS.filter((t) => t.playerId === playerId);
  }

  try {
    const transfersRef = collection(db, TRANSFERS_COLLECTION);
    const q = query(
      transfersRef,
      where("playerId", "==", playerId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transfer));
  } catch (error) {
    console.error("Error fetching transfers by player:", error);
    throw error;
  }
}

/**
 * Get transfers by status
 */
export async function getTransfersByStatus(status: Transfer["status"]): Promise<Transfer[]> {
  if (useMockData) {
    return MOCK_TRANSFERS.filter((t) => t.status === status);
  }

  try {
    const transfersRef = collection(db, TRANSFERS_COLLECTION);
    const q = query(transfersRef, where("status", "==", status), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transfer));
  } catch (error) {
    console.error("Error fetching transfers by status:", error);
    throw error;
  }
}

/**
 * Add a new transfer
 */
export async function addTransfer(transfer: Omit<Transfer, "id">): Promise<string> {
  if (useMockData) {
    console.log("Mock mode: Would add transfer", transfer);
    return "mock-id";
  }

  try {
    const transfersRef = collection(db, TRANSFERS_COLLECTION);
    const docRef = await addDoc(transfersRef, transfer);
    return docRef.id;
  } catch (error) {
    console.error("Error adding transfer:", error);
    throw error;
  }
}

/**
 * Update a transfer
 */
export async function updateTransfer(
  transferId: string,
  updates: Partial<Transfer>
): Promise<void> {
  if (useMockData) {
    console.log("Mock mode: Would update transfer", transferId, updates);
    return;
  }

  try {
    const transferDoc = doc(db, TRANSFERS_COLLECTION, transferId);
    await updateDoc(transferDoc, updates);
  } catch (error) {
    console.error("Error updating transfer:", error);
    throw error;
  }
}

/**
 * Delete a transfer
 */
export async function deleteTransfer(transferId: string): Promise<void> {
  if (useMockData) {
    console.log("Mock mode: Would delete transfer", transferId);
    return;
  }

  try {
    const transferDoc = doc(db, TRANSFERS_COLLECTION, transferId);
    await deleteDoc(transferDoc);
  } catch (error) {
    console.error("Error deleting transfer:", error);
    throw error;
  }
}

