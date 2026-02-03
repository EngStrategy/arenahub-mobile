import { useState } from 'react';
import { Image, Pressable, View, TouchableOpacity } from 'react-native';
import { MapPin, Star, ChevronRight } from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { Arena } from '@/types/Arena';
import { useRouter } from 'expo-router';
import { TIPO_QUADRA_OPTIONS } from '@/types/Quadra';

interface ArenaCardProps {
  arena: Arena;
  onPress?: () => void;
  onPressRating?: () => void;
  showDetailsButton?: boolean;
  showAddress?: boolean;
  showFullAddress?: boolean;
  showEsportes?: boolean;
}

const fallbackSrc = require('@/assets/images/imagem-default.png');

export function ArenaCard({
  arena,
  onPress,
  onPressRating,
  showDetailsButton = false,
  showAddress = false,
  showFullAddress = false,
  showEsportes = true,
}: ArenaCardProps) {
  const router = useRouter();

  const [imageError, setImageError] = useState(false);
  const imageSource = imageError || !arena.urlFoto ? fallbackSrc : { uri: arena.urlFoto };


  const handleGoToDetails = () => {
    router.push(`/arena-details/${arena.id}`);
  };

  const esportesFormatados = arena.esportes
    ? arena.esportes.map((esporte) => TIPO_QUADRA_OPTIONS.find((option) => option.value === esporte)?.label || esporte)
    : [];

  const enderecoResumido = arena.endereco
    ? `${arena.endereco.cidade} - ${arena.endereco.estado}`
    : '';

  const enderecoCompleto = arena.endereco
    ? `${arena.endereco.rua}, ${arena.endereco.numero}, ${arena.endereco.bairro}`
    : '';

  return (
    <>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-4 active:scale-[0.98] transition-transform"
      >
        <HStack className="items-center space-x-4">
          {/* Imagem da Arena */}
          <View className="relative">
            <Image
              source={imageSource}
              className="w-24 h-24 rounded-xl bg-gray-100"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          </View>

          {/* Informações da Arena */}
          <VStack className="flex-1 ml-4">
            <View className="flex-row justify-between items-start">
              <Text className="text-base font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                {arena.nome}
              </Text>

              {/* Avaliação no canto superior direito */}
              <TouchableOpacity
                onPress={onPressRating}
                disabled={!onPressRating}
                className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-600"
              >
                <Star size={12} color="#EAB308" fill="#EAB308" />
                <Text className="text-xs font-bold text-yellow-700 ml-1">
                  {arena.notaMedia?.toFixed(1) || '0.0'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Localização com Ícone */}
            <HStack className="items-center mt-1">
              <MapPin size={12} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1 font-medium">
                {enderecoResumido}
              </Text>
            </HStack>

            {/* Endereço limitado */}
            {showAddress && arena.endereco && (
              <Text className="text-[11px] text-gray-500 mt-1" numberOfLines={1}>
                {enderecoCompleto}
              </Text>
            )}

            {/* Endereço sem limite */}
            {showFullAddress && arena.endereco && (
              <Text className="text-[11px] text-gray-500 mt-1" numberOfLines={3}>
                {enderecoCompleto}
              </Text>
            )}

            {/* Badges de Esportes */}
            {showEsportes && esportesFormatados.length > 0 && (
              <HStack space="xs" className="flex-wrap mt-1">
                {esportesFormatados.slice(0, 3).map((label, index) => (
                  <View key={index} className="bg-green-100 px-2 py-0.5 rounded-full border border-green-500 mb-1">
                    <Text className="text-[10px] font-bold text-green-800">
                      {label}
                    </Text>
                  </View>
                ))}
                {esportesFormatados.length > 3 && (
                  <Text className="text-[10px] text-gray-400 font-bold ml-1">
                    +{(arena.esportes?.length || 0) - 3}
                  </Text>
                )}
              </HStack>
            )}

            {/* Botão Ver Detalhes */}
            {showDetailsButton && (
              <TouchableOpacity
                onPress={handleGoToDetails}
                className="mt-1 self-end flex-row items-center py-1"
              >
                <Text className="text-xs text-blue-700 font-bold mr-1">
                  Detalhes da Arena
                </Text>
                <ChevronRight size={14} color="blue" />
              </TouchableOpacity>
            )}
          </VStack>
        </HStack>
      </Pressable>
    </>
  );
}