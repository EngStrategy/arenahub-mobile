import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { CitySearch } from '@/components/forms/CitySearch';
import { VStack } from '@/components/ui/vstack';

const sportLabels: Record<string, string> = {
  '': 'Todos os esportes',
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

export type SportKey = keyof typeof sportLabels;

const SPORT_OPTIONS = Object.entries(sportLabels).map(([value, label]) => ({
  label,
  value: value as SportKey,
}));

export interface GenericFilterProps {
  cidade: string;
  esporte: SportKey;
  loading: boolean;
  totalElements: number;
  showResults?: boolean;
  onCidadeChange: (text: string) => void;
  onEsporteChange: (value: SportKey) => void;
  cidadePlaceholder?: string;
  resultsLabel?: {
    singular: string;
    plural: string;
  };
}

export const GenericFilter = React.memo(
  ({
    cidade,
    esporte,
    loading,
    totalElements,
    showResults = true,
    onCidadeChange,
    onEsporteChange,
    cidadePlaceholder = 'Buscar por cidade...',
    resultsLabel = {
      singular: 'resultado encontrado',
      plural: 'resultados encontrados',
    },
  }: GenericFilterProps) => {

    return (
      <VStack className="bg-white px-7 py-3 border-gray-200">
        {/* Filtro de Cidade */}
        <CitySearch
          placeholder={cidadePlaceholder}
          value={cidade}
          onChangeText={onCidadeChange}
        />

        {/* Seletor de Esporte (Pills) */}
        <VStack className="mt-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {SPORT_OPTIONS.map((item) => {
              const isSelected = esporte === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => onEsporteChange(item.value)}
                  className={`px-4 py-2 rounded-full border ${isSelected
                    ? 'bg-green-primary border-green-600'
                    : 'bg-white border-gray-300'
                    }`}
                >
                  <Text
                    className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </VStack>

        {/* Contador de resultados */}
        {showResults && !loading && (
          <Text className="text-sm text-gray-600 mt-3">
            {totalElements}{' '}
            {totalElements === 1 ? resultsLabel.singular : resultsLabel.plural}
          </Text>
        )}
      </VStack>
    );
  }
);

GenericFilter.displayName = 'GenericFilter';