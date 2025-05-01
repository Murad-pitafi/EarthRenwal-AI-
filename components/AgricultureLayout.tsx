import type { ReactNode } from "react"

interface AgricultureLayoutProps {
  children: ReactNode
}

export function AgricultureLayout({ children }: AgricultureLayoutProps) {
  return <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">{children}</div>
}
