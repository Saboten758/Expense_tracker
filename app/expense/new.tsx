import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Receipt, DollarSign } from 'lucide-react-native';
import { useExpenseStore } from '@/store/expenseStore';

const CATEGORIES = [
  'Food & Drinks',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills',
  'Others',
];

export default function CreateExpenseScreen() {
  const { groupId } = useLocalSearchParams();
  const { groups, addExpense } = useExpenseStore();
  const group = groups.find((g) => g.id === groupId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paidBy, setPaidBy] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const handleCreateExpense = async () => {
    if (!title.trim()) {
      setError('Please enter an expense title');
      return;
    }
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }
    if (!paidBy) {
      setError('Please select who paid');
      return;
    }

    try {
      // Create equal splits for all members
      const splitAmount = Number(amount) / group.members.length;
      const splitBetween = Object.fromEntries(
        group.members.map((member) => [member, splitAmount])
      );

      await addExpense({
        groupId: group.id,
        title: title.trim(),
        description: description.trim(),
        amount: Number(amount),
        paidBy,
        category,
        splitBetween,
      });
      router.back();
    } catch (err) {
      setError('Failed to create expense. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Receipt size={32} color="#007AFF" />
        <Text style={styles.title}>New Expense</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What's this expense for?"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountContainer}>
          <View style={styles.currencyContainer}>
            <DollarSign size={20} color="#666" />
          </View>
          <TextInput
            style={[styles.input, styles.amountInput]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add notes about this expense"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat)}>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Paid By</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.membersContainer}>
          {group.members.map((member) => (
            <TouchableOpacity
              key={member}
              style={[
                styles.memberButton,
                paidBy === member && styles.memberButtonActive,
              ]}
              onPress={() => setPaidBy(member)}>
              <Text
                style={[
                  styles.memberButtonText,
                  paidBy === member && styles.memberButtonTextActive,
                ]}>
                {member}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateExpense}>
          <Text style={styles.createButtonText}>Add Expense</Text>
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyContainer: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  membersContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  memberButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  memberButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  memberButtonText: {
    color: '#666',
    fontSize: 14,
  },
  memberButtonTextActive: {
    color: 'white',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 16,
    fontSize: 14,
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