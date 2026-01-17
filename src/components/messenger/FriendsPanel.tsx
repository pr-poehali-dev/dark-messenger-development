import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const FriendsPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockFriends = [
    { id: 1, name: 'Александр', username: '@alexander', avatar: null, online: true },
    { id: 2, name: 'Мария', username: '@maria', avatar: null, online: false },
    { id: 3, name: 'Иван', username: '@ivan', avatar: null, online: true },
    { id: 4, name: 'Анна', username: '@anna', avatar: null, online: false }
  ];

  const mockRequests = [
    { id: 5, name: 'Дмитрий', username: '@dmitry', avatar: null },
    { id: 6, name: 'Елена', username: '@elena', avatar: null }
  ];

  const handleAddFriend = () => {
    if (searchQuery.startsWith('@')) {
      toast.success('Запрос в друзья отправлен');
      setSearchQuery('');
    } else {
      toast.error('Введите username с @');
    }
  };

  const handleAcceptRequest = (user: any) => {
    toast.success(`${user.name} добавлен в друзья`);
  };

  const handleRejectRequest = (user: any) => {
    toast.success('Запрос отклонен');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Друзья</h2>

        <Card className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Введите username (@username)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAddFriend}>
              <Icon name="UserPlus" size={18} className="mr-2" />
              Добавить
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="friends" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="friends" className="flex-1">
              Мои друзья ({mockFriends.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Заявки ({mockRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-2">
            {mockFriends.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {friend.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {friend.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{friend.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{friend.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success('Открыт чат')}>
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Написать
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toast.success('Удалено из друзей')}>
                      <Icon name="UserMinus" size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-2">
            {mockRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Icon name="Users" size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Нет новых заявок</p>
              </Card>
            ) : (
              mockRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {request.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{request.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{request.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request)}>
                        <Icon name="Check" size={16} className="mr-2" />
                        Принять
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRejectRequest(request)}>
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Пригласите друзей</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Поделитесь ссылкой и получите бонусы за каждого друга
              </p>
              <Button variant="outline">
                <Icon name="Share2" size={16} className="mr-2" />
                Поделиться ссылкой
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FriendsPanel;
