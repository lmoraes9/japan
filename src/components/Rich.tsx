import React from 'react';

/**
 * Renderiza ***negrito itálico***, **negrito**, *itálico* e `código` sem lib de
 * markdown.
 *
 * Duas sutilezas que já morderam o roteiro:
 *
 * - a ordem das alternativas importa: `***` precisa ser testado antes de `**`,
 *   senão sobra asterisco solto no meio do texto;
 * - o negrito aceita marcação **por dentro** (`**se tem o *goma*, o ritual**`),
 *   e por isso ele se renderiza recursivamente. Sem isso, um itálico dentro de
 *   um negrito quebrava o casamento e vazava os asteriscos para a tela.
 */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*(?:[^*]|\*(?!\*))+?\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('***') && part.endsWith('***')) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              <em>{part.slice(3, -3)}</em>
            </strong>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              <Rich text={part.slice(2, -2)} />
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-[0.85em] bg-surface-2 rounded px-1 py-0.5"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
