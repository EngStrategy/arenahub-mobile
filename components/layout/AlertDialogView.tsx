import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

interface AlertDialogViewProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onConfirm: () => void;
    readonly title: string;
    readonly description: string;
    readonly confirmText?: string;
    readonly cancelText?: string;
    readonly action?: 'primary' | 'negative' | 'positive' | 'default' | 'secondary';
    readonly isLoading?: boolean;
}

export function AlertDialogView({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    action = "negative",
    isLoading = false,
}: AlertDialogViewProps) {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        {title}
                    </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-4">
                    <Text size="sm">
                        {description}
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={onClose}
                        isDisabled={isLoading}
                    >
                        <ButtonText>{cancelText}</ButtonText>
                    </Button>
                    <Button
                        variant="outline"
                        action={action}
                        onPress={onConfirm}
                        isDisabled={isLoading}
                    >
                        <ButtonText>{confirmText}</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}