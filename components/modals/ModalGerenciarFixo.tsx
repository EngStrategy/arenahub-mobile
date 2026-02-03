import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Box } from '@/components/ui/box';
import { Clock, Trash2, Info, X, AlertTriangle } from 'lucide-react-native';
import { AgendamentoAtleta } from '@/types/Agendamento';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';

interface Props {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly loading: boolean;
    readonly agendamentosFilhos: AgendamentoAtleta[];
    readonly onCancelIndividual: (id: number, dataFormatada: string) => void;
    readonly onCancelTotal: (fixoId: number) => void;
    readonly agendamentoFixoId: number;
}

export function ModalGerenciarFixo({
    isOpen,
    onClose,
    loading,
    agendamentosFilhos,
    onCancelIndividual,
    onCancelTotal,
    agendamentoFixoId,
}: Props) {
    const valorTotal = useMemo(() =>
        agendamentosFilhos.reduce((acc, curr) =>
            curr.status === 'CANCELADO' ? acc : acc + curr.valorTotal, 0
        ), [agendamentosFilhos]);

    const temPagos = useMemo(() =>
        agendamentosFilhos.some(a => a.status === 'PAGO' || a.status === 'FINALIZADO'),
        [agendamentosFilhos]);

    const agendamentosOrdenados = useMemo(() => {
        return [...agendamentosFilhos].sort((a, b) =>
            new Date(a.dataAgendamento).getTime() - new Date(b.dataAgendamento).getTime()
        );
    }, [agendamentosFilhos]);

    const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const getBadgeStyle = (status: string) => {
        switch (status) {
            case 'PAGO': return { bg: 'bg-green-100', text: 'text-green-700' };
            case 'CANCELADO': return { bg: 'bg-red-100', text: 'text-red-700' };
            case 'PENDENTE': return { bg: 'bg-blue-100', text: 'text-blue-700' };
            case 'FINALIZADO': return { bg: 'bg-gray-100', text: 'text-gray-700' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    const renderItem = ({ item }: { item: AgendamentoAtleta }) => {
        const statusStyle = getBadgeStyle(item.status);
        const dataFormatada = format(parseISO(item.dataAgendamento), "dd/MM");

        return (
            <Box className="p-4 border-b border-outline-100">
                <HStack className="justify-between items-center">
                    <VStack className="flex-1">
                        <HStack space="sm" className="mb-1">
                            <Text className={`font-medium ${item.status === 'CANCELADO' ? 'text-typography-400' : 'text-typography-900'}`}>
                                {capitalizeFirstLetter(format(parseISO(item.dataAgendamento), "EEEE, dd 'de' MMMM", { locale: ptBR }))}
                            </Text>
                        </HStack>
                        <HStack className="items-center">
                            <Icon as={Clock} size="xs" className="text-typography-500" />
                            <Text size="xs" className="text-typography-500 ml-1">
                                {item.horarioInicio.substring(0, 5)} - {item.horarioFim.substring(0, 5)}
                            </Text>
                        </HStack>
                    </VStack>

                    <HStack className="items-center" space="md">
                        {item.status === 'CANCELADO' ? null : (
                            <Text size="sm" className="font-medium text-green-600 mr-2">
                                R$ {item.valorTotal.toFixed(2)}
                            </Text>
                        )}

                        {item.status === 'PENDENTE' ? (
                            <Button
                                variant="outline"
                                action="negative"
                                size="xs"
                                className="rounded-lg h-8 w-8 p-0"
                                onPress={() => onCancelIndividual(item.id, dataFormatada)}
                            >
                                <ButtonIcon as={Trash2} />
                            </Button>
                        ) : (
                            <Box className={`${statusStyle.bg} px-2 py-0.5 rounded-full ml-2`}>
                                <Text className={`${statusStyle.text} text-[10px] font-bold`}>
                                    {item.status}
                                </Text>
                            </Box>
                        )}
                    </HStack>
                </HStack>
            </Box>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="h-[80%] max-h-[90%]">
                <ModalHeader>
                    <VStack>
                        <Heading size="md">Gerenciar Recorrência</Heading>
                        <Text size="xs" className="text-typography-500">Exibindo datas futuras do plano fixo</Text>
                    </VStack>
                    <ModalCloseButton><Icon as={X} /></ModalCloseButton>
                </ModalHeader>

                <View className="flex-1 mt-2">
                    {loading ? (
                        <VStack className="py-20 items-center justify-center">
                            <Spinner size="large" />
                            <Text className="mt-4 text-typography-500">Buscando datas...</Text>
                        </VStack>
                    ) : (
                        <FlatList
                            data={agendamentosOrdenados}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                            scrollEnabled={true}
                            ListHeaderComponent={temPagos ? (
                                <Alert action="warning" variant="outline" className="m-4">
                                    <AlertIcon as={AlertTriangle} size="md" />
                                    <AlertText size="xs">
                                        Datas pagas não podem ser canceladas pelo aplicativo.
                                    </AlertText>
                                </Alert>
                            ) : null}
                            ListEmptyComponent={
                                <VStack className="flex-1 items-center justify-center opacity-40">
                                    <Icon as={Info} size="xl" className="text-typography-400" />
                                    <Text className="mt-2 text-typography-500">Nenhum agendamento futuro.</Text>
                                </VStack>
                            }
                        />
                    )}
                </View>

                <ModalFooter className="flex-col p-4">
                    <HStack className="w-full justify-between items-center mb-4">
                        <Text className="font-bold text-typography-900">Total do Plano:</Text>
                        <Text className="text-lg font-bold text-green-700">
                            R$ {valorTotal.toFixed(2)}
                        </Text>
                    </HStack>

                    <Button
                        action="default"
                        variant="solid"
                        className="w-full bg-red-600 h-12 rounded-xl"
                        onPress={() => onCancelTotal(agendamentoFixoId)}
                        isDisabled={loading || agendamentosFilhos.filter(a => a.status !== 'CANCELADO').length === 0}
                    >
                        <ButtonIcon as={Trash2} className="mr-2" />
                        <ButtonText className="font-bold text-white">Cancelar Toda a Recorrência</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}