import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Clipboard } from 'react-native';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Icon, CloseIcon } from '@/components/ui/icon';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Input, InputField } from '@/components/ui/input';

import { getAgendamentoStatus, confirmarPagamentoPix } from '@/services/api/endpoints/atletaAgendamento';
import { PixPagamentoResponse } from '@/types/Agendamento';
import { useAuth } from '@/context/AuthContext';
import { useToastNotification } from '@/components/layout/useToastNotification';
import { formatarTelefone } from '@/utils/formatters';

interface ModalPixProps {
    open: boolean;
    onClose: () => void;
    pixData: PixPagamentoResponse | null;
    onPaymentSuccess: () => void;
}

const useCountdown = (expirationTime: string | undefined) => {
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!expirationTime) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiration = new Date(expirationTime).getTime();
            const distance = expiration - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ minutes: 0, seconds: 0 });
                return;
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft({ minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [expirationTime]);

    return timeLeft;
};

export const ModalPix: React.FC<ModalPixProps> = ({ open, onClose, pixData, onPaymentSuccess }) => {
    const { showToast } = useToastNotification();
    const [isCopied, setIsCopied] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
    const { user } = useAuth();

    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({
        nomeCompleto: user?.name || '',
        telefone: '' // user?.telefone if available
    });

    const timeLeft = useCountdown(pixData?.expiraEm);
    const hasExpired = timeLeft.minutes === 0 && timeLeft.seconds === 0;

    let rawPixCode = pixData?.copiaECola || '';
    rawPixCode = rawPixCode.replace(/^(http|https):\/\//, '');

    useEffect(() => {
        if (!open || !pixData || isPaid || hasExpired) return;

        const interval = setInterval(async () => {
            try {
                const { status } = await getAgendamentoStatus(pixData.agendamentoId);
                if (status === 'PAGO' || status === 'AGUARDANDO_CONFIRMACAO') {
                    setIsPaid(true);
                    clearInterval(interval);
                    setTimeout(() => {
                        onPaymentSuccess();
                    }, 3000);
                }
            } catch (error) {
                console.log("Erro ao verificar status do pagamento:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [open, pixData, onPaymentSuccess, isPaid, hasExpired]);


    const handleCopy = () => {
        if (rawPixCode) {
            Clipboard.setString(rawPixCode);
            setIsCopied(true);
            showToast("Código Pix copiado!", "success");
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleConfirmarPagamento = async () => {
        if (!pixData) return;
        setIsConfirming(true);
        try {
            await confirmarPagamentoPix(pixData.agendamentoId, {
                nomeCompleto: formData.nomeCompleto || "Não informado",
                telefone: formData.telefone || "Não informado"
            });
            showToast("Comprovante enviado com sucesso!", "success");
            setIsPaid(true);
            setTimeout(() => {
                onPaymentSuccess();
            }, 3000);
        } catch (error) {
            console.error("Erro ao confirmar pagamento:", error);
            showToast("Não foi possível confirmar o pagamento. Tente novamente.", "error");
        } finally {
            setIsConfirming(false);
        }
    };

    const renderContent = () => {
        if (isPaid) {
            return (
                <VStack className="items-center justify-center p-6 gap-4">
                    <Ionicons name="checkmark-circle" size={80} color="#16a34a" />
                    <Heading size="lg" className="text-center text-green-700">Comprovante Enviado!</Heading>
                    <Text className="text-center text-gray-500">
                        Fique atento ao seu aplicativo. A Arena irá verificar o seu pagamento em breve.
                    </Text>
                </VStack>
            );
        }
        if (hasExpired) {
            return (
                <VStack className="items-center justify-center p-6 gap-4">
                    <Ionicons name="warning" size={80} color="#eab308" />
                    <Heading size="lg" className="text-center text-yellow-600">Pix Expirado</Heading>
                    <Text className="text-center text-gray-500">
                        O tempo limite para este pagamento acabou. Por favor, feche e gere um novo Pix para continuar.
                    </Text>
                </VStack>
            );
        }

        if (step === 2) {
            return (
                <VStack space="md" className="p-4">
                    <Heading size="md" className="text-center text-gray-800">Dados do Pagador</Heading>
                    <Text className="text-center text-gray-500 mb-2">
                        Para garantir a segurança, informe os dados de quem realizou a transferência PIX.
                    </Text>

                    <VStack space="xs">
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Nome do Pagador"
                                value={formData.nomeCompleto}
                                onChangeText={val => setFormData({ ...formData, nomeCompleto: val })}
                            />
                        </Input>
                    </VStack>

                    <VStack space="xs">
                        <Input variant="outline" size="md">
                            <InputField
                                placeholder="Telefone de Contato"
                                value={formData.telefone}
                                keyboardType="phone-pad"
                                onChangeText={(val) => setFormData({ ...formData, telefone: formatarTelefone(val) })}
                            />
                        </Input>
                    </VStack>

                    <Button
                        size="xl"
                        className="bg-green-600 mt-4 h-12 rounded-xl"
                        onPress={handleConfirmarPagamento}
                        disabled={isConfirming || !formData.nomeCompleto || !formData.telefone}
                    >
                        {isConfirming ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold text-white">Confirmar Envio</ButtonText>}
                    </Button>

                    <Button
                        variant="link"
                        onPress={() => setStep(1)}
                        disabled={isConfirming}
                        className="mt-2"
                    >
                        <ButtonIcon as={() => <Ionicons name="arrow-back" size={16} color="#16a34a" />} className="mr-2" />
                        <ButtonText className="text-green-600 font-bold">Voltar para o QR Code</ButtonText>
                    </Button>
                </VStack>
            );
        }

        const qrCodeValue = pixData?.qrCodeData;
        const isBase64Image = qrCodeValue?.startsWith('iVBORw');

        return (
            <VStack space="md" className="items-center justify-center p-4">
                <Heading size="sm" className="text-center mb-2">Pague com Pix para confirmar</Heading>

                {isBase64Image ? (
                    <Image
                        source={{ uri: `data:image/png;base64,${qrCodeValue}` }}
                        style={{ width: 200, height: 200, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}
                    />
                ) : (
                    <View className="p-2 border border-outline-200 rounded-xl bg-white shadow-sm">
                        <QRCode value={rawPixCode || "N/A"} size={200} />
                    </View>
                )}

                <VStack className="items-center mt-2">
                    <Text className="font-bold text-gray-800">Expira em: <Text className="text-red-600 font-bold">{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</Text></Text>
                    <Text className="text-center text-xs text-gray-500 mt-1">Abra o app do seu banco e escaneie o código ou use o "Copia e Cola".</Text>
                </VStack>

                <HStack space="xs" className="w-full mt-4 border border-outline-300 rounded-xl overflow-hidden items-center p-1 pl-3 bg-gray-50">
                    <Text numberOfLines={1} className="flex-1 text-xs text-gray-500 mr-2">{rawPixCode}</Text>
                    <TouchableOpacity
                        onPress={handleCopy}
                        className={`px-4 py-2 rounded-lg flex-row items-center ${isCopied ? 'bg-green-100' : 'bg-green-600'}`}
                    >
                        <Ionicons name={isCopied ? "checkmark" : "copy-outline"} size={16} color={isCopied ? "#16a34a" : "white"} />
                        <Text className={`font-bold text-xs ml-1 ${isCopied ? 'text-green-700' : 'text-white'}`}>{isCopied ? "Copiado" : "Copiar"}</Text>
                    </TouchableOpacity>
                </HStack>

                <VStack className="w-full mt-6" space="md">
                    <Button
                        size="xl"
                        className="w-full bg-green-600 rounded-xl h-12"
                        onPress={() => setStep(2)}
                        disabled={isConfirming}
                    >
                        <ButtonText className="font-bold text-white">Já realizei o pagamento</ButtonText>
                    </Button>
                </VStack>
            </VStack>
        );
    }

    const handleCloseAttempt = () => {
        if (isPaid || hasExpired) {
            onClose();
            return;
        }
        setIsConfirmExitOpen(true);
    };

    const timeString = `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

    return (
        <>
            <Modal isOpen={open} onClose={handleCloseAttempt} size="lg">
                <ModalBackdrop />
                <ModalContent className="rounded-2xl">
                    <ModalHeader className="pb-2 border-b-0 justify-end">
                        {(!isPaid && !hasExpired) && (
                            <ModalCloseButton onPress={handleCloseAttempt}>
                                <Icon as={CloseIcon} />
                            </ModalCloseButton>
                        )}
                    </ModalHeader>
                    <ModalBody className="pb-6">
                        {renderContent()}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Confirm Exit Modal */}
            <Modal isOpen={isConfirmExitOpen} onClose={() => setIsConfirmExitOpen(false)} size="md">
                <ModalBackdrop />
                <ModalContent className="rounded-2xl">
                    <ModalHeader>
                        <Heading size="md">Aviso - Pagamento Pendente</Heading>
                    </ModalHeader>
                    <ModalBody>
                        <Text className="text-gray-600">
                            Caso você saia, sua reserva só será concluída se o pagamento for realizado nos próximos <Text className="font-bold">{timeString}</Text> minutos. Deseja sair mesmo assim?
                        </Text>
                    </ModalBody>
                    <VStack className="p-4 pt-2 gap-3" space="sm">
                        <Button variant="solid" className="bg-green-600 rounded-xl" onPress={() => setIsConfirmExitOpen(false)}>
                            <ButtonText className="font-bold text-white">Continuar no pagamento</ButtonText>
                        </Button>
                        <Button variant="outline" className="border-red-500 rounded-xl" onPress={() => {
                            setIsConfirmExitOpen(false);
                            onClose();
                        }}>
                            <ButtonText className="font-bold text-red-500">Sim, sair e cancelar</ButtonText>
                        </Button>
                    </VStack>
                </ModalContent>
            </Modal>
        </>
    );
};
