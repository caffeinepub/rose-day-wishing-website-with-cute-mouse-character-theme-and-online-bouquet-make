import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className="border-rose-600 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
