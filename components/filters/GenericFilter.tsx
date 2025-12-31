import React, { useState } from 'react';
import {
  TouchableOpacity,
  Modal,
  View,
  FlatList,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { InputTexto } from '@/components/forms/formInputs/InputTexto';
import { VStack } from '@/components/ui/vstack';
import { ChevronDown } from 'lucide-react-native';

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
    const [showSportModal, setShowSportModal] = useState(false);

    return (
      <VStack className="bg-white px-7 pb-3 border-gray-200">
        {/* Filtro de Cidade */}
        <InputTexto
          placeholder={cidadePlaceholder}
          value={cidade}
          onChangeText={onCidadeChange}
        />

        {/* Seletor de Esporte */}
        <VStack className="mt-3">
          <TouchableOpacity
            onPress={() => setShowSportModal(true)}
            className="border border-gray-300 rounded-lg h-12 px-3 flex-row items-center justify-between"
          >
            <Text className="text-gray-700">
              {sportLabels[esporte]}
            </Text>
            <ChevronDown size={20} color="#6b7280" />
          </TouchableOpacity>
        </VStack>

        {/* Contador de resultados */}
        {showResults && !loading && (
          <Text className="text-sm text-gray-600 mt-3">
            {totalElements}{' '}
            {totalElements === 1 ? resultsLabel.singular : resultsLabel.plural}
          </Text>
        )}

        {/* Modal de seleção de esporte */}
        <Modal
          visible={showSportModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSportModal(false)}
        >
          <TouchableOpacity
            className="flex-1 bg-black/30 justify-center items-center"
            activeOpacity={1}
            onPress={() => setShowSportModal(false)}
          >
            <View className="bg-white w-[80%] rounded-xl p-4 shadow-lg max-h-[70%]">
              <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
                Selecionar Esporte
              </Text>
              <FlatList
                data={SPORT_OPTIONS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`py-3 border-b border-gray-100 ${
                      esporte === item.value ? 'bg-green-50' : ''
                    }`}
                    onPress={() => {
                      onEsporteChange(item.value);
                      setShowSportModal(false);
                    }}
                  >
                    <Text
                      className={`text-center font-medium ${
                        esporte === item.value
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </VStack>
    );
  }
);

GenericFilter.displayName = 'GenericFilter';