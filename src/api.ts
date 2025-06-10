// Универсальный API-клиент для работы с сервером Uyghur Connect
export const getUsers = async (token?: string) => {
  const res = await fetch('http://localhost:4000/api/users', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (res.status === 304) return [];
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  return res.json();
};

export const fetchUserById = async (id: string, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Ошибка загрузки профиля');
  return res.json();
}

export const updateUser = async (id: string, user: any, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Ошибка обновления профиля');
  return res.json();
}

export const checkUserDuplicate = async (username: string, email: string) => {
  console.log(`checking duplicate: ${username} ${email}`);
  const res = await fetch('http://localhost:4000/api/users/check-duplicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email }),
  });
  console.log(`connected to server: ${username} ${email}`);
  return res;
};

/**
 * Создать нового пользователя. Отправляет только необходимые поля на сервер.
 * @param userData Объект с обязательными и опциональными полями пользователя
 */
/**
 * Создать нового пользователя. Отправляет userData напрямую.
 * @param userData Объект с обязательными и опциональными полями пользователя
 */
export const createUser = async (userData: {
  login: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  language: string;
  email: string;
  [key: string]: any; // остальные опциональные поля
}) => {
  const res = await fetch('http://localhost:4000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  console.log(`created user: ${userData.username}`);
  return res;
};

export const updateUserNotes = async (userId: string, notes: string, token?: string) => {
  console.log(`updating user notes: ${userId}`);
  const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error('Ошибка обновления заметок');
  return res.json();
};

export const getCourses = async () => {
  const res = await fetch('http://localhost:4000/api/courses', { cache: 'no-store' });
  if (res.status === 304) return [];
  if (!res.ok) throw new Error('Ошибка загрузки курсов');
  return res.json();
};

export const getCourseById = async (id: string) => {
  const res = await fetch(`http://localhost:4000/api/courses/${id}`, { cache: 'no-store' });
  if (res.status === 304) return null;
  if (!res.ok) throw new Error('Ошибка загрузки курса');
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

export const updateCourse = async (id: string, course: any, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(course),
  });
  if (!res.ok) throw new Error('Ошибка обновления курса');
  return res.json();
};

export const deleteCourse = async (id: string, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    const error = new Error((typeof data === 'string' ? data : (data?.error || 'Ошибка удаления курса')));
    // @ts-ignore
    error.status = res.status;
    // @ts-ignore
    error.statusText = res.statusText;
    // @ts-ignore
    error.body = data;
    throw error;
  }
  return data;
};

export const login = async (login: string, password: string) => {
  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: login, password }),
  });
  return res;
};

export const getEvents = async () => {
  const res = await fetch('http://localhost:4000/api/events', { cache: 'no-store' });
  if (res.status === 304) return [];
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
  if (!res.ok) throw new Error('Ошибка создания события');
  return res.json();
};

export const updateEvent = async (id: string, event: any, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/events/${id}` , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Ошибка обновления события');
  return res.json();
};

export const deleteEvent = async (id: string, token?: string) => {
  const res = await fetch(`http://localhost:4000/api/events/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Ошибка удаления события');
  return res.json();
};

