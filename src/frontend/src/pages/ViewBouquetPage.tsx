import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Flower2, Home, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBouquet } from '../hooks/useBouquet';
import CopyLinkButton from '../components/CopyLinkButton';
import BouquetPreview from '../components/BouquetPreview';
import SecretReveal from '../components/SecretReveal';
import RomanticGif from '../components/RomanticGif';
import { buildBouquetShareUrl } from '../lib/shareLinks';
import { DEFAULT_GIF } from '../lib/romanticGifs';

export default function ViewBouquetPage() {
  const { bouquetId } = useParams({ from: '/bouquet/$bouquetId' });
  const navigate = useNavigate();
  const { data: bouquet, isLoading, isError } = useGetBouquet(bouquetId);
  const [revealedSecret, setRevealedSecret] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleFlowerClick = (flowerType: string) => {
    if (bouquet?.secret && bouquet.secret.flowerType === flowerType) {
      setRevealedSecret(true);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-2 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !bouquet) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive" className="border-2">
          <Flower2 className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Bouquet Not Found</AlertTitle>
          <AlertDescription className="mt-2">
            The bouquet you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/' })} className="bg-rose-600 hover:bg-rose-700">
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl = buildBouquetShareUrl(bouquetId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Decorative romantic couple GIF */}
      <div className="no-print mb-6 flex justify-center">
        <RomanticGif
          src={DEFAULT_GIF.url}
          alt={DEFAULT_GIF.name}
          className="w-full max-w-sm rounded-2xl shadow-lg"
        />
      </div>

      <div className="no-print mb-6 flex justify-end gap-2">
        <CopyLinkButton url={shareUrl} />
        <Button
          variant="outline"
          onClick={handlePrint}
          className="border-rose-600 text-rose-700 dark:text-rose-300"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/95 dark:bg-rose-950/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-8 pt-12 bg-gradient-to-b from-rose-100/50 to-transparent dark:from-rose-900/30">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flower2 className="w-10 h-10 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="text-4xl font-bold text-rose-800 dark:text-rose-200 mb-2">
            Your Rose Day Bouquet
          </h1>
          {bouquet.creatorName && (
            <p className="text-rose-600 dark:text-rose-400 text-lg">
              Created by {bouquet.creatorName}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 py-10">
          <BouquetPreview 
            bouquet={bouquet} 
            interactive={!!bouquet.secret}
            onFlowerClick={handleFlowerClick}
          />

          {bouquet.secret && (
            <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-6 border border-rose-200 dark:border-rose-800 text-center">
              <p className="text-sm text-rose-700 dark:text-rose-300 mb-2">
                💡 <strong>Hint:</strong> Click on the {bouquet.secret.flowerType} flowers to reveal a secret message!
              </p>
            </div>
          )}

          {bouquet.cardMessage && (
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-2xl p-8 border-2 border-pink-200 dark:border-pink-800">
              <p className="text-sm font-medium text-pink-800 dark:text-pink-200 mb-3 text-center">
                Greeting Card Message
              </p>
              <p className="text-lg text-pink-700 dark:text-pink-300 leading-relaxed text-center italic">
                {bouquet.cardMessage}
              </p>
            </div>
          )}

          <div className="text-center pt-6 border-t border-rose-200 dark:border-rose-800">
            <p className="text-sm text-rose-600 dark:text-rose-400 italic">
              Happy Rose Day! 🌹
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="no-print mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/' })}
          className="border-rose-600 text-rose-700 dark:text-rose-300"
        >
          <Home className="w-4 h-4 mr-2" />
          Create Your Own Bouquet
        </Button>
      </div>

      {bouquet.secret && (
        <SecretReveal
          open={revealedSecret}
          onOpenChange={setRevealedSecret}
          secret={bouquet.secret}
        />
      )}
    </div>
  );
}
