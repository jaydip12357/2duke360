"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Leaf,
  Droplets,
  DollarSign,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Award,
} from "lucide-react";

// Duke colors for charts
const DUKE_COLORS = {
  blue: "#012169",
  navy: "#003366",
  royal: "#00539B",
  success: "#339966",
  warning: "#F09905",
  error: "#DC3545",
};

// Mock analytics data
const adoptionData = [
  { month: "Aug", users: 120, containers: 450 },
  { month: "Sep", users: 280, containers: 1200 },
  { month: "Oct", users: 520, containers: 2800 },
  { month: "Nov", users: 890, containers: 5200 },
  { month: "Dec", users: 1150, containers: 7800 },
  { month: "Jan", users: 1420, containers: 10500 },
];

const returnRateData = [
  { week: "W1", onTime: 94, late: 6 },
  { week: "W2", onTime: 95, late: 5 },
  { week: "W3", onTime: 97, late: 3 },
  { week: "W4", onTime: 96, late: 4 },
  { week: "W5", onTime: 98, late: 2 },
  { week: "W6", onTime: 97, late: 3 },
];

const environmentalImpact = [
  { month: "Aug", waste: 45, carbon: 22, water: 112 },
  { month: "Sep", waste: 120, carbon: 58, water: 290 },
  { month: "Oct", waste: 280, carbon: 136, water: 680 },
  { month: "Nov", waste: 520, carbon: 252, water: 1260 },
  { month: "Dec", waste: 780, carbon: 378, water: 1890 },
  { month: "Jan", waste: 1050, carbon: 509, water: 2545 },
];

const locationBreakdown = [
  { name: "Marketplace", value: 42, color: DUKE_COLORS.blue },
  { name: "West Union", value: 28, color: DUKE_COLORS.navy },
  { name: "Farmstead", value: 18, color: DUKE_COLORS.royal },
  { name: "The Loop", value: 12, color: DUKE_COLORS.success },
];

const peakHoursData = [
  { hour: "7AM", checkouts: 12 },
  { hour: "8AM", checkouts: 45 },
  { hour: "9AM", checkouts: 28 },
  { hour: "10AM", checkouts: 15 },
  { hour: "11AM", checkouts: 68 },
  { hour: "12PM", checkouts: 125 },
  { hour: "1PM", checkouts: 98 },
  { hour: "2PM", checkouts: 42 },
  { hour: "3PM", checkouts: 35 },
  { hour: "4PM", checkouts: 28 },
  { hour: "5PM", checkouts: 72 },
  { hour: "6PM", checkouts: 95 },
  { hour: "7PM", checkouts: 68 },
  { hour: "8PM", checkouts: 35 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [demoModeActive, setDemoModeActive] = useState(false);

  // Check for demo mode activation (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyD") {
        setDemoModeActive(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Summary stats
  const stats = {
    totalUsers: 1420,
    activeUsers: 892,
    totalContainers: 500,
    containersInUse: 234,
    returnRate: 97.2,
    wasteAverted: 2795,
    carbonSaved: 1355,
    waterSaved: 6775,
    lateFeeRevenue: 1250,
    disposableCostsSaved: 8750,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header currentRole="ADMIN" />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#012169]">
              System Analytics
            </h1>
            <p className="text-gray-600">
              Real-time insights and program performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Demo Mode Panel */}
        {demoModeActive && (
          <Card className="border-purple-300 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Demo Mode Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => router.push("/demo/qr-codes")}
                >
                  Generate Demo QR Codes
                </Button>
                <Button size="sm" variant="outline">
                  Create 50 Fake Students
                </Button>
                <Button size="sm" variant="outline">
                  Simulate Week of Activity
                </Button>
                <Button size="sm" variant="outline">
                  Seed Impact Statistics
                </Button>
                <Button size="sm" variant="destructive">
                  Reset Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="p-3 bg-[#012169]/10 rounded-lg">
                  <Users className="w-6 h-6 text-[#012169]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Containers in Use</p>
                  <p className="text-2xl font-bold">{stats.containersInUse}</p>
                  <p className="text-xs text-gray-500">
                    of {stats.totalContainers} total
                  </p>
                </div>
                <div className="p-3 bg-[#00539B]/10 rounded-lg">
                  <Package className="w-6 h-6 text-[#00539B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Return Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.returnRate}%
                  </p>
                  <p className="text-xs text-green-600 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Target: 97%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">CO₂ Prevented</p>
                  <p className="text-2xl font-bold">{stats.carbonSaved} kg</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{Math.round(stats.carbonSaved * 0.08)} kg this week
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adoption Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Program Adoption</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={adoptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="users"
                        name="Active Users"
                        stroke={DUKE_COLORS.blue}
                        fill={DUKE_COLORS.blue}
                        fillOpacity={0.3}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="containers"
                        name="Container Uses"
                        stroke={DUKE_COLORS.royal}
                        fill={DUKE_COLORS.royal}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Return Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Return Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={returnRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="onTime"
                        name="On-Time %"
                        fill={DUKE_COLORS.success}
                        stackId="a"
                      />
                      <Bar
                        dataKey="late"
                        name="Late %"
                        fill={DUKE_COLORS.error}
                        stackId="a"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Location Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage by Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={locationBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {locationBreakdown.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Peak Hours */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Peak Usage Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={peakHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="checkouts" fill={DUKE_COLORS.blue}>
                        {peakHoursData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              entry.checkouts > 80
                                ? DUKE_COLORS.blue
                                : entry.checkouts > 50
                                ? DUKE_COLORS.royal
                                : DUKE_COLORS.navy
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6 mt-6">
            {/* Environmental Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                <CardContent className="p-6">
                  <Leaf className="w-10 h-10 mb-3 opacity-80" />
                  <p className="text-4xl font-bold">{stats.carbonSaved}</p>
                  <p className="text-lg opacity-80">kg CO₂ Prevented</p>
                  <p className="text-sm mt-2 opacity-70">
                    Equivalent to 55 trees planted
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <CardContent className="p-6">
                  <Droplets className="w-10 h-10 mb-3 opacity-80" />
                  <p className="text-4xl font-bold">{stats.waterSaved}</p>
                  <p className="text-lg opacity-80">Gallons Water Saved</p>
                  <p className="text-sm mt-2 opacity-70">
                    Enough for 135 showers
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                <CardContent className="p-6">
                  <Package className="w-10 h-10 mb-3 opacity-80" />
                  <p className="text-4xl font-bold">{stats.wasteAverted}</p>
                  <p className="text-lg opacity-80">lbs Waste Diverted</p>
                  <p className="text-sm mt-2 opacity-70">
                    From ending up in landfills
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Environmental Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={environmentalImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="waste"
                      name="Waste Diverted (lbs)"
                      stroke={DUKE_COLORS.warning}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbon"
                      name="CO₂ Saved (kg)"
                      stroke={DUKE_COLORS.success}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="water"
                      name="Water Saved (gal)"
                      stroke={DUKE_COLORS.royal}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Disposable Costs Avoided
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        ${stats.disposableCostsSaved.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        vs single-use containers
                      </p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Late Fee Revenue</p>
                      <p className="text-3xl font-bold">
                        ${stats.lateFeeRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        This semester
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-[#012169] opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Program ROI</p>
                      <p className="text-3xl font-bold text-green-600">
                        +{Math.round(((stats.disposableCostsSaved + stats.lateFeeRevenue) / 5000) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on program costs
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            {/* User Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    User management interface
                  </p>
                  <p>View, edit, and manage all system users</p>
                  <Button className="mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Export User Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                <span>Sustainability Report</span>
                <span className="text-xs text-gray-500">PDF Format</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                <span>Transaction Data</span>
                <span className="text-xs text-gray-500">CSV Format</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                <span>Carbon Certificates</span>
                <span className="text-xs text-gray-500">PDF Format</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                <span>Presentation Slides</span>
                <span className="text-xs text-gray-500">PPTX Format</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer hint */}
        <div className="text-center text-sm text-gray-400">
          Press Ctrl+Shift+D to access Demo Mode
        </div>
      </main>
    </div>
  );
}
