import { Slot } from 'expo-router';
import { SessionProvider } from './components/context/ctx';

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
