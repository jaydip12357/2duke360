import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getTimeRemaining(dueDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  isOverdue: boolean;
  text: string;
} {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  let text = "";
  if (isOverdue) {
    if (days > 0) text = `${days}d ${hours}h overdue`;
    else if (hours > 0) text = `${hours}h ${minutes}m overdue`;
    else text = `${minutes}m overdue`;
  } else {
    if (days > 0) text = `${days}d ${hours}h remaining`;
    else if (hours > 0) text = `${hours}h ${minutes}m remaining`;
    else text = `${minutes}m remaining`;
  }

  return { days, hours, minutes, isOverdue, text };
}

export function generateContainerId(locationCode: string, sequence: number): string {
  return `DRC-${locationCode}-${String(sequence).padStart(4, "0")}`;
}

export function parseContainerId(containerId: string): {
  prefix: string;
  locationCode: string;
  sequence: number;
} | null {
  const match = containerId.match(/^(DRC)-([A-Z]+)-(\d+)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    locationCode: match[2],
    sequence: parseInt(match[3], 10),
  };
}

export function calculateImpact(containersReused: number): {
  wasteAverted: number;
  carbonSaved: number;
  waterSaved: number;
} {
  // Average single-use container: 0.1 lbs, 0.2 kg CO2, 0.5 gallons water
  return {
    wasteAverted: Math.round(containersReused * 0.1 * 10) / 10,
    carbonSaved: Math.round(containersReused * 0.2 * 10) / 10,
    waterSaved: Math.round(containersReused * 0.5 * 10) / 10,
  };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: "bg-duke-success",
    CHECKED_OUT: "bg-duke-royal",
    IN_CLEANING: "bg-duke-warning",
    LATE: "bg-duke-error",
    DAMAGED: "bg-gray-500",
    RETIRED: "bg-gray-400",
  };
  return colors[status] || "bg-gray-500";
}

export function getStatusText(status: string): string {
  const text: Record<string, string> = {
    AVAILABLE: "Available",
    CHECKED_OUT: "Checked Out",
    IN_CLEANING: "In Cleaning",
    LATE: "Late",
    DAMAGED: "Damaged",
    RETIRED: "Retired",
  };
  return text[status] || status;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
