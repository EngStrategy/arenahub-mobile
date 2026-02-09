import { Button, ButtonText } from '@/components/ui/button';

interface ButtonCancelProps {
    readonly text: string;
    readonly loading: boolean;
    readonly handleAction: () => void;
}

export function ButtonCancel({ text, loading, handleAction }: ButtonCancelProps) {
    return (
        <Button
            size="xl"
            className="flex-1 bg-gray-200 rounded-3xl py-3"
            onPress={handleAction}
            disabled={loading}
        >
            <ButtonText className="text-base text-gray-600">
                {text}
            </ButtonText>
        </Button>
    )
}
