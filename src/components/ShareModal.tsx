
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, CheckCircle, Share2, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  externalUrl: string;
}

const ShareModal = ({ isOpen, onClose, shareUrl, externalUrl }: ShareModalProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(label);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.log('Clipboard not available, manual copy needed');
      // Select the text for manual copying
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedUrl(label);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const handleOpenExternal = () => {
    window.open(externalUrl, '_blank');
  };

  const handleOpenCurrent = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Valuation Results
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to share your valuation analysis with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Primary sharing option */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Share on Dominate Media</h3>
            <p className="text-sm text-muted-foreground">
              Professional presentation on our official platform
            </p>
            <div className="flex gap-2">
              <Button onClick={handleOpenExternal} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open on DominateMedia.io
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleCopyUrl(externalUrl, 'external')}
                className="px-4"
              >
                {copiedUrl === 'external' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Input 
              value={externalUrl} 
              readOnly 
              className="text-xs bg-muted"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>

          {/* Secondary sharing option */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-semibold">Direct Link</h3>
            <p className="text-sm text-muted-foreground">
              Share the current page directly
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleOpenCurrent} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleCopyUrl(shareUrl, 'current')}
                className="px-4"
              >
                {copiedUrl === 'current' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Input 
              value={shareUrl} 
              readOnly 
              className="text-xs bg-muted"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>

          {/* Success message */}
          {copiedUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Link copied to clipboard successfully!
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">Sharing Tips:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Use the Dominate Media link for professional presentations</li>
              <li>• Direct links work best for internal team sharing</li>
              <li>• All links preserve your complete valuation analysis</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
