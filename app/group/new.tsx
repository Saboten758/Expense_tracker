import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Users, X, Plus } from 'lucide-react-native';
import { useExpenseStore } from '@/store/expenseStore';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addGroup } = useExpenseStore();

  const addMember = () => {
    if (!memberName.trim()) {
      setError('Please enter a member name');
      return;
    }
    if (members.includes(memberName.trim())) {
      setError('Member already exists');
      return;
    }
    setMembers([...members, memberName.trim()]);
    setMemberName('');
    setError(null);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (members.length < 2) {
      setError('Add at least 2 members to create a group');
      return;
    }

    try {
      await addGroup({
        name: groupName.trim(),
        members,
      });
      router.back();
    } catch (err) {
      setError('Failed to create group. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Users size={32} color="#007AFF" />
        <Text style={styles.title}>Create New Group</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter group name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Add Members</Text>
        <View style={styles.addMemberContainer}>
          <TextInput
            style={[styles.input, styles.memberInput]}
            value={memberName}
            onChangeText={setMemberName}
            placeholder="Enter member name"
            placeholderTextColor="#999"
            onSubmitEditing={addMember}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMember}>
            <Plus color="white" size={24} />
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.membersContainer}>
          {members.map((member, index) => (
            <View key={index} style={styles.memberTag}>
              <Text style={styles.memberTagText}>{member}</Text>
              <TouchableOpacity onPress={() => removeMember(index)}>
                <X size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGroup}>
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addMemberContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  memberInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 8,
    fontSize: 14,
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  memberTag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberTagText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});