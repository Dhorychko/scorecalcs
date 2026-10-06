"use client";

import { useState } from "react";
import { apScore, composite, defaults, mcNeeded } from "@/lib/apMath";
import type { ApExam } from "@/lib/apTypes";
import { Mark, MobileBar, Sheet, Tally, num } from "./parts";

export default function ApCalc({ exam: e }: { exam: ApExam }) {
  const d = defaults(e);
  const [mc, setMc] = useState(String(d.mc));
  const [frq, setFrq] = useState(d.frq.map(String));
  const pts = frq.map(num);
  const share = composite(e, num(mc), pts);
  const score = apScore(share, e.cut);
  const nextTarget = score < 5 ? score + 1 : null;
  const needMc = nextTarget ? mcNeeded(e, nextTarget, pts) : null;
  const msg = ["", "No recommendation", "Possibly qualified", "Qualified", "Well qualified", "Extremely well qualified"][score];

  return (
    <div className="calc">
      <Sheet title={e.name} right={<span className="small">May {e.formatYear} format</span>}>
        {e.mc.count > 0 && <>
          <div className="sheet-section">Section I: multiple choice ({Math.round(e.mc.weight * 1000) / 10}% of your score)</div>
          <div className="row" style={{ gridTemplateColumns: "1fr" }}>
            <label className="field" htmlFor="mc">
              <span>Questions right</span>
              <div className="inline">
                <input id="mc" type="number" inputMode="numeric" min={0} max={e.mc.count} step={1} value={mc} onChange={(x) => setMc(x.target.value)} onFocus={(x) => x.target.select()} />
                <span className="of">of {e.mc.count}</span>
              </div>
              {num(mc) > e.mc.count ? <span className="help warn">The section has {e.mc.count} questions — counted as {e.mc.count}.</span>
                : <span className="help">No penalty for wrong answers. {e.mc.note ?? ""}</span>}
            </label>
          </div>
        </>}
        <div className="sheet-section">{e.mc.count > 0 ? "Section II: free response" : "Scored components"} ({Math.round((1 - e.mc.weight) * 1000) / 10}% of your score)</div>
        {e.frq.map((f, i) => (
          <div className="row" key={i} style={{ gridTemplateColumns: "28px 1fr" }}>
            <span className="idx">{i + 1}</span>
            <label className="field" htmlFor={`q${i}`}>
              <span>{f.label}</span>
              <div className="inline">
                <input id={`q${i}`} type="number" inputMode="decimal" min={0} max={f.max} step={f.max >= 100 ? 1 : 0.5} value={frq[i]}
                  onChange={(x) => setFrq((p) => p.map((v, j) => (j === i ? x.target.value : v)))} onFocus={(x) => x.target.select()} />
                <span className="of">{f.max === 100 ? "%" : `of ${f.max}`}</span>
              </div>
              {num(frq[i]) > f.max && <span className="help warn">Maximum is {f.max} — counted as {f.max}.</span>}
            </label>
          </div>
        ))}
      </Sheet>

      <Mark label="Predicted AP score" value={String(score)} sub={<>{msg}. Composite {Math.round(share * 1000) / 10}%.</>}>
        <ol className="bubbles" aria-label={`Predicted score ${score} of 5`}>
          {[1, 2, 3, 4, 5].map((n) => <li key={n} className={n === score ? "on" : ""}>{n}</li>)}
        </ol>
        <Tally rows={[
          ["Composite needed for a 5", `≈${Math.round(e.cut.five * 100)}%`],
          ["for a 4", `≈${Math.round(e.cut.four * 100)}%`],
          ["for a 3", `≈${Math.round(e.cut.three * 100)}%`],
          ...(nextTarget && e.mc.count > 0 ? [[`MC right for a ${nextTarget}, same FRQ`, needMc === null ? "not reachable" : `${needMc} of ${e.mc.count}`] as [string, string]] : []),
        ]} />
        <p className="note">Estimate. College Board sets the cutoffs each year after scoring and doesn&apos;t publish them.</p>
      </Mark>
      <MobileBar label="Predicted AP score" value={String(score)} />
    </div>
  );
}
