import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'allorah_tasks';

const generateId = (): string =>
  `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const loadTasks = async (): Promise<Task[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const createTask = async (title: string, description: string): Promise<Task> => {
  const tasks = await loadTasks();
  const now = new Date().toISOString();
  const task: Task = {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  await saveTasks([task, ...tasks]);
  return task;
};

export const updateTask = async (
  id: string,
  fields: Partial<Pick<Task, 'title' | 'description' | 'completed'>>
): Promise<Task | null> => {
  const tasks = await loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...fields, updatedAt: new Date().toISOString() };
  await saveTasks(tasks);
  return tasks[idx];
};

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = await loadTasks();
  await saveTasks(tasks.filter((t) => t.id !== id));
};

export const toggleTask = async (id: string): Promise<Task | null> => {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  return updateTask(id, { completed: !task.completed });
};
