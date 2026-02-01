import QRCode from "qrcode";

export interface ContainerQRData {
  containerId: string;
  type: "container";
  version: "1.0";
}

export interface UserQRData {
  userId: string;
  type: "user";
  version: "1.0";
}

export type QRData = ContainerQRData | UserQRData;

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

export async function generateQRCodeSVG(data: string): Promise<string> {
  try {
    const svg = await QRCode.toString(data, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return svg;
  } catch (error) {
    console.error("Error generating QR code SVG:", error);
    throw error;
  }
}

export function encodeContainerQR(containerId: string): string {
  const data: ContainerQRData = {
    containerId,
    type: "container",
    version: "1.0",
  };
  return JSON.stringify(data);
}

export function encodeUserQR(userId: string): string {
  const data: UserQRData = {
    userId,
    type: "user",
    version: "1.0",
  };
  return JSON.stringify(data);
}

export function decodeQR(data: string): QRData | null {
  try {
    const parsed = JSON.parse(data);
    if (parsed.type === "container" || parsed.type === "user") {
      return parsed as QRData;
    }
    return null;
  } catch {
    // Try to parse as simple container ID (backward compatibility)
    if (data.startsWith("DRC-")) {
      return {
        containerId: data,
        type: "container",
        version: "1.0",
      };
    }
    return null;
  }
}

export async function generateContainerQRBatch(
  containerIds: string[]
): Promise<Array<{ containerId: string; qrCode: string }>> {
  const results = await Promise.all(
    containerIds.map(async (containerId) => {
      const qrData = encodeContainerQR(containerId);
      const qrCode = await generateQRCode(qrData);
      return { containerId, qrCode };
    })
  );
  return results;
}

export function generateContainerIdRange(
  locationCode: string,
  startNum: number,
  count: number
): string[] {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    ids.push(`DRC-${locationCode}-${String(num).padStart(4, "0")}`);
  }
  return ids;
}
