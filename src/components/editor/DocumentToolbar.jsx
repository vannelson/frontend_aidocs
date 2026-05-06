import { HStack, IconButton, Separator, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  FiBold,
  FiItalic,
  FiList,
  FiMinus,
  FiType,
  FiUnderline,
} from 'react-icons/fi'

function ToolbarButton({ label, isActive, onMouseDown, icon, disabled }) {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      rounded="xl"
      color={isActive ? 'var(--gd-accent)' : 'var(--gd-text)'}
      bg={isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent'}
      _hover={{ bg: 'rgba(148, 163, 184, 0.14)' }}
      onMouseDown={onMouseDown}
      disabled={disabled}
    >
      {icon}
    </IconButton>
  )
}

function DocumentToolbar({ editor, canEdit }) {
  const [, forceRender] = useState(0)

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    const rerenderToolbar = () => {
      forceRender((value) => value + 1)
    }

    editor.on('selectionUpdate', rerenderToolbar)
    editor.on('transaction', rerenderToolbar)
    editor.on('focus', rerenderToolbar)
    editor.on('blur', rerenderToolbar)

    return () => {
      editor.off('selectionUpdate', rerenderToolbar)
      editor.off('transaction', rerenderToolbar)
      editor.off('focus', rerenderToolbar)
      editor.off('blur', rerenderToolbar)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const run = (event, callback) => {
    event.preventDefault()

    if (!canEdit) {
      return
    }

    callback(editor.chain().focus())
  }

  return (
    <HStack
      gap="1"
      wrap="wrap"
      rounded="24px"
      border="1px solid rgba(148, 163, 184, 0.18)"
      bg="rgba(248, 250, 252, 0.92)"
      px="3"
      py="2"
      boxShadow="0 12px 24px rgba(15, 23, 42, 0.05)"
    >
      <ToolbarButton
        label="Paragraph"
        isActive={editor.isActive('paragraph')}
        onMouseDown={(event) => run(event, (chain) => chain.setParagraph().run())}
        icon={<FiMinus />}
        disabled={!canEdit}
      />
      <ToolbarButton
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onMouseDown={(event) => run(event, (chain) => chain.toggleHeading({ level: 1 }).run())}
        icon={<FiType />}
        disabled={!canEdit}
      />
      <ToolbarButton
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onMouseDown={(event) => run(event, (chain) => chain.toggleHeading({ level: 2 }).run())}
        icon={<Text fontSize="xs" fontWeight="800">H2</Text>}
        disabled={!canEdit}
      />

      <Separator orientation="vertical" h="6" />

      <ToolbarButton
        label="Bold"
        isActive={editor.isActive('bold')}
        onMouseDown={(event) => run(event, (chain) => chain.toggleBold().run())}
        icon={<FiBold />}
        disabled={!canEdit}
      />
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive('italic')}
        onMouseDown={(event) => run(event, (chain) => chain.toggleItalic().run())}
        icon={<FiItalic />}
        disabled={!canEdit}
      />
      <ToolbarButton
        label="Underline"
        isActive={editor.isActive('underline')}
        onMouseDown={(event) => run(event, (chain) => chain.toggleUnderline().run())}
        icon={<FiUnderline />}
        disabled={!canEdit}
      />

      <Separator orientation="vertical" h="6" />

      <ToolbarButton
        label="Bulleted list"
        isActive={editor.isActive('bulletList')}
        onMouseDown={(event) => run(event, (chain) => chain.toggleBulletList().run())}
        icon={<FiList />}
        disabled={!canEdit}
      />
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive('orderedList')}
        onMouseDown={(event) => run(event, (chain) => chain.toggleOrderedList().run())}
        icon={<Text fontSize="xs" fontWeight="800">1.</Text>}
        disabled={!canEdit}
      />
    </HStack>
  )
}

export default DocumentToolbar
