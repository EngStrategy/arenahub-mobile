import React from 'react';
import { View, ScrollView } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Info, Clock, Calendar, X, MapPin } from 'lucide-react-native';
import type { Arena } from '@/context/types/Arena';

type ModalArenaDetalhesProps = {
    isOpen: boolean;
    onClose: () => void;
    arena: Arena;
};

// Mapeamento para exibição amigável (PascalCase conforme solicitado anteriormente)
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

export function ModalArenaDetalhes({ isOpen, onClose, arena }: ModalArenaDetalhesProps) {
    const dataFormatada = new Date(arena.dataCriacao).toLocaleDateString('pt-BR');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="max-h-[85%]">
                <ModalHeader className="border-b border-outline-100 pb-4">
                    <VStack className="flex-1">
                        <HStack className="justify-between items-center">
                            <Heading size="md" className="text-typography-900">
                                Detalhes da Arena
                            </Heading>
                            <ModalCloseButton>
                                <Icon as={X} size="md" />
                            </ModalCloseButton>
                        </HStack>
                        <Text size="sm" className="text-typography-600 mt-1">
                            {arena.nome}
                        </Text>
                    </VStack>
                </ModalHeader>

                <ModalBody contentContainerStyle={{ paddingVertical: 20 }}>
                    <VStack space="xl">
                        {/* Seção: Descrição */}
                        <VStack space="xs">
                            <HStack space="sm" className="items-center">
                                <Icon as={Info} size="sm" className="text-primary-500" />
                                <Heading size="xs">Sobre a Arena</Heading>
                            </HStack>
                            <Text size="sm" className="text-typography-600 leading-6">
                                {arena.descricao || "Nenhuma descrição informada."}
                            </Text>
                        </VStack>

                        {/* Seção: Esportes (Tags/Pílulas) */}
                        {arena.esportes && arena.esportes.length > 0 && (
                            <VStack space="sm">
                                <Heading size="xs">Esportes disponíveis</Heading>
                                <HStack className="flex-wrap gap-2">
                                    {arena.esportes.map((esporte) => (
                                        <Box 
                                            key={esporte} 
                                            className="bg-green-200 px-3 py-1 rounded-full border border-green-500"
                                        >
                                            <Text className="text-[12px] font-bold text-green-700">
                                                {sportLabels[esporte] || esporte}
                                            </Text>
                                        </Box>
                                    ))}
                                </HStack>
                            </VStack>
                        )}

                        {/* Seção: Políticas e Info */}
                        <VStack space="md" className="bg-background-50 p-4 rounded-xl">
                            <HStack space="md" className="items-center">
                                <Icon as={Clock} size="sm" className="text-typography-500" />
                                <VStack>
                                    <Text size="xs" className="font-bold uppercase text-typography-600">Política de Cancelamento</Text>
                                    <Text size="sm">
                                        {arena.horasCancelarAgendamento > 0 
                                            ? `Até ${arena.horasCancelarAgendamento}h antes do início`
                                            : "Cancelamento gratuito não disponível"}
                                    </Text>
                                </VStack>
                            </HStack>

                            <HStack space="md" className="items-center">
                                <Icon as={Calendar} size="sm" className="text-typography-500" />
                                <VStack>
                                    <Text size="xs" className="font-bold uppercase text-typography-600">Parceiro desde</Text>
                                    <Text size="sm">{dataFormatada}</Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}