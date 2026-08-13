// BrandLoading — splash de marca (fundo escuro + anel roxo girando + logo JETOOH).
// Fonte única do tema Dashboard2026: é o loader da CHECAGEM DE SESSÃO / handoff SSO,
// para o usuário ver UM loader contínuo (mesmo do #initial-loading do index.html /
// LoadingScreen do site). Régua = platform. Não confundir com <Loading /> (skeleton
// de página) nem <TabLoading /> (spinner de aba) — este é o splash de app inteiro.
//   if (session === 'loading') return <BrandLoading />
// Cores em style inline (independem do Tailwind do app consumidor) — e vindas do
// BOOT_COLORS (JET-118), a MESMA fonte do splash pré-hidratação (themes/boot.css +
// themes/boot.html). Antes os literais estavam escritos aqui, uma quarta cópia ao
// lado das três dos index.html: com o mesmo valor em quatro arquivos, a troca do
// roxo da marca deixa o loader de sessão diferente do loader de boot, e a emenda
// aparece justo na transição entre os dois.
import { BOOT_COLORS, BOOT_LOGO_PATH } from '../themes/boot';

export function BrandLoading() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: BOOT_COLORS.bg }}
    >
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-28 w-28 animate-spin rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: BOOT_COLORS.ring, borderRightColor: BOOT_COLORS.ringTrail }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-24 w-24 fill-white">
          <path d={BOOT_LOGO_PATH} />
        </svg>
      </div>
    </div>
  );
}
