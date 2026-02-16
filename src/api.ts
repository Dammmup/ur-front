// Используем переменную окружения для production, fallback на localhost для разработки
export const apiBaseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

// API helpers for Community posts
export type PostCategory = 'question' | 'discussion' | 'news' | 'history';

// TODO: move models to shared package; for now duplicate type
export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName?: string;
    lastName?: string;
    role: string;
    photo?: string;
  };
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: PostCategory;
  author: {
    _id: string;
    firstName?: string;
    lastName?: string;
    role: string;
    photo?: string;
  };
  createdAt: string;
  comments?: Comment[];
}

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

// Получить список всех курсов
// Получить список всех курсов
export const getCourses = async () => {
  const res = await fetch(`${apiBaseUrl}/api/courses`);
  if (!res.ok) throw new Error('Ошибка загрузки курсов');
  return res.json();
};

// Получить курс по ID
export const getCourse = async (id: string) => {
  const res = await fetch(`${apiBaseUrl}/api/courses/${id}`);
  if (!res.ok) throw new Error('Ошибка загрузки курса');
  return res.json();
};

// Получить все уроки для курса по его ID
export const getLessons = async (courseId: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/course/${courseId}`);
  if (!res.ok) {
    console.error(`[API] Error loading lessons for course: ${res.status}`);
    throw new Error('Ошибка загрузки уроков курса');
  }
  const lessons = await res.json();
  return lessons;
};

// Получить конкретный урок и преобразовать к формату фронтенда
export const getLesson = async (id: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/${id}`);
  if (!res.ok) {
    throw new Error('Ошибка загрузки урока');
  }
  const data = await res.json();

  // Преобразуем данные из формата бэкенда в формат фронтенда
  const result = {
    ...data,
    content: data.contentBlocks ? JSON.stringify(data.contentBlocks) : '[]',
    content2: data.description || '',
  };

  console.log('[API] Lesson data received:', data);
  console.log('[API] Transformed for frontend:', result);

  return result;
};

// API для работы с уроками
export const getLessonsByCourse = async (courseId: string) => {
  const res = await fetch(`${apiBaseUrl}/api/lessons/course/${courseId}`);
  if (!res.ok) throw new Error('Ошибка загрузки уроков');
  return res.json();
};

export const createLesson = async (lesson: {
  id?: any;
  title: string;
  content?: string;  // сериализованный JSON строкой массив блоков
  content2?: string; // описание/description
  course: string;
  image?: string;
  image2?: string;
  linkonyoutube?: string;
  order?: number;
}, token?: string) => {
  // Преобразуем данные в формат, ожидаемый бэкендом
  let contentBlocks = [];

  // Пытаемся распарсить contentBlocks из content, если оно есть
  if (lesson.content) {
    try {
      contentBlocks = JSON.parse(lesson.content);
    } catch (err) {
      console.error('Error parsing content blocks:', err);
    }
  }

  // Проверяем, что course является валидным MongoDB ID
  if (!lesson.course || typeof lesson.course !== 'string' || !/^[0-9a-fA-F]{24}$/.test(lesson.course)) {
    console.error(`[API] Invalid MongoDB ID format for course: ${lesson.course}`);
    throw new Error(`Ошибка: неверный формат ID курса`);
  }

  // Создаем объект в формате модели бэкенда
  const lessonData = {
    title: lesson.title,
    description: lesson.content2 || '',  // content2 -> description
    contentBlocks,
    course: lesson.course, // ID курса (MongoDB ID формата)
    order: lesson.order || 0,
  };

  console.log('[API] Creating lesson with data:', lessonData);
  console.log(`[API] Course ID being sent: ${lessonData.course} (should be a valid MongoDB ID)`);

  const res = await fetch(`${apiBaseUrl}/api/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(lessonData),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('API Error:', res.status, errorData);
    throw new Error(`Ошибка создания урока: ${res.status} ${errorData}`);
  }

  return res.json();
};

// Обновить урок
export const updateLesson = async (id: string, lesson: {
  title: string;
  content?: string;  // сериализованный JSON строкой массив блоков
  content2?: string; // описание/description
  course: string;
  image?: string;
  image2?: string;
  linkonyoutube?: string;
  order?: number;
}, token?: string) => {
  // Преобразуем данные в формат, ожидаемый бэкендом
  let contentBlocks = [];

  // Пытаемся распарсить contentBlocks из content, если оно есть
  if (lesson.content) {
    try {
      contentBlocks = JSON.parse(lesson.content);
    } catch (err) {
      console.error('Error parsing content blocks:', err);
    }
  }

  // Создаем объект в формате модели бэкенда
  const lessonData = {
    title: lesson.title,
    description: lesson.content2 || '',  // content2 -> description
    contentBlocks,
    course: lesson.course,
    order: lesson.order || 0,
  };

  console.log('[API] Updating lesson with data:', lessonData);

  const res = await fetch(`${apiBaseUrl}/api/lessons/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(lessonData),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('API Error:', res.status, errorData);
    throw new Error(`Ошибка обновления урока: ${res.status} ${errorData}`);
  }

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
  const res = await fetch(`${apiBaseUrl}/api/events/${id}`, {
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
export const getPosts = async (category: PostCategory) => {
  const res = await fetch(`${apiBaseUrl}/api/posts?category=${category}`);
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
};

export const createPost = async (post: { title: string; content: string; category: PostCategory }, token: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
};

export const updatePost = async (id: string, post: Partial<{ title: string; content: string }>, token: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
};

export const deletePost = async (id: string, token: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
};

// ------ Comments API ------
export const getPostById = async (id: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts/${id}`);
  if (!res.ok) throw new Error('Failed to load post');
  return res.json();
};

export const createComment = async (postId: string, content: string, token: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
};

export const deleteComment = async (commentId: string, token: string) => {
  const res = await fetch(`${apiBaseUrl}/api/posts/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
};
