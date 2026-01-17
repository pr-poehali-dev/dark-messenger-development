import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const emojiCategories = {
    smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋'],
    gestures: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆']
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 w-full max-w-md">
      <Tabs defaultValue="smileys">
        <TabsList className="w-full mb-3">
          <TabsTrigger value="smileys" className="flex-1">😀</TabsTrigger>
          <TabsTrigger value="gestures" className="flex-1">👍</TabsTrigger>
          <TabsTrigger value="hearts" className="flex-1">❤️</TabsTrigger>
          <TabsTrigger value="animals" className="flex-1">🐶</TabsTrigger>
        </TabsList>
        
        {Object.entries(emojiCategories).map(([key, emojis]) => (
          <TabsContent key={key} value={key} className="grid grid-cols-10 gap-1">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-xl hover:bg-muted"
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EmojiPicker;
