import { useNavigate } from '@tanstack/react-router';
import { Heart, Flower2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RomanticGif from '../components/RomanticGif';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 via-pink-400/20 to-red-400/20 blur-3xl -z-10" />
          
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-shrink-0">
              <RomanticGif
                src="/assets/generated/couple-romance-hero.dim_900x600.gif"
                alt="Romantic couple celebrating together"
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              />
            </div>
            <div className="flex-shrink-0">
              <img
                src="/assets/generated/rose-mouse-hero.dim_1600x900.png"
                alt="Cute mouse with roses"
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-rose-800 dark:text-rose-200 mb-4 leading-tight">
            Celebrate Rose Day with Love
          </h1>
          <p className="text-lg sm:text-xl text-rose-700 dark:text-rose-300 mb-8 max-w-2xl mx-auto">
            Create heartfelt wishes and beautiful bouquets to share with your loved ones
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/create-wish' })}
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Heart className="w-5 h-5 mr-2" />
              Create a Rose Day Wish
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/bouquet-maker' })}
              className="border-2 border-rose-600 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Flower2 className="w-5 h-5 mr-2" />
              Make an Online Bouquet
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/80 dark:bg-rose-950/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400 fill-current" />
            </div>
            <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">Send Heartfelt Wishes</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Create personalized Rose Day wishes with your message and share them with a unique link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-rose-700 dark:text-rose-300">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Personalized sender and recipient names</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Custom heartfelt messages</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Choose romantic couple GIFs</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Attach a beautiful bouquet</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Shareable links and print-friendly</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/80 dark:bg-rose-950/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mb-4">
              <Flower2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">Design Your Bouquet</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Create a custom virtual bouquet with your choice of flowers, colors, and wrapping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-rose-700 dark:text-rose-300">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Choose flower types and colors</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Customize wrapping and ribbons</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Add a greeting card message</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Hide secret messages in flowers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
