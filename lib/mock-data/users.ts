import { User } from "@/lib/types";

export const MOCK_USERS: User[] = [
  {
    id: "admin1",
    email: "admin@futball.com",
    displayName: "Admin User",
    role: "admin",
    createdAt: new Date("2023-01-01"),
    photoURL: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
  },
  {
    id: "scout1",
    email: "scout@futball.com",
    displayName: "John Scout",
    role: "scout",
    createdAt: new Date("2023-01-15"),
    photoURL: "https://ui-avatars.com/api/?name=John+Scout&background=059669&color=fff",
  },
  {
    id: "scout2",
    email: "scout2@futball.com",
    displayName: "Sarah Martinez",
    role: "scout",
    createdAt: new Date("2023-02-01"),
    photoURL: "https://ui-avatars.com/api/?name=Sarah+Martinez&background=059669&color=fff",
  },
  {
    id: "coach1",
    email: "coach@futball.com",
    displayName: "Mike Coach",
    role: "coach",
    createdAt: new Date("2023-01-20"),
    photoURL: "https://ui-avatars.com/api/?name=Mike+Coach&background=7C3AED&color=fff",
  },
];

// SECURITY: Default mock user for MVP demo
export const DEFAULT_MOCK_USER = MOCK_USERS[0]; // Admin user

