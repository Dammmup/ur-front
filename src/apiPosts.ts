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

// @ts-ignore
const apiBaseUrl = 'http://localhost:4000';

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
