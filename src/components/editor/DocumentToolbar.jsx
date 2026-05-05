import { HStack, IconButton, Separator, Text } from '@chakra-ui/react'
import {
  FiBold,
  FiItalic,
  FiList,
  FiMinus,
  FiType,
  FiUnderline,
} from 'react-icons/fi'

function ToolbarButton({ label, isActive, onClick, icon }) {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      rounded="xl"
      color={isActive ? 'var(--gd-accent)' : 'var(--gd-text)'}
      bg={isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent'}
      _hover={{ bg: 'rgba(148, 163, 184, 0.14)' }}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  )
}

function DocumentToolbar({ editor, canEdit }) {
  if (!editor) {
    return null
  }

  const run = (callback) => {
    if (!canEdit) {
      return
    }

    callback()
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
        onClick={() => run(() => editor.chain().focus().setParagraph().run())}
        icon={<FiMinus />}
      />
      <ToolbarButton
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        icon={<FiType />}
      />
      <ToolbarButton
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        icon={<Text fontSize="xs" fontWeight="800">H2</Text>}
      />

      <Separator orientation="vertical" h="6" />

      <ToolbarButton
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => run(() => editor.chain().focus().toggleBold().run())}
        icon={<FiBold />}
      />
      <ToolbarButton
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => run(() => editor.chain().focus().toggleItalic().run())}
        icon={<FiItalic />}
      />
      <ToolbarButton
        label="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}
        icon={<FiUnderline />}
      />

      <Separator orientation="vertical" h="6" />

      <ToolbarButton
        label="Bulleted list"
        isActive={editor.isActive('bulletList')}
        onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}
        icon={<FiList />}
      />
      <ToolbarButton
        label="Numbered list"
        isActive={editor.isActive('orderedList')}
        onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}
        icon={<Text fontSize="xs" fontWeight="800">1.</Text>}
      />
    </HStack>
  )
}

export default DocumentToolbar
