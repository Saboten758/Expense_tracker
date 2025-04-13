import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  paidBy: string;
  splitBetween: { [userId: string]: number };
  category: string;
  createdAt: number;
}

interface ExpenseStore {
  groups: Group[];
  expenses: Expense[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  loadData: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  groups: [],
  expenses: [],

  addGroup: async (groupData) => {
    const group: Group = {
      ...groupData,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
    };

    set((state) => {
      const newGroups = [...state.groups, group];
      AsyncStorage.setItem('groups', JSON.stringify(newGroups));
      return { groups: newGroups };
    });
  },

  addExpense: async (expenseData) => {
    const expense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
    };

    set((state) => {
      const newExpenses = [...state.expenses, expense];
      AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      return { expenses: newExpenses };
    });
  },

  loadData: async () => {
    try {
      const [groupsData, expensesData] = await Promise.all([
        AsyncStorage.getItem('groups'),
        AsyncStorage.getItem('expenses'),
      ]);

      set({
        groups: groupsData ? JSON.parse(groupsData) : [],
        expenses: expensesData ? JSON.parse(expensesData) : [],
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },
}));