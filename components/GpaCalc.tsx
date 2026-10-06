"use client";

import { useMemo, useState } from "react";
import { computeGpa, cumulativeGpa, gradeToPoints, LETTERS, pointsToLetter, requiredGpa, maxReachable, type Level } from "@/lib/gpa";
import type { GpaVariant } from "@/lib/catalog";
import { Mark, MobileBar, NumField, Sheet, Tally, fmt, num } from "./parts";

type Row = { name: string; grade: string; credits: string; level: Level };

const GRADE_OPTIONS = LETTERS.map((l) => l.letter);

const PRESETS: Record<GpaVariant, { rows: Row[]; credits: boolean; levels: boolean; creditLabel: string }> = {
  general: { credits: true, levels: true, creditLabel: "Credits", rows: [
    { name: "English", grade: "A-", credits: "1", level: "honors" }, { name: "Algebra II", grade: "B+", credits: "1", level: "regular" },
    { name: "Biology", grade: "A", credits: "1", level: "ap" }, { name: "U.S. History", grade: "B", credits: "1", level: "regular" },
    { name: "Spanish", grade: "A", credits: "1", level: "regular" } ] },
  college: { credits: true, levels: false, creditLabel: "Credit hours", rows: [
    { name: "Calculus I", grade: "B+", credits: "4", level: "regular" }, { name: "English Composition", grade: "A-", credits: "3", level: "regular" },
    { name: "Intro to Psychology", grade: "A", credits: "3", level: "regular" }, { name: "General Chemistry", grade: "B", credits: "4", level: "regular" },
    { name: "Chem Lab", grade: "A", credits: "1", level: "regular" } ] },
  "high-school": { credits: true, levels: true, creditLabel: "Credits", rows: [
    { name: "AP English Lang", grade: "B+", credits: "1", level: "ap" }, { name: "Precalculus Honors", grade: "A-", credits: "1", level: "honors" },
    { name: "Chemistry", grade: "A", credits: "1", level: "regular" }, { name: "AP U.S. History", grade: "B", credits: "1", level: "ap" },
    { name: "Spanish III", grade: "A", credits: "1", level: "regular" }, { name: "PE", grade: "A", credits: "0.5", level: "regular" } ] },
  "middle-school": { credits: false, levels: false, creditLabel: "Credits", rows: [
    { name: "Math", grade: "B+", credits: "1", level: "regular" }, { name: "English", grade: "A", credits: "1", level: "regular" },
    { name: "Science", grade: "A-", credits: "1", level: "regular" }, { name: "Social Studies", grade: "B", credits: "1", level: "regular" },
    { name: "Elective", grade: "A", credits: "1", level: "regular" } ] },
  weighted: { credits: true, levels: true, creditLabel: "Credits", rows: [
    { name: "AP Calculus AB", grade: "B+", credits: "1", level: "ap" }, { name: "AP Biology", grade: "A-", credits: "1", level: "ap" },
    { name: "English 11 Honors", grade: "A", credits: "1", level: "honors" }, { name: "U.S. History", grade: "A", credits: "1", level: "regular" },
    { name: "French III", grade: "B", credits: "1", level: "regular" } ] },
  unweighted: { credits: true, levels: false, creditLabel: "Credits", rows: [
    { name: "English", grade: "A", credits: "1", level: "regular" }, { name: "Geometry", grade: "B", credits: "1", level: "regular" },
    { name: "Biology", grade: "A-", credits: "1", level: "regular" }, { name: "World History", grade: "B+", credits: "1", level: "regular" },
    { name: "Art", grade: "A", credits: "1", level: "regular" } ] },
};

export default function GpaCalc({ variant }: { variant: GpaVariant }) {
  const preset = PRESETS[variant];
  const [rows, setRows] = useState<Row[]>(preset.rows);
  const [honors, setHonors] = useState("0.5");
  const [ap, setAp] = useState("1.0");
  const upd = (i: number, k: keyof Row, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const res = useMemo(
    () => computeGpa(rows.map((r) => ({ grade: r.grade, credits: preset.credits ? num(r.credits) : 1, level: r.level })), { regular: 0, honors: num(honors), ap: num(ap) }),
    [rows, honors, ap, preset.credits],
  );
  const showWeighted = preset.levels;
  const headline = variant === "weighted" ? res.weighted : res.unweighted;
  const areas = `"idx name grade${preset.credits ? " cr" : ""}${preset.levels ? " lvl" : ""} x"`;
  const cols = `28px minmax(0,1.6fr) minmax(0,1fr)${preset.credits ? " 82px" : ""}${preset.levels ? " minmax(0,1fr)" : ""} 32px`;

  return (
    <div className="calc">
      <Sheet
        title={`Your courses (${rows.length})`}
        right={<span className="small hint">Letter or percent, e.g. B+ or 88</span>}
        actions={<>
          <button className="btn" type="button" onClick={() => setRows((r) => [...r, { name: "", grade: "A", credits: preset.credits ? (variant === "college" ? "3" : "1") : "1", level: "regular" }])}>Add course</button>
          <button className="btn-ghost" type="button" onClick={() => setRows([{ name: "", grade: "", credits: variant === "college" ? "3" : "1", level: "regular" }])}>Clear all</button>
        </>}
      >
        {rows.map((r, i) => {
          const bad = r.grade.trim() !== "" && gradeToPoints(r.grade) === null;
          return (
            <div className="row crow" key={i} style={{ gridTemplateColumns: cols, gridTemplateAreas: areas }}>
              <span className="idx">{i + 1}</span>
              <label className="field f-name"><span>Course</span><input type="text" value={r.name} placeholder="Optional" onChange={(e) => upd(i, "name", e.target.value)} /></label>
              <label className="field f-grade"><span>Grade{bad && <span className="warn"> ?</span>}</span>
                <input type="text" list="grade-list" value={r.grade} aria-invalid={bad} onChange={(e) => upd(i, "grade", e.target.value)} onFocus={(e) => e.target.select()} />
              </label>
              {preset.credits && <label className="field f-cr"><span>{preset.creditLabel}</span><input type="number" inputMode="decimal" min={0} step="0.5" value={r.credits} onChange={(e) => upd(i, "credits", e.target.value)} /></label>}
              {preset.levels && (
                <label className="field f-lvl"><span>Level</span>
                  <select value={r.level} onChange={(e) => upd(i, "level", e.target.value)}>
                    <option value="regular">Regular</option><option value="honors">Honors</option><option value="ap">AP / IB / Dual</option>
                  </select>
                </label>
              )}
              <button className="btn-x f-x" type="button" aria-label={`Remove course ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>×</button>
            </div>
          );
        })}
        <datalist id="grade-list">{GRADE_OPTIONS.map((g) => <option key={g} value={g} />)}</datalist>
        {showWeighted && (
          <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <NumField id="hb" label="Honors bonus" value={honors} onChange={setHonors} step="0.1" help="Most schools add 0.5" />
            <NumField id="ab" label="AP / IB bonus" value={ap} onChange={setAp} step="0.1" help="Most schools add 1.0" />
          </div>
        )}
      </Sheet>

      <Mark label={variant === "weighted" ? "Weighted GPA" : showWeighted ? "Unweighted GPA (4.0 scale)" : "GPA (4.0 scale)"} value={fmt(headline)}
        sub={<>That averages to {res.credits ? <b>{pointsToLetter(res.unweighted)}</b> : "—"} across {fmt(res.credits, res.credits % 1 ? 1 : 0)} {preset.credits ? preset.creditLabel.toLowerCase() : "classes"}.</>}>
        <Tally rows={[
          ...(showWeighted ? [[variant === "weighted" ? "Unweighted GPA" : "Weighted GPA", fmt(variant === "weighted" ? res.unweighted : res.weighted)] as [string, string]] : []),
          ["Quality points", fmt(res.qualityPoints, 1)],
          [preset.credits ? `Total ${preset.creditLabel.toLowerCase()}` : "Classes", fmt(res.credits, res.credits % 1 ? 1 : 0)],
        ]} />
        <p className="note">A+ counts as 4.0. Pass/fail classes don&apos;t count — leave them out.</p>
      </Mark>
      <MobileBar label={variant === "weighted" ? "Weighted GPA" : "GPA"} value={fmt(headline)} />
    </div>
  );
}

export function CumulativeCalc() {
  const [prior, setPrior] = useState("3.20");
  const [priorCr, setPriorCr] = useState("45");
  const [term, setTerm] = useState("3.60");
  const [termCr, setTermCr] = useState("15");
  const g = cumulativeGpa(num(prior), num(priorCr), num(term), num(termCr));
  const change = g - num(prior);
  return (
    <div className="calc">
      <Sheet title="Your GPA so far and this term">
        <div className="sheet-section">Before this term</div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="pg" label="Cumulative GPA" value={prior} onChange={setPrior} step="0.01" max={5} />
          <NumField id="pc" label="Credits completed" value={priorCr} onChange={setPriorCr} step="0.5" help="From your transcript" />
        </div>
        <div className="sheet-section">This term</div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="tg" label="Term GPA" value={term} onChange={setTerm} step="0.01" max={5} help="Use the GPA calculator if you don't know it yet" />
          <NumField id="tc" label="Term credits" value={termCr} onChange={setTermCr} step="0.5" />
        </div>
      </Sheet>
      <Mark label="New cumulative GPA" value={num(priorCr) + num(termCr) > 0 ? fmt(g) : "—"} sub={num(priorCr) + num(termCr) > 0 ? <>{change >= 0 ? "Up" : "Down"} {fmt(Math.abs(change))} from {fmt(num(prior))}.</> : <span className="warn">Enter your credits.</span>}>
        <Tally rows={[["Total credits", fmt(num(priorCr) + num(termCr), 1)], ["Total quality points", fmt(num(prior) * num(priorCr) + num(term) * num(termCr), 1)], ["Letter equivalent", num(priorCr) + num(termCr) > 0 ? pointsToLetter(g) : "—"]]} />
      </Mark>
      <MobileBar label="Cumulative GPA" value={fmt(g)} />
    </div>
  );
}

export function RaiseCalc({ preset }: { preset?: number }) {
  const [cur, setCur] = useState(preset ? preset.toFixed(2) : "3.10");
  const [done, setDone] = useState(preset ? "30" : "60");
  const presetTarget = preset ? (preset >= 3.8 ? Math.min(3.95, preset + 0.05) : preset + 0.2) : 3.4;
  const [target, setTarget] = useState(presetTarget.toFixed(2));
  const [next, setNext] = useState("30");
  const need = requiredGpa(num(cur), num(done), num(target), num(next));
  const best = maxReachable(num(cur), num(done), num(next));
  const noCredits = !(num(next) > 0);
  const impossible = !noCredits && need > 4.0001;
  const already = need <= num(cur) && num(target) <= num(cur);
  return (
    <div className="calc">
      <Sheet title="Where you are and where you want to be">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="rc" label="Current GPA" value={cur} onChange={setCur} step="0.01" max={4} />
          <NumField id="rd" label="Credits completed" value={done} onChange={setDone} step="1" />
        </div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="rt" label="Target GPA" value={target} onChange={setTarget} step="0.01" max={4} />
          <NumField id="rn" label="Credits still to take" value={next} onChange={setNext} step="1" help="One semester is usually 15 college credits or 6–7 high school credits" />
        </div>
      </Sheet>
      <Mark label="GPA you need on those credits" value={noCredits ? "—" : impossible ? "4.0+" : fmt(Math.max(0, need))}
        sub={noCredits ? <span className="warn">Enter how many credits you still have to take.</span> : impossible ? <span className="warn">Not reachable in {num(next)} credits — even straight A&apos;s get you to {fmt(best)}.</span>
          : already ? <>You&apos;re already at or above that target.</> : <>That&apos;s about a{/^[AEFIO]/.test(pointsToLetter(need)) ? "n" : ""} <b>{pointsToLetter(need)}</b> average.</>}>
        <Tally rows={[["Best possible with straight A's", fmt(best)], ["Credits after this", fmt(num(done) + num(next), 0)]]} />
      </Mark>
      <MobileBar label="GPA needed" value={impossible ? "4.0+" : fmt(Math.max(0, need))} />
    </div>
  );
}
