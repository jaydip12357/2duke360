"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from "@/components/shared/QRScanner";
import { RFIDSimulator } from "@/components/shared/RFIDSimulator";
import type { QRData } from "@/lib/qr";
import {
  QrCode,
  Radio,
  User,
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertTriangle,
  Search,
} from "lucide-react";

// Mock student data
const getStudentInfo = (qrCode: string) => ({
  id: qrCode,
  name: "Demo Student",
  netId: "ds123",
  email: "demo.student@duke.edu",
  containersOut: 2,
  maxContainers: 5,
  status: "good" as const,
  lateFees: 0,
});

// Mock container data
const getContainerInfo = (containerId: string) => ({
  id: containerId,
  status: "AVAILABLE" as const,
  location: "Marketplace",
  checkoutCount: 42,
  condition: "Good",
});

function ScanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode = searchParams.get("mode") || "qr";
  const [scanMode, setScanMode] = useState<"qr" | "rfid">(
    initialMode === "rfid" ? "rfid" : "qr"
  );
  const [scanStep, setScanStep] = useState<
    "student" | "container" | "confirm" | "success" | "error"
  >("student");
  const [scannedStudent, setScannedStudent] = useState<ReturnType<
    typeof getStudentInfo
  > | null>(null);
  const [scannedContainer, setScannedContainer] = useState<ReturnType<
    typeof getContainerInfo
  > | null>(null);
  const [manualEntry, setManualEntry] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !showManualEntry) {
        e.preventDefault();
        // Focus scanner
      }
      if (e.code === "KeyR") {
        setScanStep("student");
        setScannedStudent(null);
        setScannedContainer(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showManualEntry]);

  const handleStudentScan = (data: QRData) => {
    if (data.type === "user") {
      const student = getStudentInfo(data.netId || data.qrCode || "");
      setScannedStudent(student);
      setScanStep("container");
    }
  };

  const handleContainerScan = (data: QRData) => {
    if (data.type === "container") {
      const container = getContainerInfo(data.containerId);
      setScannedContainer(container);
      setScanStep("confirm");
    }
  };

  const handleRFIDScan = (containerId: string) => {
    const container = getContainerInfo(containerId);
    setScannedContainer(container);
    setScanStep("confirm");
  };

  const handleConfirmCheckout = () => {
    // Simulate API call
    setTimeout(() => {
      setScanStep("success");
    }, 500);
  };

  const handleReset = () => {
    setScanStep("student");
    setScannedStudent(null);
    setScannedContainer(null);
    setManualEntry("");
    setErrorMessage("");
    setShowManualEntry(false);
  };

  const handleManualSubmit = () => {
    if (scanStep === "student") {
      if (manualEntry.length > 0) {
        const student = getStudentInfo(manualEntry);
        setScannedStudent(student);
        setScanStep("container");
        setManualEntry("");
        setShowManualEntry(false);
      }
    } else if (scanStep === "container") {
      if (manualEntry.startsWith("DRC-")) {
        const container = getContainerInfo(manualEntry);
        setScannedContainer(container);
        setScanStep("confirm");
        setManualEntry("");
        setShowManualEntry(false);
      } else {
        setErrorMessage("Invalid container ID. Must start with DRC-");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header currentRole="DINING_STAFF" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dining-staff/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Mode Selector */}
        <Tabs
          value={scanMode}
          onValueChange={(v) => {
            setScanMode(v as "qr" | "rfid");
            handleReset();
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr">
              <QrCode className="w-4 h-4 mr-2" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="rfid">
              <Radio className="w-4 h-4 mr-2" />
              RFID Scanner
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              scanStep === "student" || scannedStudent
                ? "bg-[#012169] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">1. Student</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              scanStep === "container" || scannedContainer
                ? "bg-[#012169] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">2. Container</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              scanStep === "confirm" || scanStep === "success"
                ? "bg-[#012169] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">3. Confirm</span>
          </div>
        </div>

        {/* Scanned Student Info */}
        {scannedStudent && scanStep !== "student" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{scannedStudent.name}</p>
                  <p className="text-sm text-gray-600">
                    {scannedStudent.netId} • {scannedStudent.containersOut}/
                    {scannedStudent.maxContainers} containers
                  </p>
                </div>
              </div>
              <Badge variant="success">Verified</Badge>
            </CardContent>
          </Card>
        )}

        {/* Main Scan Area */}
        {scanMode === "qr" ? (
          <>
            {scanStep === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Scan Student QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showManualEntry ? (
                    <>
                      <QRScanner
                        onScan={handleStudentScan}
                        mode="checkout"
                        expectedType="user"
                        onError={(err) => setErrorMessage(err)}
                      />
                      <div className="mt-4 text-center">
                        <Button
                          variant="link"
                          onClick={() => setShowManualEntry(true)}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Enter NetID Manually
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter NetID (e.g., abc123)"
                        value={manualEntry}
                        onChange={(e) => setManualEntry(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleManualSubmit()
                        }
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleManualSubmit} className="flex-1">
                          Lookup Student
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowManualEntry(false)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Use Scanner
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {scanStep === "container" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Scan Container QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showManualEntry ? (
                    <>
                      <QRScanner
                        onScan={handleContainerScan}
                        mode="checkout"
                        expectedType="container"
                        onError={(err) => setErrorMessage(err)}
                      />
                      <div className="mt-4 text-center">
                        <Button
                          variant="link"
                          onClick={() => setShowManualEntry(true)}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Enter Container ID Manually
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Container ID (e.g., DRC-MKT-0001)"
                        value={manualEntry}
                        onChange={(e) =>
                          setManualEntry(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleManualSubmit()
                        }
                      />
                      {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={handleManualSubmit} className="flex-1">
                          Lookup Container
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowManualEntry(false);
                            setErrorMessage("");
                          }}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Use Scanner
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* RFID Mode */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                RFID Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RFIDSimulator
                onScan={handleRFIDScan}
                onError={(err) => setErrorMessage(err)}
              />
            </CardContent>
          </Card>
        )}

        {/* Confirmation Step */}
        {scanStep === "confirm" && scannedContainer && (
          <Card className="animate-slideIn">
            <CardHeader>
              <CardTitle>Confirm Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-[#012169]/10 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#012169]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {scannedContainer.id}
                  </h3>
                  <p className="text-gray-600">{scannedContainer.location}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="success">Available</Badge>
                    <Badge variant="outline">
                      Used {scannedContainer.checkoutCount}x
                    </Badge>
                  </div>
                </div>
              </div>

              {scannedStudent && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{scannedStudent.name}</strong> will have{" "}
                    <strong>{scannedStudent.containersOut + 1}</strong> of{" "}
                    {scannedStudent.maxContainers} containers checked out.
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Due:{" "}
                    {new Date(
                      Date.now() + 1000 * 60 * 60 * 72
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmCheckout}
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Complete Checkout
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {scanStep === "success" && (
          <Card className="animate-slideIn border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">
                Checkout Complete!
              </h3>
              <p className="text-green-700 mb-1">
                {scannedContainer?.id} → {scannedStudent?.name}
              </p>
              <p className="text-green-600 text-sm mb-6">
                Due:{" "}
                {new Date(Date.now() + 1000 * 60 * 60 * 72).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }
                )}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReset} size="lg">
                  Scan Another
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dining-staff/dashboard")}
                  size="lg"
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Step */}
        {scanStep === "error" && (
          <Card className="animate-slideIn border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Checkout Failed
              </h3>
              <p className="text-red-600 mb-6">{errorMessage}</p>
              <Button onClick={handleReset}>Try Again</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function DiningStaffScanPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
