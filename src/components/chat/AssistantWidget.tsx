import { useEffect, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '#/lib/assistant/chat'
import { BlobMascotIcon } from '#/components/chat/BlobMascotIcon'

type AssistantWidgetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssistantWidget({ open: chatOpen, onOpenChange }: AssistantWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)

  const headerMood = sending ? 'hmm' : messages.length > 0 ? 'happy' : 'neutral'
  const headerGaze = inputFocused ? { x: 18, y: -8 } : undefined
  const headerNod = inputFocused && messageInput.length > 0

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = messageInput.trim()
    if (!text || sending) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setMessageInput('')
    setSending(true)

    try {
      const result = await sendChatMessage({ data: { messages: nextMessages } })
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Something went wrong on our end. Please try again, or email us directly at info@vizualabs.com.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {chatOpen && (
        <div className="fixed bottom-20 left-5 right-5 sm:left-auto sm:right-6 z-50 w-auto sm:w-96 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/15 bg-black/90 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <BlobMascotIcon
                className="h-10 w-10 drop-shadow-[0_0_6px_rgba(255,94,77,0.5)]"
                mood={headerMood}
                gaze={headerGaze}
                nod={headerNod}
              />
              <div>
                <h4 className="text-sm font-bold text-white">Vizualabs Assistant</h4>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-4">
            {messages.length === 0 && !sending && (
              <p className="text-xs text-gray-300 pb-3">
                Have a project in mind or need quick assistance? Send us a quick note below!
              </p>
            )}

            {messages.length > 0 && (
              <div ref={historyRef} className="max-h-64 overflow-y-auto space-y-3 pb-3 pr-1">
                {messages.map((message, index) => (
                  <p
                    key={index}
                    className={
                      message.role === 'user'
                        ? 'text-xs sm:text-sm text-gray-300'
                        : 'text-xs sm:text-sm font-medium text-white'
                    }
                  >
                    {message.role === 'user' ? 'You: ' : ''}
                    {message.content}
                  </p>
                ))}
                {sending && <p className="text-xs text-gray-500">Typing...</p>}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Type your message..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#FF5E4D] focus:outline-none focus:ring-1 focus:ring-[#FF5E4D] transition-all resize-none"
                disabled={sending}
                required
              />
              <button
                type="submit"
                disabled={sending || !messageInput.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5E4D] py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#FF5E4D]/25 hover:bg-[#ff4634] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Send Message</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 sm:right-6 z-50">
        <button
          onClick={() => onOpenChange(!chatOpen)}
          aria-label="Toggle Quick Message"
          className={`relative group flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl shadow-[#FF5E4D]/35 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none cursor-pointer ${
            chatOpen ? 'bg-[#FF5E4D] hover:bg-[#ff4634]' : ''
          }`}
        >
          {/* Subtle pulse glow animation */}
          <span className="absolute -inset-0.5 rounded-full bg-[#FF5E4D] animate-ping opacity-25 pointer-events-none" />

          {chatOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <BlobMascotIcon
              className="h-11 w-11 transition-transform group-hover:scale-105 pointer-events-none"
              mood="happy"
            />
          )}

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 hidden group-hover:block whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg border border-white/10 backdrop-blur-md">
            Message Us
          </span>
        </button>
      </div>
    </>
  )
}
