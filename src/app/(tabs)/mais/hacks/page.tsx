import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { HACKS, HACKS_INTRO, HACKS_CATEGORIA, type HackCategoria } from '@/data/hacks';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { thumbOf } from '@/data/placeMaps';

const ORDEM: HackCategoria[] = ['combo', 'bebida', 'farmacia'];

export default function HacksPage() {
  const comFoto = HACKS.filter((h) => h.foto || PLACE_PHOTOS[`hacks/${h.id}`]).length;
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Hacks de konbini e farmácia"
        subtitle={`${HACKS.length} produtos, ${comFoto} com foto para achar na prateleira`}
      />

      <div className="space-y-2.5 rounded-2xl border border-hairline bg-surface p-4">
        {HACKS_INTRO.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
            <Rich text={p} />
          </p>
        ))}
      </div>

      {ORDEM.map((cat) => {
        const meta = HACKS_CATEGORIA[cat];
        const itens = HACKS.filter((h) => h.categoria === cat);
        return (
          <section key={cat} className="space-y-2.5">
            <header className="px-1">
              <h2 className="text-[16px] font-bold leading-tight">
                {meta.titulo}
                <span className="ml-2 font-jp text-[12px] font-normal text-muted">{meta.jp}</span>
              </h2>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">{meta.resumo}</p>
            </header>

            {itens.map((item) => {
              const photo = item.foto ?? PLACE_PHOTOS[`hacks/${item.id}`];
              return (
                <details key={item.id} className="rounded-2xl border border-hairline bg-surface p-4">
                  <summary className="flex cursor-pointer items-center gap-3">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbOf(photo)} alt="" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-xl border border-hairline object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-hairline bg-surface-2 text-[9px] font-semibold uppercase leading-tight text-muted">
                        foto<br />pendente
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold leading-snug">{item.title}</span>
                      <span className="font-jp text-[12px] text-muted">{item.jp}</span>
                      <span className="mt-0.5 block text-[11px] text-accent">{item.para}</span>
                    </span>
                    {item.pedido && (
                      <span className="shrink-0 rounded-full border border-matcha/50 bg-matcha/15 px-2 py-0.5 text-[10px] font-semibold text-matcha">
                        ✋ a pedido
                      </span>
                    )}
                  </summary>

                  {photo && (
                    <figure className="mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.src} alt={item.title} loading="lazy" decoding="async" className="photo-in max-h-[60svh] w-full rounded-xl border border-hairline bg-surface-2 object-contain" />
                      <figcaption className="mt-1 text-[10px] text-muted">
                        <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline decoration-hairline underline-offset-2">
                          {photo.credit} · {photo.license}
                        </a>
                      </figcaption>
                    </figure>
                  )}
                  {!photo && (
                    <p className="mt-3 rounded-xl border border-dashed border-hairline bg-surface-2 p-3 text-[12px] leading-snug text-muted">
                      A foto deste ainda não foi baixada — a busca já está em <code>scripts/photo-queries.json</code>; um <code>npm run fotos</code> na máquina local resolve. Até lá, procurem pelo nome em japonês acima.
                    </p>
                  )}

                  <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-muted">
                    {item.romaji} · {item.preco}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug">
                    <span className="font-semibold text-muted">Onde: </span>
                    <Rich text={item.onde} />
                  </p>

                  <div className="mt-2.5 space-y-2">
                    {item.paragraphs.map((p, i) => (
                      <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
                        <Rich text={p} />
                      </p>
                    ))}
                    {item.como && (
                      <p className="border-l-2 border-matcha/60 pl-2.5 text-[12.5px] leading-relaxed">
                        <span className="font-semibold">Como usar: </span>
                        <Rich text={item.como} />
                      </p>
                    )}
                    {item.aviso && (
                      <p className="border-l-2 border-accent/60 pl-2.5 text-[12.5px] leading-relaxed text-foreground/85">
                        <span className="font-semibold text-accent">Cuidado: </span>
                        <Rich text={item.aviso} />
                      </p>
                    )}
                  </div>
                </details>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
