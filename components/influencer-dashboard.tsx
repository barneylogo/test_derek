"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Calendar,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";

import { InfluencerCard } from "./influencer-card";
import { InfluencerRow } from "./influencer-row";
import { AddInfluencerModal } from "./add-influencer-modal";
import { EditInfluencerModal } from "./edit-influencer-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { mockInfluencers } from "@/lib/mock-data";

export type Influencer = {
  id: string;
  name: string;
  profilePicture: string;
  tier: "Gold" | "Silver";
  platforms: ("Instagram" | "YouTube")[];
  score: number;
  dateAdded: string;
};

export default function InfluencerDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers);
  const [filteredInfluencers, setFilteredInfluencers] =
    useState<Influencer[]>(mockInfluencers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<"dateAdded" | "score">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"card" | "row">("card");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let filtered = [...influencers];

    if (searchQuery) {
      filtered = filtered.filter((influencer) =>
        influencer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTiers.length > 0) {
      filtered = filtered.filter((influencer) =>
        selectedTiers.includes(influencer.tier)
      );
    }

    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((influencer) =>
        influencer.platforms.some((platform) =>
          selectedPlatforms.includes(platform)
        )
      );
    }

    filtered = filtered.filter(
      (influencer) =>
        influencer.score >= scoreRange[0] && influencer.score <= scoreRange[1]
    );

    filtered.sort((a, b) => {
      if (sortBy === "dateAdded") {
        return sortOrder === "asc"
          ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else {
        return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
      }
    });

    setFilteredInfluencers(filtered);
  }, [
    influencers,
    searchQuery,
    selectedTiers,
    selectedPlatforms,
    scoreRange,
    sortBy,
    sortOrder,
  ]);

  const handleAddInfluencer = (newInfluencer: Omit<Influencer, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const influencer = { ...newInfluencer, id };
    setInfluencers([...influencers, influencer as Influencer]);
    setShowAddModal(false);
    toast({
      title: "Influencer Added",
      description: `${newInfluencer.name} has been added to the directory.`,
    });
  };

  const handleEditInfluencer = (updatedInfluencer: Influencer) => {
    setInfluencers(
      influencers.map((influencer) =>
        influencer.id === updatedInfluencer.id ? updatedInfluencer : influencer
      )
    );
    setShowEditModal(false);
    toast({
      title: "Influencer Updated",
      description: `${updatedInfluencer.name}'s information has been updated.`,
    });
  };

  const handleDeleteInfluencer = () => {
    if (selectedInfluencer) {
      setInfluencers(
        influencers.filter(
          (influencer) => influencer.id !== selectedInfluencer.id
        )
      );
      setShowDeleteModal(false);
      toast({
        title: "Influencer Deleted",
        description: `${selectedInfluencer.name} has been removed from the directory.`,
        variant: "destructive",
      });
      setSelectedInfluencer(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTiers([]);
    setSelectedPlatforms([]);
    setScoreRange([0, 100]);
    setSortBy("dateAdded");
    setSortOrder("desc");
  };

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <aside className="hidden md:flex flex-col w-64 p-4 border-r border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-yellow-500">Influencer Hub</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Tier</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gold-tier-desktop"
                  checked={selectedTiers.includes("Gold")}
                  onCheckedChange={() => toggleTier("Gold")}
                  className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor="gold-tier-desktop"
                  className="flex items-center"
                >
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  Gold
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="silver-tier-desktop"
                  checked={selectedTiers.includes("Silver")}
                  onCheckedChange={() => toggleTier("Silver")}
                  className="border-gray-400 data-[state=checked]:bg-gray-400 data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor="silver-tier-desktop"
                  className="flex items-center"
                >
                  <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                  Silver
                </Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Platform</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instagram-platform-desktop"
                  checked={selectedPlatforms.includes("Instagram")}
                  onCheckedChange={() => togglePlatform("Instagram")}
                  className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="instagram-platform-desktop">Instagram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="youtube-platform-desktop"
                  checked={selectedPlatforms.includes("YouTube")}
                  onCheckedChange={() => togglePlatform("YouTube")}
                  className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="youtube-platform-desktop">YouTube</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Score Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 100]}
                value={scoreRange}
                onValueChange={(value) =>
                  setScoreRange(value as [number, number])
                }
                max={100}
                step={1}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{scoreRange[0]}</span>
                <span>{scoreRange[1]}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="w-full border-yellow-500 text-yellow-500 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-amber-500/10"
          >
            Reset Filters
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h1 className="text-lg font-bold text-yellow-500">Influencer Hub</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        <div className="p-4 border-b border-border bg-card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search influencers ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-background border-border"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-yellow-500"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 text-yellow-500" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger className="w-[150px] border-border">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAdded">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Added
                      </div>
                    </SelectItem>

                    <SelectItem value="score">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Score
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as any)}
                >
                  <SelectTrigger className="w-[150px] border-border">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <div className="flex items-center">
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Ascending
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center">
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Descending
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant={viewMode === "card" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("card")}
                    className={
                      viewMode === "card"
                        ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-primary-foreground"
                        : ""
                    }
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "row" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("row")}
                    className={
                      viewMode === "row"
                        ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-primary-foreground"
                        : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-[200px] bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500 text-primary-foreground border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Influencer
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center flex-col sm:flex-row  gap-2 justify-between mt-4">
            <div className="w-full flex flex-wrap items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger className="w-full sm:w-[150px] border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Added
                    </div>
                  </SelectItem>
                  <SelectItem value="score">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Score
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as any)}
              >
                <SelectTrigger className="w-full sm:w-[150px] border-border">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className={
                  viewMode === "card"
                    ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-primary-foreground"
                    : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "row" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("row")}
                className={
                  viewMode === "row"
                    ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-primary-foreground"
                    : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {filteredInfluencers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-muted/30 rounded-full p-6 mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No influencers found</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {viewMode === "card" ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredInfluencers.map((influencer) => (
                    <InfluencerCard
                      key={influencer.id}
                      influencer={influencer}
                      onEdit={() => {
                        setSelectedInfluencer(influencer);
                        setShowEditModal(true);
                      }}
                      onDelete={() => {
                        setSelectedInfluencer(influencer);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div layout className="flex flex-col space-y-2">
                  {filteredInfluencers.map((influencer) => (
                    <InfluencerRow
                      key={influencer.id}
                      influencer={influencer}
                      onEdit={() => {
                        setSelectedInfluencer(influencer);
                        setShowEditModal(true);
                      }}
                      onDelete={() => {
                        setSelectedInfluencer(influencer);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black z-40"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl z-50 p-4 max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Tier</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gold-tier-mobile"
                        checked={selectedTiers.includes("Gold")}
                        onCheckedChange={() => toggleTier("Gold")}
                        className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                      />
                      <Label
                        htmlFor="gold-tier-mobile"
                        className="flex items-center"
                      >
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                        Gold
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="silver-tier-mobile"
                        checked={selectedTiers.includes("Silver")}
                        onCheckedChange={() => toggleTier("Silver")}
                        className="border-gray-400 data-[state=checked]:bg-gray-400 data-[state=checked]:text-primary-foreground"
                      />
                      <Label
                        htmlFor="silver-tier-mobile"
                        className="flex items-center"
                      >
                        <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                        Silver
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Platform</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instagram-platform-mobile"
                        checked={selectedPlatforms.includes("Instagram")}
                        onCheckedChange={() => togglePlatform("Instagram")}
                        className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                      />
                      <Label htmlFor="instagram-platform-mobile">
                        Instagram
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="youtube-platform-mobile"
                        checked={selectedPlatforms.includes("YouTube")}
                        onCheckedChange={() => togglePlatform("YouTube")}
                        className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-primary-foreground"
                      />
                      <Label htmlFor="youtube-platform-mobile">YouTube</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Score Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 100]}
                      value={scoreRange}
                      onValueChange={(value) =>
                        setScoreRange(value as [number, number])
                      }
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{scoreRange[0]}</span>
                      <span>{scoreRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    Reset Filters
                  </Button>
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500 text-primary-foreground border-0"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <AddInfluencerModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddInfluencer}
          />
        )}

        {showEditModal && selectedInfluencer && (
          <EditInfluencerModal
            influencer={selectedInfluencer}
            onClose={() => {
              setShowEditModal(false);
              setSelectedInfluencer(null);
            }}
            onEdit={handleEditInfluencer}
          />
        )}

        {showDeleteModal && selectedInfluencer && (
          <DeleteConfirmationModal
            influencer={selectedInfluencer}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedInfluencer(null);
            }}
            onDelete={handleDeleteInfluencer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
