import { Badge, Box, HStack, Stack, Text } from '@chakra-ui/react'
import { FiFileText, FiShare2 } from 'react-icons/fi'
import { extractTextPreview, formatRelativeTime, formatRoleLabel } from '../../utils/formatters'

function DocumentCard({ document, onOpen }) {
  const preview = extractTextPreview(document.content)
  const isShared = document.ownership_type === 'shared'

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onOpen(document.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onOpen(document.id)
        }
      }}
      rounded="28px"
      border="1px solid rgba(148, 163, 184, 0.18)"
      bg="rgba(255, 255, 255, 0.88)"
      p="5"
      boxShadow="0 16px 30px rgba(15, 23, 42, 0.06)"
      transition="transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 24px 40px rgba(15, 23, 42, 0.10)',
        borderColor: 'rgba(37, 99, 235, 0.24)',
      }}
      _focusVisible={{
        outline: '2px solid var(--gd-accent)',
        outlineOffset: '3px',
      }}
    >
      <Stack gap="4">
        <HStack justify="space-between" align="start">
          <HStack gap="3" align="start">
            <Box
              rounded="2xl"
              bg={isShared ? 'rgba(14, 165, 233, 0.12)' : 'rgba(37, 99, 235, 0.12)'}
              color={isShared ? '#0284c7' : '#2563eb'}
              p="3"
            >
              {isShared ? <FiShare2 size={18} /> : <FiFileText size={18} />}
            </Box>
            <Stack gap="1">
              <Text fontWeight="700" color="var(--gd-text)" lineClamp="2">
                {document.title}
              </Text>
              <Text fontSize="sm" color="var(--gd-muted)">
                Updated {formatRelativeTime(document.updated_at)}
              </Text>
            </Stack>
          </HStack>

          <Badge
            rounded="full"
            px="3"
            py="1"
            bg={isShared ? 'rgba(14, 165, 233, 0.12)' : 'rgba(37, 99, 235, 0.12)'}
            color={isShared ? '#0369a1' : '#1d4ed8'}
            textTransform="none"
            fontWeight="700"
          >
            {formatRoleLabel(document.access_role)}
          </Badge>
        </HStack>

        <Stack gap="2">
          <Box h="1" rounded="full" bg="rgba(226, 232, 240, 0.75)" overflow="hidden">
            <Box
              h="full"
              w={isShared ? '48%' : '64%'}
              rounded="full"
              bg={isShared ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)' : 'linear-gradient(90deg, #2563eb, #60a5fa)'}
            />
          </Box>
          <Text fontSize="sm" color="var(--gd-muted)" minH="44px">
            {preview || 'Start writing to see a preview of your document content.'}
          </Text>
        </Stack>
      </Stack>
    </Box>
  )
}

export default DocumentCard
