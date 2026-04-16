import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { loadTasks, createTask, updateTask, Task } from '../../utils/taskStorage';

export default function TaskEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (!isNew) {
      loadTasks().then((tasks) => {
        const task = tasks.find((t) => t.id === id);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setCompleted(task.completed);
        } else {
          Alert.alert('Error', 'Task not found');
          router.back();
        }
      });
    }
  }, [id, isNew]);

  const save = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    setSaving(true);
    try {
      if (isNew) {
        await createTask(title.trim(), description.trim());
      } else {
        await updateTask(id as string, {
          title: title.trim(),
          description: description.trim(),
          completed,
        });
      }
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNew ? 'New Task' : 'Edit Task'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Task Title *"
            value={title}
            onChangeText={(v) => { setTitle(v); setTitleError(''); }}
            placeholder="What needs to be done?"
            error={titleError}
            autoFocus={isNew}
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details..."
            multiline
            numberOfLines={4}
          />

          {/* Completed toggle (only when editing) */}
          {!isNew && (
            <TouchableOpacity
              style={[styles.completedRow, completed && styles.completedRowActive]}
              onPress={() => setCompleted((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, completed && styles.checkboxDone]}>
                {completed && <Ionicons name="checkmark" size={14} color={Colors.SURFACE} />}
              </View>
              <Text style={[styles.completedLabel, completed && styles.completedLabelDone]}>
                {completed ? 'Marked as completed' : 'Mark as completed'}
              </Text>
            </TouchableOpacity>
          )}

          <Button
            title={isNew ? 'Add Task' : 'Save Changes'}
            onPress={save}
            loading={saving}
            style={{ marginTop: Theme.spacing.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.SURFACE, borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  headerTitle: {
    fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.semibold,
    color: Colors.TEXT_PRIMARY,
  },
  content: { padding: Theme.spacing.lg, paddingBottom: 40 },
  completedRow: {
    flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm,
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md, borderWidth: 1.5, borderColor: Colors.BORDER,
    marginTop: Theme.spacing.sm,
  },
  completedRowActive: { borderColor: Colors.SUCCESS, backgroundColor: Colors.SURFACE_2 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.SUCCESS, borderColor: Colors.SUCCESS },
  completedLabel: {
    fontSize: Theme.fontSize.md, color: Colors.TEXT_SECONDARY,
    fontWeight: Theme.fontWeight.medium,
  },
  completedLabelDone: { color: Colors.SUCCESS, fontWeight: Theme.fontWeight.semibold },
});
