import { BottomNav } from '@/components/BottomNav';
import { AppInit } from '@/components/AppInit';
import { InstallHint } from '@/components/InstallHint';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <AppInit />
      <main className="flex-1 mx-auto w-full max-w-xl px-4 pb-28 pt-3">
        {children}
      </main>
      <InstallHint />
      <BottomNav />
    </div>
  );
}
