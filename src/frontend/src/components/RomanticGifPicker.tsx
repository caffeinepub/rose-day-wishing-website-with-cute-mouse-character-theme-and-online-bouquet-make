import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ROMANTIC_GIFS, type RomanticGifOption } from '../lib/romanticGifs';
import { Check } from 'lucide-react';

interface RomanticGifPickerProps {
  value: string | null;
  onChange: (url: string) => void;
}

export default function RomanticGifPicker({ value, onChange }: RomanticGifPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-rose-800 dark:text-rose-200">
        Choose a Romantic GIF
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROMANTIC_GIFS.map((gif) => {
          const isSelected = value === gif.url;
          return (
            <Card
              key={gif.id}
              className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-rose-600 dark:ring-rose-400 border-rose-600 dark:border-rose-400'
                  : 'border-rose-200 dark:border-rose-800'
              }`}
              onClick={() => onChange(gif.url)}
            >
              <div className="relative">
                <img
                  src={gif.url}
                  alt={gif.name}
                  className="w-full h-auto rounded-t-lg"
                  style={{ aspectRatio: '3/2' }}
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                  {gif.name}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
