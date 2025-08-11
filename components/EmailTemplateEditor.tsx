'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Unlink,
  Plus,
  Eye,
  EyeOff,
  Code as CodeIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Custom extension to highlight placeholders
const PlaceholderHighlight = Extension.create({
  name: 'placeholderHighlight',
  
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          placeholder: {
            default: null,
            parseHTML: element => element.getAttribute('data-placeholder'),
            renderHTML: attributes => {
              if (!attributes.placeholder) {
                return {}
              }
              return {
                'data-placeholder': attributes.placeholder,
                class: 'placeholder-highlight'
              }
            },
          },
        },
      },
    ]
  },
})

interface EmailTemplateEditorProps {
  value: string
  onChange: (value: string) => void
  onTextChange?: (value: string) => void
  placeholder?: string
  className?: string
  showPreview?: boolean
  onShowPreviewChange?: (show: boolean) => void
}

const emailPlaceholders = [
  { placeholder: '{{downloadUrl}}', label: 'Download URL', example: 'https://example.com/download/abc123' },
  { placeholder: '{{name}}', label: 'Nome Utente', example: 'Marco' },
  { placeholder: '{{bookTitle}}', label: 'Titolo Libro', example: 'Fish Cannot Carry Guns' },
  { placeholder: '{{authorName}}', label: 'Nome Autore', example: 'Michael B. Morgan' },
  { placeholder: '{{goodreadsUrl}}', label: 'Goodreads URL', example: 'https://goodreads.com/book/show/123' },
  { placeholder: '{{amazonUrl}}', label: 'Amazon URL', example: 'https://amazon.com/dp/B0DS55TQ8R' },
  { placeholder: '{{substackUrl}}', label: 'Substack URL', example: 'https://aroundscifi.substack.com/' },
  { placeholder: '{{substackName}}', label: 'Substack Name', example: 'Around Sci-Fi' },
  { placeholder: '{{publisherUrl}}', label: 'Publisher URL', example: 'https://37indielab.com' },
  { placeholder: '{{publisherName}}', label: 'Publisher Name', example: '3/7 Indie Lab' }
]

// Subset of placeholders valid for URL hrefs
const urlPlaceholders = [
  { placeholder: '{{downloadUrl}}', label: 'Download URL' },
  { placeholder: '{{goodreadsUrl}}', label: 'Goodreads URL' },
  { placeholder: '{{amazonUrl}}', label: 'Amazon URL' },
  { placeholder: '{{substackUrl}}', label: 'Substack URL' },
  { placeholder: '{{publisherUrl}}', label: 'Publisher URL' },
]

export default function EmailTemplateEditor({ 
  value, 
  onChange, 
  onTextChange,
  placeholder = "Start writing...",
  className = "",
  showPreview = false,
  onShowPreviewChange
}: EmailTemplateEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [showContentPlaceholders, setShowContentPlaceholders] = useState(false)
  const [showUrlPlaceholders, setShowUrlPlaceholders] = useState(false)
  const [internalShowPreview, setInternalShowPreview] = useState(false)
  const effectiveShowPreview = showPreview !== undefined ? showPreview : internalShowPreview
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html')
  const [showCodeView, setShowCodeView] = useState(false)
  const [codeHtml, setCodeHtml] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Call onTextChange when content changes
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: false,
        // Allow placeholder href like {{downloadUrl}}
        validate: (href) => typeof href === 'string' && href.length > 0,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      PlaceholderHighlight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        style: `
          .placeholder-highlight {
            background-color: #dbeafe;
            color: #1e40af;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 0.875rem;
            font-family: monospace;
          }
        `,
      },
    },
    immediatelyRender: false,
  })

  // Call onTextChange when content changes
  useEffect(() => {
    if (onTextChange && editor) {
      const textContent = editor.getText()
      onTextChange(textContent)
    }
  }, [editor?.getHTML(), onTextChange])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted || !editor) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded opacity-50" disabled>
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-2 rounded opacity-50" disabled>
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-2 rounded opacity-50" disabled>
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 min-h-[200px] bg-gray-50 rounded-b-lg">
          <div className="text-gray-400 text-sm">Loading editor...</div>
        </div>
      </div>
    )
  }

  const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const insertPlaceholder = (placeholder: string) => {
    editor.chain().focus().insertContent(placeholder).run()
    setShowContentPlaceholders(false)
  }

  const setLinkPlaceholder = (placeholder: string) => {
    // If no selection, create a link with default label
    const hasSelection = editor.state.selection && !editor.state.selection.empty
    if (!hasSelection) {
      editor.chain().focus().insertContent({ type: 'text', text: 'Link' }).setTextSelection(editor.state.selection.from - 4).setTextSelection(editor.state.selection.from + 4).run()
    }
    editor.chain().focus().setLink({ href: placeholder }).run()
  }

  const enterCodeView = () => {
    setShowContentPlaceholders(false)
    setShowUrlPlaceholders(false)
    setInternalShowPreview(false)
    setCodeHtml(editor.getHTML())
    setShowCodeView(true)
  }

  const applyCodeAndExit = () => {
    setShowCodeView(false)
    const html = codeHtml || ''
    editor.commands.setContent(html)
    onChange(editor.getHTML())
  }

  const closeCodeWithoutApply = () => {
    setShowCodeView(false)
  }



  // Function to create a more realistic email preview
  const getEmailPreview = (content: string) => {
    // Create a simple email-like preview
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
        <div style="background: linear-gradient(135deg, #0f766e, #0891b2); padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Fish Cannot Carry Guns</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your free ebook is ready!</p>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <p>Hi <span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">Marco</span>,</p>
          <p>Thank you for downloading your free copy of <strong>Fish Cannot Carry Guns</strong> by <span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">Michael B. Morgan</span>.</p>
          <p>This collection of speculative short stories delves into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.</p>
          
          <div style="background: #e8f5e8; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #065f46;">What's included in your free copy:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>Betrayal Circuit:</strong> Captain Stalworth believes he can trust Private Jude Veil. He is wrong.</li>
              <li><strong>Devil's Advocate:</strong> What if you were trapped in a cell... with the person who killed you?</li>
              <li><strong>Fish Cannot Carry Guns:</strong> All his life, John had thought he was safe...</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download Your Free Copy (PDF)
            </a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">⏰ This link expires in 24 hours</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">Support Independent Authors</h3>
            <p style="margin: 0 0 15px 0; color: #0c4a6e;">Since this book is completely free, we'd be grateful if you could support <span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">Michael B. Morgan</span> in these ways:</p>
            <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
              <li><strong>Add to Goodreads:</strong> Mark "Fish Cannot Carry Guns" as "Want to Read" on Goodreads to help other readers discover it</li>
              <li><strong>Subscribe to Substack:</strong> Follow <span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">Around Sci-Fi</span> for the latest in speculative fiction and author interviews</li>
            </ul>
            <div style="text-align: center; margin-top: 15px;">
              <a href="#" style="background: #0ea5e9; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; margin-right: 10px;">Add to Goodreads</a>
              <a href="#" style="background: #f59e0b; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">Subscribe to Around Sci-Fi</a>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="font-size: 14px; color: #6b7280;">
            <p><strong>About the Author:</strong></p>
            <p><span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">Michael B. Morgan</span> is a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don't always offer easy answers. Consultant by day, author by night.</p>
            <p><strong>Publisher:</strong> <span class="bg-yellow-100 text-yellow-800 px-1 rounded text-sm font-mono">3/7 Indie Lab</span> - Be independent, be unique.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">You received this email because you requested a free copy of "Fish Cannot Carry Guns". If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </div>
    `
    
    return emailContent
  }

  // Function to create text-only preview
  const getTextPreview = (content: string) => {
    // Convert HTML to plain text and replace placeholders
    let textContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    // Replace placeholders with examples
    emailPlaceholders.forEach(({ placeholder, example }) => {
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      textContent = textContent.replace(regex, `[${example}]`)
    })
    
    return textContent
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={enterCodeView}
            className={`p-2 rounded hover:bg-gray-200 ${showCodeView ? 'bg-gray-200' : ''}`}
            title="Visualizza/Modifica HTML"
          >
            <CodeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={removeLink}
            className="p-2 rounded hover:bg-gray-200"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => { setShowUrlPlaceholders(!showUrlPlaceholders); setShowContentPlaceholders(false) }}
              className="px-2 py-1 text-xs rounded border text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
            >
              URL Placeholder
            </button>
            {showUrlPlaceholders && (
              <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Imposta href del link:</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {urlPlaceholders.map((item) => (
                    <button
                      key={item.placeholder}
                      onClick={() => { setLinkPlaceholder(item.placeholder); setShowUrlPlaceholders(false) }}
                      className="w-full text-left p-2 text-xs hover:bg-gray-50 rounded flex items-center justify-between"
                    >
                      <span className="font-mono text-blue-600">{item.placeholder}</span>
                      <span className="text-gray-500">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => { setShowContentPlaceholders(!showContentPlaceholders); setShowUrlPlaceholders(false) }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
            >
              <Plus className="w-3 h-3" />
              Placeholders
            </button>

            {showContentPlaceholders && (
              <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Inserisci Placeholder:</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {emailPlaceholders.map((item) => (
                    <button
                      key={item.placeholder}
                      onClick={() => insertPlaceholder(item.placeholder)}
                      className="w-full text-left p-2 text-xs hover:bg-gray-50 rounded flex items-center justify-between"
                    >
                      <span className="font-mono text-blue-600">{item.placeholder}</span>
                      <span className="text-gray-500">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const newShowPreview = !effectiveShowPreview;
              if (onShowPreviewChange) {
                onShowPreviewChange(newShowPreview);
              } else {
                setInternalShowPreview(newShowPreview);
              }
            }}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border ${
              effectiveShowPreview 
                ? 'text-green-600 bg-green-50 border-green-200' 
                : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {effectiveShowPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {effectiveShowPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      {showCodeView ? (
        <div className="p-4 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Modifica HTML del template</div>
            <div className="flex items-center gap-2">
              <button
                onClick={applyCodeAndExit}
                className="px-2 py-1 text-xs rounded border text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
              >
                Applica e chiudi
              </button>
              <button
                onClick={closeCodeWithoutApply}
                className="px-2 py-1 text-xs rounded border text-gray-700 bg-white border-gray-200 hover:bg-gray-100"
              >
                Chiudi senza salvare
              </button>
            </div>
          </div>
          <textarea
            value={codeHtml}
            onChange={(e) => setCodeHtml(e.target.value)}
            className="w-full h-80 font-mono text-sm p-3 border rounded-md bg-white"
            spellCheck={false}
          />
        </div>
      ) : effectiveShowPreview ? (
        <div className="p-4 min-h-[200px] bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setPreviewMode('html')}
              className={`p-2 rounded border ${
                previewMode === 'html'
                  ? 'text-green-600 bg-green-50 border-green-200'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              HTML Preview
            </button>
            <button
              onClick={() => setPreviewMode('text')}
              className={`p-2 rounded border ${
                previewMode === 'text'
                  ? 'text-green-600 bg-green-50 border-green-200'
                  : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Text Preview
            </button>
          </div>
                     {previewMode === 'html' ? (
             <>
               <div className="text-xs text-gray-500 mb-2">Preview Email HTML (con valori di esempio evidenziati):</div>
               <div 
                 className="max-w-none"
                 dangerouslySetInnerHTML={{ __html: getEmailPreview(editor.getHTML()) }}
               />
             </>
           ) : (
             <>
               <div className="text-xs text-gray-500 mb-2">Preview Email Text (con valori di esempio evidenziati):</div>
               <pre className="bg-white p-4 rounded border text-sm whitespace-pre-wrap font-mono">
                 {getTextPreview(editor.getHTML())}
               </pre>
             </>
           )}
        </div>
      ) : (
        <div className="relative">
          <EditorContent editor={editor} className="p-4 min-h-[200px]" />
          {editor.getHTML().includes('{{') && (
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {editor.getHTML().match(/\{\{[^}]+\}\}/g)?.length || 0} placeholder
            </div>
          )}
        </div>
      )}
    </div>
  )
}
