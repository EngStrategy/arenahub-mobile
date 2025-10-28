import "./global.css"
import { Text, View } from "react-native";
 
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function App() {
  return (
    
    <GluestackUIProvider mode="dark">
      <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
    </GluestackUIProvider>
  
  );
}