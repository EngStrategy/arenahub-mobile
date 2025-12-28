import { useState } from 'react';
import { FlatList, Alert, View } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonSpinner } from '@/components/ui/button';
import { SvgUri } from 'react-native-svg';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Box } from '@/components/ui/box';
import { Phone, Info, X, Check } from 'lucide-react-native';
import { SolicitacaoJogoAberto } from '@/services/api/entities/atletaAgendamento';

type ModalSolicitacoesProps = {
    isOpen: boolean;
    loading: boolean;
    vagasDisponiveis: number;
    solicitacoes: SolicitacaoJogoAberto[];
    onClose: () => void;
    onAccept: (solicitacaoId: number) => Promise<void>;
    onDecline: (solicitacaoId: number) => Promise<void>;
};

export function ModalSolicitacoesEntrada({
    isOpen,
    loading,
    vagasDisponiveis,
    solicitacoes,
    onClose,
    onAccept,
    onDecline,
}: Readonly<ModalSolicitacoesProps>) {
    const [actionId, setActionId] = useState<number | null>(null);

    const handleAction = async (id: number, type: 'ACCEPT' | 'DECLINE') => {
        setActionId(id);
        try {
            if (type === 'ACCEPT') {
                await onAccept(id);
            } else {
                await onDecline(id);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível processar a ação.");
            console.error("Erro ao processar ação da solicitação", error);
        } finally {
            setActionId(null);
        }
    };

    const renderItem = ({ item }: { item: SolicitacaoJogoAberto }) => {
        const isProcessing = actionId === item.id;

        const isSvg = item.fotoSolicitante?.toLowerCase().includes('.svg') ||
            item.fotoSolicitante?.includes('dicebear');

        return (
            <Box className="flex-row items-center py-4 bg-background">
                <Avatar size="md">
                    {!item.fotoSolicitante && (
                        <AvatarFallbackText>{item.nomeSolicitante}</AvatarFallbackText>
                    )}

                    {!!item.fotoSolicitante && (
                        isSvg ? (
                            <View className="w-full h-full overflow-hidden rounded-full bg-background-0">
                                <SvgUri
                                    uri={item.fotoSolicitante}
                                    width="100%"
                                    height="100%"
                                />
                            </View>
                        ) : (
                            <AvatarImage
                                source={{ uri: item.fotoSolicitante }}
                                alt={item.nomeSolicitante}
                            />
                        )
                    )}
                </Avatar>

                <VStack className="flex-1 ml-3">
                    <Text size="md" className="font-bold text-typography-900" numberOfLines={1}>
                        {item.nomeSolicitante}
                    </Text>
                    <HStack className="items-center space-x-1">
                        <Icon as={Phone} size="xs" className="text-typography-500" />
                        <Text size="xs" className="text-typography-500 ml-1">{item.telefoneSolicitante}</Text>
                    </HStack>
                </VStack>

                <HStack space="sm">
                    {item.status === 'PENDENTE' ? (
                        <>
                            <Button
                                variant="outline"
                                action="negative"
                                size="sm"
                                className="rounded-full w-10 h-10 p-0"
                                onPress={() => handleAction(item.id, 'DECLINE')}
                                isDisabled={isProcessing}
                            >
                                <Icon as={X} size="sm" color="red" />
                            </Button>
                            <Button
                                variant="solid"
                                action="primary"
                                size="sm"
                                className="rounded-full w-10 h-10 p-0 bg-green-600"
                                onPress={() => handleAction(item.id, 'ACCEPT')}
                                isDisabled={isProcessing || vagasDisponiveis <= 0}
                            >
                                {isProcessing ? <ButtonSpinner /> : <Icon as={Check} color="white" size="sm" />}
                            </Button>
                        </>
                    ) : (
                        <Box className={`px-3 py-1 rounded-full ${item.status === 'ACEITO' ? 'bg-success-100' : 'bg-error-100'}`}>
                            <Text size="xs" className={`font-bold ${item.status === 'ACEITO' ? 'text-success-700' : 'text-error-700'}`}>
                                {item.status}
                            </Text>
                        </Box>
                    )}
                </HStack>
            </Box>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="max-h-[80%]">
                <ModalHeader>
                    <VStack>
                        <HStack className="w-full justify-between items-center mb-1">
                            <Heading size="lg">Solicitações</Heading>
                            <ModalCloseButton>
                                <Icon as={X} />
                            </ModalCloseButton>
                        </HStack>
                        <HStack className="items-center mt-1">
                            <Box className={`w-2 h-2 rounded-full mr-2 ${vagasDisponiveis > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <Text size="sm" className="text-typography-500">
                                {vagasDisponiveis} vagas restantes
                            </Text>
                        </HStack>
                    </VStack>
                </ModalHeader>

                <View className="flex-shrink-1">
                    {loading ? (
                        <VStack className="p-10 items-center justify-center">
                            <Spinner size="large" />
                            <Text size="sm" className="text-typography-400 mt-4">Buscando solicitações...</Text>
                        </VStack>
                    ) : (
                        <FlatList
                            data={solicitacoes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            scrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            ListEmptyComponent={
                                <VStack className="p-10 items-center opacity-40">
                                    <Icon as={Info} size="xl" className="text-typography-400" />
                                    <Text className="text-typography-500 mt-2 text-center">Nenhuma solicitação encontrada.</Text>
                                </VStack>
                            }
                        />
                    )}
                </View>

            </ModalContent>
        </Modal>
    );
}