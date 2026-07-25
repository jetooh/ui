// Rodapé canônico do painel — idêntico nos apps do tema (fonte única).
import { memo } from "react"
import { Globe, MessageCircle, Mail, ExternalLink } from "lucide-react"

const socialLinks = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
  { icon: ExternalLink, href: "#", label: "Link" },
]

const footerLinks = [
  { label: "Suporte", href: "#" },
  { label: "Termos de Uso", href: "#" },
  { label: "Política de Privacidade", href: "#" },
]

export const AppFooter = memo(function AppFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <p className="text-xs text-gray-500">&copy; 2026 Jetooh. Todos os direitos reservados.</p>

      <div className="flex flex-wrap items-center gap-4">
        {footerLinks.map((link) => (
          <a key={link.label} href={link.href} className="text-xs text-gray-500 transition-colors hover:text-gray-600">
            {link.label}
          </a>
        ))}

        <div className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <social.icon size={14} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
})
