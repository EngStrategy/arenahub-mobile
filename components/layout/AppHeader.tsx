import { View, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

const logo = require('@/assets/images/logo.png') as ImageSourcePropType;

export function AppHeader() {
  const router = useRouter();
  const { user } = useAuth();

  const handleProfilePress = () => {
    router.push('/(atleta)/perfil');
  };

  return (
    <View className="bg-white px-7 pt-4 pb-3 flex-row border-b border-gray-200 items-center justify-between">
      <Image
        source={logo}
        style={{
          width: 128,
          height: 40,
        }}
        contentFit="contain"
      />

      <View className="flex-row items-center gap-x-4">

        {/* Avatar do Usuário */}
        <TouchableOpacity onPress={handleProfilePress}>
          <Avatar size="md" className="bg-green-600">
            <AvatarFallbackText className="text-white">{user?.name || 'Atleta'}</AvatarFallbackText>
            {user?.imageUrl && (
              <AvatarImage
                source={{ uri: user.imageUrl }}
                alt="Foto do perfil"
              />
            )}
          </Avatar>
        </TouchableOpacity>
      </View>
    </View>
  );
}