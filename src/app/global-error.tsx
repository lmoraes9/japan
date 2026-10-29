'use client';

/**
 * Último recurso: o erro aconteceu no próprio layout, então não há CSS do app
 * nem fonte, e este arquivo precisa trazer o <html> e o <body>. Por isso o
 * estilo é todo inline e a tela é de propósito simples.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f6f5f2',
          color: '#1c1c1e',
        }}
      >
        <div style={{ fontSize: 40 }}>🏯</div>
        <h1 style={{ margin: 0, fontSize: 20 }}>O app travou ao abrir</h1>
        <p style={{ margin: 0, maxWidth: 300, fontSize: 14, lineHeight: 1.5, color: '#71717a' }}>
          Normalmente é só recarregar. Se continuar assim, feche o app por completo e abra de novo — as páginas já visitadas ficam guardadas para uso sem internet.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{ border: 0, borderRadius: 999, padding: '12px 22px', background: '#c2402a', color: '#fff', fontSize: 15, fontWeight: 600 }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
