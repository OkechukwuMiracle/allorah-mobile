import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../hooks/useNotes';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const { createNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      // fetch single note
      import('../../services/api').then(({ default: api }) => {
        api.get(`/api/notes/${id}`)
          .then(({ data }) => {
            setTitle(data.title);
            setContent(data.content);
          })
          .catch(() => Alert.alert('Error', 'Could not load note'))
          .finally(() => setLoading(false));
      });
    }
  }, [id, isNew]);

  const save = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Add a title or content before saving.');
      return;
    }
    setSaving(true);
    if (isNew) {
      const note = await createNote(title, content);
      if (note) router.back();
      else Alert.alert('Error', 'Could not save note.');
    } else {
      const note = await updateNote(id as string, title, content);
      if (note) router.back();
      else Alert.alert('Error', 'Could not update note.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.PRIMARY} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNew ? 'New Note' : 'Edit Note'}</Text>
        <TouchableOpacity onPress={save} disabled={saving}>
          {saving
            ? <ActivityIndicator size="small" color={Colors.PRIMARY} />
            : <Text style={styles.saveBtn}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={Colors.TEXT_SECONDARY}
          maxLength={120}
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
          placeholderTextColor={Colors.TEXT_SECONDARY}
          multiline
          textAlignVertical="top"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.SURFACE },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  headerTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.semibold, color: Colors.TEXT_PRIMARY },
  saveBtn: { fontSize: Theme.fontSize.md, color: Colors.PRIMARY, fontWeight: Theme.fontWeight.bold },
  titleInput: {
    fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.bold, color: Colors.TEXT_PRIMARY,
    paddingHorizontal: Theme.spacing.lg, paddingTop: Theme.spacing.md, paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  contentInput: {
    flex: 1, fontSize: Theme.fontSize.md, color: Colors.TEXT_PRIMARY,
    padding: Theme.spacing.lg, lineHeight: 24,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
