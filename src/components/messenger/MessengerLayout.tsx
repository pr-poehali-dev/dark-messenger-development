import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ProfilePanel from './ProfilePanel';
import SettingsPanel from './SettingsPanel';
import MusicPanel from './MusicPanel';
import WalletPanel from './WalletPanel';
import ShopPanel from './ShopPanel';
import FriendsPanel from './FriendsPanel';

interface MessengerLayoutProps {
  currentUser: any;
}

type View = 'chats' | 'profile' | 'settings' | 'music' | 'wallet' | 'shop' | 'friends';

const MessengerLayout = ({ currentUser }: MessengerLayoutProps) => {
  const [currentView, setCurrentView] = useState<View>('chats');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [user, setUser] = useState(currentUser);

  const renderMainContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfilePanel user={user} onUpdateUser={setUser} />;
      case 'settings':
        return <SettingsPanel />;
      case 'music':
        return <MusicPanel />;
      case 'wallet':
        return <WalletPanel user={user} onUpdateUser={setUser} />;
      case 'shop':
        return <ShopPanel user={user} onUpdateUser={setUser} />;
      case 'friends':
        return <FriendsPanel />;
      default:
        return (
          <div className="flex h-screen">
            <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
            <ChatWindow chat={selectedChat} currentUser={user} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} />
      <div className="flex-1 flex overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default MessengerLayout;
