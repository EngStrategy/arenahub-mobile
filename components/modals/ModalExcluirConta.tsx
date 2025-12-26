import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { deleteArena } from "@/services/api/entities/arena";
import { getUserId } from "@/context/functions/getUserId";
import { HStack } from "@/components/ui/hstack";
import React, { useState } from "react";

interface ModalExcluirContaProps {
    // userId : number;
    isOpen: boolean;
    onClose: () => void;
}

export function ModalExcluirConta({
    isOpen ,
    onClose,
    // userId,
}: Readonly<ModalExcluirContaProps>) {
    const [loading, setLoading] = useState(false);

    const excluirConta = async () => {
        const userId = await getUserId();

        setLoading(true);
        try {
            await deleteArena(userId);
            onClose();
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Text className="text-xl font-medium">
                        Você tem certeza que deseja excluir sua conta?
                    </Text>
                </ModalHeader>

                <ModalBody>
                        <Text>Essa ação não pode ser desfeita.</Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        size="md"
                        className="bg-red-600 px-6 py-2 rounded-full"
                        onPress={excluirConta}
                        isDisabled={loading}
                    >
                        <ButtonText>
                            {loading ? "Excluindo..." : "Excluir conta"}
                        </ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}