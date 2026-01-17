import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface WalletPanelProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

const WalletPanel = ({ user, onUpdateUser }: WalletPanelProps) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [amount, setAmount] = useState('');

  const handleTopUp = (method: string) => {
    const enotsToAdd = parseInt(amount) * 2;
    onUpdateUser({ ...user, enots: user.enots + enotsToAdd });
    toast.success(`Пополнено на ${enotsToAdd} енотиков`);
    setShowTopUp(false);
    setAmount('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Кошелек</h2>

        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg opacity-90">Баланс</h3>
            <Icon name="Wallet" size={24} />
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold">{user.enots} 🦝</p>
            <p className="text-sm opacity-90">Енотиков на счету</p>
          </div>
          <Button
            className="w-full mt-6 bg-white text-primary hover:bg-white/90"
            onClick={() => setShowTopUp(true)}
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Пополнить кошелек
          </Button>
        </Card>

        <div>
          <h3 className="font-semibold mb-3">Курс обмена</h3>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">🦝</span>
                </div>
                <div>
                  <p className="font-medium">100 енотиков</p>
                  <p className="text-sm text-muted-foreground">Базовый пакет</p>
                </div>
              </div>
              <p className="text-xl font-bold">50 ₽</p>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="font-semibold mb-3">История операций</h3>
          <div className="space-y-2">
            {[
              { id: 1, type: 'purchase', title: 'Покупка подарка', amount: -200, date: 'Сегодня, 14:30' },
              { id: 2, type: 'topup', title: 'Пополнение', amount: 1000, date: 'Вчера, 12:15' },
              { id: 3, type: 'purchase', title: 'Покупка стикеров', amount: -100, date: '15 янв, 18:20' }
            ].map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'topup' ? 'bg-secondary/10' : 'bg-primary/10'
                    }`}>
                      <Icon 
                        name={transaction.type === 'topup' ? 'ArrowDown' : 'ShoppingBag'} 
                        size={20}
                        className={transaction.type === 'topup' ? 'text-secondary' : 'text-primary'}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.amount > 0 ? 'text-secondary' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} 🦝
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Пополнить кошелек</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Сумма (₽)</label>
              <Input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Вы получите: {amount ? parseInt(amount) * 2 : 0} 🦝 енотиков
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Способ оплаты</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleTopUp('card')}
                  disabled={!amount || parseInt(amount) <= 0}
                >
                  <Icon name="CreditCard" size={24} />
                  Карта
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleTopUp('sbp')}
                  disabled={!amount || parseInt(amount) <= 0}
                >
                  <Icon name="Smartphone" size={24} />
                  СБП
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPanel;
