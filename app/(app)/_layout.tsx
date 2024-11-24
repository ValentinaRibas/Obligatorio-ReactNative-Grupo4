import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useSession } from '../components/context/ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
      <Tabs>
        <Tabs.Screen 
         name="index"
         options={{
           title: 'Home',
           headerShown: false,
           tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
         }} />
        <Tabs.Screen 
        name="profile"
        options={{
          title: 'Profile',
          href: {
            pathname: '/profile',
            params: {
              profile: undefined,
            },
          },
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}/>
      </Tabs>
  );
}
