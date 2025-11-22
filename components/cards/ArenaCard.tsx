import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native'; // Use Pressable
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { Arena } from '@/context/types/Arena';

interface ArenaCardProps {
  arena: Arena;
  onPress?: () => void;
  showDescription?: boolean;
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
  showDescription = false, 
  showEsportes = true 
}: ArenaCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // REMOVIDO: const [isPressed, setIsPressed] = useState(false); NÃO É MAIS NECESSÁRIO

  const imageSource =
    imageError || !arena.urlFoto ? fallbackSrc : { uri: arena.urlFoto };

  const esportesFormatados = arena.esportes
    ? arena.esportes.map(esporte => sportLabels[esporte] || esporte)
    : [];

  let esportesLabel = '';
  const count = esportesFormatados.length;

  if (count === 1) {
    esportesLabel = esportesFormatados[0];
  } else if (count === 2) {
    esportesLabel = esportesFormatados.join(' e ');
  } else if (count > 2) {
    const todosMenosOUltimo = esportesFormatados.slice(0, -1);
    const ultimo = esportesFormatados[count - 1];
    esportesLabel = todosMenosOUltimo.join(', ') + ' e ' + ultimo;
  }

  const endereco = arena.endereco
    ? `${arena.endereco.cidade} - ${arena.endereco.estado}`
    : '';

  const enderecoCompleto = arena.endereco
    ? `${arena.endereco.rua}, ${arena.endereco.numero} - ${arena.endereco.bairro} - ${arena.endereco.cep}`
    : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      // O truque está aqui: active:border-gray-200 e active:opacity-70
      // O NativeWind lida com isso automaticamente ao pressionar
      className={`
        bg-white rounded-lg overflow-hidden mb-4 
        border border-transparent 
        active:border-gray-200 active:opacity-70
      `}
    >
      <HStack>
        {/* Imagem da Arena */}
        <Image
          source={imageSource}
          style={{
            width: 128,
            height: 128,
          }}
          className="bg-gray-100"
          resizeMode="contain"
          onError={() => setImageError(true)}
        />

        {/* Informações da Arena */}
        <VStack className="flex-1 p-3 justify-between">
          <VStack>
            <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
              {arena.nome}
            </Text>

            <Text className="text-sm text-gray-600 mb-0.5" numberOfLines={1}>
              {endereco}
            </Text>

            {showDescription && arena.descricao ? (
               <Text className="text-xs text-gray-500 mt-1" numberOfLines={3}>
                 {arena.descricao}
               </Text>
            ) : (
               <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
                 {enderecoCompleto}
               </Text>
            )}
          </VStack>

          {/* Rodapé (Esportes e Avaliações) */}
          <VStack>
            {showEsportes && esportesLabel && (
              <Text
                className="text-xs font-medium text-green-600 mb-1"
                numberOfLines={1}
              >
                {esportesLabel}
              </Text>
            )}

            <HStack className="items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-sm text-gray-700 font-bold">
                {arena.notaMedia?.toFixed(1) || '0.0'}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">
                ({arena.quantidadeAvaliacoes || 0} avaliações)
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Pressable>
  );
}