export const TIPO_QUADRA_OPTIONS = [
    { value: 'FUTEBOL_SOCIETY', label: 'Futebol society' },
    { value: 'FUTEBOL_SETE', label: 'Futebol 7' },
    { value: 'FUTEBOL_ONZE', label: 'Futebol 11' },
    { value: 'FUTSAL', label: 'Futsal' },
    { value: 'BEACHTENNIS', label: 'Beach tennis' },
    { value: 'VOLEI', label: 'Vôlei' },
    { value: 'FUTEVOLEI', label: 'Futevôlei' },
    { value: 'BASQUETE', label: 'Basquete' },
    { value: 'HANDEBOL', label: 'Handebol' },
];

export const MATERIAIS_OPTIONS = [
    { value: 'BOLA', label: 'Bola' },
    { value: 'REDE', label: 'Rede' },
    { value: 'COLETE', label: 'Colete' },
    { value: 'APITO', label: 'Apito' },
    { value: 'LUVA', label: 'Luva' },
    { value: 'CONE', label: 'Cone' },
    { value: 'BOMBA', label: 'Bomba' },
    { value: 'TRAVE', label: 'Trave' },
    { value: 'ILUMINACAO', label: 'Iluminação' },
    { value: 'VESTIARIO', label: 'Vestiário' },
    { value: 'ESTACIONAMENTO', label: 'Estacionamento' },
    { value: 'CHURRASQUEIRA', label: 'Churrasqueira' },
    { value: 'LANCHONETE', label: 'Lanchonete' },
];

export const DURACAO_OPTIONS = [
    { value: 'TRINTA_MINUTOS', label: '30 minutos' },
    { value: 'UMA_HORA', label: '1 hora' },
    { value: 'UMA_HORA_E_MEIA', label: '1 hora e meia' },
    { value: 'DUAS_HORAS', label: '2 horas' },
];

export const STATUS_OPTIONS = [
    { label: 'Disponível', value: 'DISPONIVEL', hexColor: '#047857' },
    { label: 'Indisponível', value: 'INDISPONIVEL', hexColor: '#DC2626' },
    { label: 'Manutenção', value: 'MANUTENCAO', hexColor: '#2563EB' },
];

// Funções helpers para formatar
export const formatarEsporte = (esporte: string): string => {
    const option = TIPO_QUADRA_OPTIONS.find(opt => opt.value === esporte);
    return option ? option.label : esporte;
};

export const formatarMaterial = (material: string): string => {
    const option = MATERIAIS_OPTIONS.find(opt => opt.value === material);
    return option ? option.label : material;
};

export const formatarDuracao = (duracao: string): string => {
    const option = DURACAO_OPTIONS.find(opt => opt.value === duracao);
    return option ? option.label : duracao;
};

export const formatarStatus = (status: string): string => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option ? option.label : status;
};