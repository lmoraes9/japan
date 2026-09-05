import { AppInit } from '@/components/AppInit';

/** Modo rua: tela cheia, sem a barra de abas — o botão de sair está na própria tela */
export default function RuaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppInit />
      {children}
    </div>
  );
}
