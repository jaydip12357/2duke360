"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeDisplay } from "@/components/shared/QRCodeDisplay";
import {
  ArrowLeft,
  Download,
  Printer,
  Plus,
  RefreshCw,
  Package,
  QrCode,
  Eye,
} from "lucide-react";

const locations = [
  { code: "MKT", name: "Marketplace" },
  { code: "WU", name: "West Union" },
  { code: "FARM", name: "Farmstead" },
  { code: "LOOP", name: "The Loop" },
];

interface DemoContainer {
  id: string;
  containerId: string;
  location: string;
}

export default function DemoQRCodesPage() {
  const router = useRouter();
  const [containers, setContainers] = useState<DemoContainer[]>([]);
  const [prefix, setPrefix] = useState("MKT");
  const [quantity, setQuantity] = useState("20");
  const [startNumber, setStartNumber] = useState("1");
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  // Generate initial demo containers
  useEffect(() => {
    generateContainers();
  }, []);

  const generateContainers = () => {
    const newContainers: DemoContainer[] = [];
    const start = parseInt(startNumber) || 1;
    const count = parseInt(quantity) || 20;

    for (let i = 0; i < count; i++) {
      const num = start + i;
      const containerId = `DRC-${prefix}-${String(num).padStart(4, "0")}`;
      newContainers.push({
        id: `container-${num}`,
        containerId,
        location: locations.find((l) => l.code === prefix)?.name || prefix,
      });
    }

    setContainers(newContainers);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAll = () => {
    // In a real app, this would generate a ZIP file with all QR codes
    alert("Downloading all QR codes as ZIP file...");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header - hidden when printing */}
      <div className="no-print bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-[#012169]">
                  Demo QR Codes
                </h1>
                <p className="text-sm text-gray-500">
                  Generate and print container QR codes for hackathon demo
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadAll}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Generator Controls - hidden when printing */}
        <Card className="no-print">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Generate QR Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location Prefix
                </label>
                <Select value={prefix} onValueChange={setPrefix}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.code} value={loc.code}>
                        {loc.name} ({loc.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Number
                </label>
                <Input
                  type="number"
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={generateContainers} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Preview: DRC-{prefix}-{String(parseInt(startNumber) || 1).padStart(4, "0")} to DRC-{prefix}-
                {String((parseInt(startNumber) || 1) + (parseInt(quantity) || 1) - 1).padStart(4, "0")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Container Preview - hidden when printing */}
        {selectedContainer && (
          <Card className="no-print border-[#012169]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview: {selectedContainer}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <QRCodeDisplay
                data={selectedContainer}
                type="container"
                size={300}
                showDownload
                label={selectedContainer}
              />
            </CardContent>
          </Card>
        )}

        {/* QR Code Grid */}
        <Card>
          <CardHeader className="no-print">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Generated QR Codes ({containers.length})
              </span>
              <Badge variant="outline">
                Click any code to preview
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Print-friendly grid layout */}
            <div className="qr-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
              {containers.map((container) => (
                <div
                  key={container.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedContainer === container.containerId
                      ? "ring-2 ring-[#012169] ring-offset-2"
                      : ""
                  }`}
                  onClick={() => setSelectedContainer(container.containerId)}
                >
                  <div className="bg-white border rounded-lg p-3 text-center">
                    <QRCodeDisplay
                      data={container.containerId}
                      type="container"
                      size={120}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-xs font-mono font-medium text-[#012169]">
                      {container.containerId}
                    </p>
                    <p className="text-xs text-gray-500 no-print">
                      {container.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Print Instructions - hidden when printing */}
        <Card className="no-print border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-800 mb-2">
              Printing Instructions
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Print on Avery 5160 labels (30 per sheet) for best results
              </li>
              <li>
                • Use &quot;Fit to page&quot; option in print settings
              </li>
              <li>
                • Select &quot;Landscape&quot; orientation for more codes per page
              </li>
              <li>
                • Cut along grid lines if using regular paper
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Test Scanner Link - hidden when printing */}
        <div className="no-print text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/student/scan")}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Open Scanner to Test
          </Button>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
