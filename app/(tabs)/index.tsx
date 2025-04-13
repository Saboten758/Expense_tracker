import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useExpenseStore } from '@/store/expenseStore';

export default function GroupsScreen() {
  const { groups, expenses, loadData } = useExpenseStore();

  useEffect(() => {
    loadData();
  }, []);

  const getGroupBalance = (groupId: string) => {
    return expenses
      .filter((e) => e.groupId === groupId)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const renderGroupCard = ({ item: group }) => (
    <Link href={`/group/${group.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.memberCount}>{group.members.length} members</Text>
        <Text style={styles.balance}>
          Total: ${getGroupBalance(group.id).toFixed(2)}
        </Text>
        <Text style={styles.timestamp}>
          Created {new Date(group.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <Link href="/group/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balance: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});