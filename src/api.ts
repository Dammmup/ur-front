// @ts-ignore: Ignore error about process not being defined
const apiBaseUrl = `http://${process.env.REACT_APP_API_URL}:8080`;

// Функции для работы с верификацией email
export const verifyEmail = async (email: string, code: string) => {
  const response = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при проверке кода верификации');
  }

  return response.json();
};

export const sendVerificationEmail = async (email: string) => {
  const response = await fetch(`${apiBaseUrl}/api/auth/send-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при отправке кода верификации');
  }

  return response.json();
};

// Универсальный API-клиент для работы с сервером Uyghur Connect
export const getUsers = async (token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/users`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (res.status === 304) return [];
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  return res.json();
};

export const getUserById = async (id: string, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Ошибка загрузки профиля пользователя');
  return res.json();
};

export const fetchUserById = async (id: string, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Ошибка загрузки профиля');
  return res.json();
}

export const getUserProfile = async (id: string, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Ошибка загрузки профиля');
  const data = await res.json();
  return { ...data, id: id };     // нормализуем
};

export const updateUser = async (id: string, user: any, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, {
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
  const res = await fetch(`${apiBaseUrl}/api/users/check-duplicate`, {
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
  const res = await fetch(`${apiBaseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  console.log(`created user: ${userData.username}`);
  return res;
};

export const updateUserNotes = async (userId: string, notes: string, token?: string) => {
  console.log(`updating user notes: ${userId}`);
  const res = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
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
  const res = await fetch(`${apiBaseUrl}/api/courses`);
  if (!res.ok) throw new Error('Ошибка загрузки курсов');
  return res.json();
};

// Получить конкретный урок
export const getLesson = async (id: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/${id}`);
  if (!res.ok) throw new Error('Урок не найден');
  return res.json();
};

// Получить все уроки курса
export const getLessonsByCourse = async (courseId: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/course/${courseId}`);
  if (!res.ok) throw new Error('Уроки не найдены');
  return res.json();
};

// Создать новый урок
export const createLesson = async (lesson: any, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(lesson),
  });
  if (!res.ok) throw new Error('Ошибка создания урока');
  return res.json();
};

// Обновить урок
export const updateLesson = async (id: string, lesson: any, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(lesson),
  });
  if (!res.ok) throw new Error('Ошибка обновления урока');
  return res.json();
};

// Удалить урок
export const deleteLesson = async (id: string, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Ошибка удаления урока');
  return res.json();
};

export const createCourse = async (course: any, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/courses`, {
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
  const res = await fetch(`${apiBaseUrl}/api/courses/${id}`, {
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
  const res = await fetch(`${apiBaseUrl}/api/courses/${id}`, {
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
  const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: login, password }),
  });
  return res;
};

export const getEvents = async () => {
  const res = await fetch(`${apiBaseUrl}/api/events`, { cache: 'no-store' });
  if (res.status === 304) return [];
  if (!res.ok) throw new Error('Ошибка загрузки событий');
  return res.json();
};

export const createEvent = async (event: any, token?: string) => {
  const res = await fetch(`${apiBaseUrl}/api/events`, {
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
  const res = await fetch(`${apiBaseUrl}/api/events/${id}` , {
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
  const res = await fetch(`${apiBaseUrl}/api/events/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Ошибка удаления события');
  return res.json();
};
