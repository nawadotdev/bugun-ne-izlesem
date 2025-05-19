import { useUser } from '../../context/UserContext'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { User, List, LogOut } from 'lucide-react'
import Image from 'next/image'

const DesktopNavbar = () => {
  const { user, logout } = useUser()
  return (
    <div className='hidden md:flex'>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium flex items-center gap-2">
              {user.image ? (
                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              )}
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            
            
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
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Button variant='outline' className='text-sm ml-2'>
            <Link href="/auth/login">
              Giriş Yap
            </Link>
          </Button>
          <Button variant='outline' className='text-sm ml-2'>
            <Link href="/auth/register">
              Kayıt Ol
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default DesktopNavbar