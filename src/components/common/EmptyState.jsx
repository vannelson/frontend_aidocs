import { Box, Heading, Stack, Text } from '@chakra-ui/react'

function EmptyState({ title, description, action }) {
  return (
    <Stack
      align="flex-start"
      gap="4"
      rounded="28px"
      border="1px dashed rgba(148, 163, 184, 0.35)"
      bg="rgba(255, 255, 255, 0.75)"
      p={{ base: '6', md: '8' }}
    >
      <Box
        h="12"
        w="12"
        rounded="2xl"
        bg="linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,233,0.16))"
      />
      <Stack gap="1">
        <Heading size="md" color="var(--gd-text)">
          {title}
        </Heading>
        <Text color="var(--gd-muted)" maxW="520px">
          {description}
        </Text>
      </Stack>
      {action}
    </Stack>
  )
}

export default EmptyState
