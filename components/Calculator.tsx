"use client";

import { CALC_BY_SLUG } from "@/lib/catalog";
import GpaCalc, { CumulativeCalc, RaiseCalc } from "./GpaCalc";
import { FinalCalc, SemesterCalc, TestCalc, WeightedCalc } from "./GradeCalc";
import { ActCalc, SatCalc } from "./TestCalc";
import { GpaToPct, LetterToGpa, PctToGpa, ScaleCalc } from "./ConvertCalc";

export default function Calculator({ slug }: { slug: string }) {
  const c = CALC_BY_SLUG[slug];
  switch (c.kind) {
    case "gpa": return <GpaCalc variant={c.variant ?? "general"} />;
    case "cumulative": return <CumulativeCalc />;
    case "raise": return <RaiseCalc />;
    case "weighted": return <WeightedCalc />;
    case "average": return <WeightedCalc equalWeights />;
    case "final": return <FinalCalc />;
    case "test": return <TestCalc />;
    case "semester": return <SemesterCalc />;
    case "sat": return <SatCalc />;
    case "psat": return <SatCalc psat />;
    case "act": return <ActCalc />;
    case "pct2gpa": return <PctToGpa />;
    case "gpa2pct": return <GpaToPct />;
    case "letter2gpa": return <LetterToGpa />;
    case "scale": return <ScaleCalc />;
  }
}
