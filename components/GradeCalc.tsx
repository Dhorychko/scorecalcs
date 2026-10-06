"use client";

import { useState } from "react";
import { finalNeeded, gradeAfterFinal, percentToLetter, percentToPoints, testGrade, weightedGrade } from "@/lib/gpa";
import { Mark, MobileBar, NumField, Sheet, Tally, fmt, num } from "./parts";

type Row = { name: string; score: string; weight: string };

const WEIGHTED_PRESET: Row[] = [
  { name: "Homework", score: "95", weight: "20" },
  { name: "Quizzes", score: "86", weight: "20" },
  { name: "Tests", score: "81", weight: "40" },
  { name: "Project", score: "90", weight: "20" },
];
const AVERAGE_PRESET: Row[] = [
  { name: "Test 1", score: "88", weight: "1" }, { name: "Test 2", score: "79", weight: "1" },
  { name: "Test 3", score: "92", weight: "1" }, { name: "Test 4", score: "85", weight: "1" },
];

/** Weighted categories ("grade-calculator", "weighted-grade-calculator") or a plain average. */
export function WeightedCalc({ equalWeights = false }: { equalWeights?: boolean }) {
  const [rows, setRows] = useState<Row[]>(equalWeights ? AVERAGE_PRESET : WEIGHTED_PRESET);
  const upd = (i: number, k: keyof Row, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const { grade, weightUsed } = weightedGrade(rows.map((r) => ({ score: num(r.score), weight: equalWeights ? 1 : num(r.weight) })));
  const cols = equalWeights ? "28px minmax(0,1.6fr) minmax(0,1fr) 32px" : "28px minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) 32px";
  const off = !equalWeights && Math.abs(weightUsed - 100) > 0.01;
  return (
    <div className="calc">
      <Sheet title={equalWeights ? `Grades (${rows.length})` : `Categories or assignments (${rows.length})`}
        right={!equalWeights && <span className={off ? "warn small" : "small"}>Weights: {fmt(weightUsed, 0)}%</span>}
        actions={<>
          <button className="btn" type="button" onClick={() => setRows((r) => [...r, { name: "", score: "", weight: equalWeights ? "1" : "10" }])}>{equalWeights ? "Add grade" : "Add row"}</button>
          <button className="btn-ghost" type="button" onClick={() => setRows([{ name: "", score: "", weight: equalWeights ? "1" : "100" }])}>Clear all</button>
        </>}>
        {rows.map((r, i) => (
          <div className="row crow" key={i} style={{ gridTemplateColumns: cols, gridTemplateAreas: equalWeights ? '"idx name grade x"' : '"idx name grade cr x"' }}>
            <span className="idx">{i + 1}</span>
            <label className="field f-name"><span>Name</span><input type="text" value={r.name} placeholder="Optional" onChange={(e) => upd(i, "name", e.target.value)} /></label>
            <label className="field f-grade"><span>Grade %</span><input type="number" inputMode="decimal" step="any" min={0} value={r.score} onChange={(e) => upd(i, "score", e.target.value)} onFocus={(e) => e.target.select()} /></label>
            {!equalWeights && <label className="field f-cr"><span>Weight %</span><input type="number" inputMode="decimal" step="any" min={0} value={r.weight} onChange={(e) => upd(i, "weight", e.target.value)} onFocus={(e) => e.target.select()} /></label>}
            <button className="btn-x f-x" type="button" aria-label={`Remove row ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </Sheet>
      <Mark label={equalWeights ? "Average grade" : "Your grade"} value={fmt(grade, 1)} unit="%"
        sub={<>That&apos;s {/^[AEF]/.test(percentToLetter(grade)) ? "an" : "a"} <b>{percentToLetter(grade)}</b> — {fmt(percentToPoints(grade), 1)} on a 4.0 scale.</>}>
        {off && <p className="note warn">Your weights add up to {fmt(weightUsed, 0)}%, not 100%. The grade above is your average over the weight entered so far — useful mid-semester.</p>}
        <Tally rows={[["Rows counted", String(rows.filter((r) => r.score !== "").length)], ...(equalWeights ? [] : [["Weight entered", `${fmt(weightUsed, 0)}%`] as [string, string]])]} />
      </Mark>
      <MobileBar label={equalWeights ? "Average" : "Grade"} value={`${fmt(grade, 1)}%`} />
    </div>
  );
}

export function FinalCalc() {
  const [cur, setCur] = useState("84");
  const [target, setTarget] = useState("85");
  const [w, setW] = useState("20");
  const need = finalNeeded(num(cur), num(target), num(w));
  const ifPerfect = gradeAfterFinal(num(cur), 100, num(w));
  const ifZero = gradeAfterFinal(num(cur), 0, num(w));
  const targets = [93, 90, 87, 83, 80, 77, 73, 70, 65];
  return (
    <div className="calc">
      <Sheet title="Your class and the final">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <NumField id="fc" label="Current grade" value={cur} onChange={setCur} suffix="%" />
          <NumField id="ft" label="Grade you want" value={target} onChange={setTarget} suffix="%" />
          <NumField id="fw" label="Final is worth" value={w} onChange={setW} suffix="%" help="Check your syllabus" />
        </div>
        <div className="row">
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>To finish with</th><th className="r">You need on the final</th></tr></thead>
              <tbody>
                {targets.map((t) => {
                  const n = finalNeeded(num(cur), t, num(w));
                  return <tr key={t} className={t === Math.round(num(target)) ? "hl" : ""}><td>{t}% ({percentToLetter(t)})</td><td className="r">{n > 100 ? "not possible" : n <= 0 ? "already locked in" : `${fmt(n, 1)}%`}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Sheet>
      <Mark label="You need on the final" value={need <= 0 ? "0" : fmt(need, 1)} unit="%"
        sub={need > 100 ? <span className="warn">More than 100% — not reachable unless there&apos;s extra credit.</span> : need <= 0 ? <>You&apos;ve already got it, even with a zero.</> : <>That&apos;s {/^[AEF]/.test(percentToLetter(need)) ? "an" : "a"} <b>{percentToLetter(need)}</b> on the final.</>}>
        <Tally rows={[["If you ace it (100%)", `${fmt(ifPerfect, 1)}%`], ["If you skip it (0%)", `${fmt(ifZero, 1)}%`]]} />
      </Mark>
      <MobileBar label="Needed on final" value={need <= 0 ? "0%" : `${fmt(need, 1)}%`} />
    </div>
  );
}

export function TestCalc() {
  const [total, setTotal] = useState("40");
  const [wrong, setWrong] = useState("6");
  const pct = testGrade(num(total), num(wrong));
  const rows = Array.from({ length: Math.min(16, Math.max(0, Math.floor(num(total))) + 1) }, (_, k) => k);
  return (
    <div className="calc">
      <Sheet title="Your test">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="tq" label="Number of questions (or points)" value={total} onChange={setTotal} step="1" />
          <NumField id="tw" label="Wrong (or points missed)" value={wrong} onChange={setWrong} step="0.5" />
        </div>
        <div className="row">
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Wrong</th><th className="r">Score</th><th className="r">Letter</th></tr></thead>
              <tbody>
                {rows.map((k) => {
                  const p = testGrade(num(total), k);
                  return <tr key={k} className={k === num(wrong) ? "hl" : ""}><td>{k}</td><td className="r">{fmt(p, 1)}%</td><td className="r">{percentToLetter(p)}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Sheet>
      <Mark label="Test grade" value={fmt(pct, 1)} unit="%" sub={<>{fmt(num(total) - num(wrong), 1)} of {fmt(num(total), 0)} right — {/^[AEF]/.test(percentToLetter(pct)) ? "an" : "a"} <b>{percentToLetter(pct)}</b>.</>}>
        <Tally rows={[["Each question is worth", num(total) > 0 ? `${fmt(100 / num(total), 2)}%` : "—"]]} />
      </Mark>
      <MobileBar label="Test grade" value={`${fmt(pct, 1)}%`} />
    </div>
  );
}

export function SemesterCalc() {
  const [q1, setQ1] = useState("88");
  const [q2, setQ2] = useState("84");
  const [exam, setExam] = useState("80");
  const [wq, setWq] = useState("40");
  const [we, setWe] = useState("20");
  const wQ = num(wq), wE = num(we);
  const sum = 2 * wQ + wE;
  const g = sum ? (num(q1) * wQ + num(q2) * wQ + num(exam) * wE) / sum : 0;
  return (
    <div className="calc">
      <Sheet title="Two quarters and a semester exam">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <NumField id="s1" label="Quarter 1" value={q1} onChange={setQ1} suffix="%" />
          <NumField id="s2" label="Quarter 2" value={q2} onChange={setQ2} suffix="%" />
          <NumField id="se" label="Semester exam" value={exam} onChange={setExam} suffix="%" />
        </div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="sw" label="Each quarter counts" value={wq} onChange={setWq} suffix="%" help="40/40/20 is the most common split" />
          <NumField id="sx" label="Exam counts" value={we} onChange={setWe} suffix="%" />
        </div>
      </Sheet>
      <Mark label="Semester grade" value={fmt(g, 1)} unit="%" sub={<>{/^[AEF]/.test(percentToLetter(g)) ? "An" : "A"} <b>{percentToLetter(g)}</b> — {fmt(percentToPoints(g), 1)} grade points.</>}>
        {Math.abs(sum - 100) > 0.01 && <p className="note warn">Weights add up to {fmt(sum, 0)}%; the grade is scaled to 100%.</p>}
      </Mark>
      <MobileBar label="Semester grade" value={`${fmt(g, 1)}%`} />
    </div>
  );
}
