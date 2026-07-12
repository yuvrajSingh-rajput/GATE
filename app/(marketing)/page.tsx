"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BarChart3, Clock, BrainCircuit, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* Navbar */}
      <header className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between border-b border-border/40">
        <div className="font-bold text-2xl tracking-tight text-primary">GATEPrep</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="shadow-glow">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
          {/* Aceternity style blurred background orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent blur-[120px] mix-blend-screen" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Crack GATE with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-cyan-500">confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The most advanced, realistic CBT simulation platform for GATE CS. Master topics, track analytics, and ace the exam with premium mock tests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-glow w-full sm:w-auto">
                  Start Practicing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl w-full sm:w-auto">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to succeed</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">A comprehensive toolkit designed specifically for GATE aspirants to maximize their scoring potential.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              <div className="md:col-span-2 bg-card rounded-3xl p-8 border shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <BrainCircuit className="h-10 w-10 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-3">Realistic Mock Tests</h3>
                <p className="text-muted-foreground">Experience the exact GATE CBT interface. Virtual calculator, palettes, MSQ, NAT, and negative marking fully supported.</p>
              </div>
              <div className="bg-card rounded-3xl p-8 border shadow-sm">
                <BarChart2 className="h-10 w-10 text-accent mb-6" />
                <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
                <p className="text-muted-foreground text-sm">Identify weak areas and track your accuracy over time.</p>
              </div>
              <div className="bg-card rounded-3xl p-8 border shadow-sm">
                <Clock className="h-10 w-10 text-warning mb-6" />
                <h3 className="text-xl font-bold mb-3">Time Management</h3>
                <p className="text-muted-foreground text-sm">Analyze time spent per question to optimize speed.</p>
              </div>
              <div className="md:col-span-2 bg-card rounded-3xl p-8 border shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-success mb-6" />
                <h3 className="text-2xl font-bold mb-3">Revision Mode & Bookmarks</h3>
                <p className="text-muted-foreground">Auto-generated sets of your frequently incorrectly answered questions and custom bookmarks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">10k+</div>
                <div className="text-sm font-medium text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50+</div>
                <div className="text-sm font-medium text-muted-foreground">Mock Tests</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">99%</div>
                <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">Availability</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section id="pricing" className="py-24 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to start your journey?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of successful GATE aspirants who cracked the exam with our platform.
            </p>
            <div className="inline-block bg-background/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8">
              <span className="font-semibold">Pro Plans starting at ₹999/mo (Coming Soon)</span>
            </div>
            <div>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-xl text-primary font-bold">
                  Try for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 GATEPrep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
