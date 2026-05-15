import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#88172C',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tischübersicht',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="th-large" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
