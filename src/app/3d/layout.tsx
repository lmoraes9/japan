import { AppInit } from '@/components/AppInit';

/** Mapa em 3D: tela cheia, sem a barra de abas — o botão de voltar está na própria tela */
export default function ThreeDLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppInit />
      {children}
    </div>
  );
}
