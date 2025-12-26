import { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert, View, TouchableOpacity, Text, TextInput, Switch, Image, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Trash2, Upload, ChevronDown } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { type Arena } from '@/context/types/Arena';
import { type QuadraCreate } from '@/context/types/Quadra';
import { TipoQuadra, MaterialFornecido, DuracaoReserva } from '@/context/types/Quadra';
import { horariosDaSemanaCompleta } from '@/context/types/Horario';
import { formatarDiaSemanaCompleto } from '@/context/functions/mapeamentoDiaSemana';
import { getArenaById } from '@/services/api/entities/arena';
import { createQuadra } from '@/services/api/entities/quadra';
import { useRouter } from 'expo-router';
import { MATERIAIS_OPTIONS, TIPO_QUADRA_OPTIONS, DURACAO_OPTIONS } from '@/constants/Quadra';
import { ModalCriarHorarios } from '@/components/modals/ModalCriarHorarios';
import { ModalMultiSelect } from '@/components/modals/ModalMultiSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArenaCard } from '@/components/cards/ArenaCard';
import { Spinner } from '@/components/ui/spinner';
import { Picker } from '@react-native-picker/picker';

const DEFAULT_AVATAR_URL = "https://i.imgur.com/hepj9ZS.png";

const FlexCol: React.FC<{ children: React.ReactNode; className?: string; space?: number }> = ({ children, className = '', space = 0 }) => (
    <View className={`flex flex-col ${className}`} style={{ gap: space * 4 }}>{children}</View>
);

const FlexRow: React.FC<{ children: React.ReactNode; className?: string; space?: number }> = ({ children, className = '', space = 0 }) => (
    <View className={`flex flex-row ${className}`} style={{ gap: space * 4 }}>{children}</View>
);

export default function CadastrarQuadra() {
    const [loading, setLoading] = useState(false); // Loading do botão salvar
    const [initialLoading, setInitialLoading] = useState(true); // Loading da tela
    const [arena, setArena] = useState<Arena | undefined>();
    const router = useRouter();

    const [nomeQuadra, setNomeQuadra] = useState('');
    const [tipoQuadra, setTipoQuadra] = useState<string[]>([]);
    const [materiaisFornecidos, setMateriaisFornecidos] = useState<string[]>([]);
    const [duracaoReserva, setDuracaoReserva] = useState('UMA_HORA');
    const [cobertura, setCobertura] = useState(false);
    const [iluminacaoNoturna, setIluminacaoNoturna] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});

    const [imageUrl, setImageUrl] = useState<string | null>(DEFAULT_AVATAR_URL);
    const [editingDay, setEditingDay] = useState<any>(null);
    const [horarios, setHorarios] = useState(horariosDaSemanaCompleta);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isModalTipoQuadraVisible, setIsModalTipoQuadraVisible] = useState(false);
    const [isModalMateriaisVisible, setIsModalMateriaisVisible] = useState(false);

    useEffect(() => {
        const fetchArena = async () => {
            try {
                setInitialLoading(true);
                const userData = await AsyncStorage.getItem('userData');
                const arenaId = userData ? JSON.parse(userData).id : null;
                const arenaData = await getArenaById(arenaId?.toString() || '');

                setArena(arenaData);
            } catch (error: unknown) {
                console.error("Erro ao buscar dados da arena:", (error as Error).message);
                Alert.alert("Erro", (error as Error).message);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchArena();
    }, []);

    const handleSubmit = async () => {

        if (!validateForm()) {
            Alert.alert("Erro de Validação", "Por favor, preencha todos os campos obrigatórios e verifique os horários.");
            return;
        }

        const userDataString = await AsyncStorage.getItem('userData');
        let finalArenaId = null;

        if (userDataString) {
            const userData = JSON.parse(userDataString);
            finalArenaId = userData.id;
        }

        if (!finalArenaId) {
            Alert.alert('Erro', 'Sessão expirada ou ID da Arena ausente. Faça login novamente.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let urlParaSalvar = imageUrl ?? '';

            if (imageUrl && imageUrl !== DEFAULT_AVATAR_URL) {
                urlParaSalvar = await uploadToImgur(null);
            }

            const quadra: QuadraCreate = {
                nomeQuadra,
                tipoQuadra: tipoQuadra as TipoQuadra[],
                materiaisFornecidos: materiaisFornecidos as MaterialFornecido[],
                duracaoReserva: duracaoReserva as DuracaoReserva,
                cobertura,
                iluminacaoNoturna,
                descricao,
                urlFotoQuadra: urlParaSalvar,
                arenaId: finalArenaId as string,
                horariosFuncionamento: horarios
                    .filter(dia => dia.intervalosDeHorario.length > 0)
                    .map(item => ({
                        diaDaSemana: item.diaDaSemana,
                        intervalosDeHorario: item.intervalosDeHorario
                            .map(h => ({
                                inicio: h.inicio,
                                fim: h.fim,
                                valor: Number(h.valor) || 0,
                                status: h.status ?? 'DISPONIVEL',
                            })),
                    })),
            };

            await createQuadra(quadra);

            Alert.alert("Sucesso", "Quadra cadastrada com sucesso!");
            router.push('/(arena)/quadras');
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            Alert.alert("Erro", error.message || 'Erro ao cadastrar quadra.');
        } finally {
            setLoading(false);
        }
    };

    const selectImage = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const MOCK_URI = "https://i.imgur.com/zCznLJY.png";

            setImageUrl(MOCK_URI);

        } catch (error) {
            console.error("Error selecting image:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors: any = {};
        if (!nomeQuadra) errors.nomeQuadra = 'O nome da quadra é obrigatório.';
        if (tipoQuadra.length === 0) errors.tipoQuadra = 'Selecione pelo menos um tipo de quadra.';
        if (duracaoReserva.length === 0) errors.duracaoReserva = 'A duração da reserva é obrigatória.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveTipoQuadra = (values: string[]) => {
        setTipoQuadra(values);
        setIsModalTipoQuadraVisible(false);
        if (values.length === 0) setFormErrors((prev: any) => ({ ...prev, tipoQuadra: 'Selecione pelo menos um tipo de quadra.' }));
        else setFormErrors((prev: any) => ({ ...prev, tipoQuadra: undefined }));
    };

    const handleSaveMateriais = (values: string[]) => {
        setMateriaisFornecidos(values);
        setIsModalMateriaisVisible(false);
    };

    const uploadToImgur = async (file: any): Promise<string> => {
        console.log("[MOCK IMGUR] Simulando upload...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        return DEFAULT_AVATAR_URL;
    };

    const showModal = (day: any) => {
        setEditingDay(day);
        setIsModalVisible(true);
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
            <FlexRow
                key={index}
                className="justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
            >
                <FlexCol space={0} className='flex-1'>
                    <Text className="text-base font-medium text-gray-800">
                        {formatarDiaSemanaCompleto(item.diaDaSemana)}
                    </Text>
                    {isFechado ? (
                        <Text className="text-red-500 font-semibold">Fechado</Text>
                    ) : (
                        <Text className="text-green-600 font-semibold">Horários Cadastrados</Text>
                    )}
                </FlexCol>

                <TouchableOpacity
                    onPress={() => showModal(item)}
                    disabled={loading}
                    className="p-2 ml-4"
                >
                    <Edit size={20} color='black' />
                </TouchableOpacity>
            </FlexRow>
        );
    };

    const getFormattedLabels = (values: string[], options: typeof TIPO_QUADRA_OPTIONS) => {
        if (values.length === 0) return '';
        return values.map(v => options.find(o => o.value === v)?.label || v).join(', ');
    };

    // Efeito de carregamento inicial da tela
    if (initialLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* TOP BAR COM ROUTER BACK */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white z-10">
                <Pressable onPress={() => router.back()} className="mr-4 p-1">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </Pressable>
                <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
                    Cadastrar quadra
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    <View className="w-full max-w-3xl mx-auto px-6">

                        {/* HEADER - removi o texto duplicado "Cadastrar quadra" daqui */}
                        <FlexCol space={3} className="mt-4">
                            
                            {/* ARENA CARD */}
                            {arena ? (<View className='mb-4'><ArenaCard arena={arena} showDescription={false} /></View>) : null}

                            {/* FOTO DA QUADRA */}
                            <FlexCol space={2}>
                                <Text className="text-sm font-medium">Foto da Quadra</Text>
                                <FlexRow space={2} className='items-center'>
                                    <Image source={{ uri: imageUrl ?? DEFAULT_AVATAR_URL }} alt="Foto" className="w-16 h-16 rounded-full border border-gray-300" />
                                    <FlexCol space={0.5}>
                                        <Text className="text-xs text-gray-500">Recomendamos imagem quadrada.</Text>
                                        <FlexRow space={1}>
                                            <TouchableOpacity onPress={selectImage} disabled={loading} className="py-2 px-3 border border-gray-400 rounded-lg flex-row items-center">
                                                <Upload size={16} color='black' />
                                                <Text className="ml-2 text-gray-700">Escolher foto</Text>
                                            </TouchableOpacity>
                                            {imageUrl && imageUrl !== DEFAULT_AVATAR_URL && (
                                                <TouchableOpacity
                                                    onPress={() => setImageUrl(DEFAULT_AVATAR_URL)}
                                                    disabled={loading}
                                                    className="p-2 border border-red-500 rounded-lg items-center justify-center"
                                                >
                                                    <Trash2 size={16} color="red" />
                                                </TouchableOpacity>
                                            )}
                                        </FlexRow>
                                    </FlexCol>
                                </FlexRow>
                            </FlexCol>

                            <FlexCol space={4}>
                                {/* Nome da Quadra */}
                                <FlexCol space={1}>
                                    <Text className="text-sm font-medium">Nome da quadra</Text>
                                    <TextInput
                                        className={`p-3 border rounded-lg ${formErrors.nomeQuadra ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: Quadra Principal"
                                        value={nomeQuadra} onChangeText={setNomeQuadra}
                                    />
                                    {formErrors.nomeQuadra && <Text className="text-red-500 text-xs mt-1">{formErrors.nomeQuadra}</Text>}
                                </FlexCol>

                                {/* Tipo de Quadra */}
                                <FlexCol space={1}>
                                    <Text className="text-sm font-medium">Tipo de quadra</Text>
                                    <TouchableOpacity
                                        onPress={() => setIsModalTipoQuadraVisible(true)}
                                        className={`p-3 border rounded-lg flex-row justify-between items-center h-12 ${formErrors.tipoQuadra ? 'border-red-500' : 'border-gray-300'}`}
                                        disabled={loading}
                                    >
                                        <Text className={`text-md flex-1 ${tipoQuadra.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                                            {getFormattedLabels(tipoQuadra, TIPO_QUADRA_OPTIONS) || 'Selecione um ou mais esportes'}
                                        </Text>
                                        <ChevronDown size={18} color={formErrors.tipoQuadra ? 'red' : 'gray'} />
                                    </TouchableOpacity>
                                    {formErrors.tipoQuadra && <Text className="text-red-500 text-xs mt-1">{formErrors.tipoQuadra}</Text>}
                                </FlexCol>

                                {/* Materiais Fornecidos */}
                                <FlexCol space={1}>
                                    <Text className="text-sm font-medium">Materiais fornecidos</Text>
                                    <TouchableOpacity
                                        onPress={() => setIsModalMateriaisVisible(true)}
                                        className="p-3 border border-gray-300 rounded-lg flex-row justify-between items-center h-12"
                                        disabled={loading}
                                    >
                                        <Text className={`text-md flex-1 ${materiaisFornecidos.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                                            {getFormattedLabels(materiaisFornecidos, MATERIAIS_OPTIONS) || 'Nenhum material selecionado'}
                                        </Text>
                                        <ChevronDown size={18} color='gray' />
                                    </TouchableOpacity>
                                </FlexCol>

                                {/* Duração da Reserva */}
                                <FlexCol space={1}>
                                    <Text className="text-sm font-medium">Duração de cada reserva</Text>

                                    <View className={`border rounded-lg justify-center h-12 overflow-hidden ${formErrors.duracaoReserva ? 'border-red-500' : 'border-gray-300'}`} >
                                        <Picker
                                            selectedValue={duracaoReserva || 'UMA_HORA'}
                                            onValueChange={(itemValue) => {
                                                setDuracaoReserva(itemValue);
                                                setFormErrors((prev: any) => ({ ...prev, duracaoReserva: undefined }));
                                            }}
                                            className='border border-gray-300 bg-green-600'
                                        >
                                            {DURACAO_OPTIONS.map(opt => (
                                                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                                            ))}
                                        </Picker>
                                    </View>
                                    {formErrors.duracaoReserva && <Text className="text-red-500 text-xs mt-1">{formErrors.duracaoReserva}</Text>}
                                </FlexCol>

                                {/* Possui cobertura? */}
                                <FlexRow className="justify-between items-center p-3 border border-gray-200 rounded-md h-12">
                                    <Text>Possui cobertura</Text>
                                    <Switch
                                        value={cobertura}
                                        onValueChange={setCobertura}
                                        trackColor={{ true: '#90ee90' }}
                                        thumbColor={cobertura ? '#15a01a' : undefined}
                                    />
                                </FlexRow>

                                {/* Possui iluminação noturna? */}
                                <FlexRow className="justify-between items-center p-3 border border-gray-200 rounded-md h-12">
                                    <Text>Possui iluminação noturna</Text>
                                    <Switch
                                        value={iluminacaoNoturna}
                                        onValueChange={setIluminacaoNoturna}
                                        trackColor={{ true: '#90ee90' }}
                                        thumbColor={iluminacaoNoturna ? '#15a01a' : undefined}
                                    />
                                </FlexRow>

                                {/* Descrição */}
                                <FlexCol space={1}>
                                    <Text className="text-sm font-medium">Descrição</Text>
                                    <TextInput
                                        className="p-3 border border-gray-300 rounded-lg h-28"
                                        placeholder="Descreva a quadra..."
                                        value={descricao} onChangeText={setDescricao} multiline={true} maxLength={500}
                                        style={{ textAlignVertical: 'top' }}
                                    />
                                    <Text className="text-xs text-right text-gray-500">{descricao.length}/500</Text>
                                </FlexCol>
                            </FlexCol>

                            {/* HORÁRIOS */}
                            <FlexCol space={1} className='mt-4'>
                                <Text className="text-lg font-bold">Horários de funcionamento</Text>
                                <View className="border border-gray-200 rounded-lg">
                                    {horarios.map(renderHorarioItem)}
                                </View>
                            </FlexCol>

                            {/* BOTÕES */}
                            <FlexRow space={2} className="justify-between mt-6 mb-10">
                                <TouchableOpacity onPress={() => router.back()} disabled={loading} className='flex-1 border border-gray-400 rounded-lg py-3 items-center'>
                                    <Text className="text-gray-700 font-semibold">Voltar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSubmit} disabled={loading || !arena} className='flex-1 bg-green-primary rounded-lg py-3 items-center'>
                                    {loading ? <Spinner color='green' /> : <Text className="text-white font-semibold">Salvar</Text>}
                                </TouchableOpacity>
                            </FlexRow>

                        </FlexCol>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAIS */}
            <ModalMultiSelect
                open={isModalTipoQuadraVisible} title="Selecione os Tipos de Quadra" options={TIPO_QUADRA_OPTIONS} initialValues={tipoQuadra}
                onClose={() => setIsModalTipoQuadraVisible(false)} onSave={handleSaveTipoQuadra}
            />
            <ModalMultiSelect
                open={isModalMateriaisVisible} title="Selecione os Materiais Disponíveis" options={MATERIAIS_OPTIONS} initialValues={materiaisFornecidos}
                onClose={() => setIsModalMateriaisVisible(false)} onSave={handleSaveMateriais}
            />
            <ModalCriarHorarios
                open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleModalSave} day={editingDay}
            />
        </SafeAreaView>
    );
}