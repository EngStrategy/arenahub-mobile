import { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, View, TouchableOpacity, Text, TextInput, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Upload, ChevronDown } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { type QuadraCreate } from '@/context/types/Quadra';
import { TipoQuadra, MaterialFornecido, DuracaoReserva } from '@/context/types/Quadra';
import { horariosDaSemanaCompleta, HorarioFuncionamentoCreate, DiaDaSemana } from '@/context/types/Horario';
import { formatarDiaSemanaCompleto } from '@/context/functions/mapeamentoDiaSemana';
import { getQuadraById, updateQuadra } from '@/services/api/entities/quadra'; 
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MATERIAIS_OPTIONS, TIPO_QUADRA_OPTIONS, DURACAO_OPTIONS } from '@/constants/Quadra';
import { ModalCriarHorarios } from '@/components/modais/ModalCriarHorarios';
import { ModalMultiSelect } from '@/components/modais/ModalMultiSelect';
import { Spinner } from '@/components/ui/spinner';
import { Picker } from '@react-native-picker/picker';

const fallbackSrc = require('@/assets/images/imagem-default.png');

const FlexCol: React.FC<{ children: React.ReactNode; className?: string; space?: number }> = ({ children, className = '', space = 0 }) => (
    <View className={`flex flex-col ${className}`} style={{ gap: space * 4 }}>{children}</View>
);

const FlexRow: React.FC<{ children: React.ReactNode; className?: string; space?: number }> = ({ children, className = '', space = 0 }) => (
    <View className={`flex flex-row ${className}`} style={{ gap: space * 4 }}>{children}</View>
);

export default function EditarQuadra() {
    const { id } = useLocalSearchParams<{ id: string }>(); 
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [nomeQuadra, setNomeQuadra] = useState('');
    const [tipoQuadra, setTipoQuadra] = useState<string[]>([]);
    const [materiaisFornecidos, setMateriaisFornecidos] = useState<string[]>([]);
    const [duracaoReserva, setDuracaoReserva] = useState('UMA_HORA');
    const [cobertura, setCobertura] = useState(false);
    const [iluminacaoNoturna, setIluminacaoNoturna] = useState(false);
    const [descricao, setDescricao] = useState('');
    
    // Inicializa como null. Se tiver foto, preenchemos no useEffect.
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    
    const [horarios, setHorarios] = useState(horariosDaSemanaCompleta);
    
    const [formErrors, setFormErrors] = useState<any>({});
    const [editingDay, setEditingDay] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalTipoQuadraVisible, setIsModalTipoQuadraVisible] = useState(false);
    const [isModalMateriaisVisible, setIsModalMateriaisVisible] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const quadraData = await getQuadraById(Number(id));
                
                setNomeQuadra(quadraData.nomeQuadra);
                setTipoQuadra(quadraData.tipoQuadra);
                setMateriaisFornecidos(quadraData.materiaisFornecidos);
                setDuracaoReserva(quadraData.duracaoReserva);
                setCobertura(quadraData.cobertura);
                setIluminacaoNoturna(quadraData.iluminacaoNoturna);
                setDescricao(quadraData.descricao || '');
                
                // Se vier string vazia ou nulo, setamos null para usar o fallback no render
                setImageUrl(quadraData.urlFotoQuadra || null);

                
                const horariosMapeados = horariosDaSemanaCompleta.map(diaDefault => {
                    const diaBackend = quadraData.horariosFuncionamento.find(h => h.diaDaSemana === diaDefault.diaDaSemana);
                    
                    if (diaBackend) {
                        return {
                            diaDaSemana: diaDefault.diaDaSemana,
                            intervalosDeHorario: diaBackend.intervalosDeHorario.map(intervalo => ({
                                id: intervalo.id, 
                                inicio: intervalo.inicio,
                                fim: intervalo.fim,
                                valor: Number(intervalo.valor),
                                status: intervalo.status
                            }))
                        };
                    }
                    return diaDefault;
                });
                
                
                setHorarios(horariosMapeados);

            } catch (error) {
                console.error(error);
                Alert.alert("Erro", "Falha ao carregar dados da quadra.");
                router.back();
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const payload: any = {
                nomeQuadra,
                tipoQuadra: tipoQuadra as TipoQuadra[], 
                materiaisFornecidos: materiaisFornecidos as MaterialFornecido[],
                cobertura,
                iluminacaoNoturna,
                descricao,
                // Envia a URL se existir, ou string vazia (nunca envia o objeto require do fallback)
                urlFotoQuadra: imageUrl || '',
                
                horariosFuncionamento: horarios
                    .filter(dia => dia.intervalosDeHorario.length > 0)
                    .map(item => ({
                        diaDaSemana: item.diaDaSemana,
                        intervalosDeHorario: item.intervalosDeHorario.map(h => ({
                            id: h.id, 
                            inicio: h.inicio,
                            fim: h.fim,
                            valor: Number(h.valor) || 0,
                            status: h.status ?? 'DISPONIVEL',
                        })),
                    })),
            };

            await updateQuadra(Number(id), payload);
            
            Alert.alert("Sucesso", "Quadra atualizada com sucesso!");
            router.back();
        } catch (error: any) {
            console.error("Erro update:", error);
            if(error.response?.data) console.log(JSON.stringify(error.response.data, null, 2));
            
            Alert.alert("Erro", error.message || "Erro ao atualizar quadra.");
        } finally {
            setSaving(false);
        }
    };

    const validateForm = () => {
        const errors: any = {};
        if (!nomeQuadra) errors.nomeQuadra = 'Campo obrigatório.';
        if (tipoQuadra.length === 0) errors.tipoQuadra = 'Selecione ao menos um.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleModalSave = (values: { horarios: any[] }) => {
        const novosHorarios = horarios.map(h => {
            if (h.diaDaSemana === editingDay.diaDaSemana) {
                return { ...h, intervalosDeHorario: values.horarios };
            }
            return h;
        });
        setHorarios(novosHorarios);
        setIsModalVisible(false);
    };
    
    const renderHorarioItem = (item: any, index: number) => {
        const isFechado = item.intervalosDeHorario.length === 0;
        return (
            <FlexRow key={index} className="justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                <FlexCol space={0} className='flex-1'>
                    <Text className="text-base font-medium text-gray-800">{formatarDiaSemanaCompleto(item.diaDaSemana)}</Text>
                    {isFechado ? <Text className="text-red-500 font-semibold">Fechado</Text> : <Text className="text-green-600 font-semibold">Horários Definidos</Text>}
                </FlexCol>
                <TouchableOpacity onPress={() => { setEditingDay(item); setIsModalVisible(true); }} className="p-2 ml-4">
                    <Edit size={20} color='#3B82F6' />
                </TouchableOpacity>
            </FlexRow>
        );
    };

    const getFormattedLabels = (values: string[], options: typeof TIPO_QUADRA_OPTIONS) => {
        if (values.length === 0) return '';
        return values.map(v => options.find(o => o.value === v)?.label || v).join(', ');
    };

    if (loading) return <View className="flex-1 justify-center items-center bg-white"><Spinner color="green" /></View>;

    return (
        <SafeAreaView className="flex-1 bg-white">
            
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white z-10">
                <Pressable onPress={() => router.back()} className="mr-4 p-1">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </Pressable>
                <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
                    Editar quadra
                </Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    <View className="w-full max-w-3xl mx-auto px-6">
                        <FlexCol space={3} className="mt-2">

                            {/* FOTO */}
                            <FlexRow space={2} className='items-center'>
                                <Image 
                                    // Lógica de fallback visual:
                                    // Se tem URL válida, usa { uri: imageUrl }
                                    // Se não tem (ou deu erro), usa fallbackSrc
                                    source={imageUrl ? { uri: imageUrl } : fallbackSrc} 
                                    className="w-16 h-16 rounded-full border border-gray-300" 
                                    // Se a URL remota falhar (404, etc), reseta para null para mostrar o fallback
                                    onError={() => setImageUrl(null)}
                                />
                                <TouchableOpacity onPress={() => Alert.alert("Em breve", "Upload de imagem")} className="py-2 px-3 border border-gray-400 rounded-lg flex-row items-center">
                                    <Upload size={16} color='black' />
                                    <Text className="ml-2 text-gray-700">Alterar foto</Text>
                                </TouchableOpacity>
                            </FlexRow>

                            <FlexCol space={4}>
                                <View>
                                    <Text className="text-sm font-medium mb-1">Nome</Text>
                                    <TextInput className={`p-3 border rounded-lg ${formErrors.nomeQuadra ? 'border-red-500' : 'border-gray-300'}`} value={nomeQuadra} onChangeText={setNomeQuadra} />
                                </View>

                                <View>
                                    <Text className="text-sm font-medium mb-1">Tipo de quadra</Text>
                                    <TouchableOpacity onPress={() => setIsModalTipoQuadraVisible(true)} className="p-3 border border-gray-300 rounded-lg flex-row justify-between items-center">
                                        <Text className={`flex-1 ${tipoQuadra.length ? 'text-black' : 'text-gray-400'}`}>{getFormattedLabels(tipoQuadra, TIPO_QUADRA_OPTIONS) || 'Selecione'}</Text>
                                        <ChevronDown size={18} color="gray" />
                                    </TouchableOpacity>
                                </View>
                                
                                 <View>
                                    <Text className="text-sm font-medium mb-1">Locação de objetos</Text>
                                    <TouchableOpacity onPress={() => setIsModalMateriaisVisible(true)} className="p-3 border border-gray-300 rounded-lg flex-row justify-between items-center">
                                        <Text className={`flex-1 ${materiaisFornecidos.length ? 'text-black' : 'text-gray-400'}`}>{getFormattedLabels(materiaisFornecidos, MATERIAIS_OPTIONS) || 'Selecione'}</Text>
                                        <ChevronDown size={18} color="gray" />
                                    </TouchableOpacity>
                                </View>

                                <View>
                                    <Text className="text-sm font-medium mb-1">Duração de cada horário</Text>
                                    <View className="border border-gray-300 rounded-lg justify-center h-12 overflow-hidden">
                                         <Picker selectedValue={duracaoReserva} onValueChange={setDuracaoReserva}>
                                            {DURACAO_OPTIONS.map(opt => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
                                        </Picker>
                                    </View>
                                </View>
                            </FlexCol>

                            <FlexCol space={1} className='mt-4'>
                                <Text className="text-lg font-bold">Horários de funcionamento</Text>
                                <View className="border border-gray-200 rounded-lg">
                                    {horarios.map(renderHorarioItem)}
                                </View>
                            </FlexCol>

                            <FlexRow space={2} className="justify-between mt-6 mb-10">
                                <TouchableOpacity onPress={() => router.back()} className='flex-1 bg-gray-200 rounded-lg py-3 items-center'>
                                    <Text className="text-gray-800 font-bold">Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} disabled={saving} className='flex-1 bg-green-600 rounded-lg py-3 items-center'>
                                    {saving ? <Spinner color="white" /> : <Text className="text-white font-bold">Salvar alterações</Text>}
                                </TouchableOpacity>
                            </FlexRow>
                        </FlexCol>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            
            <ModalMultiSelect open={isModalTipoQuadraVisible} title="Tipos de Quadra" options={TIPO_QUADRA_OPTIONS} initialValues={tipoQuadra} onClose={() => setIsModalTipoQuadraVisible(false)} onSave={(v) => {setTipoQuadra(v); setIsModalTipoQuadraVisible(false)}} />
            <ModalMultiSelect open={isModalMateriaisVisible} title="Materiais" options={MATERIAIS_OPTIONS} initialValues={materiaisFornecidos} onClose={() => setIsModalMateriaisVisible(false)} onSave={(v) => {setMateriaisFornecidos(v); setIsModalMateriaisVisible(false)}} />
            <ModalCriarHorarios open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleModalSave} day={editingDay} />
        </SafeAreaView>
    );
}