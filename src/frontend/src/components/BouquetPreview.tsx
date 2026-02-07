import { Card, CardContent } from '@/components/ui/card';
import type { Bouquet, Flower } from '../backend';

interface BouquetPreviewProps {
  bouquet: {
    flowers: Flower[];
    wrappingStyle: string;
    ribbonStyle: string;
    cardMessage?: string;
  };
  interactive?: boolean;
  onFlowerClick?: (flowerType: string) => void;
}

export default function BouquetPreview({ bouquet, interactive = false, onFlowerClick }: BouquetPreviewProps) {
  const totalFlowers = bouquet.flowers.reduce((sum, flower) => sum + Number(flower.quantity), 0);
  const primaryFlower = bouquet.flowers[0];

  const handleFlowerClick = () => {
    if (interactive && onFlowerClick && primaryFlower) {
      onFlowerClick(primaryFlower.flowerType);
    }
  };

  return (
    <Card className="border-2 border-rose-200 dark:border-rose-800 bg-white/90 dark:bg-rose-950/90 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-rose-800 dark:text-rose-200 mb-6">
            {interactive ? 'Your Bouquet' : 'Live Preview'}
          </h3>

          {/* Visual Bouquet Representation */}
          <div className="relative bg-gradient-to-b from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl p-8 min-h-[300px] flex items-center justify-center border-2 border-rose-300 dark:border-rose-700">
            <div className="relative">
              {/* Flower arrangement visualization */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Array.from({ length: Math.min(totalFlowers, 9) }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={handleFlowerClick}
                    disabled={!interactive}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl animate-pulse ${
                      interactive 
                        ? 'cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2' 
                        : 'cursor-default'
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      backgroundColor: getColorHex(primaryFlower?.color || 'Red'),
                    }}
                    aria-label={interactive ? `Click to reveal secret in ${primaryFlower?.flowerType}` : undefined}
                  >
                    🌹
                  </button>
                ))}
              </div>
              
              {totalFlowers > 9 && (
                <div className="text-rose-700 dark:text-rose-300 text-sm font-medium">
                  + {totalFlowers - 9} more flowers
                </div>
              )}

              {/* Wrapping indicator */}
              <div className="mt-6 text-center">
                <div className="inline-block bg-white/80 dark:bg-rose-950/80 px-6 py-3 rounded-full border-2 border-rose-300 dark:border-rose-700">
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                    {bouquet.wrappingStyle}
                  </p>
                </div>
              </div>

              {/* Ribbon indicator */}
              <div className="mt-3">
                <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-rose-400 to-pink-400" />
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {bouquet.ribbonStyle}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
            <div className="space-y-2 text-sm text-rose-700 dark:text-rose-300">
              <p>
                <span className="font-semibold">{totalFlowers}</span> {primaryFlower?.color} {primaryFlower?.flowerType}
                {totalFlowers !== 1 ? 's' : ''}
              </p>
              <p>
                Wrapped in <span className="font-semibold">{bouquet.wrappingStyle}</span>
              </p>
              <p>
                With <span className="font-semibold">{bouquet.ribbonStyle}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    'Red': '#ef4444',
    'Pink': '#ec4899',
    'White': '#f9fafb',
    'Yellow': '#eab308',
    'Orange': '#f97316',
    'Purple': '#a855f7',
    'Lavender': '#c084fc',
    'Peach': '#fdba74',
  };
  return colorMap[color] || '#ef4444';
}
