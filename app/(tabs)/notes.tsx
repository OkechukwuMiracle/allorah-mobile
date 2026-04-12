import React from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotes, Note } from '../../hooks/useNotes';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { format } from 'date-fns';

export default function NotesTab() {
  const { notes, loading, error, fetchNotes, deleteNote } = useNotes();

  useFocusEffect(
    React.useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const handleDelete = (note: Note) => {
    Alert.alert('Delete Note', `Delete "${note.title || 'Untitled'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteNote(note._id);
          fetchNotes();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => router.push({ pathname: '/notes/[id]', params: { id: item._id } })}
      activeOpacity={0.85}
    >
      <View style={styles.noteBody}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={styles.notePreview} numberOfLines={2}>
          {item.content || 'No content'}
        </Text>
        <Text style={styles.noteDate}>
          {format(new Date(item.updatedAt), 'MMM d, yyyy · h:mm a')}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color={Colors.ERROR} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Notes</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push({ pathname: '/notes/[id]', params: { id: 'new' } })}
        >
          <Ionicons name="add" size={24} color={Colors.SURFACE} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchNotes} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={notes.length === 0 ? styles.emptyContainer : styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="document-text-outline" size={64} color={Colors.BORDER} />
              <Text style={styles.emptyText}>No notes yet</Text>
              <Text style={styles.emptySubtext}>Tap + to create your first note</Text>
            </View>
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
  list: { padding: Theme.spacing.md, gap: Theme.spacing.sm },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  noteCard: {
    backgroundColor: Colors.SURFACE, borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md, flexDirection: 'row', alignItems: 'center', ...Theme.shadow.sm,
  },
  noteBody: { flex: 1 },
  noteTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_PRIMARY, marginBottom: 2 },
  notePreview: { fontSize: Theme.fontSize.sm, color: Colors.TEXT_SECONDARY, marginBottom: 4 },
  noteDate: { fontSize: Theme.fontSize.xs, color: Colors.TAB_INACTIVE },
  deleteBtn: { padding: Theme.spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Theme.spacing.xl },
  errorText: { fontSize: Theme.fontSize.md, color: Colors.TEXT_SECONDARY, textAlign: 'center', marginTop: Theme.spacing.md },
  retryBtn: { marginTop: Theme.spacing.md, paddingVertical: 8, paddingHorizontal: 20, backgroundColor: Colors.PRIMARY, borderRadius: Theme.borderRadius.md },
  retryText: { color: Colors.SURFACE, fontWeight: Theme.fontWeight.semibold },
  emptyText: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_SECONDARY, marginTop: Theme.spacing.md },
  emptySubtext: { fontSize: Theme.fontSize.sm, color: Colors.TAB_INACTIVE, marginTop: 4 },
});
