import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  onSelectChat: (chat: any) => void;
  selectedChat: any;
}

const ChatList = ({ onSelectChat, selectedChat }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockChats = [
    { id: 1, name: 'Александр', username: '@alexander', avatar: null, lastMessage: 'Привет! Как дела?', time: '12:30', unread: 2, online: true, type: 'personal' },
    { id: 2, name: 'Мария', username: '@maria', avatar: null, lastMessage: 'Отправила тебе файлы', time: '11:15', unread: 0, online: false, type: 'personal' },
    { id: 3, name: 'Разработчики', username: '@devs', avatar: null, lastMessage: 'Иван: Созвон в 15:00', time: '10:45', unread: 5, online: true, type: 'group', members: 12 }
  ];

  const mockGroups = [
    { id: 3, name: 'Разработчики', username: '@devs', avatar: null, lastMessage: 'Иван: Созвон в 15:00', time: '10:45', unread: 5, type: 'group', members: 12 },
    { id: 4, name: 'Дизайнеры', username: '@designers', avatar: null, lastMessage: 'Анна: Новый макет готов', time: '09:30', unread: 1, type: 'group', members: 8 }
  ];

  const mockChannels = [
    { id: 5, name: 'Новости IT', username: '@itnews', avatar: null, lastMessage: 'Вышла новая версия React', time: '14:20', unread: 0, type: 'channel', subscribers: 1500 },
    { id: 6, name: 'Дизайн', username: '@designchannel', avatar: null, lastMessage: 'Топ UI тренды 2024', time: '13:10', unread: 3, type: 'channel', subscribers: 2300 }
  ];

  const renderChatItem = (chat: any) => (
    <div
      key={chat.id}
      onClick={() => onSelectChat(chat)}
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors ${
        selectedChat?.id === chat.id ? 'bg-muted' : ''
      }`}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chat.name[0]}
          </AvatarFallback>
        </Avatar>
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary border-2 border-background rounded-full" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{chat.name}</span>
            {chat.type === 'group' && <Icon name="Users" size={14} className="text-muted-foreground" />}
            {chat.type === 'channel' && <Icon name="Radio" size={14} className="text-muted-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground">{chat.time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
      </div>
      
      {chat.unread > 0 && (
        <Badge className="bg-primary text-primary-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center">
          {chat.unread}
        </Badge>
      )}
    </div>
  );

  return (
    <div className="w-96 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Сообщения</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Icon name="PenSquare" size={18} />
          </Button>
        </div>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto">
          <TabsTrigger value="all" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Все
          </TabsTrigger>
          <TabsTrigger value="groups" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Группы
          </TabsTrigger>
          <TabsTrigger value="channels" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Каналы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-1 overflow-y-auto p-2 scrollbar-hide mt-0">
          {mockChats.map(renderChatItem)}
        </TabsContent>
        
        <TabsContent value="groups" className="flex-1 overflow-y-auto p-2 scrollbar-hide mt-0">
          {mockGroups.map(renderChatItem)}
        </TabsContent>
        
        <TabsContent value="channels" className="flex-1 overflow-y-auto p-2 scrollbar-hide mt-0">
          {mockChannels.map(renderChatItem)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatList;
