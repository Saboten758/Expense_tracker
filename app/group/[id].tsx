import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useExpenseStore } from '@/store/expenseStore';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { groups, expenses } = useExpenseStore();

  const group = groups.find((g) => g.id === id);
  const groupExpenses = expenses.filter((e) => e.groupId === id);

  const renderExpenseItem = ({ item: expense }) => (
    <View style={styles.expenseCard}>
      <Text style={styles.expenseTitle}>{expense.title}</Text>
      <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
      <Text style={styles.expensePayer}>Paid by: {expense.paidBy}</Text>
      <Text style={styles.expenseDate}>
        {new Date(expense.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.memberCount}>{group.members.length} members</Text>
      </View>

      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>Members</Text>
        {group.members.map((member, index) => (
          <Text key={index} style={styles.memberName}>
            {member}
          </Text>
        ))}
      </View>

      <FlatList
        data={groupExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <Link href={`/expense/new?groupId=${id}`} asChild>
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
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  expenseCard: {
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
  expenseTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  expensePayer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseDate: {
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
  membersSection: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});