import { Dialog, XStack, YStack } from 'tamagui';
import { Button } from './Button';
import { Text } from './Text';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmIntent?: 'primary' | 'danger' | 'secondary' | 'ghost';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  confirmIntent = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog modal open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          backgroundColor="black"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          key="content"
          bordered
          elevate
          borderRadius="$5"
          padding="$5"
          width="85%"
          animation="quick"
          enterStyle={{ opacity: 0, scale: 0.95 }}
          exitStyle={{ opacity: 0, scale: 0.95 }}
        >
          <YStack gap="$3">
            <Dialog.Title>
              <Text size="$5" weight="700">{title}</Text>
            </Dialog.Title>

            <Dialog.Description>
              <Text size="$3" color="$textMuted">{message}</Text>
            </Dialog.Description>

            <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
              <Dialog.Close asChild>
                <Button intent="ghost" onPress={onCancel} width="auto">
                  {cancelLabel}
                </Button>
              </Dialog.Close>
              <Button intent={confirmIntent} onPress={onConfirm} width="auto">
                {confirmLabel}
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
