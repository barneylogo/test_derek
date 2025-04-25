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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Influencer } from "./influencer-dashboard";

interface InfluencerCardProps {
  influencer: Influencer;
  onEdit: () => void;
  onDelete: () => void;
}

export function InfluencerCard({
  influencer,
  onEdit,
  onDelete,
}: InfluencerCardProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-card to-card/80 border-opacity-40 hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
          <div className="justify-center sm:justify-start flex w-full gap-2 items-center flex-wrap space-x-3">
            <Avatar className="h-20 w-20 border-2 border-yellow-500/20">
              <AvatarImage
                src={influencer.profilePicture || "/placeholder.jpg"}
                alt={influencer.name}
              />
              <AvatarFallback className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                {getInitials(influencer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base leading-none">
                {influencer.name}
              </h3>
              <div className="flex justify-center sm:justify-start items-center mt-1.5 space-x-1.5">
                {influencer.platforms.includes("Instagram") && (
                  <Instagram className="h-6 w-6 text-muted-foreground" />
                )}

                {influencer.platforms.includes("YouTube") && (
                  <Youtube className="h-6 w-6 text-muted-foreground" />
                )}
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
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
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
          </div>

          <div className="space-y-1.5">
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
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          Added on {formatDate(influencer.dateAdded)}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
