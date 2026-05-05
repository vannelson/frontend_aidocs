import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'

function ImportDialog({ open, onOpenChange, onImport, isSubmitting }) {
  const [file, setFile] = useState(null)

  const handleClose = () => {
    setFile(null)
    onOpenChange(false)
  }

  const handleImport = async () => {
    if (!file) {
      return
    }

    const imported = await onImport(file)
    if (imported) {
      setFile(null)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop bg="rgba(15, 23, 42, 0.28)" backdropFilter="blur(5px)" />
        <Dialog.Positioner>
          <Dialog.Content rounded="30px" border="1px solid rgba(148, 163, 184, 0.18)" p="0">
            <Dialog.Header px="6" pt="6">
              <Dialog.Title fontSize="xl" color="var(--gd-text)">
                Import document
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body px="6" py="4">
              <Stack gap="4">
                <Text color="var(--gd-muted)">
                  Upload a plain text or Markdown file and turn it into a new editable document.
                </Text>
                <Field.Root>
                  <Field.Label fontWeight="600">Supported formats</Field.Label>
                  <Input
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                    p="1.5"
                    borderRadius="18px"
                    borderColor="rgba(148, 163, 184, 0.26)"
                    bg="rgba(248, 250, 252, 0.9)"
                  />
                </Field.Root>
                {file ? (
                  <Text fontSize="sm" color="var(--gd-muted)">
                    Selected: {file.name}
                  </Text>
                ) : null}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer px="6" pb="6">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                loading={isSubmitting}
                onClick={handleImport}
                bg="var(--gd-accent)"
                color="white"
                _hover={{ opacity: 0.92 }}
              >
                Import file
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default ImportDialog
