"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, X, FlipHorizontal } from "lucide-react";
import { decodeQR, type QRData } from "@/lib/qr";

interface QRScannerProps {
  onScan: (data: QRData) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  mode?: "checkout" | "return";
  expectedType?: "container" | "user";
}

export function QRScanner({
  onScan,
  onError,
  onClose,
  mode = "checkout",
  expectedType,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current) return;

    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Successfully scanned
          const qrData = decodeQR(decodedText);

          if (!qrData) {
            setError("Invalid QR code format");
            return;
          }

          if (expectedType && qrData.type !== expectedType) {
            setError(
              `Expected ${expectedType} QR code, got ${qrData.type} QR code`
            );
            return;
          }

          // Haptic feedback simulation
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          onScan(qrData);
          stopScanning();
        },
        () => {
          // Ignore continuous scanning errors
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Scanner error:", err);
      setError("Failed to start camera. Please check permissions.");
      onError?.("Camera access denied");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleCamera = async () => {
    await stopScanning();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    // Small delay before restarting
    setTimeout(startScanning, 100);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#012169]">
          {mode === "checkout" ? "Scan to Check Out" : "Scan to Return"}
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Scanner Container */}
      <div className="relative">
        <div
          id="qr-reader"
          ref={containerRef}
          className="w-full aspect-square bg-gray-900 rounded-lg overflow-hidden"
        />

        {/* Scan Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner markers */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 border-l-4 border-t-4 border-[#00539B]" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 border-r-4 border-t-4 border-[#00539B]" />
            <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border-l-4 border-b-4 border-[#00539B]" />
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-r-4 border-b-4 border-[#00539B]" />

            {/* Scan line animation */}
            <div className="absolute left-1/4 right-1/4 top-1/4 bottom-1/4">
              <div className="scan-line absolute left-0 right-0 h-0.5 bg-[#00539B] opacity-75" />
            </div>
          </div>
        )}

        {/* Not scanning overlay */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 rounded-lg">
            <Camera className="w-16 h-16 text-white/50 mb-4" />
            <p className="text-white/70 text-center mb-4">
              Camera is not active
            </p>
            <Button onClick={startScanning}>Start Scanning</Button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-4">
        {isScanning ? (
          <>
            <Button variant="outline" onClick={toggleCamera}>
              <FlipHorizontal className="w-4 h-4 mr-2" />
              Flip Camera
            </Button>
            <Button variant="destructive" onClick={stopScanning}>
              Stop
            </Button>
          </>
        ) : (
          <Button onClick={startScanning} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {mode === "checkout" ? (
          <p>
            Position the{" "}
            {expectedType === "container" ? "container" : "student"} QR code
            within the frame
          </p>
        ) : (
          <p>Scan the container QR code to return it</p>
        )}
      </div>
    </div>
  );
}
