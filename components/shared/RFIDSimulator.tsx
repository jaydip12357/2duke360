"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Package, CheckCircle2, Wifi } from "lucide-react";

interface RFIDSimulatorProps {
  onScan: (containerId: string) => void;
  onError?: (error: string) => void;
  batchMode?: boolean;
}

// Demo container RFID tags
const demoContainers = [
  { id: "DRC-MKT-0001", rfid: "RFID-001", battery: 95, signal: "strong" },
  { id: "DRC-MKT-0002", rfid: "RFID-002", battery: 88, signal: "strong" },
  { id: "DRC-WU-0015", rfid: "RFID-015", battery: 72, signal: "medium" },
  { id: "DRC-FARM-0008", rfid: "RFID-008", battery: 65, signal: "medium" },
  { id: "DRC-LOOP-0023", rfid: "RFID-023", battery: 45, signal: "weak" },
];

export function RFIDSimulator({
  onScan,
  onError,
  batchMode = false,
}: RFIDSimulatorProps) {
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  // Activate reader
  const handleActivate = () => {
    setIsActive(true);
  };

  // Simulate container tap
  const handleSimulateTap = (container: (typeof demoContainers)[0]) => {
    if (!isActive) return;

    setIsScanning(true);

    // Simulate RFID read delay (200ms as specified)
    setTimeout(() => {
      setIsScanning(false);
      setLastScanned(container.id);

      if (batchMode) {
        if (!scannedItems.includes(container.id)) {
          setScannedItems((prev) => [...prev, container.id]);
        }
      } else {
        onScan(container.id);
      }
    }, 200);
  };

  // Process batch
  const handleProcessBatch = () => {
    scannedItems.forEach((id) => onScan(id));
    setScannedItems([]);
    setLastScanned(null);
  };

  // Clear batch
  const handleClearBatch = () => {
    setScannedItems([]);
    setLastScanned(null);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "strong":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "weak":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 70) return "bg-green-500";
    if (battery > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* RFID Reader Visualization */}
      <div className="relative">
        <div
          className={`w-full h-48 rounded-xl border-4 transition-all duration-300 ${
            isActive
              ? "border-[#00539B] bg-[#00539B]/5"
              : "border-gray-300 bg-gray-100"
          } flex flex-col items-center justify-center`}
        >
          {/* Radio waves animation */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
              <div
                className={`absolute w-24 h-24 rounded-full border-4 border-[#00539B]/30 ${
                  isScanning ? "animate-ping" : "animate-pulse"
                }`}
              />
              <div
                className={`absolute w-40 h-40 rounded-full border-4 border-[#00539B]/20 ${
                  isScanning ? "animate-ping" : "animate-pulse"
                }`}
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className={`absolute w-56 h-56 rounded-full border-4 border-[#00539B]/10 ${
                  isScanning ? "animate-ping" : "animate-pulse"
                }`}
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          )}

          <div className="relative z-10 text-center">
            <Radio
              className={`w-12 h-12 mx-auto mb-2 ${
                isActive ? "text-[#00539B]" : "text-gray-400"
              } ${isScanning ? "animate-pulse" : ""}`}
            />
            <p
              className={`font-medium ${
                isActive ? "text-[#00539B]" : "text-gray-500"
              }`}
            >
              {isScanning
                ? "Reading..."
                : isActive
                ? "Ready to Scan"
                : "RFID Reader Inactive"}
            </p>
            {isActive && (
              <p className="text-sm text-gray-500 mt-1">
                Tap a container below to simulate scan
              </p>
            )}
          </div>

          {/* LED Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isScanning
                  ? "bg-yellow-500 animate-pulse"
                  : isActive
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isScanning ? "Reading" : isActive ? "Ready" : "Off"}
            </span>
          </div>
        </div>

        {!isActive && (
          <Button
            onClick={handleActivate}
            size="lg"
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <Radio className="w-4 h-4 mr-2" />
            Activate RFID Reader
          </Button>
        )}
      </div>

      {/* Demo Containers to Tap */}
      {isActive && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">
              Demo Containers (Click to Simulate Tap)
            </h3>
            {batchMode && scannedItems.length > 0 && (
              <Badge variant="default">{scannedItems.length} scanned</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {demoContainers.map((container) => {
              const isScannedInBatch = scannedItems.includes(container.id);
              const isLastScanned = lastScanned === container.id;

              return (
                <Card
                  key={container.id}
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    isScannedInBatch
                      ? "border-green-300 bg-green-50"
                      : isLastScanned
                      ? "border-[#00539B] bg-[#00539B]/5"
                      : "hover:border-[#00539B]/50"
                  }`}
                  onClick={() => handleSimulateTap(container)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isScannedInBatch
                            ? "bg-green-100"
                            : "bg-[#012169]/10"
                        }`}
                      >
                        {isScannedInBatch ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Package className="w-6 h-6 text-[#012169]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{container.id}</p>
                        <p className="text-sm text-gray-500">
                          RFID: {container.rfid}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 justify-end">
                          <Wifi
                            className={`w-4 h-4 ${getSignalColor(
                              container.signal
                            )}`}
                          />
                          <span className="text-xs text-gray-500 capitalize">
                            {container.signal}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getBatteryColor(
                                container.battery
                              )}`}
                              style={{ width: `${container.battery}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {container.battery}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Batch Mode Actions */}
          {batchMode && scannedItems.length > 0 && (
            <div className="flex gap-3 mt-4">
              <Button onClick={handleProcessBatch} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Process {scannedItems.length} Containers
              </Button>
              <Button variant="outline" onClick={handleClearBatch}>
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Last Scanned Result */}
      {lastScanned && !batchMode && (
        <Card className="border-green-200 bg-green-50 animate-slideIn">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Container Scanned Successfully
                </p>
                <p className="text-green-600">{lastScanned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
