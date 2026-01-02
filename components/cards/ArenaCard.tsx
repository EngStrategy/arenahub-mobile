import React, { useState } from 'react';
import { Image, Pressable, View, TouchableOpacity } from 'react-native';
import { MapPin, Star } from 'lucide-react-native'; 
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { Arena } from '@/context/types/Arena';
import { ModalArenaDetalhes } from '@/components/modals/ModalArenaDetalhes'; 
import { Info } from 'lucide-react-native';

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

const sportLabels: Record<string, string> = {
  FUTEBOL_SOCIETY: 'Futebol Society',
  FUTEBOL_SETE: 'Futebol 7',
  FUTEBOL_ONZE: 'Futebol 11',
  FUTSAL: 'Futsal',
  BEACHTENNIS: 'Beach Tennis',
  VOLEI: 'Vôlei',
  FUTEVOLEI: 'Futevôlei',
  BASQUETE: 'Basquete',
  HANDEBOL: 'Handebol',
};

export function ArenaCard({
  arena,
  onPress,
  onPressRating,
  showDetailsButton = false,
  showAddress = false,
  showFullAddress = false,
  showEsportes = true,
}: ArenaCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const imageSource = imageError || !arena.urlFoto ? fallbackSrc : { uri: arena.urlFoto };

  const esportesFormatados = arena.esportes
    ? arena.esportes.map((esporte) => sportLabels[esporte] || esporte)
    : [];

  let esportesLabel = '';

  if (esportesFormatados.length > 0) {
    esportesLabel = esportesFormatados.join(', '); 
  }

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
        className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-4 active:opacity-90"
      >
        <HStack className="items-start space-x-3">
          {/* Imagem da Arena */}
          <Image
            source={imageSource}
            className="w-28 h-28 rounded-lg bg-gray-100"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />

          {/* Informações da Arena */}
          <VStack className="flex-1 ml-3">
            <View className="flex-row justify-between items-start">
              <Text className="text-base font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                {arena.nome}
              </Text>
              
              {/* Avaliação no canto superior direito */}
              <TouchableOpacity 
                onPress={onPressRating}
                disabled={!onPressRating}
                className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-md"
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
            {showEsportes && esportesLabel !== '' && (
              <View className="mt-2">
                <Text className="text-[10px] font-bold text-green-700" numberOfLines={2}>
                  {esportesLabel}
                </Text>
              </View>
            )}

            {/* Botão Ver Detalhes */}
            {showDetailsButton && (
              <TouchableOpacity 
                onPress={() => setIsDetailsOpen(true)}
                className="mt-1 self-end flex-row items-center py-1"
              >
                <Info size={14} color="#0077E6" />
                <Text className="text-xs text-primary-600 font-bold ml-1">
                  Ver detalhes 
                </Text>
              </TouchableOpacity>
            )}
          </VStack>
        </HStack>
      </Pressable>

      {/* Renderização do Modal */}
      <ModalArenaDetalhes 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        arena={arena} 
      />
    </>
  );
}