
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
      // Try navigator.clipboard first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(label);
        setTimeout(() => setCopiedUrl(null), 2000);
        return;
      }
      
      // Fallback to manual selection
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 99999); // For mobile devices
      
      // Try execCommand as fallback
      const successful = document.execCommand('copy');
      document.body.removeChild(input);
      
      if (successful) {
        setCopiedUrl(label);
        setTimeout(() => setCopiedUrl(null), 2000);
      } else {
        // Show manual copy instructions
        alert('Please manually copy the URL from the text field below');
      }
    } catch (error) {
      console.log('Copy failed, showing manual copy instruction');
      alert('Please manually copy the URL from the text field below');
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
            <h3 className="text-lg font-semibold">Visit Dominate Media</h3>
            <p className="text-sm text-muted-foreground">
              Learn more about our professional services and solutions
            </p>
            <div className="flex gap-2">
              <Button onClick={handleOpenExternal} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit DominateMedia.io
              </Button>
            </div>
          </div>

          {/* Secondary sharing option */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-semibold">Share Your Results</h3>
            <p className="text-sm text-muted-foreground">
              Share this link to show others your valuation analysis
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
              className="text-xs bg-muted font-mono"
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
              <li>• Click "Open in New Tab" to view your results in a new window</li>
              <li>• Use the copy button to get the shareable link</li>
              <li>• Visit Dominate Media to learn about our services</li>
              <li>• All links preserve your complete valuation analysis</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
