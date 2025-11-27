import React, { useState } from 'react';
import './index.css';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUM = '0123456789';
const SYM = '!@#$%^&*()_+-=[]{}|;:,.<>?/`~';

function generateOne(length: number, useLower: boolean, useUpper: boolean, useNum: boolean, useSym: boolean) {
  let chars = '';
  if (useLower) chars += LOWER;
  if (useUpper) chars += UPPER;
  if (useNum) chars += NUM;
  if (useSym) chars += SYM;
  if (!chars) return '';

  let pw = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    pw += chars[array[i] % chars.length];
  }
  return pw;
}

export default function App() {
  const [length, setLength] = useState<number>(16);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useNum, setUseNum] = useState<boolean>(true);
  const [useSym, setUseSym] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generateFive() {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) {
      out.push(generateOne(length, useLower, useUpper, useNum, useSym));
    }
    setList(out);
    setCopiedIndex(null);
  }

  async function copyToClipboard(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopiedIndex(idx); setTimeout(() => setCopiedIndex(null), 1500); } catch {}
      ta.remove();
    }
  }

  return (
    <div className="pw-app">
      <h1>Генератор паролей</h1>

      <div className="controls">
        <label>Длина: <input type="number" min={4} max={128} value={length} onChange={e => setLength(Number(e.target.value) || 4)} /></label>
        <label><input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} /> строчные</label>
        <label><input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} /> заглавные</label>
        <label><input type="checkbox" checked={useNum} onChange={e => setUseNum(e.target.checked)} /> цифры</label>
        <label><input type="checkbox" checked={useSym} onChange={e => setUseSym(e.target.checked)} /> символы</label>
        <button className="gen" onClick={generateFive}>Сгенерировать 5 паролей</button>
      </div>

      <div className="pw-list">
        {list.length === 0 && <div className="hint">Нажмите «Сгенерировать 5 паролей» чтобы получить список.</div>}
        {list.map((pw, idx) => (
          <div key={idx} className="pw-row">
            <code className="pw-value">{pw || '—'}</code>
            <div className="pw-actions">
              <button onClick={() => copyToClipboard(pw, idx)}>{copiedIndex === idx ? 'Скопировано' : 'Копировать'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
