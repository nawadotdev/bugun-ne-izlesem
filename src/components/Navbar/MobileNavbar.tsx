"use client";

import { useState } from "react";
import { useUser } from '@/context/UserContext';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Menu, User, List, LogOut, ChevronDown, X, Search } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import SearchBar from "../SearchBar";

const MobileNavbar = () => {
  const { user, logout } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center gap-4">
        {!isSearchOpen ? (
          <>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-500"
            >
              <Search className="w-6 h-6" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-700 dark:text-slate-300">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>BugünNeİzlesem</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Kullanıcı Menüsü */}
                {user ? (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Listelerim</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/watchlist" className="flex items-center cursor-pointer">
                          <List className="mr-2 h-4 w-4" />
                          <span>İzleme Listem</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center cursor-pointer">
                          <List className="mr-2 h-4 w-4" />
                          <span>Favorilerim</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Hesap</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profilim</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="cursor-pointer">
                        Giriş Yap
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="cursor-pointer">
                        Kayıt Ol
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 flex items-center px-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-4 text-slate-700 dark:text-slate-300 hover:text-slate-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileNavbar;