import { Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import DocumentCard from './DocumentCard'

function DocumentSection({ title, subtitle, documents, onOpen, onDelete }) {
  return (
    <Stack gap="5">
      <Stack gap="1">
        <Heading size="md" color="var(--gd-text)">
          {title}
        </Heading>
        <Text color="var(--gd-muted)">{subtitle}</Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="5">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} onOpen={onOpen} onDelete={onDelete} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default DocumentSection
