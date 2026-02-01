"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Users,
  QrCode,
  Radio,
  TrendingUp,
  Leaf,
  ChevronRight,
  CheckCircle2,
  Smartphone,
  Sparkles,
  Target,
  Award,
  Play,
  ExternalLink,
} from "lucide-react";

const features = [
  {
    id: "student",
    title: "Student Experience",
    description: "Personal QR code, container tracking, gamification",
    icon: Users,
    path: "/student/dashboard",
    highlights: [
      "Personal QR code for quick identification",
      "Real-time container tracking",
      "Impact statistics and achievements",
      "Gamification with badges and streaks",
    ],
  },
  {
    id: "qr",
    title: "QR Code System",
    description: "Camera-based scanning for checkout/return",
    icon: QrCode,
    path: "/student/scan",
    highlights: [
      "HTML5 camera integration",
      "Instant container identification",
      "Dual-mode: checkout & return",
      "Works on any smartphone",
    ],
  },
  {
    id: "rfid",
    title: "RFID Simulation",
    description: "Batch scanning for high-volume operations",
    icon: Radio,
    path: "/dining-staff/scan?mode=rfid",
    highlights: [
      "Visual RFID reader interface",
      "Batch scanning capability",
      "Tag health monitoring",
      "200ms simulated read delay",
    ],
  },
  {
    id: "staff",
    title: "Staff Dashboard",
    description: "Inventory management and scanning interface",
    icon: Sparkles,
    path: "/dining-staff/dashboard",
    highlights: [
      "Location-based inventory",
      "Real-time transaction feed",
      "Late container alerts",
      "Keyboard shortcuts for speed",
    ],
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: "Real-time insights and environmental impact",
    icon: TrendingUp,
    path: "/admin",
    highlights: [
      "Adoption rate tracking",
      "Return rate visualization",
      "Environmental impact metrics",
      "Financial ROI calculation",
    ],
  },
  {
    id: "facilities",
    title: "Facilities Management",
    description: "Container lifecycle and QR generation",
    icon: Target,
    path: "/facilities/dashboard",
    highlights: [
      "Bulk container registration",
      "QR/RFID code generation",
      "Maintenance tracking",
      "Location inventory management",
    ],
  },
];

const impactMetrics = [
  { label: "Containers Reused", value: "12,500+", icon: Recycle },
  { label: "CO₂ Prevented", value: "2,500 kg", icon: Leaf },
  { label: "Return Rate", value: "97%", icon: Target },
  { label: "Active Users", value: "1,400+", icon: Users },
];

export default function JudgesPage() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#012169] to-[#003366]">
      {/* Header */}
      <header className="py-8 px-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Recycle className="w-8 h-8 text-[#012169]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">DukeReuse360</h1>
        <p className="text-xl text-white/80 mb-4">
          Duke University&apos;s Smart Reusable Container System
        </p>
        <Badge className="bg-white/20 text-white text-lg px-4 py-1">
          Judges Quick Tour
        </Badge>
      </header>

      <main className="max-w-6xl mx-auto px-8 pb-12 space-y-8">
        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="bg-white/10 border-white/20 backdrop-blur"
            >
              <CardContent className="p-4 text-center text-white">
                <metric.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm opacity-70">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Auto Demo Button */}
        <div className="text-center">
          <Button
            size="xl"
            onClick={() => router.push("/presentation")}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Start 2-Minute Auto Demo
          </Button>
          <p className="text-white/60 text-sm mt-2">
            Simulates live activity with animated stats
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`bg-white cursor-pointer transition-all hover:scale-[1.02] ${
                selectedFeature === feature.id ? "ring-2 ring-yellow-400" : ""
              }`}
              onClick={() =>
                setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#012169]/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-[#012169]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-4">
                  {feature.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(feature.path);
                  }}
                >
                  View Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Highlights */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#012169]" />
              Technical Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Recharts</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Backend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prisma ORM</li>
                  <li>• PostgreSQL</li>
                  <li>• NextAuth.js</li>
                  <li>• Railway deployment</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">QR/RFID</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• qrcode library</li>
                  <li>• html5-qrcode scanner</li>
                  <li>• RFID simulation</li>
                  <li>• Batch processing</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PWA support</li>
                  <li>• Mobile-first design</li>
                  <li>• Real-time updates</li>
                  <li>• Role-based access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/demo/qr-codes")}
            className="border-white text-white hover:bg-white/10"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Demo QR Codes
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="border-white text-white hover:bg-white/10"
          >
            <Recycle className="w-4 h-4 mr-2" />
            Home Page
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm pt-8">
          <p>Built for Duke University Sustainability Initiative</p>
          <p className="mt-1">
            <Smartphone className="w-4 h-4 inline mr-1" />
            Mobile-optimized • PWA Ready • Works Offline
          </p>
        </div>
      </main>
    </div>
  );
}
