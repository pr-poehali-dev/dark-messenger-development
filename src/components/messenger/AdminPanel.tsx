import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AdminPanelProps {
  user: any;
}

const AdminPanel = ({ user }: AdminPanelProps) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288?action=search&username=${searchUsername}`);
      const data = await response.json();
      
      if (data.user) {
        setFoundUser(data.user);
      } else {
        toast.error('Пользователь не найден');
        setFoundUser(null);
      }
    } catch (error) {
      toast.error('Ошибка поиска');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_user',
          user_id: userId,
          admin_id: user.id
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Галочка верификации установлена');
        setFoundUser({ ...foundUser, verified: true });
      }
    } catch (error) {
      toast.error('Ошибка верификации');
    }
  };

  const handleUnverify = async (userId: number) => {
    try {
      const response = await fetch('https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unverify_user',
          user_id: userId,
          admin_id: user.id
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Галочка верификации снята');
        setFoundUser({ ...foundUser, verified: false });
      }
    } catch (error) {
      toast.error('Ошибка снятия верификации');
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <Icon name="ShieldAlert" size={32} className="text-destructive" />
          </div>
          <h3 className="font-semibold mb-2">Доступ запрещен</h3>
          <p className="text-sm text-muted-foreground">
            У вас нет прав администратора
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="ShieldCheck" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Админ-панель</h2>
            <p className="text-sm text-muted-foreground">Управление верификацией пользователей</p>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Поиск пользователя</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Введите username (например @user123)"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Icon name="Search" size={18} className="mr-2" />
              Найти
            </Button>
          </div>
        </Card>

        {foundUser && (
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={foundUser.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {foundUser.nickname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{foundUser.nickname}</h3>
                    {foundUser.verified && (
                      <Icon name="BadgeCheck" size={20} className="text-secondary" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{foundUser.username}</p>
                </div>

                <div className="flex gap-2">
                  {!foundUser.verified ? (
                    <Button onClick={() => handleVerify(foundUser.id)}>
                      <Icon name="BadgeCheck" size={18} className="mr-2" />
                      Выдать галочку
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={() => handleUnverify(foundUser.id)}>
                      <Icon name="BadgeX" size={18} className="mr-2" />
                      Снять галочку
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>ID: {foundUser.id}</p>
                  <p>Енотики: {foundUser.enots}</p>
                  <p>Язык: {foundUser.language === 'ru' ? 'Русский' : 'Английский'}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
