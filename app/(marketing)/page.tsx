"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BarChart2, Clock, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeIn: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* ── Navbar ── */}
      <header className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between border-b border-border/40">
        <Link href="/" className="flex items-center">
          <span className="font-heading text-2xl tracking-tight text-foreground">
            GATE
          </span>
          <span className="font-heading text-2xl gradient-text tracking-tight">
            Prep
          </span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-foreground transition-colors">Stats</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-lg">Log in</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="gradient-bg text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative pt-24 pb-32 md:pt-36 md:pb-44 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 rounded-full blur-[150px]" style={{ background: "radial-gradient(circle, rgba(0,82,255,0.3) 0%, transparent 70%)" }} />
          </div>

          <motion.div
            className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Section label */}
            <motion.div className="flex justify-center mb-8" variants={fadeIn}>
              <div className="section-label">
                <span className="h-2 w-2 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="section-label-text">GATE CS 2026</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-heading text-[2.75rem] md:text-6xl lg:text-[5.25rem] tracking-tight mb-8 leading-[1.05]"
              variants={fadeInUp}
            >
              Crack GATE with{" "}
              <span className="relative inline-block">
                <span className="gradient-text">confidence</span>
                {/* Gradient underline bar */}
                <span
                  className="absolute -bottom-1 md:-bottom-2 left-0 h-3 md:h-4 w-full rounded-sm"
                  style={{ background: "linear-gradient(to right, rgba(0,82,255,0.15), rgba(77,124,255,0.1))" }}
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              The most advanced, realistic CBT simulation platform for GATE CS.
              Master topics, track analytics, and ace the exam with full-length mock tests.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-xl gradient-bg text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-lg)] active:scale-[0.98] w-full sm:w-auto group"
                >
                  Start Practicing
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-xl w-full sm:w-auto border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
                >
                  View Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Feature Bento Grid ── */}
        <section id="features" className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div className="flex justify-center mb-6" variants={fadeIn}>
                <div className="section-label">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="section-label-text">Features</span>
                </div>
              </motion.div>
              <motion.h2
                className="font-heading text-3xl md:text-[3.25rem] tracking-tight mb-4"
                variants={fadeInUp}
              >
                Everything you need to{" "}
                <span className="gradient-text">succeed</span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-xl mx-auto"
                variants={fadeInUp}
              >
                A comprehensive toolkit designed specifically for GATE aspirants to maximize their scoring potential.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              <motion.div
                className="md:col-span-2 bg-card rounded-2xl p-8 border shadow-md relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                variants={fadeInUp}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}>
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Realistic Mock Tests</h3>
                  <p className="text-muted-foreground">Experience the exact GATE CBT interface. Virtual calculator, palettes, MSQ, NAT, and negative marking fully supported.</p>
                </div>
              </motion.div>

              <motion.div
                className="bg-card rounded-2xl p-8 border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}>
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Deep Analytics</h3>
                <p className="text-muted-foreground text-sm">Identify weak areas and track your accuracy over time.</p>
              </motion.div>

              <motion.div
                className="bg-card rounded-2xl p-8 border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}>
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Time Management</h3>
                <p className="text-muted-foreground text-sm">Analyze time spent per question to optimize speed.</p>
              </motion.div>

              <motion.div
                className="md:col-span-2 bg-card rounded-2xl p-8 border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                variants={fadeInUp}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}>
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Revision Mode & Bookmarks</h3>
                <p className="text-muted-foreground">Auto-generated sets of your frequently incorrectly answered questions and custom bookmarks.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats Section (Inverted) ── */}
        <section id="stats" className="relative py-28 overflow-hidden" style={{ background: "var(--foreground)" }}>
          {/* Dot pattern texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              opacity: 0.03,
            }}
          />

          <motion.div
            className="container relative z-10 mx-auto px-4 md:px-8 max-w-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={stagger}
            >
              {[
                { value: "10k+", label: "Questions" },
                { value: "50+", label: "Mock Tests" },
                { value: "99%", label: "Success Rate" },
                { value: "24/7", label: "Availability" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp}>
                  <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-white/60 uppercase font-mono tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-28">
          <motion.div
            className="container mx-auto px-4 text-center max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div className="flex justify-center mb-6" variants={fadeIn}>
              <div className="section-label">
                <span className="h-2 w-2 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="section-label-text">Get Started</span>
              </div>
            </motion.div>

            <motion.h2
              className="font-heading text-3xl md:text-[3.25rem] tracking-tight mb-6"
              variants={fadeInUp}
            >
              Ready to start your{" "}
              <span className="gradient-text">journey</span>?
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join thousands of successful GATE aspirants who cracked the exam with our platform.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg rounded-xl gradient-bg text-white font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-lg)] active:scale-[0.98] group"
                >
                  Start Practicing Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2026 GATEPrep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
