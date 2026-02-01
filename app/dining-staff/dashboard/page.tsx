"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QrCode,
  Radio,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Clock,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";

const locations = [
  { id: "mkt", name: "Marketplace", code: "MKT" },
  { id: "wu", name: "West Union", code: "WU" },
  { id: "farm", name: "Farmstead", code: "FARM" },
  { id: "loop", name: "The Loop", code: "LOOP" },
];

// Mock data
const todayStats = {
  checkouts: 156,
  returns: 142,
  activeContainers: 234,
  lateContainers: 12,
};

const recentTransactions = [
  {
    id: "1",
    type: "checkout",
    container: "DRC-MKT-0042",
    student: "John D.",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "return",
    container: "DRC-WU-0128",
    student: "Sarah M.",
    time: "5 min ago",
  },
  {
    id: "3",
    type: "checkout",
    container: "DRC-MKT-0089",
    student: "Mike R.",
    time: "8 min ago",
  },
  {
    id: "4",
    type: "return",
    container: "DRC-FARM-0015",
    student: "Emma L.",
    time: "12 min ago",
  },
  {
    id: "5",
    type: "checkout",
    container: "DRC-MKT-0156",
    student: "Alex K.",
    time: "15 min ago",
  },
];

const lateAlerts = [
  {
    id: "1",
    container: "DRC-MKT-0023",
    student: "James W.",
    daysLate: 2,
    phone: "***-***-1234",
  },
  {
    id: "2",
    container: "DRC-WU-0067",
    student: "Lisa P.",
    daysLate: 1,
    phone: "***-***-5678",
  },
];

export default function DiningStaffDashboard() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("mkt");

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header currentRole="DINING_STAFF" />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Location Selector and Quick Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="success" className="text-sm py-1">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Online
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/dining-staff/inventory")}
            >
              <Package className="w-4 h-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dining-staff/analytics")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todayStats.checkouts}</p>
                  <p className="text-sm text-gray-500">Checkouts Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todayStats.returns}</p>
                  <p className="text-sm text-gray-500">Returns Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#012169]/10 rounded-lg">
                  <Package className="w-5 h-5 text-[#012169]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todayStats.activeContainers}</p>
                  <p className="text-sm text-gray-500">Active Containers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={todayStats.lateContainers > 0 ? "border-red-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {todayStats.lateContainers}
                  </p>
                  <p className="text-sm text-gray-500">Late Containers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:border-[#012169] transition-colors"
            onClick={() => router.push("/dining-staff/scan?mode=qr")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#012169] rounded-xl flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">Scan QR Code</h3>
                  <p className="text-gray-600">
                    Scan student or container QR codes
                  </p>
                </div>
                <Button size="lg">Open Scanner</Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-[#00539B] transition-colors"
            onClick={() => router.push("/dining-staff/scan?mode=rfid")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#00539B] rounded-xl flex items-center justify-center">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">RFID Scanner</h3>
                  <p className="text-gray-600">
                    Batch scan containers with RFID
                  </p>
                </div>
                <Button size="lg" variant="secondary">
                  Open RFID
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === "checkout"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {tx.type === "checkout" ? (
                          <ArrowUpRight
                            className={`w-4 h-4 ${
                              tx.type === "checkout"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.container}</p>
                        <p className="text-sm text-gray-500">{tx.student}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={tx.type === "checkout" ? "success" : "default"}
                      >
                        {tx.type === "checkout" ? "Out" : "In"}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Late Container Alerts */}
          <Card className="border-red-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Late Container Alerts
              </CardTitle>
              <Badge variant="late">{lateAlerts.length} Overdue</Badge>
            </CardHeader>
            <CardContent>
              {lateAlerts.length > 0 ? (
                <div className="space-y-3">
                  {lateAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 bg-red-50 border border-red-100 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{alert.container}</p>
                        <Badge variant="late">
                          {alert.daysLate} day{alert.daysLate > 1 ? "s" : ""} late
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {alert.student} • {alert.phone}
                        </span>
                        <Button size="sm" variant="outline">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No late containers!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/dining-staff/lookup")}
              >
                <Search className="w-6 h-6 mb-2" />
                <span>Lookup Container</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/dining-staff/returns")}
              >
                <ArrowDownLeft className="w-6 h-6 mb-2" />
                <span>Process Returns</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/dining-staff/students")}
              >
                <Users className="w-6 h-6 mb-2" />
                <span>Student Lookup</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center"
                onClick={() => router.push("/dining-staff/report")}
              >
                <AlertTriangle className="w-6 h-6 mb-2" />
                <span>Report Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Help */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> Scan •{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd> Return Mode •{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded">C</kbd> Checkout Mode
          </p>
        </div>
      </main>
    </div>
  );
}
