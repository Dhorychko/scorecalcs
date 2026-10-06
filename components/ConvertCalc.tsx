"use client";

import { useState } from "react";
import { LETTERS, convertScale, percentToLetter, percentToPoints, pointsToLetter, pointsToPercent } from "@/lib/gpa";
import { Mark, MobileBar, NumField, Sheet, Tally, fmt, num } from "./parts";

function LetterTable({ hl }: { hl?: string }) {
  return (
    <div className="table-wrap">
      <table className="data">
        <thead><tr><th>Letter</th><th className="r">Percent</th><th className="r">4.0 scale</th></tr></thead>
        <tbody>
          {LETTERS.filter((l) => l.letter !== "D-").map((l) => (
            <tr key={l.letter} className={l.letter === hl ? "hl" : ""}><td>{l.letter}</td><td className="r">{l.letter === "F" ? "below 65" : `${l.min}–${l.max}`}</td><td className="r">{l.points.toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PctToGpa() {
  const [p, setP] = useState("88");
  const letter = percentToLetter(num(p));
  return (
    <div className="calc">
      <Sheet title="Percentage grade">
        <div className="row"><NumField id="p" label="Your grade" value={p} onChange={setP} suffix="%" /></div>
        <div className="row"><LetterTable hl={letter} /></div>
      </Sheet>
      <Mark label="On a 4.0 scale" value={fmt(percentToPoints(num(p)), 1)} sub={<>{fmt(num(p), 1)}% is {/^[AEF]/.test(letter) ? "an" : "a"} <b>{letter}</b>.</>} />
      <MobileBar label="4.0 scale" value={fmt(percentToPoints(num(p)), 1)} />
    </div>
  );
}

export function GpaToPct() {
  const [g, setG] = useState("3.5");
  const pct = pointsToPercent(num(g));
  return (
    <div className="calc">
      <Sheet title="Your GPA">
        <div className="row"><NumField id="g" label="GPA on a 4.0 scale" value={g} onChange={setG} step="0.01" max={4} /></div>
        <div className="row"><LetterTable hl={pointsToLetter(num(g))} /></div>
      </Sheet>
      <Mark label="Approximate percentage" value={fmt(pct, 0)} unit="%" sub={<>A {fmt(num(g))} GPA averages out to about {/^[AEF]/.test(pointsToLetter(num(g))) ? "an" : "a"} <b>{pointsToLetter(num(g))}</b>.</>}>
        <p className="note">There is no single official formula; this interpolates between the College Board&apos;s letter-grade bands.</p>
      </Mark>
      <MobileBar label="Percentage" value={`${fmt(pct, 0)}%`} />
    </div>
  );
}

export function LetterToGpa() {
  const [rows, setRows] = useState(["A", "B+", "A-", "B", "A"]);
  const pts = rows.map((r) => LETTERS.find((l) => l.letter === r)?.points ?? 0);
  const avg = pts.length ? pts.reduce((a, b) => a + b, 0) / pts.length : 0;
  return (
    <div className="calc">
      <Sheet title={`Letter grades (${rows.length})`} actions={<button className="btn" type="button" onClick={() => setRows((r) => [...r, "A"])}>Add grade</button>}>
        {rows.map((r, i) => (
          <div className="row" key={i} style={{ gridTemplateColumns: "28px 1fr 60px 32px" }}>
            <span className="idx">{i + 1}</span>
            <label className="field"><span>Grade</span>
              <select value={r} onChange={(e) => setRows((rs) => rs.map((x, j) => (j === i ? e.target.value : x)))}>
                {LETTERS.map((l) => <option key={l.letter}>{l.letter}</option>)}
              </select>
            </label>
            <span className="idx" style={{ textAlign: "left" }}>{fmt(pts[i], 1)}</span>
            <button className="btn-x" type="button" aria-label={`Remove grade ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </Sheet>
      <Mark label="Average GPA" value={fmt(avg)} sub={<>Each class counted once. Use the GPA calculator for credit hours or honors weighting.</>} />
      <MobileBar label="GPA" value={fmt(avg)} />
    </div>
  );
}

export function ScaleCalc() {
  const [g, setG] = useState("4.2");
  const [from, setFrom] = useState("5");
  const scales = [4, 5, 10, 100];
  return (
    <div className="calc">
      <Sheet title="Your GPA and its scale">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="sg" label="GPA" value={g} onChange={setG} step="0.01" />
          <label className="field"><span>Out of</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>{scales.map((s) => <option key={s} value={s}>{s}.0</option>)}</select>
          </label>
        </div>
      </Sheet>
      <Mark label="On a 4.0 scale" value={fmt(Math.min(4, convertScale(num(g), num(from), 4)))}>
        <Tally rows={scales.filter((s) => String(s) !== from && s !== 4).map((s) => [`Out of ${s}`, fmt(convertScale(num(g), num(from), s), s >= 10 ? 1 : 2)] as [string, string])} />
        <p className="note">A straight proportional conversion. Colleges usually recalculate GPAs with their own rules, so treat this as a rough comparison.</p>
      </Mark>
      <MobileBar label="4.0 scale" value={fmt(Math.min(4, convertScale(num(g), num(from), 4)))} />
    </div>
  );
}
