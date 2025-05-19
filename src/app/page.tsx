import React from 'react'
import TrendSection from '@/components/TrendSection'
import MovieList from '@/components/MovieList'
import TVShowList from '@/components/TVShowList'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const page = () => {
  return (
    <main className="min-h-screen">
      <div className="w-full py-12 bg-gradient-to-b from-blue-50 to-slate-50 dark:from-blue-950 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Bugün Ne İzlesem?
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Film ve dizilerin dünyasına hoş geldiniz. Size özel önerilerimizi keşfedin.
            </p>
            <Link
              href="/discover"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <span>Bugün Ne İzlesem?</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <TrendSection />
      <MovieList />
      <TVShowList />
      {/* Diğer bölümler buraya eklenecek */}
    </main>
  )
}

export default page