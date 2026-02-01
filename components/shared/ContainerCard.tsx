"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTimeRemaining } from "@/lib/utils";
import { Clock, MapPin, Package, RotateCcw } from "lucide-react";

interface ContainerCardProps {
  containerId: string;
  checkoutLocation: string;
  checkoutTime: Date | string;
  dueDate: Date | string;
  status: "active" | "due-soon" | "late";
  onReturn?: () => void;
}

export function ContainerCard({
  containerId,
  checkoutLocation,
  checkoutTime,
  dueDate,
  status,
  onReturn,
}: ContainerCardProps) {
  const timeRemaining = getTimeRemaining(dueDate);

  const statusConfig = {
    active: {
      variant: "success" as const,
      label: "Active",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    "due-soon": {
      variant: "warning" as const,
      label: "Due Soon",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    late: {
      variant: "late" as const,
      label: "Late",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 card-hover`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Package className="w-6 h-6 text-[#012169]" />
            </div>
            <div>
              <h4 className="font-semibold text-[#012169]">{containerId}</h4>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {checkoutLocation}
              </div>
            </div>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span
              className={
                timeRemaining.isOverdue ? "text-red-600 font-medium" : "text-gray-600"
              }
            >
              {timeRemaining.text}
            </span>
          </div>

          {onReturn && (
            <Button
              variant={status === "late" ? "destructive" : "outline"}
              size="sm"
              onClick={onReturn}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Return
            </Button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Checked out: {new Date(checkoutTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      </CardContent>
    </Card>
  );
}
