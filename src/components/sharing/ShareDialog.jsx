import {
  Badge,
  Box,
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
import {
  fetchDocumentShares,
  shareDocument,
  updateDocumentShare,
} from '../../features/documents/documentsSlice'
import { fetchShareableUsers } from '../../features/users/usersSlice'
import { formatRoleLabel } from '../../utils/formatters'
import { toaster } from '../../utils/toaster'

function ShareDialog({ open, onOpenChange, documentId }) {
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.users)
  const { shareItems, shareListStatus, shareStatus } = useSelector((state) => state.documents)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [role, setRole] = useState('viewer')
  const [editingShareId, setEditingShareId] = useState(null)

  useEffect(() => {
    if (!open) {
      return
    }

    dispatch(fetchShareableUsers())
    dispatch(fetchDocumentShares(documentId))
  }, [dispatch, documentId, open])

  const canSubmit = useMemo(
    () => selectedUserIds.length > 0 && role,
    [role, selectedUserIds.length]
  )

  const selectedRoleLabel = formatRoleLabel(role)
  const sharedUserIds = useMemo(() => shareItems.map((share) => share.user?.id).filter(Boolean), [shareItems])

  const selectableUsers = useMemo(
    () => items.filter((user) => !sharedUserIds.includes(user.id)),
    [items, sharedUserIds]
  )

  const handleClose = () => {
    setSelectedUserIds([])
    setRole('viewer')
    setEditingShareId(null)
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

      toaster.create({
        title: 'Access granted',
        description:
          result.count === 1
            ? `${result.users[0]?.name} can now access this document as ${formatRoleLabel(result.role).toLowerCase()}.`
            : `${result.count} collaborators can now access this document as ${formatRoleLabel(result.role).toLowerCase()}.`,
        type: 'success',
      })

      setSelectedUserIds([])
      dispatch(fetchDocumentShares(documentId))
    } catch (error) {
      toaster.create({
        title: 'Unable to share document',
        description: error || 'Please try again.',
        type: 'error',
      })
    }
  }

  const handleRoleUpdate = async (shareId, nextRole, userName) => {
    setEditingShareId(shareId)

    try {
      await dispatch(
        updateDocumentShare({
          documentId,
          shareId,
          payload: { role: nextRole },
        })
      ).unwrap()

      toaster.create({
        title: 'Role updated',
        description: `${userName} is now a ${formatRoleLabel(nextRole).toLowerCase()}.`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: 'Unable to update role',
        description: error || 'Please try again.',
        type: 'error',
      })
    } finally {
      setEditingShareId(null)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Portal>
        <Dialog.Backdrop bg="rgba(15, 23, 42, 0.28)" backdropFilter="blur(5px)" />
        <Dialog.Positioner px="4">
          <Dialog.Content
            maxW="860px"
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
                  Add new collaborators, then manage existing access in the table below.
                </Text>
              </Stack>
            </Dialog.Header>

            <Dialog.Body px="6" py="4">
              <Stack gap="7">
                <Stack gap="5">
                  <Text fontSize="sm" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="#2563eb">
                    Add Collaborators
                  </Text>

                  <Field.Root>
                    <Field.Label fontWeight="600">Available users</Field.Label>
                    <Stack
                      gap="3"
                      maxH="220px"
                      overflowY="auto"
                      rounded="22px"
                      border="1px solid rgba(148, 163, 184, 0.18)"
                      bg="rgba(248, 250, 252, 0.72)"
                      p="3"
                    >
                      {status === 'loading' ? (
                        <Text fontSize="sm" color="var(--gd-muted)">Loading available users...</Text>
                      ) : null}

                      {status !== 'loading' && selectableUsers.length === 0 ? (
                        <Text fontSize="sm" color="var(--gd-muted)">
                          Everyone else already has access to this document.
                        </Text>
                      ) : null}

                      {selectableUsers.map((user) => {
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
                                  {selectedRoleLabel}
                                </Badge>
                              ) : null}
                            </HStack>
                          </Checkbox.Root>
                        )
                      })}
                    </Stack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label fontWeight="600">Access role for new collaborators</Field.Label>
                    <Text fontSize="sm" color="var(--gd-muted)" mb="2">
                      Selected collaborators will be added as {selectedRoleLabel.toLowerCase()}s.
                    </Text>
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

                  <Flex justify="space-between" align="center" gap="3" wrap="wrap">
                    <Text fontSize="sm" color="var(--gd-muted)">
                      {selectedUserIds.length > 0
                        ? `${selectedUserIds.length} collaborator${selectedUserIds.length > 1 ? 's' : ''} selected as ${selectedRoleLabel.toLowerCase()}`
                        : 'No collaborators selected yet'}
                    </Text>

                    <HStack gap="3">
                      {selectedUserIds.length > 0 ? (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUserIds([])}>
                          Clear selection
                        </Button>
                      ) : null}
                      <Button
                        loading={shareStatus === 'loading' && editingShareId === null}
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
                    </HStack>
                  </Flex>
                </Stack>

                <Stack gap="4">
                  <Text fontSize="sm" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="#2563eb">
                    Current Access
                  </Text>

                  <Box
                    border="1px solid rgba(148, 163, 184, 0.18)"
                    rounded="22px"
                    overflow="hidden"
                    bg="white"
                  >
                    <Box px="5" py="3" bg="rgba(248, 250, 252, 0.9)" borderBottom="1px solid rgba(148, 163, 184, 0.18)">
                      <HStack gap="4" fontSize="sm" fontWeight="700" color="var(--gd-text)">
                        <Box flex="1">User</Box>
                        <Box w="180px">Role</Box>
                      </HStack>
                    </Box>

                    <Stack gap="0">
                      {shareListStatus === 'loading' ? (
                        <Box px="5" py="4">
                          <Text fontSize="sm" color="var(--gd-muted)">Loading current collaborators...</Text>
                        </Box>
                      ) : null}

                      {shareListStatus !== 'loading' && shareItems.length === 0 ? (
                        <Box px="5" py="4">
                          <Text fontSize="sm" color="var(--gd-muted)">This document has not been shared yet.</Text>
                        </Box>
                      ) : null}

                      {shareItems.map((share) => (
                        <Flex
                          key={share.id}
                          px="5"
                          py="4"
                          align={{ base: 'flex-start', md: 'center' }}
                          direction={{ base: 'column', md: 'row' }}
                          gap="4"
                          borderTop="1px solid rgba(148, 163, 184, 0.12)"
                        >
                          <Stack gap="0.5" flex="1">
                            <Text fontWeight="700" color="var(--gd-text)">
                              {share.user?.name}
                            </Text>
                            <Text fontSize="sm" color="var(--gd-muted)">
                              {share.user?.email}
                            </Text>
                          </Stack>

                          <Box w={{ base: 'full', md: '180px' }}>
                            <NativeSelect.Root>
                              <NativeSelect.Field
                                value={share.role}
                                onChange={(event) =>
                                  handleRoleUpdate(share.id, event.target.value, share.user?.name || 'Collaborator')
                                }
                                disabled={shareStatus === 'loading' && editingShareId === share.id}
                                borderRadius="16px"
                                borderColor="rgba(148, 163, 184, 0.26)"
                                bg="rgba(248, 250, 252, 0.9)"
                              >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                              </NativeSelect.Field>
                              <NativeSelect.Indicator />
                            </NativeSelect.Root>
                          </Box>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer px="6" pb="6">
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default ShareDialog
