import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert, TextInput, findNodeHandle, Pressable } from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { DiaDaSemana, IntervaloHorario } from '@/context/types/Horario';
import { formatarDiaSemanaCompleto } from '@/context/functions/mapeamentoDiaSemana';
import { formatCurrency, formatTimeMask } from '@/context/functions/formatters';
import { useKeyboardHeight } from '@/hooks/useKeyboard';
import { STATUS_OPTIONS } from '@/constants/Quadra';
import { Picker } from '@react-native-picker/picker';

interface ModalCriarHorariosProps {
    readonly open: boolean;
    readonly onCancel: () => void;
    readonly onOk: (values: { horarios: IntervaloHorario[] }) => void;
    readonly day: {
        diaDaSemana: DiaDaSemana;
        intervalosDeHorario: IntervaloHorario[];
    } | null;
}

export function ModalCriarHorarios({ open, onCancel, onOk, day }: ModalCriarHorariosProps) {
    const [localIntervalos, setLocalIntervalos] = useState<IntervaloHorario[]>([]);

    const scrollViewRef = useRef<ScrollView | null>(null);
    const keyboardHeight = useKeyboardHeight();
    const inputRefs = useRef<{ [key: number]: TextInput | null }>({});

    useEffect(() => {
        if (day && open) {
            if (day.intervalosDeHorario.length > 0) {
                setLocalIntervalos(day.intervalosDeHorario.map((h, index) => {
                    let valorEmCentavosString = null;

                    if (h.valor !== null && h.valor !== undefined) {
                        const valorEmCentavos = Math.round(Number(h.valor) * 100);
                        valorEmCentavosString = valorEmCentavos.toString();
                    }
                    return ({
                        ...h,
                        valor: valorEmCentavosString,
                        id: index
                    });
                }));
            } else {
                setLocalIntervalos([{ inicio: null, fim: null, valor: null, status: 'DISPONIVEL', id: 0 }]);
            }
        }
    }, [day, open]);

    const scrollToInput = (index: number) => {
        const focusedInputRef = inputRefs.current[index];
        if (scrollViewRef.current && focusedInputRef) {
            const scrollResponder = (scrollViewRef.current as any).getScrollResponder();

            if (scrollResponder) {
                const nodeHandle = findNodeHandle(focusedInputRef);

                if (nodeHandle) {
                    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                        nodeHandle,
                        0,
                        true
                    );
                }
            } else {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        }
    };

    const handleIntervalChange = (index: number, field: keyof IntervaloHorario, value: string | null) => {
        setLocalIntervalos(prev =>
            prev.map((intervalo, i) => {
                if (i === index) {
                    if (field === 'valor' && value !== null) {
                        let cleanedValue = value.replaceAll(/[^\d,]/g, '');

                        const parts = cleanedValue.split(',');
                        if (parts.length > 2) {
                            cleanedValue = parts[0] + ',' + parts.slice(1).join('');
                        }

                        const valueToSave = cleanedValue.replaceAll(',', '.');

                        return { ...intervalo, valor: valueToSave };
                    }
                    return { ...intervalo, [field]: value };
                }
                return intervalo;
            })
        );
    };

    const addIntervalo = () => {
        setLocalIntervalos(prev => [
            ...prev,
            { inicio: null, fim: null, valor: null, status: 'DISPONIVEL', id: Date.now() }
        ]);
    };

    const removeIntervalo = (id: number) => {
        setLocalIntervalos(prev => prev.filter(intervalo => intervalo.id !== id));
    };

    const handleSave = () => {
        const intervalosValidos = localIntervalos.filter(h =>
            h.inicio && h.fim && h.valor && h.status
        ).map(h => {
            const rawDigits = String(h.valor).replaceAll(/\D/g, '');

            const finalValue = Number.parseFloat(rawDigits) / 100;

            if (Number.isNaN(finalValue) || finalValue < 0) return null;

            return {
                ...h,
                valor: finalValue,
                id: 0
            } as IntervaloHorario;
        }).filter((h): h is IntervaloHorario => h !== null);

        onOk({ horarios: intervalosValidos });
    };

    // Função para fechar o dia
    const handleCloseDay = () => {
        Alert.alert(
            "Confirmar Fechamento",
            `Tem certeza que deseja fechar a ${formatarDiaSemanaCompleto(day!.diaDaSemana)}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Fechar Dia", style: "destructive", onPress: () => onOk({ horarios: [] }) }
            ]
        );
    }

    if (!open || !day) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={open}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View
                    className="bg-white rounded-t-xl w-full max-h-[90vh] shadow-xl"
                >
                    <View className="w-full p-4">

                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-gray-200">
                            <Text className="text-xl font-bold text-gray-800">
                                Editar Horários - {formatarDiaSemanaCompleto(day.diaDaSemana)}
                            </Text>
                            <TouchableOpacity onPress={onCancel} className="p-2">
                                <X size={24} color='black' />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            className="max-h-[75vh]"
                            ref={scrollViewRef}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 0 }}
                        >
                            <View className="flex flex-col gap-3">
                                {localIntervalos.map((intervalo, index) => (
                                    <View
                                        key={intervalo.id}
                                        className="border border-gray-200 p-3 rounded-lg"
                                    >
                                        {/* Título do Intervalo */}
                                        <View className='flex flex-row justify-between items-center mb-2'>
                                            <Text className="font-semibold text-sm">Intervalo {index + 1}</Text>
                                            <TouchableOpacity onPress={() => removeIntervalo(intervalo.id)} className="flex-row items-center p-1">
                                                <Trash2 size={16} color='red' />
                                                <Text className="ml-1 text-red-500 text-sm">Remover</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View className="flex flex-row gap-2">
                                            {/* Início */}
                                            <View className='flex-1'>
                                                <Text className="text-xs text-gray-500 mb-1">Horário início</Text>
                                                <TextInput
                                                    className="p-2 border border-gray-300 rounded-lg h-10"
                                                    placeholder="HH:mm"
                                                    value={intervalo.inicio ?? ''}
                                                    onChangeText={(text: string) => {
                                                        const maskedValue = formatTimeMask(text);
                                                        handleIntervalChange(index, 'inicio', maskedValue);
                                                    }}
                                                    maxLength={5}
                                                />
                                            </View>
                                            {/* Fim */}
                                            <View className='flex-1'>
                                                <Text className="text-xs text-gray-500 mb-1">Horário fim</Text>
                                                <TextInput
                                                    className="p-2 border border-gray-300 rounded-lg h-10"
                                                    placeholder="HH:mm"
                                                    value={intervalo.fim ?? ''}
                                                    onChangeText={(text: string) => {
                                                        const maskedValue = formatTimeMask(text);
                                                        handleIntervalChange(index, 'fim', maskedValue);
                                                    }}
                                                    maxLength={5}
                                                />
                                            </View>
                                        </View>

                                        <View className="flex flex-row gap-2 mt-2">
                                            {/* Valor */}
                                            <View className='flex-1'>
                                                <Text className="text-xs text-gray-500 mb-1">Valor</Text>
                                                <TextInput
                                                    ref={(el: TextInput | null) => { inputRefs.current[index] = el; }}
                                                    className="p-2 border border-gray-300 rounded-lg h-10"
                                                    placeholder="100,00"
                                                    keyboardType="numeric"
                                                    value={formatCurrency(String(intervalo.valor).replaceAll(/[^\d]/g, ''))}
                                                    onChangeText={(text: string) => {
                                                        const rawDigits = text.replaceAll(/[^\d]/g, '');
                                                        handleIntervalChange(index, 'valor', rawDigits);
                                                    }}
                                                    onFocus={() => {
                                                        setTimeout(() => scrollToInput(index), 100);
                                                    }}
                                                />
                                            </View>

                                            {/* Status */}
                                            <View className='flex flex-1'>
                                                <Text className="text-xs text-gray-500 mb-1">Status</Text>

                                                <View
                                                    className="border border-gray-300 rounded-lg overflow-hidden h-10 justify-center"
                                                >
                                                    <Picker
                                                        selectedValue={intervalo.status ?? 'DISPONIVEL'}
                                                        onValueChange={(itemValue) => handleIntervalChange(index, 'status', itemValue)}
                                                    >
                                                        {STATUS_OPTIONS.map((opt: { value: string; label: string; hexColor: string }) => (
                                                            <Picker.Item
                                                                key={opt.value}
                                                                label={opt.label}
                                                                value={opt.value}
                                                                color={opt.hexColor}
                                                            />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>


                                        </View>
                                    </View>
                                ))}

                                {/* Botão Adicionar Intervalo */}
                                <Pressable onPress={addIntervalo} className="mt-4 p-3 border border-gray-400 border-dashed rounded-lg flex-row justify-center items-center">
                                    <Plus size={20} color='gray' />
                                    <Text className="ml-2 text-gray-600 text-base font-semibold">Adicionar Intervalo</Text>
                                </Pressable>

                            </View>
                        </ScrollView>

                        {/* BOTÕES FINAIS */}
                        <View className="flex flex-row justify-between pt-4 border-t border-gray-200 mt-4">
                            <TouchableOpacity onPress={handleCloseDay} className="flex-1 mr-2 border border-red-500 rounded-lg py-3 items-center">
                                <Text className="text-red-500 font-semibold">Fechar Dia</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className="flex-1 ml-2 bg-green-primary rounded-lg py-3 items-center">
                                <Text className="text-white font-semibold">Salvar Horários</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    );
}