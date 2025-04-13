import { Tabs } from 'expo-router';
import { Chrome as Home, ChartPie as PieChart, Users } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'index':
              return <Home size={size} color={color} />;
            case 'activity':
              return <Users size={size} color={color} />;
            case 'summary':
              return <PieChart size={size} color={color} />;
            default:
              return null;
          }
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Groups',
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
        }}
      />
    </Tabs>
  );
}