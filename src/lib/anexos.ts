'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Anexos das reservas: o print do QR do Shinkansen, o PDF do Booking, a foto do
 * voucher. Ficam em IndexedDB, **só neste aparelho** — não vão pelo sync, porque
 * o sync é texto pequeno e um PDF não cabe nele. Quem quiser os mesmos arquivos
 * no celular da Priscila anexa de novo lá (ou manda pelo WhatsApp).
 *
 * Por que não localStorage, como as fotos de documentos: o localStorage tem uns
 * 5 MB para tudo, e um PDF de confirmação passa disso sozinho.
 */

export interface Anexo {
  id: string;
  reservaId: string;
  nome: string;
  tipo: string;
  tamanho: number;
  criado: number;
  blob: Blob;
}

const DB_NOME = 'japao2026-anexos';
const LOJA = 'anexos';
const LIMITE_BYTES = 15 * 1024 * 1024;
const LADO_MAX = 1800;

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NOME, 1);
    req.onupgradeneeded = () => {
      const loja = req.result.createObjectStore(LOJA, { keyPath: 'id' });
      loja.createIndex('reservaId', 'reservaId');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function pedido<T>(db: IDBDatabase, modo: IDBTransactionMode, fn: (loja: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOJA, modo);
    const req = fn(tx.objectStore(LOJA));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/** imagem grande de celular vira JPEG de até 1800 px: lê igual e ocupa uma fração */
async function reduzir(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;
  try {
    const bmp = await createImageBitmap(file);
    const escala = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * escala);
    c.height = Math.round(bmp.height * escala);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.84));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file; // formato que o navegador não decodifica: guarda como veio
  }
}

export function useAnexos(reservaId: string) {
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [indisponivel, setIndisponivel] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const db = await abrir();
      const lista = await pedido<Anexo[]>(db, 'readonly', (l) => l.index('reservaId').getAll(reservaId));
      db.close();
      setAnexos(lista.sort((a, b) => a.criado - b.criado));
    } catch {
      // navegação privada, ou o aparelho bloqueou o armazenamento
      setIndisponivel(true);
    }
  }, [reservaId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const adicionar = useCallback(
    async (files: FileList | File[]) => {
      setErro(null);
      try {
        const db = await abrir();
        for (const f of Array.from(files)) {
          if (f.size > LIMITE_BYTES) {
            setErro(`"${f.name}" passa de 15 MB. Tirem um print em vez do arquivo original.`);
            continue;
          }
          const blob = await reduzir(f);
          const anexo: Anexo = {
            id: `${reservaId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            reservaId,
            nome: f.name || 'anexo',
            tipo: blob.type || f.type || 'application/octet-stream',
            tamanho: blob.size,
            criado: Date.now(),
            blob,
          };
          await pedido(db, 'readwrite', (l) => l.put(anexo));
        }
        db.close();
        // pede ao navegador para não apagar isto quando faltar espaço
        void navigator.storage?.persist?.();
        await carregar();
      } catch {
        setErro('Não foi possível guardar o arquivo neste aparelho.');
      }
    },
    [reservaId, carregar],
  );

  const remover = useCallback(
    async (id: string) => {
      try {
        const db = await abrir();
        await pedido(db, 'readwrite', (l) => l.delete(id));
        db.close();
        await carregar();
      } catch {
        setErro('Não foi possível apagar.');
      }
    },
    [carregar],
  );

  return { anexos, adicionar, remover, erro, indisponivel };
}

/** quantos anexos cada reserva tem, para o selo 📎 no cartão */
export async function contarAnexos(): Promise<Record<string, number>> {
  try {
    const db = await abrir();
    const todos = await pedido<Anexo[]>(db, 'readonly', (l) => l.getAll());
    db.close();
    const n: Record<string, number> = {};
    for (const a of todos) n[a.reservaId] = (n[a.reservaId] ?? 0) + 1;
    return n;
  } catch {
    return {};
  }
}
