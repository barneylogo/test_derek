"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Upload, Link, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Influencer } from "./influencer-dashboard";

interface AddInfluencerModalProps {
  onClose: () => void;
  onAdd: (influencer: Omit<Influencer, "id">) => void;
}

export function AddInfluencerModal({
  onClose,
  onAdd,
}: AddInfluencerModalProps) {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("/placeholder-user.jpg");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const [tier, setTier] = useState<"Gold" | "Silver">("Silver");
  const [platforms, setPlatforms] = useState<("Instagram" | "YouTube")[]>([]);
  const [score, setScore] = useState(50);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePictureFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalProfilePicture = profilePicturePreview || profilePicture;

    onAdd({
      name,
      profilePicture: finalProfilePicture,
      tier,
      platforms,
      score,
      dateAdded: new Date().toISOString(),
    });
  };

  const togglePlatform = (platform: "Instagram" | "YouTube") => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium">Add New Influencer</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter influencer name"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Profile Picture</Label>

            <div className="flex items-center justify-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-yellow-500/20">
                  <AvatarImage
                    src={profilePicturePreview || profilePicture}
                    alt={name || "Profile"}
                  />
                  <AvatarFallback className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-2xl">
                    {name ? getInitials(name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "upload" | "url")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="text-xs">
                  <Link className="h-3.5 w-3.5 mr-1" />
                  URL
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-2 space-y-2">
                <div
                  className="border-2 border-dashed border-yellow-500/30 rounded-lg p-4 text-center cursor-pointer hover:bg-yellow-500/5 transition-colors"
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 mx-auto text-yellow-500/70 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {profilePictureFile ? (
                      <span className="text-yellow-500">
                        {profilePictureFile.name}
                      </span>
                    ) : (
                      <span>Click to upload or drag and drop</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 2MB
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="url" className="mt-2">
                <Input
                  id="profilePicture"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  placeholder="Enter profile picture URL"
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Tier</Label>
            <RadioGroup
              value={tier}
              onValueChange={(value) => setTier(value as "Gold" | "Silver")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Gold"
                  id="gold"
                  className="border-yellow-500 text-yellow-500"
                />
                <Label htmlFor="gold" className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  Gold
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Silver"
                  id="silver"
                  className="border-gray-400 text-gray-400"
                />
                <Label htmlFor="silver" className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                  Silver
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instagram"
                  checked={platforms.includes("Instagram")}
                  onCheckedChange={() => togglePlatform("Instagram")}
                  className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="instagram">Instagram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="youtube"
                  checked={platforms.includes("YouTube")}
                  onCheckedChange={() => togglePlatform("YouTube")}
                  className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="youtube">YouTube</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Score</Label>
              <span className="text-sm text-muted-foreground">{score}/100</span>
            </div>
            <Slider
              value={[score]}
              onValueChange={(value) => setScore(value[0])}
              max={100}
              step={1}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500 text-primary-foreground border-0"
            >
              Add Influencer
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
