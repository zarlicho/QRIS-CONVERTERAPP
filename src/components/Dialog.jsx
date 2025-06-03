import { AlertDialog, Button, XStack, YStack } from 'tamagui'
export function Dialog({ trigger, onDelete}) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        {trigger}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={1}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          borderColor="#141414"
          borderWidth={3}
          backgroundColor="#faf4e6"
          elevate
          key="content"
          animation={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <AlertDialog.Title fontFamily="$geistMono" fontSize={24}>Delete</AlertDialog.Title>
            <AlertDialog.Description fontFamily="$geistMono">
              Yakin mau hapus Qris kamu?
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild borderColor="#141414" borderWidth={3}>
                <Button fontFamily="$geistMono">Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild borderColor="#141414" borderWidth={3} backgroundColor="#ff6842">
                <Button theme="accent" fontFamily="$geistMono" onPress={onDelete}>Delete</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}