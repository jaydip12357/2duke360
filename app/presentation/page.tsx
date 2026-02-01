"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Leaf,
  Droplets,
  Users,
  Package,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Target,
  Award,
  MapPin,
  QrCode,
} from "lucide-react";

// Simulated live feed
interface Transaction {
  id: number;
  type: "checkout" | "return";
  container: string;
  student: string;
  location: string;
  timestamp: Date;
}

const locations = ["Marketplace", "West Union", "Farmstead", "The Loop"];
const studentNames = [
  "Alex K.", "Sarah M.", "John D.", "Emma L.", "Mike R.",
  "Lisa P.", "James W.", "Amy T.", "Chris B.", "Nina S.",
];

export default function PresentationPage() {
  const router = useRouter();
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [stats, setStats] = useState({
    containersReused: 12547,
    carbonSaved: 2509,
    waterSaved: 6273,
    activeUsers: 1423,
    returnRate: 97.2,
    containersOut: 234,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [demoTime, setDemoTime] = useState(0);

  // Generate random transaction
  const generateTransaction = useCallback((): Transaction => {
    const type = Math.random() > 0.45 ? "checkout" : "return";
    const location = locations[Math.floor(Math.random() * locations.length)];
    const student = studentNames[Math.floor(Math.random() * studentNames.length)];
    const containerNum = Math.floor(Math.random() * 100) + 1;

    return {
      id: Date.now() + Math.random(),
      type,
      container: `DRC-${location.substring(0, 3).toUpperCase()}-${String(containerNum).padStart(4, "0")}`,
      student,
      location,
      timestamp: new Date(),
    };
  }, []);

  // Auto demo mode
  useEffect(() => {
    if (!isAutoDemo) return;

    const interval = setInterval(() => {
      // Add new transaction
      const newTx = generateTransaction();
      setTransactions((prev) => [newTx, ...prev.slice(0, 9)]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        containersReused: prev.containersReused + (newTx.type === "return" ? 1 : 0),
        carbonSaved: prev.carbonSaved + (newTx.type === "return" ? 0.2 : 0),
        waterSaved: prev.waterSaved + (newTx.type === "return" ? 0.5 : 0),
        containersOut: prev.containersOut + (newTx.type === "checkout" ? 1 : -1),
      }));

      setDemoTime((prev) => prev + 3);
    }, 3000);

    // Stop after 2 minutes
    const timeout = setTimeout(() => {
      setIsAutoDemo(false);
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAutoDemo, generateTransaction]);

  const handleStartDemo = () => {
    setIsAutoDemo(true);
    setDemoTime(0);
    setTransactions([]);
  };

  const handleStopDemo = () => {
    setIsAutoDemo(false);
  };

  const handleReset = () => {
    setIsAutoDemo(false);
    setDemoTime(0);
    setTransactions([]);
    setStats({
      containersReused: 12547,
      carbonSaved: 2509,
      waterSaved: 6273,
      activeUsers: 1423,
      returnRate: 97.2,
      containersOut: 234,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#012169] to-[#003366] text-white">
      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Recycle className="w-6 h-6 text-[#012169]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">DukeReuse360</h1>
            <p className="text-white/70 text-sm">Live Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAutoDemo ? (
            <>
              <Badge className="bg-green-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                Auto Demo Running
              </Badge>
              <span className="text-white/70">
                {Math.floor(demoTime / 60)}:{String(demoTime % 60).padStart(2, "0")} / 2:00
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStopDemo}
                className="border-white text-white hover:bg-white/10"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleStartDemo}
                className="bg-green-500 hover:bg-green-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Auto Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="border-white text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="px-8 pb-8 space-y-6">
        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Recycle className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <p className="text-3xl font-bold">
                {stats.containersReused.toLocaleString()}
              </p>
              <p className="text-sm text-white/70">Containers Reused</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-3xl font-bold">
                {stats.carbonSaved.toFixed(0)} kg
              </p>
              <p className="text-sm text-white/70">CO₂ Prevented</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-3xl font-bold">
                {stats.waterSaved.toFixed(0)} gal
              </p>
              <p className="text-sm text-white/70">Water Saved</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
              <p className="text-sm text-white/70">Active Users</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-3xl font-bold">{stats.returnRate}%</p>
              <p className="text-sm text-white/70">Return Rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-3xl font-bold">{stats.containersOut}</p>
              <p className="text-sm text-white/70">Currently Out</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Transaction Feed */}
          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Live Activity Feed
                {isAutoDemo && (
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </h2>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start auto demo to see live transactions</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg animate-slideIn"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            tx.type === "checkout"
                              ? "bg-green-500/20"
                              : "bg-blue-500/20"
                          }`}
                        >
                          {tx.type === "checkout" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.container}</p>
                          <p className="text-sm text-white/60">
                            {tx.student} at {tx.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          tx.type === "checkout"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      >
                        {tx.type === "checkout" ? "Out" : "In"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Activity */}
          <Card className="bg-white/10 border-white/20 backdrop-blur">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Campus Locations
              </h2>

              <div className="space-y-4">
                {locations.map((location, i) => {
                  const activity = Math.floor(Math.random() * 50) + 20;
                  const trend = Math.random() > 0.5;

                  return (
                    <div key={location} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{location}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70">{activity} active</span>
                          {trend ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />
                          )}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00539B] to-green-500 transition-all duration-500"
                          style={{ width: `${activity + 30}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-white/60">Checkouts Today</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg text-center">
                  <ArrowDownLeft className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-xs text-white/60">Returns Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/student/dashboard")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Users className="w-4 h-4 mr-2" />
            Student View
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dining-staff/dashboard")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Package className="w-4 h-4 mr-2" />
            Staff View
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/demo/qr-codes")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Demo QR Codes
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/judges")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Award className="w-4 h-4 mr-2" />
            Judges Tour
          </Button>
        </div>

        {/* Impact Comparison */}
        <Card className="bg-white/10 border-white/20 backdrop-blur">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Single-Use vs Reusable Impact
            </h2>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-red-400">25,000+</p>
                <p className="text-white/70">Single-use containers</p>
                <p className="text-sm text-white/50">avoided this semester</p>
              </div>
              <div className="flex items-center justify-center">
                <ChevronRight className="w-12 h-12 text-green-400" />
              </div>
              <div>
                <p className="text-4xl font-bold text-green-400">500</p>
                <p className="text-white/70">Reusable containers</p>
                <p className="text-sm text-white/50">serving 1,400+ students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
