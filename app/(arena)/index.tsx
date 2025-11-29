import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';

export default function DashboardScreen() {
  return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <AppHeader/>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
            <Text>Dashboard da arena</Text>
        </View>
      </SafeAreaView>
    );
}