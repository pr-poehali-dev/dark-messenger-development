import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  user: any;
}

const Sidebar = ({ currentView, onViewChange, user }: SidebarProps) => {
  const menuItems = [
    { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
    { id: 'friends', icon: 'Users', label: 'Друзья' },
    { id: 'music', icon: 'Music', label: 'Музыка' },
    { id: 'wallet', icon: 'Wallet', label: 'Кошелек' },
    { id: 'shop', icon: 'ShoppingBag', label: 'Магазин' },
    { id: 'settings', icon: 'Settings', label: 'Настройки' }
  ];

  return (
    <div className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4">
      <div className="relative cursor-pointer" onClick={() => onViewChange('profile')}>
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.nickname?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        {user.verified && (
          <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-0.5">
            <Icon name="BadgeCheck" size={14} className="text-white" />
          </div>
        )}
      </div>

      <div className="h-px w-12 bg-sidebar-border" />

      <div className="flex-1 flex flex-col space-y-2 w-full px-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'ghost'}
            size="icon"
            className="w-full h-14 rounded-xl relative"
            onClick={() => onViewChange(item.id)}
          >
            <Icon name={item.icon} size={24} />
          </Button>
        ))}
      </div>

      <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl">
        <Icon name="LogOut" size={20} />
      </Button>
    </div>
  );
};

export default Sidebar;
