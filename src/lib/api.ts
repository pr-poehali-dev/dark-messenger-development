const API_URLS = {
  auth: 'https://functions.poehali.dev/c02a7e14-6980-4dfe-9879-c2c9ebefdae8',
  users: 'https://functions.poehali.dev/d141a91b-1840-4612-951c-31a67ab14288',
  upload: 'https://functions.poehali.dev/ab07fbd5-b989-428e-8836-8322eb53272c'
};

export const api = {
  auth: {
    register: async (phone: string, nickname: string, username: string) => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', phone, nickname, username })
      });
      return response.json();
    },
    
    login: async (phone: string) => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', phone })
      });
      return response.json();
    }
  },
  
  users: {
    getStats: async (userId: number) => {
      const response = await fetch(`${API_URLS.users}?user_id=${userId}&action=stats`);
      return response.json();
    },
    
    getFriends: async (userId: number) => {
      const response = await fetch(`${API_URLS.users}?user_id=${userId}&action=friends`);
      return response.json();
    },
    
    getBlocked: async (userId: number) => {
      const response = await fetch(`${API_URLS.users}?user_id=${userId}&action=blocked`);
      return response.json();
    },
    
    updateProfile: async (userId: number, updates: any) => {
      const response = await fetch(API_URLS.users, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', user_id: userId, ...updates })
      });
      return response.json();
    },
    
    blockUser: async (userId: number, blockedUserId: number) => {
      const response = await fetch(API_URLS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', user_id: userId, blocked_user_id: blockedUserId })
      });
      return response.json();
    },
    
    unblockUser: async (userId: number, blockedUserId: number) => {
      const response = await fetch(API_URLS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock', user_id: userId, blocked_user_id: blockedUserId })
      });
      return response.json();
    },
    
    addFriend: async (userId: number, friendUsername: string) => {
      const response = await fetch(API_URLS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_friend', user_id: userId, friend_username: friendUsername })
      });
      return response.json();
    },
    
    verifyUser: async (adminId: number, targetUserId: number) => {
      const response = await fetch(API_URLS.users, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_user', admin_id: adminId, target_user_id: targetUserId })
      });
      return response.json();
    }
  },
  
  upload: {
    uploadFile: async (file: string, type: string, userId: number) => {
      const response = await fetch(API_URLS.upload, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file, type, user_id: userId })
      });
      return response.json();
    }
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};
