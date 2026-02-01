"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  QrCode,
  Radio,
  AlertTriangle,
  Plus,
  Download,
  Printer,
  Settings,
  TrendingUp,
  Wrench,
  MapPin,
  RefreshCw,
} from "lucide-react";

// Mock data
const systemStats = {
  totalContainers: 500,
  available: 312,
  checkedOut: 156,
  inCleaning: 24,
  damaged: 5,
  retired: 3,
  needingReplacement: 12,
};

const locations = [
  { id: "mkt", name: "Marketplace", code: "MKT", containers: 180, capacity: 200 },
  { id: "wu", name: "West Union", code: "WU", containers: 150, capacity: 175 },
  { id: "farm", name: "Farmstead", code: "FARM", containers: 100, capacity: 100 },
  { id: "loop", name: "The Loop", code: "LOOP", containers: 70, capacity: 80 },
];

const maintenanceAlerts = [
  { id: "1", container: "DRC-MKT-0042", issue: "Damaged lid", priority: "high" },
  { id: "2", container: "DRC-WU-0089", issue: "RFID malfunction", priority: "medium" },
  { id: "3", container: "DRC-FARM-0023", issue: "Wear and tear", priority: "low" },
];

export default function FacilitiesDashboard() {
  const router = useRouter();
  const [newContainerPrefix, setNewContainerPrefix] = useState("MKT");
  const [newContainerQuantity, setNewContainerQuantity] = useState("10");

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header currentRole="FACILITIES" />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#012169]">
              Facilities Management
            </h1>
            <p className="text-gray-600">
              Container lifecycle and system administration
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={() => router.push("/admin")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-[#012169]" />
              <p className="text-2xl font-bold">{systemStats.totalContainers}</p>
              <p className="text-sm text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {systemStats.available}
              </p>
              <p className="text-sm text-gray-500">Available</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {systemStats.checkedOut}
              </p>
              <p className="text-sm text-gray-500">Checked Out</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {systemStats.inCleaning}
              </p>
              <p className="text-sm text-gray-500">In Cleaning</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {systemStats.damaged}
              </p>
              <p className="text-sm text-gray-500">Damaged</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {systemStats.needingReplacement}
              </p>
              <p className="text-sm text-gray-500">Needs Replace</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Container Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Register New Containers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location Prefix
                  </label>
                  <Select
                    value={newContainerPrefix}
                    onValueChange={setNewContainerPrefix}
                  >
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
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={newContainerQuantity}
                    onChange={(e) => setNewContainerQuantity(e.target.value)}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  This will generate:
                </p>
                <p className="font-medium">
                  DRC-{newContainerPrefix}-0001 to DRC-{newContainerPrefix}-
                  {String(parseInt(newContainerQuantity) || 0).padStart(4, "0")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Containers
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR/RFID Code Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Generate QR/RFID Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push("/demo/qr-codes")}
                >
                  <QrCode className="w-8 h-8 mb-2" />
                  <span>Generate QR Codes</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push("/facilities/rfid-tags")}
                >
                  <Radio className="w-8 h-8 mb-2" />
                  <span>Generate RFID Tags</span>
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print QR Sheet (Avery 5160)
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Codes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Inventory */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Inventory
            </CardTitle>
            <Button variant="outline" size="sm">
              View Map
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {locations.map((location) => {
                const utilization = (location.containers / location.capacity) * 100;
                const isNearCapacity = utilization > 90;
                const isLow = utilization < 30;

                return (
                  <Card
                    key={location.id}
                    className={`${
                      isNearCapacity
                        ? "border-red-200"
                        : isLow
                        ? "border-yellow-200"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{location.name}</h4>
                        <Badge variant="outline">{location.code}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Containers</span>
                          <span className="font-medium">
                            {location.containers}/{location.capacity}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isNearCapacity
                                ? "bg-red-500"
                                : isLow
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <p
                          className={`text-xs ${
                            isNearCapacity
                              ? "text-red-600"
                              : isLow
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }`}
                        >
                          {isNearCapacity
                            ? "Near capacity"
                            : isLow
                            ? "Low inventory"
                            : `${utilization.toFixed(0)}% utilized`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Maintenance Alerts
            </CardTitle>
            <Badge variant="warning">{maintenanceAlerts.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.priority === "high"
                          ? "bg-red-500"
                          : alert.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{alert.container}</p>
                      <p className="text-sm text-gray-500">{alert.issue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        alert.priority === "high"
                          ? "late"
                          : alert.priority === "medium"
                          ? "warning"
                          : "outline"
                      }
                    >
                      {alert.priority}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/facilities/bulk-register")}
              >
                <Plus className="w-6 h-6 mb-2" />
                <span>Bulk Register</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/facilities/retire")}
              >
                <Package className="w-6 h-6 mb-2" />
                <span>Retire Containers</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/facilities/lost")}
              >
                <AlertTriangle className="w-6 h-6 mb-2" />
                <span>Lost Containers</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/facilities/reports")}
              >
                <Download className="w-6 h-6 mb-2" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
