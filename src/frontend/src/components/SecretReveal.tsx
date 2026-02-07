import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BouquetSecret } from '../backend';

interface SecretRevealProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secret: BouquetSecret;
}

export default function SecretReveal({ open, onOpenChange, secret }: SecretRevealProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-rose-300 dark:border-rose-700 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
        <DialogHeader>
          <DialogTitle className="text-2xl text-rose-800 dark:text-rose-200 text-center">
            🌹 Secret Revealed! 🌹
          </DialogTitle>
          <DialogDescription className="text-rose-600 dark:text-rose-400 text-center">
            You found the hidden message in the {secret.flowerType.toLowerCase()} flowers
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {secret.secretImageUrl && (
            <div className="flex justify-center">
              <img
                src={secret.secretImageUrl}
                alt="Secret reveal"
                className="w-32 h-32 object-contain animate-pulse"
              />
            </div>
          )}
          
          {secret.secretMessage && (
            <div className="bg-white/80 dark:bg-rose-900/40 rounded-xl p-6 border-2 border-rose-300 dark:border-rose-700">
              <p className="text-rose-800 dark:text-rose-200 text-center text-lg leading-relaxed whitespace-pre-wrap">
                {secret.secretMessage}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-rose-600 dark:text-rose-400 italic">
              This secret was hidden just for you! 💕
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
