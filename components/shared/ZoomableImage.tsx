"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 bg-muted/50 border border-dashed rounded-lg text-muted-foreground", className)}>
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm font-medium">Diagram Unavailable</span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <div className={cn("relative group cursor-zoom-in rounded-lg overflow-hidden border bg-white/5", className)} />
        }
      >
        {/* Using img for simpler phase 1 rather than Next.js Image to avoid strict size requirements unless we know them */}
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="object-contain w-full h-auto max-h-[300px]"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
          <div className="bg-background/80 p-2 rounded-full shadow-sm backdrop-blur-sm">
            <ZoomIn className="w-5 h-5 text-foreground" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
        <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center bg-black/50 rounded-lg overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="object-contain w-full h-full max-h-[90vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
