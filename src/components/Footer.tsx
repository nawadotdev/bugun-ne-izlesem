"use client";

import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo ve Açıklama */}
          <div className="text-center">
            <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Bugün Ne İzlesem
            </Link>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Film ve dizi tutkunları için özel olarak tasarlanmış platform
            </p>
          </div>

          {/* Sosyal Medya Linkleri */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/sudeataman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

          {/* Telif Hakkı ve Proje Bilgisi */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} Bugün Ne İzlesem. Tüm hakları saklıdır.
            </p>
            <p className="mt-1">
              Bu proje{" "}
              <a
                href="https://github.com/sudeataman"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 dark:text-slate-50 hover:underline"
              >
                Sude Ataman
              </a>{" "}
              tarafından bitirme projesi olarak geliştirilmiştir.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 