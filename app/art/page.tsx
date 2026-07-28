"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ImageIcon, X } from "lucide-react";
import MouseTrail from "../../components/MouseTrail";

const artworks = [
  {
    title: "Downstream",
    images: ["/art-000.jpg"],
    medium: "Acrylic on canvas",
    date: "",
    meaning: "I painted this at a sip-and-paint party, where it was voted second best in the group. Looking at it reminds me of friends, and what friends bring to your life. A day (and night) I'll never forget 🌚.",
  },
  {
    title: "Wildflowers",
    images: ["/art-001.jpg"],
    medium: "Acrylic on canvas",
    date: "",
    meaning: "I painted this with my friend Anzy. This one is mine. The piece she started became 'The Clearing'. Just another painting we made for the fun of it, enjoying each other's company.",
  },
  {
    title: "The Clearing",
    images: ["/art-002.jpg"],
    medium: "Acrylic on canvas",
    date: "",
    meaning: "This started as Anzy's painting. Many might think I destroyed her work, but to me I only added to it. It's a reminder that there's always light at the end of the tunnel. No matter how dark the forest you walk through, you'll always come out the other side and find yourself on a beautiful plain.",
  },
  {
    title: "What???",
    images: ["/art-003.jpg"],
    medium: "Marker on paper",
    date: "",
    meaning: "Honestly? Even I'm not sure. A spontaneous marker doodle with no plan and no meaning, just colours and shapes for the fun of it.",
  },
  {
    title: "Out my window",
    images: ["/art-004.jpg"],
    medium: "Acrylic on canvas",
    date: "",
    meaning: "A view from my window, somewhere in Kanda.",
  },
  {
    title: "Family House",
    images: ["/art-005.jpg"],
    medium: "Acrylic on canvas",
    date: "",
    meaning: "The family house, the place that holds everyone together. All the colour, warmth, and life of home in a single frame.",
  },
  {
    title: "Lady",
    images: ["/art-006.jpg"],
    medium: "Oil pastel on paper",
    date: "",
    meaning: "A quiet portrait of a lady at rest, caught in a still, peaceful moment, somewhere between waking and sleep.",
  },
];

type Preview = { src: string; alt: string };

const ArtImage = ({
  src,
  alt,
  onOpen,
}: {
  src: string;
  alt: string;
  onOpen: (preview: Preview) => void;
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onClick={() => onOpen({ src, alt })}
        className="w-full h-auto rounded-2xl cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
      />
    );
  }
  return (
    <div className="w-full aspect-[3/4] rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center">
      <ImageIcon className="w-8 h-8 text-black/30" strokeWidth={1.5} />
    </div>
  );
};

const ArtCard = ({
  title,
  images,
  medium,
  date,
  meaning,
  onOpen,
}: {
  title: string;
  images: string[];
  medium: string;
  date: string;
  meaning: string;
  onOpen: (preview: Preview) => void;
}) => {
  const meta = [medium, date].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col">
      <div className={images.length > 1 ? "grid grid-cols-2 gap-3" : ""}>
        {images.map((src, i) => (
          <ArtImage
            key={i}
            src={src}
            alt={`${title} image ${i + 1}`}
            onOpen={onOpen}
          />
        ))}
      </div>

      <h3 className="text-2xl font-bold runde-bold text-black mt-4">{title}</h3>
      {meta && (
        <p className="text-sm runde-medium text-black/40 mt-1">{meta}</p>
      )}
      <p className="text-base runde-regular text-black/50 leading-relaxed mt-2">
        {meaning}
      </p>
    </div>
  );
};

const Lightbox = ({
  preview,
  onClose,
}: {
  preview: Preview;
  onClose: () => void;
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in"
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      <img
        src={preview.src}
        alt={preview.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-2xl"
      />
    </div>
  );
};

const ArtPage = () => {
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  return (
    <div className="w-full min-h-screen background-plain">
      <MouseTrail />

      <div className="flex flex-col w-full md:max-w-md mx-auto pt-36 px-8 md:px-0 pb-24">
        <Link
          href="/"
          className="text-sm runde-medium text-black/50 hover:text-black transition-colors mb-10"
        >
          ← back
        </Link>

        <p className="text-xl runde-medium text-black/70">Art</p>
        <h1 className="text-5xl font-bold runde-bold text-black mb-4">
          Things I make, and what they mean
        </h1>
        <p className="text-base runde-regular text-black/80 leading-relaxed">
          A collection of paintings and drawings I've made. Tap any piece to see
          it up close. I'll be adding what each one means over time.
        </p>

        <div className="space-y-16 mt-16">
          {artworks.map((art, index) => (
            <ArtCard key={index} {...art} onOpen={setPreview} />
          ))}
        </div>
      </div>

      {preview && <Lightbox preview={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

export default ArtPage;
