import Chatbot from "@/components/Chatbot"

export default function ChatbotPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">AI Agriculture Assistant</h1>
      <Chatbot />
    </div>
  )
}
