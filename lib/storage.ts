import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import type { ApplicationSubmissionValues } from "@/lib/validation";

const jsonStorePath = path.join(process.cwd(), "data", "applications.json");
let prismaAvailable = true;

const normalizeOptional = (value?: string) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

type PersistedApplicationBase = {
  inGameName: string;
  playerId: string;
  region: string;
  age: number;
  currentRank: string;
  kd: number;
  roles: string[];
  availability: string;
  previousExperience: string;
  contactMethod: string;
  whatsappNumber: string | null;
  telegramUsername: string | null;
  discord: string | null;
  notes: string | null;
  status: "PENDING";
  createdAt: Date;
};

export type PersistedApplication = PersistedApplicationBase & {
  id: number;
};

type JsonPersistedApplication = Omit<PersistedApplication, "createdAt"> & {
  createdAt: string;
};

const preparePayload = (data: ApplicationSubmissionValues): PersistedApplicationBase => ({
  inGameName: data.inGameName.trim(),
  playerId: data.playerId.trim(),
  region: data.region,
  age: data.age,
  currentRank: data.currentRank,
  kd: data.kd,
  roles: data.roles,
  availability: data.availability.trim(),
  previousExperience: data.previousExperience.trim(),
  contactMethod: data.contactMethod,
  whatsappNumber: normalizeOptional(data.whatsappNumber),
  telegramUsername: normalizeOptional(data.telegramUsername),
  discord: normalizeOptional(data.discord),
  notes: normalizeOptional(data.notes),
  status: "PENDING",
  createdAt: new Date(),
});

const readJsonStore = async (): Promise<JsonPersistedApplication[]> => {
  try {
    const raw = await readFile(jsonStorePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJsonStore = async (entries: JsonPersistedApplication[]) => {
  await mkdir(path.dirname(jsonStorePath), { recursive: true });
  await writeFile(jsonStorePath, JSON.stringify(entries, null, 2), "utf-8");
};

const saveWithJsonFallback = async (payload: PersistedApplicationBase): Promise<PersistedApplication> => {
  const existing = await readJsonStore();
  const nextId = existing.length > 0 ? Math.max(...existing.map((entry) => entry.id)) + 1 : 1;

  const created: JsonPersistedApplication = {
    ...payload,
    id: nextId,
    createdAt: payload.createdAt.toISOString(),
  };

  existing.push(created);
  await writeJsonStore(existing);

  return {
    ...created,
    createdAt: new Date(created.createdAt),
  };
};

const saveWithPrisma = async (payload: PersistedApplicationBase): Promise<PersistedApplication> => {
  const created = await prisma.application.create({
    data: {
      ...payload,
      roles: payload.roles.join(", "),
    },
  });

  return {
    id: created.id,
    inGameName: created.inGameName,
    playerId: created.playerId,
    region: created.region,
    age: created.age,
    currentRank: created.currentRank,
    kd: created.kd,
    roles: created.roles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean),
    availability: created.availability,
    previousExperience: created.previousExperience,
    contactMethod: created.contactMethod,
    whatsappNumber: created.whatsappNumber,
    telegramUsername: created.telegramUsername,
    discord: created.discord,
    notes: created.notes,
    status: "PENDING",
    createdAt: created.createdAt,
  };
};

export const saveApplication = async (data: ApplicationSubmissionValues): Promise<PersistedApplication> => {
  const payload = preparePayload(data);
  const storageMode = process.env.STORAGE_MODE?.toLowerCase();
  const forceJson = storageMode === "json";
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  if (forceJson) {
    return saveWithJsonFallback(payload);
  }

  if (!hasDatabaseUrl) {
    return saveWithJsonFallback(payload);
  }

  if (prismaAvailable) {
    try {
      return await saveWithPrisma(payload);
    } catch (error) {
      prismaAvailable = false;
      console.error("Prisma storage failed, falling back to JSON storage.", error);
    }
  }

  return saveWithJsonFallback(payload);
};
