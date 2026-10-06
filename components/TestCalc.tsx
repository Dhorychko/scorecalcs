"use client";

import { useState } from "react";
import { ACT, SAT, SAT_RANGE, actComposite, actSection, actStem, psatSection, satSection, selectionIndex, type Module2 } from "@/lib/satact";
import { Mark, MobileBar, NumField, Sheet, Tally, num } from "./parts";

function ModulePick({ id, value, onChange }: { id: string; value: Module2; onChange: (v: Module2) => void }) {
  return (
    <div className="field">
      <span>Second module was</span>
      <div className="toggle" role="radiogroup" aria-label="Second module difficulty">
        {(["harder", "easier"] as const).map((v) => (
          <label key={v}><input type="radio" name={id} checked={value === v} onChange={() => onChange(v)} /> {v === "harder" ? "Harder" : "Easier"}</label>
        ))}
      </div>
      <span className="help">Bluebook practice reports show which one you got. Not sure? Harder if module 1 went well.</span>
    </div>
  );
}

export function SatCalc({ psat = false }: { psat?: boolean }) {
  const [rw, setRw] = useState("42");
  const [m, setM] = useState("34");
  const [rwMod, setRwMod] = useState<Module2>("harder");
  const [mMod, setMMod] = useState<Module2>("harder");
  const fn = psat ? psatSection : satSection;
  const rwS = fn("rw", num(rw), rwMod);
  const mS = fn("math", num(m), mMod);
  const total = rwS + mS;
  const lo = psat ? 320 : 400, hi = psat ? 1520 : 1600;
  return (
    <div className="calc">
      <Sheet title={psat ? "PSAT/NMSQT: questions right" : "Digital SAT: questions right"}>
        <div className="sheet-section">Reading and Writing ({SAT.rw.modules})</div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="rw" label="Right answers" value={rw} onChange={setRw} step="1" max={SAT.rw.questions} suffix={`of ${SAT.rw.questions}`} />
          <ModulePick id="rwm" value={rwMod} onChange={setRwMod} />
        </div>
        <div className="sheet-section">Math ({psat ? "2 modules × 22 questions, 70 minutes" : SAT.math.modules})</div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="m" label="Right answers" value={m} onChange={setM} step="1" max={SAT.math.questions} suffix={`of ${SAT.math.questions}`} />
          <ModulePick id="mm" value={mMod} onChange={setMMod} />
        </div>
      </Sheet>
      <Mark label={psat ? "Estimated PSAT score" : "Estimated SAT score"} value={String(total)} sub={<>Likely range {Math.max(lo, total - 2 * SAT_RANGE)}–{Math.min(hi, total + 2 * SAT_RANGE)} on a {lo}–{hi} scale.</>}>
        <Tally rows={[
          ["Reading and Writing", String(rwS)],
          ["Math", String(mS)],
          ...(psat ? [["National Merit Selection Index", String(selectionIndex(rwS, mS))] as [string, string]] : []),
        ]} />
        <p className="note">Estimate. The digital {psat ? "PSAT" : "SAT"} is adaptive and each test form has its own conversion, so the same number of right answers can land 20–40 points apart.</p>
      </Mark>
      <MobileBar label={psat ? "PSAT estimate" : "SAT estimate"} value={String(total)} />
    </div>
  );
}

export function ActCalc() {
  const [e, setE] = useState("38");
  const [m, setM] = useState("31");
  const [r, setR] = useState("27");
  const [s, setS] = useState("29");
  const [sci, setSci] = useState(true);
  const eS = actSection(num(e), ACT.english.questions);
  const mS = actSection(num(m), ACT.math.questions);
  const rS = actSection(num(r), ACT.reading.questions);
  const sS = actSection(num(s), ACT.science.questions);
  const comp = actComposite(eS, mS, rS);
  return (
    <div className="calc">
      <Sheet title="ACT: questions right">
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="ae" label="English" value={e} onChange={setE} step="1" max={50} suffix="of 50" />
          <NumField id="am" label="Math" value={m} onChange={setM} step="1" max={45} suffix="of 45" />
        </div>
        <div className="row" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <NumField id="ar" label="Reading" value={r} onChange={setR} step="1" max={36} suffix="of 36" />
          {sci ? <NumField id="as" label="Science (optional)" value={s} onChange={setS} step="1" max={40} suffix="of 40" /> : <span />}
        </div>
        <div className="row"><div className="toggle"><label><input type="checkbox" checked={sci} onChange={(x) => setSci(x.target.checked)} /> I&apos;m taking the Science section</label></div></div>
      </Sheet>
      <Mark label="Estimated ACT composite" value={String(comp)} sub={<>Average of English, Math and Reading, on a 1–36 scale.</>}>
        <Tally rows={[
          ["English", String(eS)], ["Math", String(mS)], ["Reading", String(rS)],
          ...(sci ? [["Science", String(sS)], ["STEM score", String(actStem(mS, sS))]] as [string, string][] : []),
        ]} />
        <p className="note">Estimate for the enhanced ACT (from 2025). Some questions on each section are unscored field-test items, and each form has its own conversion table.</p>
      </Mark>
      <MobileBar label="ACT composite" value={String(comp)} />
    </div>
  );
}
