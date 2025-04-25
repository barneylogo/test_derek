"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Instagram, Youtube, MoreVertical, Edit, Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Influencer } from "./influencer-dashboard";

interface InfluencerRowProps {
  influencer: Influencer;
  onEdit: () => void;
  onDelete: () => void;
}

export function InfluencerRow({
  influencer,
  onEdit,
  onDelete,
}: InfluencerRowProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-r from-card to-card/90 border border-border rounded-md p-3 flex  justify-between hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-wrap  items-center justify-between w-full">
        <div className="flex flex-wrap items-center space-x-3">
          <Avatar className="h-20 w-20 border-2 border-yellow-500/20">
            <AvatarImage
              src={influencer.profilePicture || "/placeholder.svg"}
              alt={influencer.name}
            />
            <AvatarFallback className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              {getInitials(influencer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{influencer.name}</h3>
            <div className="flex items-center mt-1 space-x-2">
              <Badge
                variant="outline"
                className={`${
                  influencer.tier === "Gold"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                    : "bg-gray-200/10 text-gray-600 dark:text-gray-400 border-gray-300/30"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full mr-1 ${
                    influencer.tier === "Gold" ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                ></span>
                {influencer.tier}
              </Badge>
              <div className="flex items-center space-x-1 text-muted-foreground">
                {influencer.platforms.includes("Instagram") && (
                  <Instagram className="h-6 w-6" />
                )}
                {influencer.platforms.includes("YouTube") && (
                  <Youtube className="h-6 w-6" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center space-x-6">
          <div className="hidden md:block text-sm text-muted-foreground">
            Added {formatDate(influencer.dateAdded)}
          </div>

          <div className="w-32 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Score</span>
              <span
                className={`font-medium ${
                  influencer.score >= 80
                    ? "text-green-600 dark:text-green-400"
                    : influencer.score >= 50
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {influencer.score}/100
              </span>
            </div>
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  influencer.score >= 80
                    ? "bg-gradient-to-r from-green-500 to-emerald-400"
                    : influencer.score >= 50
                    ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                    : "bg-gradient-to-r from-red-500 to-rose-400"
                }`}
                style={{ width: `${influencer.score}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
