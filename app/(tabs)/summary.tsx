import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useExpenseStore } from '@/store/expenseStore';
import { ChartPie as PieChart, ChartLine as LineChart } from 'lucide-react-native';

export default function SummaryScreen() {
  const { expenses, groups } = useExpenseStore();

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate expenses by group
  const expensesByGroup = expenses.reduce((acc, expense) => {
    acc[expense.groupId] = (acc[expense.groupId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const renderCategorySummary = () => {
    return Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => {
        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
        return (
          <View key={category} style={styles.summaryItem}>
            <View style={styles.summaryItemHeader}>
              <Text style={styles.summaryItemTitle}>{category}</Text>
              <Text style={styles.summaryItemAmount}>${amount.toFixed(2)}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${percentage}%` },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{percentage}%</Text>
          </View>
        );
      });
  };

  const renderGroupSummary = () => {
    return Object.entries(expensesByGroup)
      .sort(([, a], [, b]) => b - a)
      .map(([groupId, amount]) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return null;

        const balance = amount.toFixed(2);
        const status = balance > 0 ? 'Owed' : 'To Receive';

        return (
          <View key={groupId} style={styles.summaryItem}>
            <View style={styles.summaryItemHeader}>
              <Text style={styles.summaryItemTitle}>{group.name}</Text>
              <Text style={styles.summaryItemAmount}>
                ${Math.abs(balance)} ({status})
              </Text>
            </View>
          </View>
        );
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Summary</Text>
        <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <PieChart size={20} color="#1a1a1a" />
          <Text style={styles.sectionTitle}>By Category</Text>
        </View>
        <View style={styles.sectionContent}>
          {renderCategorySummary()}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <LineChart size={20} color="#1a1a1a" />
          <Text style={styles.sectionTitle}>By Group</Text>
        </View>
        <View style={styles.sectionContent}>
          {renderGroupSummary()}
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10B981',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionContent: {
    gap: 16,
  },
  summaryItem: {
    gap: 8,
  },
  summaryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  summaryItemAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#6B7280',
  },
});