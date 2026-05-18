import React, { createContext, useContext, useState, useCallback } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../api';

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await getPosts(params);
      // Handle both paginated and non-paginated responses
      if (Array.isArray(data)) {
        setPosts(data);
        setPagination({ count: data.length, next: null, previous: null });
      } else {
        setPosts(data.results || []);
        setPagination({ count: data.count, next: data.next, previous: data.previous });
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (formData) => {
    const { data } = await createPost(formData);
    setPosts((prev) => [data, ...prev]);
    return data;
  }, []);

  const editPost = useCallback(async (id, formData) => {
    const { data } = await updatePost(id, formData);
    setPosts((prev) => prev.map((p) => (p.id === id ? data : p)));
    return data;
  }, []);

  const removePost = useCallback(async (id) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, pagination, fetchPosts, addPost, editPost, removePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePosts must be used within PostProvider');
  return ctx;
};
