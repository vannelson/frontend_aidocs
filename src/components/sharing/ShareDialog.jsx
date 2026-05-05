import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Field,
  Flex,
  HStack,
  NativeSelect,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheck } from 'react-icons/fi'
import { shareDocument } from '../../features/documents/documentsSlice'
import { fetchShareableUsers } from '../../features/users/usersSlice'
import { formatRoleLabel } from '../../utils/formatters'
import { toaster } from '../../utils/toaster'

function ShareDialog({ open, onOpenChange, documentId }) {
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.users)
  const shareStatus = useSelector((state) => state.documents.shareStatus)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [role, setRole] = useState('viewer')

  useEffect(() => {
    if (open) {
      dispatch(fetchShareableUsers())
    }
  }, [dispatch, open])

  const canSubmit = useMemo(
    () => selectedUserIds.length > 0 && role,
    [role, selectedUserIds.length]
  )

  const handleClose = () => {
    setSelectedUserIds([])
    setRole('viewer')
    onOpenChange(false)
  }

  const toggleUser = (userId, checked) => {
    setSelectedUserIds((current) => {
      if (checked) {
        return current.includes(userId) ? current : [...current, userId]
      }

      return current.filter((id) => id !== userId)
    })
  }

  const handleShare = async () => {
    if (!canSubmit) {
      return
    }

    try {
      const result = await dispatch(
        shareDocument({
          documentId,
          payload: {
            user_ids: selectedUserIds,
            role,
          },
        })
      ).unwrap()

      const description =
        result.count === 1
          ? `${result.users[0]?.name} can now access this document as ${formatRoleLabel(result.role).toLowerCase()}.`
          : `${result.count} collaborators can now access this document as ${formatRoleLabel(result.role).toLowerCase()}.`

      toaster.create({
        title: 'Access granted',
        description,
        type: 'success',
      })

      handleClose()
    } catch (error) {
      toaster.create({
        title: 'Unable to share document',
        description: error || 'Please try again.',
        type: 'error',
      })
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop bg="rgba(15, 23, 42, 0.28)" backdropFilter="blur(5px)" />
        <Dialog.Positioner px="4">
          <Dialog.Content
            maxW="720px"
            rounded="30px"
            border="1px solid rgba(148, 163, 184, 0.18)"
            p="0"
          >
            <Dialog.Header px="6" pt="6">
              <Stack gap="2">
                <Dialog.Title fontSize="xl" color="var(--gd-text)">
                  Share document
                </Dialog.Title>
                <Text color="var(--gd-muted)">
                  Choose one or more collaborators and apply the same access role to everyone you select.
                </Text>
              </Stack>
            </Dialog.Header>

            <Dialog.Body px="6" py="4">
              <Stack gap="5">
                <Field.Root>
                  <Field.Label fontWeight="600">Collaborators</Field.Label>
                  <Stack
                    gap="3"
                    maxH="280px"
                    overflowY="auto"
                    rounded="22px"
                    border="1px solid rgba(148, 163, 184, 0.18)"
                    bg="rgba(248, 250, 252, 0.72)"
                    p="3"
                  >
                    {items.map((user) => {
                      const isSelected = selectedUserIds.includes(user.id)

                      return (
                        <Checkbox.Root
                          key={user.id}
                          checked={isSelected}
                          onCheckedChange={(details) => toggleUser(user.id, Boolean(details.checked))}
                          rounded="20px"
                          border="1px solid rgba(148, 163, 184, 0.18)"
                          bg={isSelected ? 'rgba(37, 99, 235, 0.08)' : 'white'}
                          px="4"
                          py="3"
                          transition="background 140ms ease, border-color 140ms ease"
                          _hover={{ borderColor: 'rgba(37, 99, 235, 0.28)' }}
                        >
                          <Checkbox.HiddenInput />
                          <HStack w="full" justify="space-between" align="start" gap="4">
                            <HStack align="start" gap="3" flex="1">
                              <Checkbox.Control mt="0.5">
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                              <Stack gap="0.5">
                                <Checkbox.Label fontWeight="700" color="var(--gd-text)">
                                  {user.name}
                                </Checkbox.Label>
                                <Text fontSize="sm" color="var(--gd-muted)">
                                  {user.email}
                                </Text>
                              </Stack>
                            </HStack>

                            {isSelected ? (
                              <Badge rounded="full" bg="rgba(37, 99, 235, 0.12)" color="#1d4ed8">
                                Selected
                              </Badge>
                            ) : null}
                          </HStack>
                        </Checkbox.Root>
                      )
                    })}
                  </Stack>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600">Access role</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      borderRadius="18px"
                      borderColor="rgba(148, 163, 184, 0.26)"
                      bg="rgba(248, 250, 252, 0.9)"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                {status === 'loading' ? (
                  <Text fontSize="sm" color="var(--gd-muted)">
                    Loading available users...
                  </Text>
                ) : null}

                <Flex justify="space-between" align="center" gap="3" wrap="wrap">
                  <Text fontSize="sm" color="var(--gd-muted)">
                    {selectedUserIds.length > 0
                      ? `${selectedUserIds.length} collaborator${selectedUserIds.length > 1 ? 's' : ''} selected`
                      : 'No collaborators selected yet'}
                  </Text>

                  {selectedUserIds.length > 0 ? (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUserIds([])}>
                      Clear selection
                    </Button>
                  ) : null}
                </Flex>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer px="6" pb="6">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                loading={shareStatus === 'loading'}
                onClick={handleShare}
                bg="var(--gd-accent)"
                color="white"
                _hover={{ opacity: 0.92 }}
                disabled={!canSubmit}
              >
                <HStack gap="2">
                  <FiCheck />
                  <Text>Share access</Text>
                </HStack>
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default ShareDialog
