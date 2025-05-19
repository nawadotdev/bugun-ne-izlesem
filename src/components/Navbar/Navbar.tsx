"use client";

import { useState, useEffect } from "react";
import DesktopNavbar from "@/components/Navbar/DesktopNavbar";
import MobileNavbar from "@/components/Navbar/MobileNavbar";
import SearchBar from "../SearchBar";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center md:w-1/4 w-1/2">
          <a href="/" className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Bugün Ne İzlesem
          </a>
        </div>
        <div className="hidden md:flex items-center justify-center w-2/4 space-x-4">
          <SearchBar />
        </div>
        <div className="w-1/4 flex justify-end">
          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
} 