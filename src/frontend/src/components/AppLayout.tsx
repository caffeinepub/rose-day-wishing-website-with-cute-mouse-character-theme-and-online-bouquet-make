import { Link, useNavigate } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950 dark:via-pink-950 dark:to-red-950">
      <div className="rose-pattern-overlay" />
      
      <header className="sticky top-0 z-50 w-full border-b border-rose-200/50 dark:border-rose-800/50 bg-white/80 dark:bg-rose-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
              <Heart className="w-7 h-7 fill-current" />
              <span className="hidden sm:inline">Rose Day</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/' })}
                className="text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/create-wish' })}
                className="text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100"
              >
                Create Wish
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/bouquet-maker' })}
                className="text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100"
              >
                Bouquet Maker
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-rose-200/50 dark:border-rose-800/50 bg-white/60 dark:bg-rose-950/60 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-rose-700 dark:text-rose-300">
          <p>
            © 2026. Built with <Heart className="inline w-4 h-4 fill-current text-rose-500 mx-1" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-rose-900 dark:hover:text-rose-100 transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
