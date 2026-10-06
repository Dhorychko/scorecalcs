"use client";

import { useState } from "react";
import { ASU, LSAC, UF, UT_AUSTIN, UT_KNOXVILLE, schemeGpa, ucGpa, type Scheme, type UcRow } from "@/lib/schools";
import { Mark, MobileBar, Sheet, Tally, fmt, num } from "./parts";

const SETS: Record<string, Scheme[]> = { lsac: [LSAC], uf: [UF], ut: [UT_AUSTIN, UT_KNOXVILLE], asu: [ASU] };

type R = { name: string; grade: string; credits: string; level: string; flag: boolean };
const fromScheme = (s: Scheme): R[] => s.presetRows.map((r) => ({ name: r.name, grade: r.grade, credits: r.credits, level: r.level ?? "regular", flag: !!r.flag }));

export default function SchoolCalc({ set }: { set: "lsac" | "uf" | "ut" | "asu" }) {
  const schemes = SETS[set];
  const [mode, setMode] = useState(0);
  const s = schemes[mode];
  const [rows, setRows] = useState<R[]>(fromScheme(s));
  const [cycle2728, setCycle2728] = useState(true);
  const switchMode = (i: number) => { setMode(i); setRows(fromScheme(schemes[i])); };
  const upd = (i: number, k: keyof R, v: string | boolean) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const res = schemeGpa(s, rows.map((r) => ({ grade: r.grade, credits: num(r.credits), level: r.level, flag: r.flag })), cycle2728);
  const areas = `"idx name grade${s.credits ? " cr" : ""}${s.levels ? " lvl" : ""} x"`;
  const cols = `28px minmax(0,1.5fr) minmax(0,0.8fr)${s.credits ? " 82px" : ""}${s.levels ? " minmax(0,1.2fr)" : ""} 32px`;

  return (
    <div className="calc">
      <Sheet title={`Your courses (${rows.length})`}
        right={schemes.length > 1 ? (
          <span className="toggle" role="radiogroup" aria-label="Which school">
            {schemes.map((x, i) => <label key={x.id}><input type="radio" name="mode" checked={mode === i} onChange={() => switchMode(i)} /> {x.name}</label>)}
          </span>
        ) : undefined}
        actions={<>
          <button className="btn" type="button" onClick={() => setRows((r) => [...r, { name: "", grade: s.defaultGrade, credits: s.creditLabel === "Credits" ? "1" : "3", level: "regular", flag: false }])}>Add course</button>
          <button className="btn-ghost" type="button" onClick={() => setRows([{ name: "", grade: s.defaultGrade, credits: s.creditLabel === "Credits" ? "1" : "3", level: "regular", flag: false }])}>Clear all</button>
        </>}>
        {rows.map((r, i) => (
          <div key={i}>
            <div className="row crow" style={{ gridTemplateColumns: cols, gridTemplateAreas: areas }}>
              <span className="idx">{i + 1}</span>
              <label className="field f-name"><span>Course</span><input type="text" value={r.name} placeholder="Optional" onChange={(e) => upd(i, "name", e.target.value)} /></label>
              <label className="field f-grade"><span>Grade</span>
                <select value={r.grade} onChange={(e) => upd(i, "grade", e.target.value)}>{s.grades.map((g) => <option key={g.label} value={g.label}>{g.label} ({g.points.toFixed(2)})</option>)}</select>
              </label>
              {s.credits && <label className="field f-cr"><span>{s.creditLabel}</span><input type="number" inputMode="decimal" min={0} step="0.5" value={r.credits} onChange={(e) => upd(i, "credits", e.target.value)} /></label>}
              {s.levels && <label className="field f-lvl"><span>Level</span>
                <select value={r.level} onChange={(e) => upd(i, "level", e.target.value)}>{s.levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}</select>
              </label>}
              <button className="btn-x f-x" type="button" aria-label={`Remove course ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>×</button>
            </div>
            {s.flag && (
              <div className="row" style={{ paddingTop: 0 }}>
                <div className="toggle"><label><input type="checkbox" checked={r.flag} onChange={(e) => upd(i, "flag", e.target.checked)} /> {s.flag.label}</label></div>
              </div>
            )}
          </div>
        ))}
        {s.flag && (
          <div className="row">
            <div className="toggle" role="radiogroup" aria-label="Application cycle">
              <label><input type="radio" name="cycle" checked={cycle2728} onChange={() => setCycle2728(true)} /> Applying 2027–28 or later</label>
              <label><input type="radio" name="cycle" checked={!cycle2728} onChange={() => setCycle2728(false)} /> 2026–27 cycle</label>
            </div>
          </div>
        )}
      </Sheet>
      <Mark label={s.resultLabel} value={res.credits ? fmt(res.gpa) : "—"}
        sub={res.credits ? <>Over {fmt(res.credits, res.credits % 1 ? 1 : 0)} {(s.creditLabel ?? "credits").toLowerCase()}.</> : <span className="warn">Add at least one graded course.</span>}>
        <Tally rows={[
          ...(s.levels ? [["Unweighted (same courses)", fmt(res.unweighted)] as [string, string]] : []),
          ...(s.cap && res.uncapped > s.cap ? [["Before the 4.00 cap", fmt(res.uncapped)] as [string, string]] : []),
        ]} />
        <p className="note">{s.note} <a href={s.source.url} rel="nofollow noopener" target="_blank">{s.source.label}</a>.</p>
      </Mark>
      <MobileBar label={s.resultLabel} value={res.credits ? fmt(res.gpa) : "—"} />
    </div>
  );
}

const UC_PRESET: UcRow[] = [
  { grade: "A", year: "10", honors: false }, { grade: "A", year: "10", honors: false }, { grade: "B", year: "10", honors: true }, { grade: "A", year: "10", honors: true },
  { grade: "A", year: "10", honors: false }, { grade: "B", year: "10", honors: false },
  { grade: "A", year: "11", honors: true }, { grade: "A", year: "11", honors: true }, { grade: "B", year: "11", honors: true }, { grade: "A", year: "11", honors: true },
  { grade: "A", year: "11", honors: false }, { grade: "A", year: "11", honors: false },
];

export function UcCalc() {
  const [rows, setRows] = useState<UcRow[]>(UC_PRESET);
  const upd = (i: number, v: Partial<UcRow>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...v } : x)));
  const res = ucGpa(rows);
  const tenth = rows.filter((r) => r.year === "10").length;
  return (
    <div className="calc">
      <Sheet title={`Semester grades (${rows.length})`} right={<span className="small hint">One row per semester of each A–G course</span>}
        actions={<>
          <button className="btn" type="button" onClick={() => setRows((r) => [...r, { grade: "A", year: "11", honors: false }])}>Add semester grade</button>
          <button className="btn-ghost" type="button" onClick={() => setRows([{ grade: "A", year: "10", honors: false }])}>Clear all</button>
        </>}>
        {rows.map((r, i) => (
          <div className="row" key={i} style={{ gridTemplateColumns: "28px 1fr 1fr 1.2fr 32px", alignItems: "end" }}>
            <span className="idx">{i + 1}</span>
            <label className="field"><span>Grade</span>
              <select value={r.grade} onChange={(e) => upd(i, { grade: e.target.value as UcRow["grade"] })}>{(["A", "B", "C", "D", "F"] as const).map((g) => <option key={g}>{g}</option>)}</select>
            </label>
            <label className="field"><span>Grade level</span>
              <select value={r.year} onChange={(e) => upd(i, { year: e.target.value as UcRow["year"] })}><option value="10">10th</option><option value="11">11th</option></select>
            </label>
            <div className="toggle" style={{ paddingBottom: 6 }}><label><input type="checkbox" checked={r.honors} onChange={(e) => upd(i, { honors: e.target.checked })} /> UC honors / AP / IB</label></div>
            <button className="btn-x" type="button" aria-label={`Remove grade ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </Sheet>
      <Mark label="UC weighted GPA (capped)" value={res.grades ? fmt(res.capped) : "—"} sub={<>{res.honorsUsed} of {res.honorsEarned} honors points counted ({rows.length} grades, {tenth} from 10th grade).</>}>
        <Tally rows={[["Unweighted", fmt(res.unweighted)], ["Fully weighted (uncapped)", fmt(res.fully)], ["Minimum for admission", "3.00 CA / 3.40 non-resident"]]} />
        <p className="note">Plus and minus don&apos;t count. Honors points need a C or better, max 8, no more than 4 from 10th grade. <a href="https://admission.universityofcalifornia.edu/admission-requirements/freshman-requirements/gpa-requirement.html" rel="nofollow noopener" target="_blank">UC Admissions</a>.</p>
      </Mark>
      <MobileBar label="UC capped GPA" value={res.grades ? fmt(res.capped) : "—"} />
    </div>
  );
}
