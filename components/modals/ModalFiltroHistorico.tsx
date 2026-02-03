import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon, CalendarDaysIcon, CheckIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TipoAgendamentoFilter } from '@/types/Agendamento';
import { ButtonCancel } from '../buttons/ButtonCancel';
import { ButtonPrimary } from '../buttons/ButtonPrimary';

interface ModalFiltroHistoricoProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (tipo: TipoAgendamentoFilter, start?: Date, end?: Date) => void;
    onClear: () => void;
    initialTipo: TipoAgendamentoFilter;
    initialStart?: Date;
    initialEnd?: Date;
}

export const ModalFiltroHistorico = ({
    isOpen,
    onClose,
    onApply,
    onClear,
    initialTipo,
    initialStart,
    initialEnd
}: ModalFiltroHistoricoProps) => {
    const [tipo, setTipo] = useState<TipoAgendamentoFilter>(initialTipo);
    const [start, setStart] = useState<Date | undefined>(initialStart);
    const [end, setEnd] = useState<Date | undefined>(initialEnd);

    const [isStartVisible, setIsStartVisible] = useState(false);
    const [isEndVisible, setIsEndVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTipo(initialTipo);
            setStart(initialStart);
            setEnd(initialEnd);
        }
    }, [isOpen, initialTipo, initialStart, initialEnd]);

    const textStyle = "text-base";
    const activeColor = "text-typography-900";
    const inactiveColor = "text-typography-400";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="rounded-3xl">
                <ModalHeader>
                    <Heading size="lg">Filtrar Histórico</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <VStack space="xl" className="py-4">
                        {/* Tipo de Jogo */}
                        <VStack space="xs">
                            <Text className="font-bold text-typography-700">Tipo de Jogo</Text>
                            <HStack space="sm">
                                {(['AMBOS', 'NORMAL', 'FIXO'] as TipoAgendamentoFilter[]).map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        onPress={() => setTipo(t)}
                                        className={`flex-1 py-3 rounded-lg border items-center relative ${tipo === t ? 'bg-green-50 border-green-600' : 'bg-white border-outline-300'
                                            }`}
                                    >
                                        <Text className={`${textStyle} ${tipo === t ? 'text-green-700 font-medium' : inactiveColor}`}>
                                            {t === 'AMBOS' ? 'Todos' : t.charAt(0) + t.slice(1).toLowerCase()}
                                        </Text>
                                        {tipo === t && (
                                            <View className="absolute top-1 right-1">
                                                <Icon as={CheckIcon} size="xs" className="text-green-700" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </HStack>
                        </VStack>

                        {/* Período */}
                        <VStack space="xs">
                            <Text className="font-bold text-typography-700">Período</Text>
                            <HStack space="md">
                                <TouchableOpacity
                                    onPress={() => setIsStartVisible(true)}
                                    className={`flex-1 p-3 border rounded-lg flex-row items-center justify-between bg-white ${start ? 'border-green-600' : 'border-outline-300'}`}
                                >
                                    <Text className={`${textStyle} ${start ? activeColor : inactiveColor}`}>
                                        {start ? start.toLocaleDateString('pt-BR') : 'Início'}
                                    </Text>
                                    <Icon
                                        as={CalendarDaysIcon}
                                        size="sm"
                                        className={start ? "text-typography-900" : "text-typography-400"}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsEndVisible(true)}
                                    className={`flex-1 p-3 border rounded-lg flex-row items-center justify-between bg-white ${end ? 'border-green-600' : 'border-outline-300'}`}
                                >
                                    <Text className={`${textStyle} ${end ? activeColor : inactiveColor}`}>
                                        {end ? end.toLocaleDateString('pt-BR') : 'Fim'}
                                    </Text>
                                    <Icon
                                        as={CalendarDaysIcon}
                                        size="sm"
                                        className={end ? "text-typography-900" : "text-typography-400"}
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </VStack>

                    <DateTimePickerModal
                        isVisible={isStartVisible}
                        mode="date"
                        onConfirm={(date) => { setStart(date); setIsStartVisible(false); }}
                        onCancel={() => setIsStartVisible(false)}
                        date={start || new Date()}
                    />
                    <DateTimePickerModal
                        isVisible={isEndVisible}
                        mode="date"
                        onConfirm={(date) => { setEnd(date); setIsEndVisible(false); }}
                        onCancel={() => setIsEndVisible(false)}
                        date={end || new Date()}
                    />
                </ModalBody>

                <ModalFooter className="gap-3">
                    <ButtonCancel
                        text='Limpar'
                        loading={false}
                        handleAction={() => {
                            setTipo('AMBOS');
                            setStart(undefined);
                            setEnd(undefined);
                            onClear();
                        }}
                    />
                    <ButtonPrimary
                        text='Aplicar'
                        loading={false}
                        handleAction={() => onApply(tipo, start, end)}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};