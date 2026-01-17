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
import MyGiftsPanel from './MyGiftsPanel';
import AdminPanel from './AdminPanel';

interface MessengerLayoutProps {
  currentUser: any;
}

type View = 'chats' | 'profile' | 'settings' | 'music' | 'wallet' | 'shop' | 'friends' | 'gifts' | 'admin';

const MessengerLayout = ({ currentUser }: MessengerLayoutProps) => {
  const [currentView, setCurrentView] = useState<View>('chats');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [user, setUser] = useState(currentUser);

  const renderMainContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfilePanel user={user} onUpdateUser={setUser} />;
      case 'settings':
        return <SettingsPanel user={user} onUpdateUser={setUser} />;
      case 'music':
        return <MusicPanel />;
      case 'wallet':
        return <WalletPanel user={user} onUpdateUser={setUser} />;
      case 'shop':
        return <ShopPanel user={user} onUpdateUser={setUser} />;
      case 'friends':
        return <FriendsPanel />;
      case 'gifts':
        return <MyGiftsPanel user={user} onUpdateUser={setUser} />;
      case 'admin':
        return <AdminPanel user={user} />;
      default:
        return (
          <>
            <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} currentUser={user} />
            <ChatWindow chat={selectedChat} currentUser={user} />
          </>
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