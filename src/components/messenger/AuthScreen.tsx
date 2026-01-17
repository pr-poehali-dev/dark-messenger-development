import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuthComplete: (user: any) => void;
}

const AuthScreen = ({ onAuthComplete }: AuthScreenProps) => {
  const [step, setStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleCodeSubmit = () => {
    if (code.length === 6) {
      setStep('profile');
    }
  };

  const handleProfileSubmit = async () => {
    if (nickname.trim()) {
      try {
        const response = await fetch('https://functions.poehali.dev/c02a7e14-6980-4dfe-9879-c2c9ebefdae8', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            phone,
            nickname,
            username: `@${nickname.toLowerCase().replace(/\s/g, '')}`
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('speaky_user', JSON.stringify(data.user));
          onAuthComplete(data.user);
        } else {
          toast.error('Ошибка регистрации');
        }
      } catch (error) {
        toast.error('Ошибка подключения к серверу');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-card border-border">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="MessageCircle" size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Speaky</h1>
          <p className="text-muted-foreground">
            {step === 'phone' && 'Введите номер телефона'}
            {step === 'code' && 'Введите код из СМС'}
            {step === 'profile' && 'Создайте свой профиль'}
          </p>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="+7 999 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-center text-lg h-14"
              />
            </div>
            <Button 
              onClick={handlePhoneSubmit} 
              className="w-full h-12 text-base"
              disabled={phone.length < 10}
            >
              Продолжить
            </Button>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                Код отправлен на номер {phone}
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest h-14"
                maxLength={6}
              />
            </div>
            <Button 
              onClick={handleCodeSubmit} 
              className="w-full h-12 text-base"
              disabled={code.length !== 6}
            >
              Подтвердить
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setStep('phone')}
              className="w-full"
            >
              Изменить номер
            </Button>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Ваш никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-center text-lg h-14"
              />
              <p className="text-xs text-center text-muted-foreground">
                Username: @{nickname.toLowerCase().replace(/\s/g, '') || 'username'}
              </p>
            </div>
            <Button 
              onClick={handleProfileSubmit} 
              className="w-full h-12 text-base"
              disabled={!nickname.trim()}
            >
              Начать общение
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthScreen;