import { useState, useCallback } from 'react';
import {
  Task,
  loadTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../utils/taskStorage';

export type { Task };

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (title: string, description: string): Promise<Task> => {
    const task = await createTask(title, description);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const editTask = async (
    id: string,
    title: string,
    description: string
  ): Promise<void> => {
    const updated = await updateTask(id, { title, description });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const removeTask = async (id: string): Promise<void> => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggle = async (id: string): Promise<void> => {
    const updated = await toggleTask(id);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggle,
    completedCount,
    pendingCount,
  };
};
