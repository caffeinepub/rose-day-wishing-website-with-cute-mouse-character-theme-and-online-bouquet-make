import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Heart, Loader2, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateWish } from '../hooks/useWish';
import { useGetAllBouquets } from '../hooks/useBouquet';
import CopyLinkButton from '../components/CopyLinkButton';
import RomanticGifPicker from '../components/RomanticGifPicker';
import { buildWishShareUrl } from '../lib/shareLinks';
import { DEFAULT_GIF } from '../lib/romanticGifs';
import { NO_BOUQUET_VALUE, selectValueToBouquetId } from '../lib/bouquetSelect';

export default function CreateWishPage() {
  const navigate = useNavigate();
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [bouquetId, setBouquetId] = useState<string>(NO_BOUQUET_VALUE);
  const [gifUrl, setGifUrl] = useState<string>(DEFAULT_GIF.url);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdWishId, setCreatedWishId] = useState<string | null>(null);

  const createWishMutation = useCreateWish();
  const { data: bouquets } = useGetAllBouquets();

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
      const wishId = await createWishMutation.mutateAsync({
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        message: message.trim(),
        bouquetId: selectValueToBouquetId(bouquetId),
        note: note.trim() || null,
        gifUrl: gifUrl || null,
      });
      
      setCreatedWishId(wishId.toString());
    } catch (error) {
      console.error('Failed to create wish:', error);
    }
  };

  if (createdWishId) {
    const shareUrl = buildWishShareUrl(createdWishId);
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-rose-600 dark:text-rose-400 fill-current" />
            </div>
            <CardTitle className="text-3xl text-rose-800 dark:text-rose-200">Wish Created Successfully!</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Your Rose Day wish has been created. Share it with your loved one!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
              <Label className="text-sm font-medium text-rose-700 dark:text-rose-300 mb-2 block">
                Share this link:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-white dark:bg-rose-950 border-rose-300 dark:border-rose-700"
                />
                <CopyLinkButton url={shareUrl} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate({ to: '/wish/$wishId', params: { wishId: createdWishId } })}
                className="flex-1 bg-rose-600 hover:bg-rose-700"
              >
                View Wish
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatedWishId(null);
                  setSenderName('');
                  setRecipientName('');
                  setMessage('');
                  setNote('');
                  setBouquetId(NO_BOUQUET_VALUE);
                  setGifUrl(DEFAULT_GIF.url);
                  setErrors({});
                }}
                className="flex-1 border-rose-600 text-rose-700 dark:text-rose-300"
              >
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
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
          Create a Rose Day Wish
        </h1>
        <p className="text-rose-700 dark:text-rose-300">
          Send a heartfelt message to someone special
        </p>
      </div>

      <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">Your Wish Details</CardTitle>
          <CardDescription className="text-rose-700 dark:text-rose-300">
            Fill in the details below to create your personalized Rose Day wish
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

            {createWishMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to create wish. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createWishMutation.isPending}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-6 text-lg"
              >
                {createWishMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Create Wish
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="border-rose-600 text-rose-700 dark:text-rose-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
