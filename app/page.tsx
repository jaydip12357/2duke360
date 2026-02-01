"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Recycle,
  QrCode,
  Leaf,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#012169] to-[#003366]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Recycle className="w-10 h-10 text-[#012169]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            DukeReuse360
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Duke University&apos;s sustainable dining initiative. Track, reuse, and
            reduce waste with our smart container system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              onClick={() => router.push("/student/dashboard")}
              className="bg-white text-[#012169] hover:bg-gray-100"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => router.push("/presentation")}
              className="border-white text-white hover:bg-white/10"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center">
              <QrCode className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                QR Code Tracking
              </h3>
              <p className="text-white/70">
                Scan containers with your phone for instant checkout and return.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center">
              <Leaf className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Impact Dashboard
              </h3>
              <p className="text-white/70">
                Track your environmental impact with real-time statistics.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Gamification
              </h3>
              <p className="text-white/70">
                Earn badges, climb leaderboards, and compete with friends.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Student", href: "/student/dashboard", icon: "🎓" },
              { label: "Dining Staff", href: "/dining-staff/dashboard", icon: "🍽️" },
              { label: "Facilities", href: "/facilities/dashboard", icon: "🔧" },
              { label: "Admin", href: "/admin", icon: "⚙️" },
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="h-auto py-4 flex flex-col items-center bg-white/5 hover:bg-white/10 text-white"
                onClick={() => router.push(item.href)}
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 mt-1 opacity-50" />
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-16 bg-white/10 backdrop-blur rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Campus Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-white">12,500+</p>
              <p className="text-white/70">Containers Reused</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">2,500 kg</p>
              <p className="text-white/70">CO₂ Prevented</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">6,250 gal</p>
              <p className="text-white/70">Water Saved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">97%</p>
              <p className="text-white/70">Return Rate</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/50 text-sm">
          <p>
            Built for Duke University Sustainability
          </p>
          <p className="mt-2">
            Triple-click the Duke logo to access demo mode
          </p>
        </footer>
      </div>
    </div>
  );
}
