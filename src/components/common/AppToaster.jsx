import {
  HStack,
  Portal,
  Stack,
  Text,
  Toast,
  Toaster,
} from '@chakra-ui/react'
import { toaster } from '../../utils/toaster'

function renderToastValue(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value instanceof Error) {
    return value.message || 'Something went wrong.'
  }

  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') {
      return value.message
    }

    try {
      return JSON.stringify(value)
    } catch {
      return 'Something went wrong.'
    }
  }

  return ''
}

export function AppToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            minW="320px"
            maxW="360px"
            borderRadius="18px"
            border="1px solid rgba(148, 163, 184, 0.2)"
            bg="rgba(15, 23, 42, 0.96)"
            color="white"
            boxShadow="0 24px 44px rgba(15, 23, 42, 0.28)"
            px="4"
            py="3"
          >
            <HStack align="start" gap="3">
              <Toast.Indicator mt="1" flexShrink="0" />
              <Stack gap="1" flex="1">
                {renderToastValue(toast.title) ? (
                  <Text fontSize="sm" fontWeight="700" lineHeight="1.3" color="white">
                    {renderToastValue(toast.title)}
                  </Text>
                ) : null}
                {renderToastValue(toast.description) ? (
                  <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.45">
                    {renderToastValue(toast.description)}
                  </Text>
                ) : null}
              </Stack>
              <Stack flexShrink="0" gap="0">
                <Toast.CloseTrigger />
              </Stack>
            </HStack>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  )
}
