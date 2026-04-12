import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get<Note[]>('/api/notes');
      setNotes(data);
    } catch {
      setError('Could not load notes. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = async (title: string, content: string): Promise<Note | null> => {
    try {
      const { data } = await api.post<Note>('/api/notes', { title, content });
      return data;
    } catch {
      return null;
    }
  };

  const updateNote = async (id: string, title: string, content: string): Promise<Note | null> => {
    try {
      const { data } = await api.put<Note>(`/api/notes/${id}`, { title, content });
      return data;
    } catch {
      return null;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/notes/${id}`);
      return true;
    } catch {
      return false;
    }
  };

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote };
};
