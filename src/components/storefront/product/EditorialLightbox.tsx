"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface EditorialLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export function EditorialLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: EditorialLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync initialIndex when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = "";
      window.__lenis?.start();
    }
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation: ESC, Left, Right
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-near-black/95 text-off-white flex flex-col justify-between select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image View"
      onClick={onClose}
    >
      {/* 1. MINIMAL TOP BAR: COUNTER & CLOSE ONLY */}
      <div className="w-full site-padding-x py-5 flex items-center justify-between z-20 pointer-events-none">
        {/* Subtle Counter */}
        <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gray pointer-events-auto">
          {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>

        {/* Minimal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-off-white/70 hover:text-off-white transition-colors cursor-pointer pointer-events-auto"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. FULLSCREEN PURE IMAGE STAGE */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-5xl max-h-[86vh]">
          <Image
            src={currentImage}
            alt="Product view"
            fill
            quality={95}
            sizes="100vw"
            priority
            className="object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Previous Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 text-off-white/50 hover:text-off-white hover:bg-white/5 transition-all cursor-pointer z-30"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Image Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 text-off-white/50 hover:text-off-white hover:bg-white/5 transition-all cursor-pointer z-30"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* 3. SUBTLE BOTTOM PADDING (EMPTY TO KEEP SCREEN ZERO-CLUTTER) */}
      <div className="w-full py-3 pointer-events-none" />
    </div>
  );
}
