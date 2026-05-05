import { Badge, Box, Button, Flex, Heading, HStack, Input, Separator, Stack, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiDownload, FiFileText, FiSave, FiShare2 } from 'react-icons/fi'
import DocumentToolbar from '../components/editor/DocumentToolbar'
import RichTextEditor from '../components/editor/RichTextEditor'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import ShareDialog from '../components/sharing/ShareDialog'
import { documentService } from '../services/documentService'
import {
  clearCurrentDocument,
  fetchDocumentById,
  updateDocument,
} from '../features/documents/documentsSlice'
import { formatRoleLabel, formatTimestamp } from '../utils/formatters'
import { toaster } from '../utils/toaster'

function EditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentDocument, currentStatus, error } = useSelector((state) => state.documents)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('<p></p>')
  const [saveState, setSaveState] = useState('idle')
  const [lastSavedAt, setLastSavedAt] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [exportingType, setExportingType] = useState('')
  const baselineRef = useRef({ title: '', content: '' })
  const autosaveTimerRef = useRef(null)
  const loadedDocumentIdRef = useRef(null)

  useEffect(() => {
    dispatch(fetchDocumentById(id))

    return () => {
      dispatch(clearCurrentDocument())
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [dispatch, id])

  useEffect(() => {
    if (!currentDocument || String(currentDocument.id) !== String(id)) {
      return
    }

    if (loadedDocumentIdRef.current !== currentDocument.id) {
      const nextTitle = currentDocument.title || 'Untitled document'
      const nextContent = currentDocument.content || '<p></p>'

      setTitle(nextTitle)
      setContent(nextContent)
      setSaveState('saved')
      setLastSavedAt(currentDocument.updated_at)
      baselineRef.current = { title: nextTitle, content: nextContent }
      loadedDocumentIdRef.current = currentDocument.id
    }
  }, [currentDocument, id])

  const canEdit = useMemo(() => {
    return ['owner', 'editor'].includes(currentDocument?.access_role)
  }, [currentDocument?.access_role])

  const isOwner = currentDocument?.access_role === 'owner'

  const performSave = useCallback(async ({ notifyOnSuccess = false } = {}) => {
    if (!currentDocument || !canEdit) {
      return
    }

    const hasChanges =
      title !== baselineRef.current.title || content !== baselineRef.current.content

    if (!hasChanges) {
      setSaveState('saved')

      if (notifyOnSuccess) {
        toaster.create({
          title: 'Already Saved',
          description: 'This document already has your latest changes.',
          type: 'success',
        })
      }

      return
    }

    setSaveState('saving')

    try {
      const document = await dispatch(
        updateDocument({
          documentId: currentDocument.id,
          payload: {
            title,
            content,
          },
        })
      ).unwrap()

      baselineRef.current = { title: document.title, content: document.content }
      setSaveState('saved')
      setLastSavedAt(document.updated_at)

      if (notifyOnSuccess) {
        toaster.create({
          title: 'Successfully Save',
          description: 'Your latest changes have been saved.',
          type: 'success',
        })
      }
    } catch (requestError) {
      setSaveState('error')
      toaster.create({
        title: 'Save failed',
        description: requestError || 'Please try again.',
        type: 'error',
      })
    }
  }, [canEdit, content, currentDocument, dispatch, title])

  const handleManualSave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    performSave({ notifyOnSuccess: true })
  }, [performSave])

  const downloadBlob = useCallback((blob, fileName) => {
    const url = window.URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')

    anchor.href = url
    anchor.download = fileName
    window.document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(url)
  }, [])

  const buildDownloadFileName = useCallback((extension) => {
    const safeTitle = (title || currentDocument?.title || 'untitled-document')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return `${safeTitle || 'untitled-document'}.${extension}`
  }, [currentDocument?.title, title])

  const handleExport = useCallback(async (type) => {
    if (!currentDocument) {
      return
    }

    setExportingType(type)

    try {
      const blob = type === 'pdf'
        ? await documentService.exportPdf(currentDocument.id)
        : await documentService.exportWord(currentDocument.id)

      downloadBlob(blob, buildDownloadFileName(type === 'pdf' ? 'pdf' : 'docx'))

      toaster.create({
        title: type === 'pdf' ? 'PDF export ready' : 'Word export ready',
        description: `Your document has been downloaded as ${type === 'pdf' ? 'PDF' : 'Word'}.`,
        type: 'success',
      })
    } catch (requestError) {
      toaster.create({
        title: 'Export failed',
        description: requestError || 'Please try again.',
        type: 'error',
      })
    } finally {
      setExportingType('')
    }
  }, [buildDownloadFileName, currentDocument, downloadBlob])

  useEffect(() => {
    if (!currentDocument || !canEdit || loadedDocumentIdRef.current !== currentDocument.id) {
      return
    }

    const hasChanges =
      title !== baselineRef.current.title || content !== baselineRef.current.content

    if (!hasChanges) {
      return
    }

    setSaveState('pending')

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(() => {
      performSave()
    }, 950)

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [canEdit, content, currentDocument, performSave, title])

  if (currentStatus === 'loading') {
    return <LoadingState label="Opening document…" minH="70vh" />
  }

  if (currentStatus === 'failed') {
    return (
      <ErrorState
        title="Document unavailable"
        description={error || 'This document could not be opened.'}
        onRetry={() => dispatch(fetchDocumentById(id))}
      />
    )
  }

  if (!currentDocument) {
    return null
  }

  return (
    <Stack gap="6">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap="4">
        <Stack gap="2">
          <Button variant="ghost" alignSelf="flex-start" onClick={() => navigate('/documents')}>
            <HStack gap="2">
              <FiArrowLeft />
              <Text>Back to documents</Text>
            </HStack>
          </Button>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} lineHeight="1.05" color="var(--gd-text)">
            Writing workspace
          </Heading>
        </Stack>

        <HStack gap="3" wrap="wrap">
          <Badge
            rounded="full"
            px="3"
            py="1.5"
            bg="rgba(37, 99, 235, 0.10)"
            color="#1d4ed8"
            textTransform="none"
            fontWeight="700"
          >
            {formatRoleLabel(currentDocument.access_role)}
          </Badge>
          <Button variant="outline" rounded="full" onClick={handleManualSave} disabled={!canEdit}>
            <HStack gap="2">
              <FiSave />
              <Text>{saveState === 'saving' ? 'Saving...' : 'Save now'}</Text>
            </HStack>
          </Button>
          <Button
            variant="outline"
            rounded="full"
            onClick={() => handleExport('pdf')}
            loading={exportingType === 'pdf'}
            disabled={exportingType === 'word'}
          >
            <HStack gap="2">
              <FiDownload />
              <Text>Export PDF</Text>
            </HStack>
          </Button>
          <Button
            variant="outline"
            rounded="full"
            onClick={() => handleExport('word')}
            loading={exportingType === 'word'}
            disabled={exportingType === 'pdf'}
          >
            <HStack gap="2">
              <FiFileText />
              <Text>Export Word</Text>
            </HStack>
          </Button>
          {isOwner ? (
            <Button
              rounded="full"
              bg="var(--gd-accent)"
              color="white"
              _hover={{ opacity: 0.92 }}
              onClick={() => setShareOpen(true)}
            >
              <HStack gap="2">
                <FiShare2 />
                <Text>Share</Text>
              </HStack>
            </Button>
          ) : null}
        </HStack>
      </Flex>

      {!canEdit ? (
        <Box
          rounded="24px"
          border="1px solid rgba(14, 165, 233, 0.16)"
          bg="rgba(240, 249, 255, 0.82)"
          px="5"
          py="4"
        >
          <Text color="#0369a1" fontWeight="600">
            You have view-only access to this document.
          </Text>
        </Box>
      ) : null}

      <Box
        rounded="34px"
        border="1px solid rgba(148, 163, 184, 0.18)"
        bg="rgba(248, 250, 252, 0.76)"
        p={{ base: '4', md: '6' }}
        boxShadow="0 30px 50px rgba(15, 23, 42, 0.08)"
      >
        <Stack gap="4">
          <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="4" direction={{ base: 'column', md: 'row' }}>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={!canEdit}
              variant="unstyled"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              lineHeight="1.1"
              letterSpacing="-0.04em"
              color="var(--gd-text)"
              placeholder="Untitled document"
            />

            <Stack gap="1" minW="184px" align={{ base: 'flex-start', md: 'flex-end' }}>
              <Text fontSize="sm" color="var(--gd-muted)">
                {saveState === 'saving'
                  ? 'Saving changes…'
                  : saveState === 'error'
                    ? 'Save failed'
                    : saveState === 'pending'
                      ? 'Changes pending'
                      : 'All changes saved'}
              </Text>
              <Text fontSize="sm" color="var(--gd-muted)">
                {lastSavedAt ? `Updated ${formatTimestamp(lastSavedAt)}` : 'Not saved yet'}
              </Text>
            </Stack>
          </Flex>

          <Separator />

          <Box
            rounded="32px"
            border="1px solid rgba(148, 163, 184, 0.16)"
            bg="white"
            px={{ base: '5', md: '10' }}
            py={{ base: '6', md: '8' }}
            minH="70vh"
            maxW="4xl"
            mx="auto"
            w="full"
            boxShadow="0 32px 64px rgba(15, 23, 42, 0.09)"
          >
            <EditorWithToolbar
              content={content}
              onChange={setContent}
              canEdit={canEdit}
            />
          </Box>
        </Stack>
      </Box>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} documentId={currentDocument.id} />
    </Stack>
  )
}

function EditorWithToolbar({ content, onChange, canEdit }) {
  const [editorInstance, setEditorInstance] = useState(null)

  return (
    <Stack gap="6">
      <DocumentToolbar editor={editorInstance} canEdit={canEdit} />
      <RichTextEditorBridge
        content={content}
        onChange={onChange}
        editable={canEdit}
        onReady={setEditorInstance}
      />
    </Stack>
  )
}

function RichTextEditorBridge({ content, onChange, editable, onReady }) {
  const [mountedEditor, setMountedEditor] = useState(null)

  useEffect(() => {
    onReady(mountedEditor)
  }, [mountedEditor, onReady])

  return (
    <RichTextEditor
      content={content}
      onChange={onChange}
      editable={editable}
      onReady={setMountedEditor}
    />
  )
}

export default EditorPage
