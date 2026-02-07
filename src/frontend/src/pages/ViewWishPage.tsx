import { useParams, useNavigate } from '@tanstack/react-router';
import { Heart, Loader2, Home, Printer, Flower2, ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWish } from '../hooks/useWish';
import { useGetBouquet } from '../hooks/useBouquet';
import CopyLinkButton from '../components/CopyLinkButton';
import BouquetPreview from '../components/BouquetPreview';
import RomanticGif from '../components/RomanticGif';
import { buildWishShareUrl } from '../lib/shareLinks';
import { getGifByUrl } from '../lib/romanticGifs';

export default function ViewWishPage() {
  const { wishId } = useParams({ from: '/wish/$wishId' });
  const navigate = useNavigate();
  const { data: wish, isLoading, isError } = useGetWish(wishId);
  const { data: attachedBouquet, isLoading: isBouquetLoading, isError: isBouquetError } = useGetBouquet(
    wish?.bouquetId?.toString() || ''
  );

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-2 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !wish) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive" className="border-2">
          <Heart className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Wish Not Found</AlertTitle>
          <AlertDescription className="mt-2">
            The wish you're looking for doesn't exist or has been removed.
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

  const shareUrl = buildWishShareUrl(wishId);
  const selectedGif = getGifByUrl(wish.gifUrl);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Decorative romantic couple GIF */}
      <div className="no-print mb-6 flex justify-center">
        <RomanticGif
          src={selectedGif.url}
          alt={selectedGif.name}
          className="w-full max-w-sm rounded-2xl shadow-lg"
        />
      </div>

      <div className="no-print mb-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/wish/$wishId/edit', params: { wishId } })}
          className="border-rose-600 text-rose-700 dark:text-rose-300"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
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
            <Heart className="w-10 h-10 text-rose-600 dark:text-rose-400 fill-current" />
          </div>
          <h1 className="text-4xl font-bold text-rose-800 dark:text-rose-200 mb-2">
            Rose Day Wishes
          </h1>
          <p className="text-rose-600 dark:text-rose-400 text-lg">
            From {wish.senderName} to {wish.recipientName}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 py-10">
          <div className="bg-rose-50 dark:bg-rose-900/30 rounded-2xl p-8 border-2 border-rose-200 dark:border-rose-800">
            <p className="text-lg text-rose-800 dark:text-rose-200 leading-relaxed whitespace-pre-wrap">
              {wish.message}
            </p>
          </div>

          {wish.note && (
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
              <p className="text-sm font-medium text-pink-800 dark:text-pink-200 mb-2">
                Additional Note:
              </p>
              <p className="text-pink-700 dark:text-pink-300 italic">
                {wish.note}
              </p>
            </div>
          )}

          {/* Attached Bouquet Section */}
          {wish.bouquetId && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
                <Flower2 className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Attached Bouquet</h2>
              </div>
              
              {isBouquetLoading && (
                <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-6 border border-rose-200 dark:border-rose-800">
                  <Skeleton className="h-32 w-full" />
                </div>
              )}

              {isBouquetError && (
                <Alert className="border-rose-300 dark:border-rose-700">
                  <AlertDescription className="text-rose-700 dark:text-rose-300">
                    The attached bouquet could not be loaded. It may have been removed.
                  </AlertDescription>
                </Alert>
              )}

              {attachedBouquet && (
                <div className="space-y-4">
                  <BouquetPreview bouquet={attachedBouquet} />
                  
                  <div className="no-print flex justify-center">
                    <Button
                      onClick={() => navigate({ to: '/bouquet/$bouquetId', params: { bouquetId: wish.bouquetId!.toString() } })}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Bouquet
                    </Button>
                  </div>
                </div>
              )}
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
          Create Your Own Wish
        </Button>
      </div>
    </div>
  );
}
