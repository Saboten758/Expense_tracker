import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useExpenseStore } from '@/store/expenseStore';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';

export default function ActivityScreen() {
  const { expenses, groups } = useExpenseStore();

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => b.createdAt - a.createdAt);

  const getGroupName = (groupId: string) => {
    return groups.find(g => g.id === groupId)?.name || 'Unknown Group';
  };

  const renderExpenseItem = ({ item: expense }) => {
    const isPositive = expense.splitBetween[expense.paidBy] > 0;

    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{expense.title}</Text>
            <Text style={styles.groupName}>{getGroupName(expense.groupId)}</Text>
          </View>
          <View style={styles.amountContainer}>
            <View style={[styles.amountBadge, isPositive ? styles.positiveBadge : styles.negativeBadge]}>
              {isPositive ? (
                <ArrowUpRight size={16} color="#10B981" />
              ) : (
                <ArrowDownRight size={16} color="#EF4444" />
              )}
            </View>
            <Text style={[styles.amount, isPositive ? styles.positiveAmount : styles.negativeAmount]}>
              ${Math.abs(expense.amount).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.expenseFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{expense.category}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(expense.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?q=80&w=100&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
      </View>
      <FlatList
        data={sortedExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start adding expenses to see your activity
            </Text>
          </View>
        }
      />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  list: {
    padding: 16,
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 12,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 14,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  positiveBadge: {
    backgroundColor: '#D1FAE5',
  },
  negativeBadge: {
    backgroundColor: '#FEE2E2',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#4B5563',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});