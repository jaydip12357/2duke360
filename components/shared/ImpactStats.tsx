"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Droplets,
  Recycle,
  Trophy,
  Flame,
  Target,
} from "lucide-react";

interface ImpactStatsProps {
  containersReused: number;
  wasteAverted: number;
  carbonSaved: number;
  waterSaved: number;
  streak: number;
  longestStreak: number;
  leaderboardRank?: number;
  badges?: string[];
}

export function ImpactStats({
  containersReused,
  wasteAverted,
  carbonSaved,
  waterSaved,
  streak,
  longestStreak,
  leaderboardRank,
  badges = [],
}: ImpactStatsProps) {
  // Achievement thresholds
  const achievements = [
    { name: "First Timer", threshold: 1, icon: "🎉" },
    { name: "Getting Started", threshold: 10, icon: "🌱" },
    { name: "Eco Warrior", threshold: 50, icon: "🌿" },
    { name: "100 Club", threshold: 100, icon: "💯" },
    { name: "Sustainability Champion", threshold: 250, icon: "🏆" },
    { name: "Planet Hero", threshold: 500, icon: "🌍" },
  ];

  const nextAchievement = achievements.find(
    (a) => a.threshold > containersReused
  );
  const progressToNext = nextAchievement
    ? (containersReused / nextAchievement.threshold) * 100
    : 100;

  const earnedBadges = achievements.filter(
    (a) => a.threshold <= containersReused
  );

  return (
    <div className="space-y-6">
      {/* Main Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#012169] to-[#003366] text-white">
          <CardContent className="p-4">
            <Recycle className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{containersReused}</p>
            <p className="text-sm opacity-80">Containers Reused</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#339966] to-green-700 text-white">
          <CardContent className="p-4">
            <Leaf className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{carbonSaved.toFixed(1)}</p>
            <p className="text-sm opacity-80">kg CO₂ Saved</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#00539B] to-blue-700 text-white">
          <CardContent className="p-4">
            <Droplets className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{waterSaved.toFixed(1)}</p>
            <p className="text-sm opacity-80">Gallons Saved</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F09905] to-orange-600 text-white">
          <CardContent className="p-4">
            <Target className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{wasteAverted.toFixed(1)}</p>
            <p className="text-sm opacity-80">lbs Waste Averted</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak and Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold text-[#012169]">
                    {streak} days
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Best</p>
                <p className="text-lg font-semibold text-gray-600">
                  {longestStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {leaderboardRank && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Campus Ranking</p>
                  <p className="text-2xl font-bold text-[#012169]">
                    #{leaderboardRank}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress to Next Achievement */}
      {nextAchievement && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {nextAchievement.icon} {nextAchievement.name}
              </span>
              <span className="text-sm font-medium">
                {containersReused}/{nextAchievement.threshold}
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="mt-2 text-xs text-gray-500">
              {nextAchievement.threshold - containersReused} more containers to
              unlock!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.name}
                  variant="outline"
                  className="text-sm py-1 px-3"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
