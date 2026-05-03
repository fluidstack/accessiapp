import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const FAVOURITES_KEY = "accessilife.favourites.v1";
const RSVP_KEY = "accessilife.rsvps.v1";
const ENQUIRY_KEY = "accessilife.enquiries.v1";
const CONSENT_KEY = "accessilife.consent.v1";
const PROFILE_KEY = "accessilife.profile.v1";

export type ConsentRecord = {
  uuid: string;
  acceptedAt: string;
  termsVersion: string;
};

export async function getOrCreateConsentUuid(): Promise<string> {
  const existing = await AsyncStorage.getItem(CONSENT_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as ConsentRecord;
      if (parsed?.uuid) return parsed.uuid;
    } catch {}
  }
  return Crypto.randomUUID();
}

export async function recordConsent(uuid: string): Promise<ConsentRecord> {
  const record: ConsentRecord = {
    uuid,
    acceptedAt: new Date().toISOString(),
    termsVersion: "v1.0",
  };
  await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  return record;
}

export async function getConsent(): Promise<ConsentRecord | null> {
  const raw = await AsyncStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

async function getSet(key: string): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return new Set();
  try {
    return new Set<string>(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

async function saveSet(key: string, set: Set<string>) {
  await AsyncStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export const favourites = {
  list: async () => Array.from(await getSet(FAVOURITES_KEY)),
  has: async (id: string) => (await getSet(FAVOURITES_KEY)).has(id),
  toggle: async (id: string) => {
    const s = await getSet(FAVOURITES_KEY);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    await saveSet(FAVOURITES_KEY, s);
    return s.has(id);
  },
};

export const rsvps = {
  list: async () => Array.from(await getSet(RSVP_KEY)),
  has: async (id: string) => (await getSet(RSVP_KEY)).has(id),
  toggle: async (id: string) => {
    const s = await getSet(RSVP_KEY);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    await saveSet(RSVP_KEY, s);
    return s.has(id);
  },
};

type EnquiryLog = { id: string; providerId: string; sentAt: string };

export const enquiries = {
  list: async (): Promise<EnquiryLog[]> => {
    const raw = await AsyncStorage.getItem(ENQUIRY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as EnquiryLog[];
    } catch {
      return [];
    }
  },
  recordCount: async (windowMs = 60 * 60 * 1000): Promise<number> => {
    const list = await enquiries.list();
    const cutoff = Date.now() - windowMs;
    return list.filter((e) => new Date(e.sentAt).getTime() > cutoff).length;
  },
  add: async (providerId: string) => {
    const list = await enquiries.list();
    list.push({
      id: Crypto.randomUUID(),
      providerId,
      sentAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(ENQUIRY_KEY, JSON.stringify(list.slice(-50)));
  },
};

export type LocalProfile = {
  displayName?: string;
  suburb?: string;
  state?: string;
  bio?: string;
  supports?: string[];
};

export const profile = {
  get: async (): Promise<LocalProfile> => {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as LocalProfile;
    } catch {
      return {};
    }
  },
  set: async (p: LocalProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  },
};
