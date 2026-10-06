"use client";

import type { ReactNode } from "react";

export const num = (s: string) => {
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

export function fmt(n: number, d = 2): string {
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}

export function NumField({ label, value, onChange, step = "any", min = 0, max, suffix, help, id }: {
  label: string; value: string; onChange: (v: string) => void; step?: string | number; min?: number; max?: number; suffix?: string; help?: string; id: string;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="inline">
        <input id={id} type="number" inputMode="decimal" step={step} min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} onFocus={(e) => e.target.select()} />
        {suffix && <span className="of">{suffix}</span>}
      </div>
      {help && <span className="help">{help}</span>}
    </label>
  );
}

export function Mark({ label, value, unit, sub, children }: { label: string; value: string; unit?: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="result" id="result" aria-live="polite">
      <div className="mark">
        <p className="label">{label}</p>
        <div className="grade">{value}{unit && <small>{unit}</small>}</div>
        {sub && <p className="sub">{sub}</p>}
        {children}
      </div>
    </div>
  );
}

export function Tally({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <ul className="tally">
      {rows.map(([k, v]) => (
        <li key={k}><span>{k}</span><b>{v}</b></li>
      ))}
    </ul>
  );
}

export function MobileBar({ label, value }: { label: string; value: string }) {
  return (
    <a className="mobile-bar" href="#result" aria-hidden="true" tabIndex={-1}>
      <span>{label}</span>
      <strong>{value}</strong>
    </a>
  );
}

export function Sheet({ title, right, children, actions }: { title: string; right?: ReactNode; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="sheet">
      <div className="sheet-head"><span>{title}</span>{right && <span>{right}</span>}</div>
      <div className="sheet-body">{children}</div>
      {actions && <div className="sheet-actions">{actions}</div>}
    </div>
  );
}
