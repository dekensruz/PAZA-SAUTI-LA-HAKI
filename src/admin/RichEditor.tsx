import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import Quill from 'quill';
import type { Range } from 'quill';
import 'quill/dist/quill.snow.css';
import { TextAlignCenter, TextAlignLeft, TextAlignRight, Trash } from '@phosphor-icons/react';
import { uploadImage, formatBytes } from '@/lib/media';

export interface RichEditorHandle {
  getHTML: () => string;
}

interface Props {
  initialHTML: string;
  placeholder?: string;
  /** Dossier du bucket où ranger les images insérées */
  folder: string;
  onChange?: () => void;
}

const TOOLBAR = [
  [{ header: [2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, 'blockquote'],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'],
];

const PRESETS = [25, 50, 75, 100];

/**
 * Éditeur riche Quill 2 :
 * - insertion d'images (bouton, glisser-déposer, coller) compressées puis envoyées dans le bucket ;
 * - redimensionnement des images (poignée à la souris / au doigt, ou préréglages 25-100 %) ;
 * - alignement et suppression rapides de l'image sélectionnée.
 */
const RichEditor = forwardRef<RichEditorHandle, Props>(({ initialHTML, placeholder, folder, onChange }, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const folderRef = useRef(folder);
  folderRef.current = folder;

  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      const q = quillRef.current;
      if (!q) return '';
      if (q.getLength() <= 1) return '';
      // getSemanticHTML produit des <ul>/<ol> standards ; on rétablit les espaces normaux
      return q.getSemanticHTML().replace(/&nbsp;/g, ' ');
    },
  }));

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const host = document.createElement('div');
    wrapper.querySelector('.rich-host')?.appendChild(host);

    const insertFiles = async (range: Range | null, files: File[]) => {
      const q = quillRef.current;
      if (!q) return;
      const images = files.filter((f) => f.type.startsWith('image/'));
      let index = range?.index ?? q.getSelection(true)?.index ?? q.getLength();
      for (const file of images) {
        setStatus(`Compression et envoi de « ${file.name} »…`);
        try {
          const res = await uploadImage(file, folderRef.current, { maxWidth: 1600, maxHeight: 1600, quality: 0.8 });
          q.insertEmbed(index, 'image', res.url, 'user');
          q.setSelection(index + 1, 0, 'silent');
          index += 1;
          setStatus(`Image insérée : ${formatBytes(res.originalBytes)} → ${formatBytes(res.bytes)}`);
        } catch (err) {
          setStatus(`Échec de l'envoi : ${(err as Error).message}`);
        }
      }
      setTimeout(() => setStatus(null), 4000);
    };

    const quill = new Quill(host, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: {
          container: TOOLBAR,
          handlers: {
            image: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = () => insertFiles(quill.getSelection(true), Array.from(input.files ?? []));
              input.click();
            },
          },
        },
        uploader: { handler: (range: Range, files: File[]) => insertFiles(range, files) },
      },
    });
    quillRef.current = quill;

    if (initialHTML) {
      quill.setContents(quill.clipboard.convert({ html: initialHTML }), 'silent');
    }
    quill.on('text-change', (_d, _o, source) => {
      if (source === 'user') onChangeRef.current?.();
      setSelectedImg((img) => (img && !quill.root.contains(img) ? null : img));
    });

    // Images collées en base64 (ex. depuis Word) : on les remplace par des fichiers envoyés au bucket
    quill.clipboard.addMatcher('IMG', (node, delta) => {
      const src = (node as HTMLImageElement).getAttribute('src') ?? '';
      if (src.startsWith('data:image/')) {
        fetch(src)
          .then((r) => r.blob())
          .then((blob) => insertFiles(quill.getSelection(true), [new File([blob], 'image-collee', { type: blob.type })]));
        return { ops: [] } as unknown as typeof delta;
      }
      return delta;
    });

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && quill.root.contains(target)) setSelectedImg(target as HTMLImageElement);
      else if (!(target.closest('.img-resizer'))) setSelectedImg(null);
    };
    wrapper.addEventListener('click', onClick);

    return () => {
      wrapper.removeEventListener('click', onClick);
      quillRef.current = null;
      host.remove();
      wrapper.querySelector('.ql-toolbar')?.remove();
    };
    // L'éditeur est initialisé une seule fois ; le contenu initial est lu au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Positionne le cadre de redimensionnement au-dessus de l'image sélectionnée
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!selectedImg || !wrapper) {
      setBox(null);
      return;
    }
    const update = () => {
      const w = wrapper.getBoundingClientRect();
      const r = selectedImg.getBoundingClientRect();
      setBox({ top: r.top - w.top, left: r.left - w.left, width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(selectedImg);
    const editorEl = quillRef.current?.root;
    editorEl?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      editorEl?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [selectedImg]);

  const blotOf = (img: HTMLImageElement) => Quill.find(img) as unknown as { format: (n: string, v: unknown) => void } | null;

  const setWidth = (px: number | null) => {
    if (!selectedImg) return;
    const blot = blotOf(selectedImg);
    if (!blot) return;
    blot.format('height', null);
    blot.format('width', px ? String(Math.round(px)) : null);
    onChangeRef.current?.();
  };

  const setPercent = (pct: number) => {
    const root = quillRef.current?.root;
    if (!root || !selectedImg) return;
    const style = getComputedStyle(root);
    const available = root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const natural = selectedImg.naturalWidth || available;
    setWidth(pct === 100 ? Math.min(natural, available) : (available * pct) / 100);
  };

  const align = (value: 'center' | 'right' | false) => {
    const q = quillRef.current;
    if (!q || !selectedImg) return;
    const blot = Quill.find(selectedImg);
    if (!blot || blot instanceof Quill) return;
    q.formatLine(q.getIndex(blot), 1, 'align', value, 'user');
  };

  const remove = () => {
    const q = quillRef.current;
    if (!q || !selectedImg) return;
    const blot = Quill.find(selectedImg);
    if (!blot || blot instanceof Quill) return;
    q.deleteText(q.getIndex(blot), 1, 'user');
    setSelectedImg(null);
  };

  const startDrag = (e: React.PointerEvent, side: 'left' | 'right') => {
    if (!selectedImg) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = selectedImg.getBoundingClientRect().width;
    const maxW = quillRef.current?.root.clientWidth ?? 2000;
    const move = (ev: PointerEvent) => {
      const delta = (ev.clientX - startX) * (side === 'right' ? 1 : -1);
      const w = Math.max(60, Math.min(maxW, startW + delta));
      selectedImg.setAttribute('width', String(Math.round(w)));
      selectedImg.removeAttribute('height');
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setWidth(selectedImg.getBoundingClientRect().width);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const currentPct = (() => {
    const root = quillRef.current?.root;
    if (!root || !box) return null;
    return Math.round((box.width / (root.clientWidth - 30)) * 100);
  })();

  return (
    <div ref={wrapperRef} className="rich-editor relative">
      <div className="rich-host" />
      {box && selectedImg && (
        <div className="img-resizer pointer-events-none absolute z-10 rounded-sm ring-2 ring-paza-blue" style={box}>
          {(['left', 'right'] as const).map((side) =>
            ['top', 'bottom'].map((v) => (
              <span
                key={side + v}
                onPointerDown={(e) => startDrag(e, side)}
                className={`pointer-events-auto absolute size-3.5 touch-none rounded-full border-2 border-white bg-paza-blue shadow ${v === 'top' ? '-top-2' : '-bottom-2'} ${side === 'left' ? '-left-2 cursor-nwse-resize' : '-right-2 cursor-nesw-resize'}`}
              />
            )),
          )}
          <div className="pointer-events-auto absolute -top-12 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-xl bg-ink p-1 text-xs font-bold whitespace-nowrap text-white shadow-xl">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => setPercent(p)} className="rounded-lg px-2 py-1.5 hover:bg-white/15">
                {p}%
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            <button type="button" title="Aligner à gauche" onClick={() => align(false)} className="rounded-lg p-1.5 hover:bg-white/15"><TextAlignLeft size={16} /></button>
            <button type="button" title="Centrer" onClick={() => align('center')} className="rounded-lg p-1.5 hover:bg-white/15"><TextAlignCenter size={16} /></button>
            <button type="button" title="Aligner à droite" onClick={() => align('right')} className="rounded-lg p-1.5 hover:bg-white/15"><TextAlignRight size={16} /></button>
            <span className="mx-1 h-5 w-px bg-white/20" />
            <button type="button" title="Supprimer l'image" onClick={remove} className="rounded-lg p-1.5 text-red-300 hover:bg-white/15"><Trash size={16} /></button>
          </div>
          <span className="absolute right-1 bottom-1 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] text-white">
            {Math.round(box.width)}px{currentPct ? ` · ${currentPct}%` : ''}
          </span>
        </div>
      )}
      {status && <div className="absolute right-3 bottom-3 z-10 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white shadow-lg">{status}</div>}
    </div>
  );
});

RichEditor.displayName = 'RichEditor';
export default RichEditor;
