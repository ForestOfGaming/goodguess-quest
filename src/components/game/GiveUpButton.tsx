
import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GiveUpButtonProps {
  onGiveUp: () => void;
  targetWord: string;
  isGameOver: boolean;
}

const GiveUpButton: React.FC<GiveUpButtonProps> = ({ onGiveUp, targetWord, isGameOver }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);

  const handleGiveUp = () => {
    onGiveUp();
    setHasGivenUp(true);
    setShowConfirmation(false);
  };

  return (
    <Dialog open={showConfirmation || hasGivenUp} onOpenChange={setShowConfirmation}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="mt-2"
          disabled={isGameOver}
        >
          <Flag className="mr-2 h-4 w-4" />
          Give Up
        </Button>
      </DialogTrigger>

      {!hasGivenUp ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              If you give up, the game will end and the word will be revealed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleGiveUp}
            >
              Yes, Give Up
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>The word was:</DialogTitle>
            <div className="flex items-center justify-center mt-6">
              <span className="text-4xl font-bold text-primary">{targetWord}</span>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="default" 
              onClick={() => setHasGivenUp(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default GiveUpButton;
