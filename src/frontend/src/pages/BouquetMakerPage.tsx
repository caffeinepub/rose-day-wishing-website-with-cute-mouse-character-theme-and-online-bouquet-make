import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Flower2, Loader2, Plus, Minus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useCreateBouquet } from '../hooks/useBouquet';
import CopyLinkButton from '../components/CopyLinkButton';
import BouquetPreview from '../components/BouquetPreview';
import { buildBouquetShareUrl } from '../lib/shareLinks';
import { FLOWER_TYPES, FLOWER_COLORS, WRAPPING_STYLES, RIBBON_STYLES } from '../lib/bouquetOptions';
import type { Flower, BouquetSecret } from '../backend';

export default function BouquetMakerPage() {
  const navigate = useNavigate();
  const [flowerType, setFlowerType] = useState(FLOWER_TYPES[0]);
  const [flowerColor, setFlowerColor] = useState(FLOWER_COLORS[0]);
  const [quantity, setQuantity] = useState(12);
  const [wrappingStyle, setWrappingStyle] = useState(WRAPPING_STYLES[0]);
  const [ribbonStyle, setRibbonStyle] = useState(RIBBON_STYLES[0]);
  const [cardMessage, setCardMessage] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [hasSecret, setHasSecret] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [includeSecretImage, setIncludeSecretImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdBouquetId, setCreatedBouquetId] = useState<string | null>(null);

  const createBouquetMutation = useCreateBouquet();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (quantity < 1) {
      newErrors.quantity = 'Please add at least one flower';
    }
    if (quantity > 100) {
      newErrors.quantity = 'Maximum 100 flowers allowed';
    }
    if (hasSecret && !secretMessage.trim()) {
      newErrors.secretMessage = 'Please enter a secret message or disable the secret';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const flowers: Flower[] = [{
      flowerType,
      color: flowerColor,
      quantity: BigInt(quantity),
    }];

    let secret: BouquetSecret | null = null;
    if (hasSecret && secretMessage.trim()) {
      secret = {
        flowerType,
        secretMessage: secretMessage.trim(),
        secretImageUrl: includeSecretImage ? '/assets/generated/secret-reveal-icon.dim_512x512.png' : undefined,
      };
    }

    try {
      const bouquetId = await createBouquetMutation.mutateAsync({
        flowers,
        wrappingStyle,
        ribbonStyle,
        cardMessage: cardMessage.trim() || null,
        creatorName: creatorName.trim() || null,
        secret,
      });
      
      setCreatedBouquetId(bouquetId.toString());
    } catch (error) {
      console.error('Failed to create bouquet:', error);
    }
  };

  if (createdBouquetId) {
    const shareUrl = buildBouquetShareUrl(createdBouquetId);
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flower2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <CardTitle className="text-3xl text-rose-800 dark:text-rose-200">Bouquet Created!</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Your beautiful bouquet is ready to share
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

            {hasSecret && (
              <Alert className="border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30">
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-rose-700 dark:text-rose-300">
                  Your bouquet contains a secret! Recipients can click on the {flowerType.toLowerCase()} flowers to reveal it.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate({ to: '/bouquet/$bouquetId', params: { bouquetId: createdBouquetId } })}
                className="flex-1 bg-rose-600 hover:bg-rose-700"
              >
                View Bouquet
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatedBouquetId(null);
                  setQuantity(12);
                  setCardMessage('');
                  setCreatorName('');
                  setHasSecret(false);
                  setSecretMessage('');
                  setIncludeSecretImage(false);
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

  const currentBouquet = {
    flowers: [{
      flowerType,
      color: flowerColor,
      quantity: BigInt(quantity),
    }],
    wrappingStyle,
    ribbonStyle,
    cardMessage: cardMessage || undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <img
          src="/assets/generated/bouquet-set.dim_1600x1200.png"
          alt="Bouquet designs"
          className="w-32 h-24 mx-auto mb-4 object-contain opacity-80"
        />
        <h1 className="text-4xl font-bold text-rose-800 dark:text-rose-200 mb-2">
          Create Your Bouquet
        </h1>
        <p className="text-rose-700 dark:text-rose-300">
          Design a beautiful virtual bouquet to share
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-800 dark:text-rose-200">Bouquet Details</CardTitle>
            <CardDescription className="text-rose-700 dark:text-rose-300">
              Customize your bouquet with your preferred options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="flowerType" className="text-rose-800 dark:text-rose-200">
                  Flower Type
                </Label>
                <Select value={flowerType} onValueChange={setFlowerType}>
                  <SelectTrigger className="border-rose-300 dark:border-rose-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOWER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flowerColor" className="text-rose-800 dark:text-rose-200">
                  Flower Color
                </Label>
                <Select value={flowerColor} onValueChange={setFlowerColor}>
                  <SelectTrigger className="border-rose-300 dark:border-rose-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOWER_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-rose-800 dark:text-rose-200">
                  Quantity
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-rose-300 dark:border-rose-700"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className={`text-center border-rose-300 dark:border-rose-700 ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    className="border-rose-300 dark:border-rose-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {errors.quantity && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wrappingStyle" className="text-rose-800 dark:text-rose-200">
                  Wrapping Style
                </Label>
                <Select value={wrappingStyle} onValueChange={setWrappingStyle}>
                  <SelectTrigger className="border-rose-300 dark:border-rose-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WRAPPING_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ribbonStyle" className="text-rose-800 dark:text-rose-200">
                  Ribbon Style
                </Label>
                <Select value={ribbonStyle} onValueChange={setRibbonStyle}>
                  <SelectTrigger className="border-rose-300 dark:border-rose-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RIBBON_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardMessage" className="text-rose-800 dark:text-rose-200">
                  Greeting Card Message (Optional)
                </Label>
                <Textarea
                  id="cardMessage"
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Add a special message..."
                  rows={4}
                  className="border-rose-300 dark:border-rose-700 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creatorName" className="text-rose-800 dark:text-rose-200">
                  Your Name (Optional)
                </Label>
                <Input
                  id="creatorName"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-rose-300 dark:border-rose-700"
                />
              </div>

              {/* Secret Configuration */}
              <div className="space-y-4 pt-4 border-t border-rose-200 dark:border-rose-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasSecret" className="text-rose-800 dark:text-rose-200 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Add Secret Message
                    </Label>
                    <p className="text-xs text-rose-600 dark:text-rose-400">
                      Hide a secret message in your {flowerType.toLowerCase()} flowers
                    </p>
                  </div>
                  <Switch
                    id="hasSecret"
                    checked={hasSecret}
                    onCheckedChange={setHasSecret}
                  />
                </div>

                {hasSecret && (
                  <div className="space-y-4 pl-6 border-l-2 border-rose-300 dark:border-rose-700">
                    <div className="space-y-2">
                      <Label htmlFor="secretMessage" className="text-rose-800 dark:text-rose-200">
                        Secret Message <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        id="secretMessage"
                        value={secretMessage}
                        onChange={(e) => setSecretMessage(e.target.value)}
                        placeholder="Enter your secret message..."
                        rows={3}
                        className={`border-rose-300 dark:border-rose-700 resize-none ${errors.secretMessage ? 'border-red-500' : ''}`}
                      />
                      {errors.secretMessage && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.secretMessage}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="includeSecretImage" className="text-rose-800 dark:text-rose-200">
                          Include Secret Image
                        </Label>
                        <p className="text-xs text-rose-600 dark:text-rose-400">
                          Add a special reveal icon
                        </p>
                      </div>
                      <Switch
                        id="includeSecretImage"
                        checked={includeSecretImage}
                        onCheckedChange={setIncludeSecretImage}
                      />
                    </div>
                  </div>
                )}
              </div>

              {createBouquetMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create bouquet. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createBouquetMutation.isPending}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-6 text-lg"
                >
                  {createBouquetMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Flower2 className="w-5 h-5 mr-2" />
                      Create Bouquet
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

        {/* Preview Section */}
        <div className="lg:sticky lg:top-24 h-fit">
          <BouquetPreview bouquet={currentBouquet} />
        </div>
      </div>
    </div>
  );
}
