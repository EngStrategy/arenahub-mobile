import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { GetArenaResponse } from '@/services/api/entities/arena';

interface ArenaCardProps {
  arena: GetArenaResponse;
  onPress?: () => void;
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

export function ArenaCard({ arena, onPress }: ArenaCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
  
  const finalClasses = `bg-white rounded-lg overflow-hidden mb-4 ${
    isPressed
      ? 'border border-gray-200' 
      : 'border border-transparent' 
  }`;

  return (
    <TouchableOpacity
      onPress={onPress}
      // 3. Adicionar handlers
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      // 4. Aplicar classes dinâmicas
      className={finalClasses}
      // 6. Desativar efeito de fade
      activeOpacity={1.0} 
    >
      <View className="flex-row">
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
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {arena.nome}
            </Text>

            <Text className="text-sm text-gray-600 mb-0.5">{endereco}</Text>

            <Text className="text-xs text-gray-500 mb-2">
              {enderecoCompleto}
            </Text>
          </View>

          {/* Rodapé (Esportes e Avaliações) */}
          <View>
            {/* Esportes */}
            {esportesLabel && (
              <Text
                className="text-xs font-medium text-green-600 mb-1"
                numberOfLines={2}
              >
                {esportesLabel}
              </Text>
            )}

            {/* Avaliações */}
            <View className="flex-row items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-sm text-gray-700">
                {arena.notaMedia?.toFixed(1) || '0.0'}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">
                ({arena.quantidadeAvaliacoes || 0} avaliações)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}