import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import EmojiPicker from './EmojiPicker';
import { toast } from 'sonner';

interface ChatWindowProps {
  chat: any;
  currentUser: any;
}

const ChatWindow = ({ chat, currentUser }: ChatWindowProps) => {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '12:30', reactions: [] },
    { id: 2, text: 'Отлично! Работаю над новым проектом', sender: 'me', time: '12:32', reactions: [] },
    { id: 3, text: 'Звучит интересно, расскажешь подробнее?', sender: 'other', time: '12:33', reactions: [] }
  ]);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleFileUpload = (type: 'photo' | 'video') => {
    fileInputRef.current?.click();
    toast.success(`Загрузка ${type === 'photo' ? 'фото' : 'видео'}...`);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? 'Запись остановлена' : 'Запись началась...');
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success('Чат очищен');
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Выберите чат</h3>
          <p className="text-muted-foreground">Начните общение с друзьями</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowUserModal(true)}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">{chat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chat.online ? 'онлайн' : 'был(а) недавно'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => toast.success('Голосовой звонок...')}>
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.success('Видеозвонок...')}>
            <Icon name="Video" size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.success('Пользователь заблокирован')}>
                <Icon name="Ban" size={16} className="mr-2" />
                Заблокировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Чат переименован')}>
                <Icon name="Edit" size={16} className="mr-2" />
                Переименовать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClearChat}>
                <Icon name="Trash2" size={16} className="mr-2" />
                Очистить чат
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'me'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p>{message.text}</p>
              </div>
              <p className={`text-xs text-muted-foreground mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-muted rounded-2xl">
            <div className="flex items-center gap-2 px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Icon name="Smile" size={20} />
              </Button>
              <Input
                placeholder="Сообщение"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFileUpload('photo')}>
                <Icon name="Paperclip" size={20} />
              </Button>
            </div>
          </div>
          
          {messageText.trim() ? (
            <Button size="icon" className="h-12 w-12 rounded-full" onClick={handleSendMessage}>
              <Icon name="Send" size={20} />
            </Button>
          ) : (
            <Button
              size="icon"
              className={`h-12 w-12 rounded-full ${isRecording ? 'bg-destructive' : ''}`}
              onClick={handleVoiceRecord}
            >
              <Icon name="Mic" size={20} />
            </Button>
          )}
        </div>
        
        {showEmojiPicker && (
          <div className="mt-2">
            <EmojiPicker onSelect={(emoji) => {
              setMessageText(messageText + emoji);
              setShowEmojiPicker(false);
            }} />
          </div>
        )}
      </div>

      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-32 bg-gradient-to-r from-primary to-secondary rounded-lg" />
            <div className="flex items-start gap-4 -mt-16 px-4">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {chat.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-16">
                <h3 className="text-xl font-bold">{chat.name}</h3>
                <p className="text-muted-foreground">{chat.username}</p>
              </div>
            </div>
            <div className="flex gap-2 px-4">
              <Button className="flex-1" onClick={() => toast.success('Добавлено в друзья')}>
                <Icon name="UserPlus" size={18} className="mr-2" />
                Добавить в друзья
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Сообщение
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatWindow;
