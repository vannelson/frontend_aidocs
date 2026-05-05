import { Flex, Spinner, Text } from '@chakra-ui/react'

function LoadingState({ label = 'Loading…', minH = '240px' }) {
  return (
    <Flex
      minH={minH}
      align="center"
      justify="center"
      direction="column"
      gap="3"
      rounded="28px"
      border="1px solid rgba(148, 163, 184, 0.18)"
      bg="rgba(255, 255, 255, 0.72)"
    >
      <Spinner size="lg" color="var(--gd-accent)" />
      <Text color="var(--gd-muted)">{label}</Text>
    </Flex>
  )
}

export default LoadingState
