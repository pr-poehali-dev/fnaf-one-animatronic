import React, { useState, useEffect, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  username: string;
  email: string;
  campaignProgress: number;
  unlockedLevels: number[];
  savedGames: any[];
  completedStories: string[];
  stats: {
    peopleSaved: number;
    peopleLost: number;
    nightsSurvived: number;
    totalPlayTime: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  saveProgress: (data: any) => void;
  loadProgress: () => any;
  updateStats: (stats: Partial<User['stats']>) => void;
  unlockLevel: (levelId: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fnaf_user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('fnaf_users') || '[]');
    const foundUser = users.find((u: any) => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        campaignProgress: foundUser.campaignProgress || 1,
        unlockedLevels: foundUser.unlockedLevels || [1],
        savedGames: foundUser.savedGames || [],
        completedStories: foundUser.completedStories || [],
        stats: foundUser.stats || {
          peopleSaved: 0,
          peopleLost: 0,
          nightsSurvived: 0,
          totalPlayTime: 0
        }
      };
      
      setUser(userData);
      localStorage.setItem('fnaf_user_data', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('fnaf_users') || '[]');
    
    if (users.find((u: any) => u.username === username || u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      campaignProgress: 1,
      unlockedLevels: [1],
      savedGames: [],
      completedStories: [],
      stats: {
        peopleSaved: 0,
        peopleLost: 0,
        nightsSurvived: 0,
        totalPlayTime: 0
      }
    };

    users.push(newUser);
    localStorage.setItem('fnaf_users', JSON.stringify(users));
    
    const userData = { ...newUser };
    delete (userData as any).password;
    setUser(userData);
    localStorage.setItem('fnaf_user_data', JSON.stringify(userData));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fnaf_user_data');
  };

  const saveProgress = (data: any) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('fnaf_user_data', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('fnaf_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('fnaf_users', JSON.stringify(users));
    }
  };

  const loadProgress = () => {
    return user;
  };

  const updateStats = (newStats: Partial<User['stats']>) => {
    if (!user) return;
    
    const updatedStats = { ...user.stats, ...newStats };
    saveProgress({ stats: updatedStats });
  };

  const unlockLevel = (levelId: number) => {
    if (!user) return;
    
    const newUnlockedLevels = [...user.unlockedLevels];
    if (!newUnlockedLevels.includes(levelId)) {
      newUnlockedLevels.push(levelId);
      saveProgress({ 
        unlockedLevels: newUnlockedLevels,
        campaignProgress: Math.max(user.campaignProgress, levelId)
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      saveProgress,
      loadProgress,
      updateStats,
      unlockLevel
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthScreen: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(username, password);
        if (!success) setError('Неверный логин или пароль');
      } else {
        if (!email) {
          setError('Email обязателен');
          return;
        }
        success = await register(username, email, password);
        if (!success) setError('Пользователь с таким именем или email уже существует');
      }
      
      if (success) {
        onAuthSuccess();
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur border-red-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl horror-title text-red-400">
            <Icon name="Shield" className="inline mr-2" size={28} />
            FNAF Security System
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? 'Вход в систему безопасности' : 'Регистрация охранника'}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            
            {!isLogin && (
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
            )}
            
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  Загрузка...
                </>
              ) : (
                isLogin ? 'Войти в систему' : 'Зарегистрироваться'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};