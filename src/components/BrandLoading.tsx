// BrandLoading — splash de marca (fundo escuro + anel roxo girando + logo JETOOH).
// Fonte única do tema Dashboard2026: é o loader da CHECAGEM DE SESSÃO / handoff SSO,
// para o usuário ver UM loader contínuo (mesmo do #initial-loading do index.html /
// LoadingScreen do site). Régua = platform. Não confundir com <Loading /> (skeleton
// de página) nem <TabLoading /> (spinner de aba) — este é o splash de app inteiro.
//   if (session === 'loading') return <BrandLoading />
// Cores em style inline (independem do Tailwind do app consumidor).
export function BrandLoading() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: "#0B0F0C" }}
    >
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-28 w-28 animate-spin rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#8B47FF", borderRightColor: "rgba(139,71,255,0.3)" }}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-24 w-24 fill-white">
          <path d="M247.26,29.65C67.56,37.31-33.89,241.82,72.17,388.72c104.35,144.53,327.7,117.1,394.22-47.79C527.76,188.81,410.5,22.69,247.26,29.65ZM179.39,365.5c-33.69,1.47-64.42-21.23-76.28-52.12-.85-2.2-4.64-12.97-4.64-14.47v-95.8c32.69-.77,63.54,21.36,75.31,51.4,1.43,3.64,5.61,16.95,5.61,20.24v90.75ZM286.15,296.11c0,2.68-3.87,14.28-5.05,17.43-11.34,30.28-43.02,53.37-75.87,51.97v-173.91c0-2.38,3.44-13.47,4.48-16.31,11.01-30.16,43.87-54.03,76.43-52.53v173.35ZM391.79,365.5c-31.67,1.6-63.55-20.91-75.16-49.86-1.27-3.18-5.75-16.86-5.75-19.53v-92.15c2.97-1.55,8.55-.67,12.01-.21,28.96,3.85,54.16,24.92,64.26,52.05.93,2.5,4.64,13.68,4.64,15.59v94.12Z" />
        </svg>
      </div>
    </div>
  );
}
