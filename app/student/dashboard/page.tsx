"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeDisplay } from "@/components/shared/QRCodeDisplay";
import { ContainerCard } from "@/components/shared/ContainerCard";
import { ImpactStats } from "@/components/shared/ImpactStats";
import {
  QrCode,
  Package,
  MapPin,
  Clock,
  Bell,
  Download,
  Wallet,
  Camera,
  ChevronRight,
} from "lucide-react";

// Demo data
const demoUser = {
  id: "demo-user-1",
  name: "Alex Johnson",
  netId: "aj123",
  qrCode: "USER-aj123",
};

const demoContainers = [
  {
    containerId: "DRC-MKT-0042",
    checkoutLocation: "Marketplace",
    checkoutTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days from now
    status: "active" as const,
  },
  {
    containerId: "DRC-WU-0128",
    checkoutLocation: "West Union",
    checkoutTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
    status: "due-soon" as const,
  },
  {
    containerId: "DRC-FARM-0015",
    checkoutLocation: "Farmstead",
    checkoutTime: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day overdue
    status: "late" as const,
  },
];

const demoLocations = [
  { name: "Marketplace", hours: "7am - 10pm", distance: "0.2 mi", capacity: 85 },
  { name: "West Union", hours: "7am - 11pm", distance: "0.4 mi", capacity: 62 },
  { name: "Farmstead", hours: "11am - 8pm", distance: "0.6 mi", capacity: 91 },
  { name: "The Loop", hours: "8am - 9pm", distance: "0.3 mi", capacity: 45 },
];

const demoNotifications = [
  {
    id: 1,
    type: "warning",
    title: "Container Due Soon",
    message: "DRC-WU-0128 is due in 12 hours",
    time: "2h ago",
  },
  {
    id: 2,
    type: "success",
    title: "Achievement Unlocked",
    message: "You've reached the 50 Club! 🎉",
    time: "1d ago",
  },
  {
    id: 3,
    type: "info",
    title: "Return Confirmed",
    message: "DRC-MKT-0039 returned successfully",
    time: "2d ago",
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("containers");
  const [showNotifications, setShowNotifications] = useState(false);

  const impactStats = {
    containersReused: 47,
    wasteAverted: 4.7,
    carbonSaved: 9.4,
    waterSaved: 23.5,
    streak: 12,
    longestStreak: 21,
    leaderboardRank: 156,
  };

  const handleReturn = (containerId: string) => {
    router.push(`/student/scan?mode=return&container=${containerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              My Duke ID
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <QRCodeDisplay
              data={demoUser.qrCode}
              type="user"
              size={180}
              showDownload={true}
              showWallet={true}
              label={`${demoUser.name} (${demoUser.netId})`}
            />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#012169]/5 rounded-lg">
                <p className="text-3xl font-bold text-[#012169]">
                  {demoContainers.length}
                </p>
                <p className="text-sm text-gray-600">Active Containers</p>
              </div>
              <div className="text-center p-4 bg-[#F09905]/10 rounded-lg">
                <p className="text-3xl font-bold text-[#F09905]">1</p>
                <p className="text-sm text-gray-600">Due Soon</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-500">1</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1"
                onClick={() => router.push("/student/scan?mode=checkout")}
              >
                <Camera className="w-4 h-4 mr-2" />
                Check Out Container
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/student/scan?mode=return")}
              >
                <Package className="w-4 h-4 mr-2" />
                Return Container
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Card className="animate-slideIn">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      notif.type === "warning"
                        ? "bg-yellow-500"
                        : notif.type === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="containers">
            <Package className="w-4 h-4 mr-2" />
            Containers
          </TabsTrigger>
          <TabsTrigger value="impact">
            <span className="mr-2">🌱</span>
            Impact
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoContainers.map((container) => (
              <ContainerCard
                key={container.containerId}
                {...container}
                onReturn={() => handleReturn(container.containerId)}
              />
            ))}
          </div>

          {demoContainers.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No active containers</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/student/scan?mode=checkout")}
              >
                Check Out Your First Container
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <ImpactStats {...impactStats} />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoLocations.map((location) => (
              <Card key={location.name} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#012169]">
                        {location.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {location.hours}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location.distance}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          location.capacity > 80
                            ? "success"
                            : location.capacity > 50
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {location.capacity}% capacity
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Directions
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Simple Map Placeholder */}
          <Card className="mt-4">
            <CardContent className="p-0">
              <div className="h-64 bg-gradient-to-br from-[#012169]/10 to-[#00539B]/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#012169] mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    (Map integration available)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
