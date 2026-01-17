import { useState } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import MessengerLayout from '@/components/messenger/MessengerLayout';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleAuthComplete = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  return <MessengerLayout currentUser={currentUser} />;
};

export default Index;
