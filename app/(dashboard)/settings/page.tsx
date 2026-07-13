"use client";

import React, { useState } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/queries/useProfile";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Download, Trash2, Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { theme, setTheme } = useTheme();

  const [nameInput, setNameInput] = useState(profile?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [confirmClear, setConfirmClear] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Sync state once loaded
  React.useEffect(() => {
    if (profile?.name && !isEditingName) {
      setNameInput(profile.name);
    }
  }, [profile?.name, isEditingName]);

  const handleSaveName = () => {
    if (nameInput.trim() && nameInput !== profile?.name) {
      updateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const exportData = () => {
    if (typeof window === "undefined") return;
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("gate_prep_")) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gate-prep-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirmClear.toLowerCase() === "delete") {
      if (typeof window !== "undefined") {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith("gate_prep_")) {
            localStorage.removeItem(key);
          }
        }
        window.location.href = "/dashboard";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            Account <span className="gradient-text">Settings</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Manage your profile, preferences, and data.
        </p>
      </motion.div>

      {/* ── Profile Section ── */}
      <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Profile</h2>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <div className="flex gap-3">
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (!isEditingName) setIsEditingName(true);
                }}
                className="bg-background rounded-xl"
              />
              <Button
                disabled={!isEditingName || !nameInput.trim()}
                onClick={handleSaveName}
                className="rounded-xl px-6 transition-all duration-200"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Preferences Section ── */}
      <motion.div variants={fadeInUp} className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Moon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight">Preferences</h2>
        </div>

        <div className="space-y-6 max-w-md">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="rounded-xl flex-col h-20 gap-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="rounded-xl flex-col h-20 gap-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="rounded-xl flex-col h-20 gap-2"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">System</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>Study Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive daily practice reminders.</p>
            </div>
            {/* PHASE-2 TODO: Wire this up to actual push notifications when backend exists */}
            <Switch disabled />
          </div>
        </div>
      </motion.div>

      {/* ── Data Management Section ── */}
      <motion.div variants={fadeInUp} className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-bold tracking-tight text-destructive">Data Management</h2>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl border">
            Your data lives only in this browser and is not backed up anywhere else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={exportData} variant="outline" className="rounded-xl hover:bg-accent/5 hover:text-accent hover:border-accent/40 transition-all flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export Backup
            </Button>
            <Button
              onClick={() => setShowConfirmDialog(true)}
              variant="destructive"
              className="rounded-xl transition-all flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Local Data
            </Button>
          </div>

          {showConfirmDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-5 mt-4"
            >
              <h3 className="font-bold text-destructive mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-destructive/80 mb-4">
                This will permanently delete all your mock test attempts, bookmarks, and syllabus progress. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder="Type 'delete' to confirm"
                  value={confirmClear}
                  onChange={(e) => setConfirmClear(e.target.value)}
                  className="bg-background border-destructive/30 rounded-xl focus-visible:ring-destructive"
                />
                <Button
                  variant="destructive"
                  disabled={confirmClear.toLowerCase() !== "delete"}
                  onClick={clearAllData}
                  className="rounded-xl px-8"
                >
                  Confirm
                </Button>
                <Button variant="ghost" onClick={() => setShowConfirmDialog(false)} className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
