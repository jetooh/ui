// Rodapé canônico do painel — idêntico nos apps do tema (fonte única).
import { memo } from "react"

export const AppFooter = memo(function AppFooter() {
  return (
    <footer className="mt-auto flex px-4 py-4 lg:px-8">
      <p className="text-xs text-gray-500">&copy; 2026 Jetooh. Todos os direitos reservados.</p>
    </footer>
  )
})
