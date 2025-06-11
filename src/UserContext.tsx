import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { fetchUserById } from './api';

// Единый интерфейс для пользователя
interface User {
  _id: string;
  id: string; // из JWT
  email: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  access: boolean;
  emailVerified: boolean;
  photo?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  telegram?: string;
  whatsapp?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'speaking';
}

// Структура декодированного токена
interface DecodedToken {
  id: string;
  role: 'student' | 'teacher' | 'admin';
  exp: number;
  iat: number;
}

// Тип контекста теперь включает состояние загрузки
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  token?: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Начинаем с состояния загрузки

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);
          // Проверяем, не истек ли срок действия токена
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            // Сразу выставляем пользователя из токена,
            setUser(decodedToken as any);
            // и параллельно пытаемся подтянуть полный профиль (не блокируем UI)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchUserById(decodedToken.id, token);
            setUser(decodedToken as any);
          }
        } catch (error) {
          console.error('Не удалось инициализировать пользователя:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false); // Завершаем загрузку
    };

    initializeUser();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Мгновенно выставляем минимальный объект пользователя из JWT,
    // чтобы маршруты не редиректировали ещё до запроса профиля
    try {
      const decoded: any = jwtDecode(token);
      if (decoded) {
        setUser((prev) => ({ ...prev, ...decoded }));
      }
    } catch (e) {
      console.warn('Не удалось декодировать токен при login():', e);
    }
    // После логина получаем профиль, чтобы иметь полный объект пользователя
    const fetchProfile = async () => {
        try {
            const response = await axios.get<User>(`http://localhost:4000/api/auth/profile`);
            setUser(response.data);
        } catch (error) {
            console.error('Не удалось получить профиль после входа:', error);
            setUser(null);
        }
    };
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, loading, login, logout, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser должен использоваться внутри UserProvider');
  }
  return context;
};