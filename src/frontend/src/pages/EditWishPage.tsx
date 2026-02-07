import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Heart, Loader2, Flower2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWish, useEditWish } from '../hooks/useWish';
import { useGetAllBouquets } from '../hooks/useBouquet';
import RomanticGifPicker from '../components/RomanticGifPicker';
import { DEFAULT_GIF } from '../lib/romanticGifs';
import { NO_BOUQUET_VALUE, bouquetIdToSelectValue, selectValueToBouquetId } from '../lib/bouquetSelect';

export default function EditWishPage() {
  const { wishId } = useParams({ from: '/wish/$wishId/edit' });
  const navigate = useNavigate();
  const { data: wish, isLoading: isLoadingWish, isError: isErrorWish } = useGetWish(wishId);
  const { data: bouquets } = useGetAllBouquets();
  const editWishMutation = useEditWish();

  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [bouquetId, setBouquetId] = useState<string>(NO_BOUQUET_VALUE);
  const [gifUrl, setGifUrl] = useState<string>(DEFAULT_GIF.url);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (wish) {
      setSenderName(wish.senderName);
      setRecipientName(wish.recipientName);
      setMessage(wish.message);
      setNote(wish.note || '');
      setBouquetId(bouquetIdToSelectValue(wish.bouquetId));
      setGifUrl(wish.gifUrl || DEFAULT_GIF.url);
    }
  }, [wish]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }
    if (!recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await editWishMutation.mutateAsync({
        id: BigInt(wishId),
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        message: message.trim(),
        bouquetId: selectValueToBouquetId(bouquetId),
        note: note.trim() || null,
        gifUrl: gifUrl || null,
      });
      
      navigate({ to: '/wish/$wishId', params: { wishId } });
    } catch (error) {
      console.error('Failed to edit wish:', error);
    }
  };

  if (isLoadingWish) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-2 border-rose-200 dark:border-rose-800">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorWish || !wish) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive" className="border-2">
          <Heart className="h-5 w-5" />
          <AlertDescription className="mt-2">
            The wish you're trying to edit doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/' })} className="bg-rose-600 hover:bg-rose-700">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <img
          src="/assets/generated/rose-ui-icons.dim_512x512.png"
          alt="Rose decorations"
          className="w-24 h-24 mx-auto mb-4 opacity-80"
        />
        <h1 className="text-4xl font-bold text-rose-800 dark:text-rose-200 mb-2">
          Edit Rose Day Wish
        </h1>
        <p className="text-rose-700 dark:text-rose-300">
          Update your heartfelt message
        </p>
      </div>

      <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">Edit Wish Details</CardTitle>
          <CardDescription className="text-rose-700 dark:text-rose-300">
            Update the details of your Rose Day wish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="senderName" className="text-rose-800 dark:text-rose-200">
                Your Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your name"
                className={`border-rose-300 dark:border-rose-700 ${errors.senderName ? 'border-red-500' : ''}`}
              />
              {errors.senderName && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.senderName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-rose-800 dark:text-rose-200">
                Recipient's Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's name"
                className={`border-rose-300 dark:border-rose-700 ${errors.recipientName ? 'border-red-500' : ''}`}
              />
              {errors.recipientName && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.recipientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-rose-800 dark:text-rose-200">
                Your Message <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt Rose Day message..."
                rows={6}
                className={`border-rose-300 dark:border-rose-700 resize-none ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
              )}
            </div>

            <RomanticGifPicker value={gifUrl} onChange={setGifUrl} />

            <div className="space-y-2">
              <Label htmlFor="bouquetId" className="text-rose-800 dark:text-rose-200 flex items-center gap-2">
                <Flower2 className="w-4 h-4" />
                Attach a Bouquet (Optional)
              </Label>
              <Select value={bouquetId} onValueChange={setBouquetId}>
                <SelectTrigger className="border-rose-300 dark:border-rose-700">
                  <SelectValue placeholder="Select a bouquet (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_BOUQUET_VALUE}>No bouquet</SelectItem>
                  {bouquets?.map((bouquet) => (
                    <SelectItem key={bouquet.id.toString()} value={bouquet.id.toString()}>
                      Bouquet #{bouquet.id.toString()} - {bouquet.flowers[0]?.color} {bouquet.flowers[0]?.flowerType}
                      {bouquet.creatorName ? ` by ${bouquet.creatorName}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Attach a bouquet to make your wish extra special
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-rose-800 dark:text-rose-200">
                Additional Note (Optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a short note or dedication..."
                rows={3}
                className="border-rose-300 dark:border-rose-700 resize-none"
              />
            </div>

            {editWishMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to update wish. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={editWishMutation.isPending}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-6 text-lg"
              >
                {editWishMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/wish/$wishId', params: { wishId } })}
                className="border-rose-600 text-rose-700 dark:text-rose-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
