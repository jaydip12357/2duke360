// RFID Simulation Library
// This simulates RFID tag reading for demo purposes

export interface RFIDTag {
  id: string;
  containerId: string;
  signalStrength: number; // 0-100
  batteryLevel: number; // 0-100
  lastRead: Date;
}

export interface RFIDReadResult {
  success: boolean;
  tag?: RFIDTag;
  error?: string;
  readTime: number; // milliseconds
}

// Simulated RFID reader state
let isReaderActive = false;
const simulatedDelay = 200; // milliseconds

export function activateReader(): void {
  isReaderActive = true;
}

export function deactivateReader(): void {
  isReaderActive = false;
}

export function isReaderOn(): boolean {
  return isReaderActive;
}

export async function simulateTagRead(
  containerId?: string
): Promise<RFIDReadResult> {
  if (!isReaderActive) {
    return {
      success: false,
      error: "RFID reader is not active",
      readTime: 0,
    };
  }

  // Simulate read delay
  await new Promise((resolve) => setTimeout(resolve, simulatedDelay));

  // 95% success rate simulation
  if (Math.random() < 0.95 || containerId) {
    const tag: RFIDTag = {
      id: `RFID-${containerId || generateRandomRFIDId()}`,
      containerId: containerId || `DRC-MKT-${String(Math.floor(Math.random() * 100) + 1).padStart(4, "0")}`,
      signalStrength: Math.floor(Math.random() * 30) + 70, // 70-100
      batteryLevel: Math.floor(Math.random() * 40) + 60, // 60-100
      lastRead: new Date(),
    };

    return {
      success: true,
      tag,
      readTime: simulatedDelay,
    };
  }

  return {
    success: false,
    error: "Tag read failed - please try again",
    readTime: simulatedDelay,
  };
}

export async function simulateBatchRead(
  count: number = 5
): Promise<RFIDReadResult[]> {
  const results: RFIDReadResult[] = [];

  for (let i = 0; i < count; i++) {
    // Stagger reads slightly
    await new Promise((resolve) => setTimeout(resolve, 50));
    const result = await simulateTagRead();
    results.push(result);
  }

  return results;
}

function generateRandomRFIDId(): string {
  const chars = "ABCDEF0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateRFIDTag(containerId: string): string {
  const prefix = containerId.replace("DRC-", "RFID-").replace(/-/g, "");
  return prefix + "-" + generateRandomRFIDId();
}

export function validateRFIDTag(tagId: string): boolean {
  return /^RFID-[A-Z0-9]{8,}$/.test(tagId) || /^RFID[A-Z]{3}\d{4}-[A-F0-9]{8}$/.test(tagId);
}

// Virtual RFID cards for demo
export interface VirtualCard {
  id: string;
  containerId: string;
  position: { x: number; y: number };
  isSelected: boolean;
}

export function createVirtualCards(
  containerIds: string[]
): VirtualCard[] {
  return containerIds.map((containerId, index) => ({
    id: `card-${index}`,
    containerId,
    position: {
      x: (index % 5) * 120 + 50,
      y: Math.floor(index / 5) * 100 + 50,
    },
    isSelected: false,
  }));
}
