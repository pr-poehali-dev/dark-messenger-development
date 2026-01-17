import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ShopPanelProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

const ShopPanel = ({ user, onUpdateUser }: ShopPanelProps) => {
  const gifts = [
    { id: 1, emoji: '🎁', name: 'Подарок', price: 100 },
    { id: 2, emoji: '🌹', name: 'Роза', price: 50 },
    { id: 3, emoji: '🎂', name: 'Торт', price: 150 },
    { id: 4, emoji: '🎈', name: 'Шарик', price: 30 },
    { id: 5, emoji: '💎', name: 'Бриллиант', price: 500 },
    { id: 6, emoji: '👑', name: 'Корона', price: 300 },
    { id: 7, emoji: '🏆', name: 'Кубок', price: 200 },
    { id: 8, emoji: '⭐', name: 'Звезда', price: 80 },
    { id: 9, emoji: '🔥', name: 'Огонь', price: 120 },
    { id: 10, emoji: '💝', name: 'Сердце', price: 90 },
    { id: 11, emoji: '🎵', name: 'Музыка', price: 60 },
    { id: 12, emoji: '🍕', name: 'Пицца', price: 70 }
  ];

  const handlePurchase = (gift: any) => {
    if (user.enots >= gift.price) {
      onUpdateUser({ ...user, enots: user.enots - gift.price });
      toast.success(`Куплено: ${gift.emoji} ${gift.name}`);
    } else {
      toast.error('Недостаточно енотиков');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Магазин подарков</h2>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
            <span className="text-2xl">🦝</span>
            <span className="font-bold">{user.enots}</span>
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="Gift" size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Дарите подарки друзьям</h3>
              <p className="text-sm text-muted-foreground">
                Покупайте подарки за енотики и отправляйте их друзьям прямо в чате
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gifts.map((gift) => (
            <Card key={gift.id} className="p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="text-center space-y-3">
                <div className="text-6xl">{gift.emoji}</div>
                <div>
                  <p className="font-semibold">{gift.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-lg">🦝</span>
                    <span className="font-bold text-primary">{gift.price}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handlePurchase(gift)}
                  disabled={user.enots < gift.price}
                >
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  Купить
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={20} />
            Специальные предложения
          </h3>
          <div className="space-y-3">
            <Card className="p-4 border-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Набор "Праздник"</p>
                      <Badge variant="secondary">-20%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">5 подарков в одном наборе</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">500 🦝</p>
                  <p className="text-xl font-bold text-secondary">400 🦝</p>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ShopPanel;
