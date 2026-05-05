import { Button, Heading, Stack, Text } from '@chakra-ui/react'

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <Stack
      align="flex-start"
      gap="4"
      rounded="28px"
      border="1px solid rgba(248, 113, 113, 0.22)"
      bg="rgba(255, 255, 255, 0.88)"
      p={{ base: '6', md: '8' }}
    >
      <Heading size="md" color="var(--gd-text)">
        {title}
      </Heading>
      <Text color="var(--gd-muted)">{description}</Text>
      {onRetry ? (
        <Button onClick={onRetry} bg="var(--gd-accent)" color="white" _hover={{ opacity: 0.92 }}>
          Try again
        </Button>
      ) : null}
    </Stack>
  )
}

export default ErrorState
