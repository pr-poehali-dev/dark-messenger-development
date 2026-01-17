import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import CreateGroupDialog from './CreateGroupDialog';
import { toast } from 'sonner';

interface ChatListProps {
  onSelectChat: (chat: any) => void;
  selectedChat: any;
  currentUser: any;
}

const ChatList = ({ onSelectChat, selectedChat, currentUser }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      loadChats();
    }
  }, [currentUser]);

  const loadChats = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/a18ead87-eff6-4d9c-a884-1ddcc97ff217?action=list&user_id=${currentUser.id}`);
      const data = await response.json();
      
      const allChats = data.filter((c: any) => c.type === 'personal');
      const allGroups = data.filter((c: any) => c.type === 'group');
      const allChannels = data.filter((c: any) => c.type === 'channel');
      
      setChats(allChats);
      setGroups(allGroups);
      setChannels(allChannels);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleCreateGroup = async (groupData: any) => {
    try {
      const response = await fetch('https://functions.poehali.dev/a18ead87-eff6-4d9c-a884-1ddcc97ff217', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          user_id: currentUser.id,
          type: groupData.type,
          name: groupData.name
        })
      });
      const data = await response.json();
      if (data.success) {
        loadChats();
        toast.success(`${groupData.type === 'group' ? 'Группа' : 'Канал'} создан`);
      }
    } catch (error) {
      toast.error('Ошибка создания');
    }
  };

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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCreateDialogOpen(true)}>
            <Icon name="Plus" size={18} />
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
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="MessageCircle" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Нет чатов</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Найдите друзей и начните общение
              </p>
              <Button variant="outline" size="sm">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Найти друзей
              </Button>
            </div>
          ) : (
            chats.map(renderChatItem)
          )}
        </TabsContent>
        
        <TabsContent value="groups" className="flex-1 overflow-y-auto p-2 scrollbar-hide mt-0">
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="Users" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Нет групп</h3>
              <p className="text-sm text-muted-foreground">
                Создайте группу или вступите в существующую
              </p>
            </div>
          ) : (
            groups.map(renderChatItem)
          )}
        </TabsContent>
        
        <TabsContent value="channels" className="flex-1 overflow-y-auto p-2 scrollbar-hide mt-0">
          {channels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon name="Radio" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Нет каналов</h3>
              <p className="text-sm text-muted-foreground">
                Подпишитесь на интересные каналы
              </p>
            </div>
          ) : (
            channels.map(renderChatItem)
          )}
        </TabsContent>
      </Tabs>
      
      <CreateGroupDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};

export default ChatList;