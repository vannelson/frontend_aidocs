import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiPlus, FiUploadCloud } from 'react-icons/fi'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import DocumentSection from '../components/documents/DocumentSection'
import ImportDialog from '../components/sharing/ImportDialog'
import { createDocument, deleteDocument, fetchDocuments, importDocument } from '../features/documents/documentsSlice'
import { toaster } from '../utils/toaster'

function DocumentsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { ownedDocuments, sharedDocuments, listStatus, actionStatus, error } = useSelector(
    (state) => state.documents
  )
  const [isImportOpen, setIsImportOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchDocuments())
  }, [dispatch])

  const openDocument = (documentId) => navigate(`/documents/${documentId}`)

  const handleCreateDocument = async () => {
    try {
      const document = await dispatch(
        createDocument({
          title: 'Untitled document',
          content: '<p>Start writing here…</p>',
        })
      ).unwrap()

      navigate(`/documents/${document.id}`)
    } catch (requestError) {
      toaster.create({
        title: 'Unable to create document',
        description: requestError || 'Please try again.',
        type: 'error',
      })
    }
  }

  const handleImportDocument = async (file) => {
    try {
      const document = await dispatch(importDocument(file)).unwrap()
      toaster.create({
        title: 'Document imported',
        description: `${document.title} is ready to edit.`,
        type: 'success',
      })
      setIsImportOpen(false)
      navigate(`/documents/${document.id}`)

      return true
    } catch (requestError) {
      toaster.create({
        title: 'Import failed',
        description: requestError || 'Please upload a .txt or .md file.',
        type: 'error',
      })

      return false
    }
  }

  const handleDeleteDocument = async (document) => {
    const shouldDelete = window.confirm(`Delete "${document.title}"? This action cannot be undone.`)

    if (!shouldDelete) {
      return
    }

    try {
      await dispatch(deleteDocument(document.id)).unwrap()
      toaster.create({
        title: 'Document deleted',
        description: `${document.title} has been removed.`,
        type: 'success',
      })
    } catch (requestError) {
      toaster.create({
        title: 'Unable to delete document',
        description: requestError || 'Please try again.',
        type: 'error',
      })
    }
  }

  const showEmptyWorkspace = !ownedDocuments.length && !sharedDocuments.length && listStatus === 'succeeded'

  return (
    <Stack gap={{ base: '8', md: '10' }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        gap="6"
      >
        <Stack gap="3" maxW="3xl">
          <Text
            fontSize="sm"
            fontWeight="700"
            letterSpacing="0.12em"
            textTransform="uppercase"
            color="var(--gd-accent)"
          >
            Document workspace
          </Text>
          <Heading
            fontSize={{ base: '3xl', md: '5xl' }}
            lineHeight="1.02"
            letterSpacing="-0.04em"
            color="var(--gd-text)"
          >
            Create, shape, and share docs in a focused writing flow.
          </Heading>
          <Text fontSize="lg" color="var(--gd-muted)" maxW="2xl">
            GoodDocs keeps the interface light and the document front and center, with just enough
            structure for ownership, sharing, and file import.
          </Text>
        </Stack>

        <Stack direction={{ base: 'column', sm: 'row' }} gap="3">
          <Button
            variant="outline"
            rounded="full"
            borderColor="rgba(148, 163, 184, 0.26)"
            onClick={() => setIsImportOpen(true)}
          >
            <HStack gap="2">
              <FiUploadCloud />
              <Text>Import .txt / .md</Text>
            </HStack>
          </Button>
          <Button
            rounded="full"
            bg="var(--gd-accent)"
            color="white"
            _hover={{ opacity: 0.92 }}
            loading={actionStatus === 'loading'}
            onClick={handleCreateDocument}
          >
            <HStack gap="2">
              <FiPlus />
              <Text>New document</Text>
            </HStack>
          </Button>
        </Stack>
      </Flex>

      <Box
        rounded="34px"
        border="1px solid rgba(148, 163, 184, 0.16)"
        bg="rgba(255, 255, 255, 0.72)"
        px={{ base: '5', md: '8' }}
        py={{ base: '6', md: '8' }}
        boxShadow="0 28px 50px rgba(15, 23, 42, 0.08)"
      >
        <Stack gap="8">
          {listStatus === 'loading' ? <LoadingState label="Loading your documents…" /> : null}

          {listStatus === 'failed' ? (
            <ErrorState description={error || 'Unable to load your workspace.'} onRetry={() => dispatch(fetchDocuments())} />
          ) : null}

          {showEmptyWorkspace ? (
            <EmptyState
              title="No documents yet"
              description="Create a fresh document or import a .txt or .md file to start building your GoodDocs workspace."
              action={
                <Button
                  rounded="full"
                  bg="var(--gd-accent)"
                  color="white"
                  _hover={{ opacity: 0.92 }}
                  onClick={handleCreateDocument}
                >
                  <HStack gap="2">
                    <FiArrowRight />
                    <Text>Create your first document</Text>
                  </HStack>
                </Button>
              }
            />
          ) : null}

          {ownedDocuments.length > 0 ? (
            <DocumentSection
              title="Owned by me"
              subtitle="Documents you created and control."
              documents={ownedDocuments}
              onOpen={openDocument}
              onDelete={handleDeleteDocument}
            />
          ) : null}

          {sharedDocuments.length > 0 ? (
            <DocumentSection
              title="Shared with me"
              subtitle="Documents other teammates invited you to access."
              documents={sharedDocuments}
              onOpen={openDocument}
            />
          ) : null}
        </Stack>
      </Box>

      <ImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportDocument}
        isSubmitting={actionStatus === 'loading'}
      />
    </Stack>
  )
}

export default DocumentsPage
