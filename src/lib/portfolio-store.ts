import { useSyncExternalStore } from "react";

export type Profile = {
  name: string;
  tagline: string;
  email: string;
  strengths: string[];
  photoDataUrl?: string;
};

export type ExperienceKind = "경력" | "학력" | "대외활동";
export type Experience = {
  id: string;
  kind: ExperienceKind;
  org: string;
  role: string;
  period: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  details: string;
  tech: string[];
  coverDataUrl?: string;
};

export type StudyKind = "책" | "논문" | "강의" | "기타";
export type StudyLog = {
  id: string;
  kind: StudyKind;
  title: string;
  source: string;
  summary: string;
  review: string;
  date: string;
};

export type PortfolioData = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  studies: StudyLog[];
};

const KEY = "portfolio:v1";

const empty: PortfolioData = {
  profile: { name: "", tagline: "", email: "", strengths: [] },
  experiences: [],
  projects: [],
  studies: [],
};

function read(): PortfolioData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, profile: { ...empty.profile, ...parsed.profile } };
  } catch {
    return empty;
  }
}

const listeners = new Set<() => void>();
let cache: PortfolioData | null = null;

function getSnapshot(): PortfolioData {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): PortfolioData {
  return empty;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: PortfolioData) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.error("localStorage write failed", e);
  }
  listeners.forEach((l) => l());
}

export function usePortfolio(): PortfolioData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateProfile(p: Profile) {
  write({ ...getSnapshot(), profile: p });
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function addExperience(e: Experience) {
  const s = getSnapshot();
  write({ ...s, experiences: [...s.experiences, e] });
}
export function updateExperience(e: Experience) {
  const s = getSnapshot();
  write({ ...s, experiences: s.experiences.map((x) => (x.id === e.id ? e : x)) });
}
export function deleteExperience(id: string) {
  const s = getSnapshot();
  write({ ...s, experiences: s.experiences.filter((x) => x.id !== id) });
}

export function addProject(p: Project) {
  const s = getSnapshot();
  write({ ...s, projects: [...s.projects, p] });
}
export function updateProject(p: Project) {
  const s = getSnapshot();
  write({ ...s, projects: s.projects.map((x) => (x.id === p.id ? p : x)) });
}
export function deleteProject(id: string) {
  const s = getSnapshot();
  write({ ...s, projects: s.projects.filter((x) => x.id !== id) });
}

export function addStudy(x: StudyLog) {
  const s = getSnapshot();
  write({ ...s, studies: [...s.studies, x] });
}
export function updateStudy(x: StudyLog) {
  const s = getSnapshot();
  write({ ...s, studies: s.studies.map((y) => (y.id === x.id ? x : y)) });
}
export function deleteStudy(id: string) {
  const s = getSnapshot();
  write({ ...s, studies: s.studies.filter((y) => y.id !== id) });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
