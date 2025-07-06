import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiBaseUrl } from './api';

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
  level?: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'speaking';
  phone?: string;
  status?: string;
  cardColor?: string;
  active?: boolean;
  language?: string;
  gender?: string;
  completedLessons?: string[];
  coursesCompleted?: number;
  totalCourses?: number;
  createdAt?: string;
  lastLogin?: string;
  birthDate?: string;
  exp: number; // добавлено поле exp из JWT-токена
  iat: number; // добавлено поле iat из JWT-токена
}

// Структура декодированного токена
interface DecodedToken {
  id: string;
  role: 'student' | 'teacher' | 'admin';
  exp: number;
  iat: number;
  blocked: boolean;
  level?: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'speaking';
  access?: boolean;
}

// Тип контекста теперь включает состояние загрузки
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Начинаем с состояния загрузки
  const token = localStorage.getItem('token');
  useEffect(() => {
    const initializeUser = async () => {

      if (token) {
        try {
          let decodedToken: DecodedToken;
          try {
            decodedToken = jwtDecode(token);
          } catch (e) {
            console.error('Ошибка декодирования токена', e);
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
          // Проверяем, не истек ли срок действия токена
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            // Устанавливаем заголовок авторизации для запросов
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            

            const tempUser = {
              id: decodedToken.id,
              level: (decodedToken as any).level,
              access: (decodedToken as any).access,
              role: decodedToken.role,
              exp: decodedToken.exp,
              iat: decodedToken.iat,
              blocked: decodedToken.blocked
            };
            
            try {
              
              const response = await axios.get<User>(`${apiBaseUrl}/api/users/${decodedToken.id}`);
              
              // Устанавливаем полученный профиль, включая данные из токена
              setUser({
                ...response.data,
                level: response.data.level ?? (decodedToken as any).level,
                access: typeof response.data.access === 'boolean' ? response.data.access : (decodedToken as any).access,
                exp: tempUser.exp,
                iat: tempUser.iat
              });
            } catch (profileError) {
              console.error('Не удалось получить полный профиль:', profileError);
              // В случае ошибки используем базовые данные из токена
              setUser(tempUser as any);
            }
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

  const login = async (token: string) => {
    // Сохраняем токен и устанавливаем заголовок авторизации
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      // Декодируем токен для получения основной информации
      const decoded: any = jwtDecode(token);
      
      if (!decoded) {
        throw new Error('Невалидный токен');
      }
      
      // Устанавливаем состояние загрузки
      setLoading(true);
      
      try {
        // @ts-ignore: Ignore error about process not being defined
        const response = await axios.get<User>(`${apiBaseUrl}/api/users/${decoded.id}`);
        
        // Устанавливаем полный профиль пользователя
        setUser({
          ...response.data,
          level: response.data.level ?? (decoded as any).level,
          access: typeof response.data.access === 'boolean' ? response.data.access : (decoded as any).access,
          exp: decoded.exp,
          iat: decoded.iat
        });
      } catch (error) {
        console.error('Не удалось получить профиль после входа:', error);
        // В случае ошибки используем только данные из токена
        setUser({
          id: decoded.id,
          role: decoded.role,
          exp: decoded.exp,
          iat: decoded.iat,
          // Добавляем другие поля из расширенного токена, если они есть
          email: decoded.email || '',
          emailVerified: decoded.emailVerified || false,
          access: (decoded as any).access !== undefined ? (decoded as any).access : true
        } as User);
      }
    } catch (e) {
      console.warn('Не удалось декодировать токен при login():', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value: UserContextType = { user, loading, login, logout, setUser, token: localStorage.getItem('token') };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser должен использоваться внутри UserProvider');
  }
  return context;
};