// Универсальный API-клиент для работы с сервером Uyghur Connect
export const getUsers = async (token?: string) => {
  const res = await fetch('/api/users', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  return res.json();
};

export const checkUserDuplicate = async (username: string, email: string) => {
  const res = await fetch('/api/users/check-duplicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email }),
  });
  return res;
};

export const createUser = async (userData: any) => {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res;
};

export const getCourses = async () => {
  const res = await fetch('http://localhost:4000/api/courses');
  if (!res.ok) throw new Error('Ошибка загрузки курсов');
  return res.json();
};

export const createCourse = async (course: any, token?: string) => {
  const res = await fetch('http://localhost:4000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(course),
  });
  return res;
};

export const login = async (login: string, password: string) => {
  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  return res;
};

export const getEvents = async () => {
  const res = await fetch('http://localhost:4000/api/events');
  if (!res.ok) throw new Error('Ошибка загрузки событий');
  return res.json();
};

export const createEvent = async (event: any, token?: string) => {
  const res = await fetch('http://localhost:4000/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(event),
  });
  return res;
};
