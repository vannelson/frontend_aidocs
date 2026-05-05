import { Box } from '@chakra-ui/react'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

function RichTextEditor({ content, onChange, editable, onReady }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(editable)
  }, [editor, editable])

  useEffect(() => {
    onReady?.(editor ?? null)
  }, [editor, onReady])

  useEffect(() => {
    if (!editor) {
      return
    }

    const currentHtml = editor.getHTML()
    if (content !== currentHtml) {
      editor.commands.setContent(content || '<p></p>', false)
    }
  }, [content, editor])

  return (
    <Box className="tiptap-editor">
      <EditorContent editor={editor} />
    </Box>
  )
}

export default RichTextEditor
