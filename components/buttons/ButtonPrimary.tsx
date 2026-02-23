import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';

interface ButtonPrimaryProps {
    readonly text: string;
    readonly loading: boolean;
    readonly handleAction: () => Promise<void> | void;
    readonly className?: string;
    readonly disabled?: boolean;
}

export function ButtonPrimary({ text, loading, handleAction, className, disabled }: ButtonPrimaryProps) {
    return (
        <Button
            size="xl"
            className={`flex-1 bg-green-primary rounded-2xl py-3 ${className}`}
            onPress={handleAction}
            disabled={loading || disabled}
        >
            {loading ? <ButtonSpinner /> : <ButtonText className="text-base text-white">{text}</ButtonText>}
        </Button>
    )
}
