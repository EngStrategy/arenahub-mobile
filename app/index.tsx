import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View } from 'react-native';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <View className="flex-1 bg-white" />;
    }

    if (user) {
        return <Redirect href="/(atleta)" />;
    }

    return <Redirect href="/welcome" />;
}
