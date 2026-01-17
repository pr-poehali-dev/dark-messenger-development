import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MyGiftsPanelProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

const MyGiftsPanel = ({ user, onUpdateUser }: MyGiftsPanelProps) => {
  const [receivedGifts, setReceivedGifts] = useState<any[]>([]);
  const [sentGifts, setSentGifts] = useState<any[]>([]);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    setReceivedGifts([]);
    setSentGifts([]);
  };

  const handleSellGift = async (giftId: number, price: number) => {
    const enots = Math.floor(price * 0.7);
    onUpdateUser({ ...user, enots: user.enots + enots });
    setReceivedGifts(receivedGifts.filter(g => g.id !== giftId));
    toast.success(`Продано за ${enots} 🦝 енотиков`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Мои подарки</h2>
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
            <div>
              <h3 className="font-semibold mb-2">Управляйте своими подарками</h3>
              <p className="text-sm text-muted-foreground">
                Храните полученные подарки или продавайте их за енотики (70% от стоимости)
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="received" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="received" className="flex-1">
              Полученные ({receivedGifts.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex-1">
              Отправленные ({sentGifts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-3">
            {receivedGifts.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="Gift" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">У вас пока нет подарков</p>
              </Card>
            ) : (
              receivedGifts.map((gift) => (
                <Card key={gift.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{gift.emoji}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{gift.name}</p>
                      <p className="text-sm text-muted-foreground">
                        От {gift.from} ({gift.from_username})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{gift.date}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xl">🦝</span>
                        <span className="font-bold">{gift.price}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSellGift(gift.id, gift.price)}
                      >
                        <Icon name="DollarSign" size={16} className="mr-2" />
                        Продать
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-3">
            {sentGifts.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="Send" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Вы еще не дарили подарки</p>
              </Card>
            ) : (
              sentGifts.map((gift) => (
                <Card key={gift.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{gift.emoji}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{gift.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Для {gift.to} ({gift.to_username})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{gift.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-xl">🦝</span>
                        <span className="font-bold">{gift.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyGiftsPanel;