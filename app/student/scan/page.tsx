"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from "@/components/shared/QRScanner";
import { QRCodeDisplay } from "@/components/shared/QRCodeDisplay";
import type { QRData } from "@/lib/qr";
import {
  Camera,
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Keyboard,
} from "lucide-react";

function ScanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = (searchParams.get("mode") as "checkout" | "return") || "checkout";
  const prefilledContainer = searchParams.get("container") || "";

  const [currentMode, setCurrentMode] = useState<"checkout" | "return">(mode);
  const [scanStep, setScanStep] = useState<"student" | "container" | "confirm" | "success" | "error">(
    currentMode === "checkout" ? "container" : "container"
  );
  const [scannedData, setScannedData] = useState<{
    student?: QRData;
    container?: QRData;
  }>({});
  const [manualEntry, setManualEntry] = useState(prefilledContainer);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mock container data
  const getContainerInfo = (containerId: string) => ({
    id: containerId,
    status: "AVAILABLE",
    location: "Marketplace",
    checkoutCount: 42,
    condition: "Good",
  });

  const handleScan = (data: QRData) => {
    if (data.type === "container") {
      setScannedData((prev) => ({ ...prev, container: data }));
      setScanStep("confirm");
    } else if (data.type === "user" && currentMode === "checkout") {
      setScannedData((prev) => ({ ...prev, student: data }));
      setScanStep("container");
    }
  };

  const handleManualSubmit = () => {
    if (manualEntry.startsWith("DRC-")) {
      handleScan({
        containerId: manualEntry,
        type: "container",
        version: "1.0",
      });
    } else {
      setErrorMessage("Invalid container ID. Must start with DRC-");
    }
  };

  const handleConfirm = () => {
    // Simulate API call
    setTimeout(() => {
      setScanStep("success");
    }, 500);
  };

  const handleReset = () => {
    setScannedData({});
    setScanStep(currentMode === "checkout" ? "container" : "container");
    setManualEntry("");
    setErrorMessage("");
  };

  const containerInfo = scannedData.container
    ? getContainerInfo(
        scannedData.container.type === "container"
          ? scannedData.container.containerId
          : ""
      )
    : null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/student/dashboard")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Mode Selector */}
      <Tabs
        value={currentMode}
        onValueChange={(v) => {
          setCurrentMode(v as "checkout" | "return");
          handleReset();
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checkout">
            <Package className="w-4 h-4 mr-2" />
            Check Out
          </TabsTrigger>
          <TabsTrigger value="return">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Return
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Scan Steps */}
      {scanStep === "container" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentMode === "checkout"
                ? "Scan Container QR Code"
                : "Scan Container to Return"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showManualEntry ? (
              <>
                <QRScanner
                  onScan={handleScan}
                  mode={currentMode}
                  expectedType="container"
                  onError={(err) => setErrorMessage(err)}
                />

                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowManualEntry(true)}
                  >
                    <Keyboard className="w-4 h-4 mr-2" />
                    Enter ID Manually
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Container ID
                  </label>
                  <Input
                    placeholder="DRC-MKT-0001"
                    value={manualEntry}
                    onChange={(e) => setManualEntry(e.target.value.toUpperCase())}
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleManualSubmit} className="flex-1">
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowManualEntry(false)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {scanStep === "confirm" && containerInfo && (
        <Card className="animate-slideIn">
          <CardHeader>
            <CardTitle className="text-lg">Confirm {currentMode === "checkout" ? "Checkout" : "Return"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#012169]/10 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-[#012169]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{containerInfo.id}</h3>
                <p className="text-gray-600">{containerInfo.location}</p>
                <Badge variant="success">
                  {currentMode === "checkout" ? "Available" : "Ready to Return"}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Condition</span>
                <span>{containerInfo.condition}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Times Used</span>
                <span>{containerInfo.checkoutCount}</span>
              </div>
              {currentMode === "checkout" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-medium">
                    {new Date(Date.now() + 1000 * 60 * 60 * 72).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirm} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm {currentMode === "checkout" ? "Checkout" : "Return"}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {scanStep === "success" && (
        <Card className="animate-slideIn border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              {currentMode === "checkout" ? "Checkout Complete!" : "Return Complete!"}
            </h3>
            <p className="text-green-700 mb-2">
              {containerInfo?.id}
            </p>
            {currentMode === "checkout" && (
              <p className="text-green-600 text-sm mb-6">
                Due by{" "}
                {new Date(Date.now() + 1000 * 60 * 60 * 72).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </p>
            )}
            {currentMode === "return" && (
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">+1 Container Reused!</p>
                <p className="text-sm text-gray-600">
                  You&apos;ve saved 0.2 kg CO₂ and 0.5 gallons of water
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={handleReset}>
                Scan Another
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/student/dashboard")}
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {scanStep === "error" && (
        <Card className="animate-slideIn border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              {currentMode === "checkout" ? "Checkout Failed" : "Return Failed"}
            </h3>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            <Button onClick={handleReset}>Try Again</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
