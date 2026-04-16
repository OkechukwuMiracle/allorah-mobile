import React, { useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTasks, Task } from '../../hooks/useTasks';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { format } from 'date-fns';

export default function TasksTab() {
  const { tasks, loading, fetchTasks, removeTask, toggle, completedCount, pendingCount } = useTasks();

  useFocusEffect(
    useCallback(() => { fetchTasks(); }, [fetchTasks])
  );

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => removeTask(task.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, item.completed && styles.taskCardDone]}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxDone]}
        onPress={() => toggle(item.id)}
        activeOpacity={0.7}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={14} color={Colors.SURFACE} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskBody}
        onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: item.id } })}
        activeOpacity={0.8}
      >
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]} numberOfLines={1}>
          {item.title}
        </Text>
        {item.description !== '' && (
          <Text style={styles.taskDesc} numberOfLines={1}>{item.description}</Text>
        )}
        <Text style={styles.taskDate}>
          {format(new Date(item.createdAt), 'MMM d, yyyy')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={Colors.ERROR} />
      </TouchableOpacity>
    </View>
  );

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Tasks</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: 'new' } })}
        >
          <Ionicons name="add" size={24} color={Colors.SURFACE} />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      {tasks.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statChip}>
            <View style={[styles.statDot, { backgroundColor: Colors.WARNING }]} />
            <Text style={styles.statText}>{pendingCount} pending</Text>
          </View>
          <View style={styles.statChip}>
            <View style={[styles.statDot, { backgroundColor: Colors.SUCCESS }]} />
            <Text style={styles.statText}>{completedCount} done</Text>
          </View>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : '0%' },
              ]}
            />
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      )}

      {!loading && (
        <FlatList
          data={[...pending, ...completed]}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="checkbox-outline" size={64} color={Colors.BORDER} />
              <Text style={styles.emptyText}>No tasks yet</Text>
              <Text style={styles.emptySubtext}>Tap + to add your first task</Text>
            </View>
          }
          ListFooterComponent={
            completed.length > 0 && pending.length > 0 ? (
              <Text style={styles.sectionLabel}>Completed</Text>
            ) : null
          }
        />
      )}
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
  heading: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.bold, color: Colors.TEXT_PRIMARY },
  addBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  statsBar: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.sm,
    backgroundColor: Colors.SURFACE_2, gap: Theme.spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statText: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY },
  progressTrack: {
    flex: 1, height: 4, backgroundColor: Colors.BORDER,
    borderRadius: 2, minWidth: 60,
  },
  progressFill: { height: 4, backgroundColor: Colors.SUCCESS, borderRadius: 2 },
  list: { padding: Theme.spacing.md, gap: Theme.spacing.sm },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  taskCard: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Theme.spacing.sm, ...Theme.shadow.sm,
  },
  taskCardDone: { opacity: 0.6 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.SUCCESS, borderColor: Colors.SUCCESS },
  taskBody: { flex: 1 },
  taskTitle: {
    fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold,
    color: Colors.TEXT_PRIMARY, marginBottom: 2,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through', color: Colors.TEXT_SECONDARY,
  },
  taskDesc: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, marginBottom: 2 },
  taskDate: { fontSize: Theme.fontSize.xs, color: Colors.TAB_INACTIVE },
  deleteBtn: { padding: Theme.spacing.xs },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Theme.spacing.xl },
  emptyText: {
    fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.semibold,
    color: Colors.TEXT_SECONDARY, marginTop: Theme.spacing.md,
  },
  emptySubtext: { fontSize: Theme.fontSize.sm, color: Colors.TAB_INACTIVE, marginTop: 4 },
  sectionLabel: {
    fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semibold,
    color: Colors.TEXT_SECONDARY, textTransform: 'uppercase',
    letterSpacing: 0.8, paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md, paddingBottom: Theme.spacing.xs,
  },
});
