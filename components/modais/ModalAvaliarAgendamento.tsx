import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { StarRating } from "@/components/avaliacoes/starRating";
import { Text } from "@/components/ui/text";
import { InputTextArea } from "../forms/formInputs/InputTextArea";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import React, { useState } from "react";
import { avaliarAgendamento } from "@/services/api/entities/agendamento";

export function ModalAvaliarAgendamento({
    isOpen,
    onClose,
    agendamentoId,
}) {
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);

    const enviarAvaliacao = async () => {
        if (nota === 0) return;

        setLoading(true);
        try {
            await avaliarAgendamento(agendamentoId, {
                nota,
                comentario,
            });

            onClose();
        } catch (err) {
            console.log("Erro ao avaliar", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Text className="text-lg font-medium">
                        Avaliar agendamento
                    </Text>
                </ModalHeader>

                <ModalBody>
                    <VStack space="md">
                        <Text>Como foi sua experiência?</Text>

                        <StarRating value={nota} onChange={setNota} />

                        <InputTextArea
                            label="Comentario"
                            placeholder="Conta pra gente como foi sua experiência."
                            value={comentario}
                            onChangeText={setComentario}
                            optional
                        />

                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        size="md"
                        className="bg-green-primary px-6 py-2 rounded-full"
                        onPress={enviarAvaliacao}
                        isDisabled={nota === 0 || loading}
                    >
                        <ButtonText>
                            {loading ? "Enviando..." : "Enviar avaliação"}
                        </ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}



