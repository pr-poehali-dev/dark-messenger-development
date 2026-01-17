import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ProfilePanelProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

const ProfilePanel = ({ user, onUpdateUser }: ProfilePanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);
  const [username, setUsername] = useState(user.username);
  const [stats, setStats] = useState({ friends_count: 0, groups_count: 0, channels_count: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288?user_id=${user.id}&action=stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          user_id: user.id,
          nickname,
          username
        })
      });
      const data = await response.json();
      if (data.success) {
        onUpdateUser(data.user);
        setIsEditing(false);
        toast.success('Профиль обновлен');
      }
    } catch (error) {
      toast.error('Ошибка обновления профиля');
    }
  };

  const handleVerification = () => {
    toast.success('Заявка на верификацию отправлена!');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Мой профиль</h2>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Icon name={isEditing ? 'Check' : 'Edit'} size={18} className="mr-2" />
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-primary via-purple-500 to-secondary relative">
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4"
                onClick={() => toast.success('Баннер изменен')}
              >
                <Icon name="Camera" size={16} className="mr-2" />
                Изменить баннер
              </Button>
            )}
          </div>
          
          <div className="p-6 -mt-16 relative">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {nickname[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => toast.success('Фото изменено')}
                  >
                    <Icon name="Camera" size={18} />
                  </Button>
                )}
                {user.verified && (
                  <div className="absolute top-0 right-0 bg-secondary rounded-full p-1">
                    <Icon name="BadgeCheck" size={20} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 pt-16 space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Никнейм</label>
                      <Input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{nickname}</h3>
                      {user.verified && (
                        <Icon name="BadgeCheck" size={24} className="text-secondary" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{username}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {!user.verified && (
          <Card className="p-6 border-secondary">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="BadgeCheck" size={24} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Получите галочку верификации</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Подтвердите свою личность и получите синюю галочку в профиле
                </p>
                <Button onClick={handleVerification}>
                  Подать заявку
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h4 className="font-semibold mb-4">Статистика</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.friends_count}</p>
              <p className="text-sm text-muted-foreground">Друзей</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.groups_count}</p>
              <p className="text-sm text-muted-foreground">Групп</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.channels_count}</p>
              <p className="text-sm text-muted-foreground">Каналов</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePanel;