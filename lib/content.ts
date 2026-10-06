export type Content = {
  intro: string;
  steps: string[];
  formula: string[];
  example?: string;
  tips: string[];
  faq: { q: string; a: string }[];
  related: string[];
};

const LETTER_FAQ = {
  q: "Does an A+ count as 4.3?",
  a: "On most U.S. high school and college scales an A+ is worth 4.0, the same as an A. A few colleges give 4.33 for an A+; this calculator uses 4.0, so if your school is one of them your real GPA will be slightly higher.",
};

export const CONTENT: Record<string, Content> = {
  "gpa-calculator": {
    intro: "Work out your GPA for a semester or a whole year. Enter each class with its letter grade (or percentage), credits and level, and the calculator shows your unweighted GPA on the 4.0 scale and your weighted GPA with honors and AP bonuses.",
    steps: [
      "Add one row per class. Type the grade as a letter (B+) or a percent (88).",
      "Enter credits. Most high school year-long classes are 1 credit, semester classes 0.5; college classes use credit hours.",
      "Pick Regular, Honors or AP/IB for each class if your school weights grades.",
      "Read the unweighted GPA in the red circle and the weighted GPA underneath.",
    ],
    formula: [
      "GPA = Σ (grade points × credits) ÷ Σ credits",
      "Weighted GPA adds the level bonus to each class's grade points first (usually +0.5 honors, +1.0 AP/IB).",
    ],
    tips: [
      "Leave out pass/fail classes — they carry no grade points.",
      "Colleges often recalculate your GPA using only core academic classes, so your 'college GPA' may differ from your transcript.",
      "If your school uses a different bonus (some add 0.5 for AP), change it under the course list.",
    ],
    faq: [
      { q: "What's the difference between weighted and unweighted GPA?", a: "Unweighted GPA uses the plain 4.0 scale for every class. Weighted GPA adds a bonus for harder classes — typically 0.5 for honors and 1.0 for AP, IB or dual enrollment — so an A in AP Biology counts as 5.0." },
      { q: "Is a 3.0 GPA good?", a: "A 3.0 is a solid B average. The average high school graduate's GPA was about 3.1 in the U.S. Department of Education's most recent transcript study, so 3.0 is close to typical. Selective colleges usually look for 3.7 and up." },
      LETTER_FAQ,
      { q: "Do failed classes count in GPA?", a: "Yes. An F is worth 0 grade points but its credits still count, so it pulls the average down. If you retake the class, many schools replace the old grade — check your school's repeat policy." },
    ],
    related: ["cumulative-gpa-calculator", "weighted-gpa-calculator", "raise-gpa-calculator", "percentage-to-gpa-calculator"],
  },
  "college-gpa-calculator": {
    intro: "Calculate your college semester GPA from letter grades and credit hours. A 4-credit class counts four times as much as a 1-credit lab, which is why credit hours matter more in college than in high school.",
    steps: [
      "Enter each class with its letter grade and credit hours from your schedule.",
      "Labs and recitations with their own grade are separate rows.",
      "Leave out pass/fail, audited and withdrawn (W) classes.",
      "To combine this semester with earlier ones, take the result to the cumulative GPA calculator.",
    ],
    formula: ["Semester GPA = Σ (grade points × credit hours) ÷ Σ credit hours", "Quality points = grade points × credit hours"],
    example: "A B+ in a 4-credit class is 3.3 × 4 = 13.2 quality points.",
    tips: [
      "Most colleges don't weight GPA — there is no honors bonus at college level.",
      "A grade of W doesn't affect GPA, but an F does, even in a class you stopped attending.",
      "Scholarships often require a minimum term GPA (3.0 is common) as well as a cumulative one.",
    ],
    faq: [
      { q: "How many credits is a full-time semester?", a: "Usually 12 or more credit hours. Most students take 15 credits a semester to graduate in four years with a 120-credit degree." },
      { q: "What GPA do you need for the Dean's List?", a: "It varies by college, but 3.5 for the semester with at least 12 graded credits is the most common rule." },
      { q: "Does a grade replacement change my GPA?", a: "Many colleges let you retake a class and replace the earlier grade in your GPA, though both grades stay on the transcript. Graduate and professional schools often count both." },
      LETTER_FAQ,
    ],
    related: ["cumulative-gpa-calculator", "raise-gpa-calculator", "final-grade-calculator", "gpa-calculator"],
  },
  "high-school-gpa-calculator": {
    intro: "Calculate your high school GPA, weighted and unweighted, the way most U.S. schools do: 4.0 scale, with an extra half point for honors and a full point for AP, IB and dual-enrollment classes.",
    steps: [
      "Enter every class for the semester or year with its letter or percentage grade.",
      "Set credits: 1 for a full-year class, 0.5 for a semester class. PE and electives count unless your school excludes them.",
      "Choose the level so honors and AP classes get their bonus.",
      "Compare both numbers: colleges see the unweighted GPA and usually your weighted one too.",
    ],
    formula: ["Unweighted = Σ (points × credits) ÷ Σ credits", "Weighted = Σ ((points + level bonus) × credits) ÷ Σ credits"],
    tips: [
      "Many college applications ask for your GPA exactly as it appears on your transcript — don't round it up.",
      "Some states and colleges (the University of California, for example) recalculate GPA with their own rules, often using only grades from 10th–11th grade.",
      "Class rank usually follows weighted GPA, so one more AP class can matter more than an extra elective A.",
    ],
    faq: [
      { q: "Do freshman grades count in GPA?", a: "On your transcript, yes. Some colleges ignore 9th grade when they recalculate GPA, but most see all four years." },
      { q: "What is a good high school GPA for college?", a: "For most four-year colleges a 3.0–3.5 unweighted GPA is competitive. Highly selective schools admit mostly students with 3.8–4.0 unweighted and a rigorous schedule." },
      { q: "Is a 4.5 weighted GPA possible?", a: "Yes. With a 5.0 maximum for AP classes, a student taking several APs with mostly A's can reach 4.3–4.7 weighted." },
      LETTER_FAQ,
    ],
    related: ["weighted-gpa-calculator", "unweighted-gpa-calculator", "cumulative-gpa-calculator", "ap-score-calculator"],
  },
  "middle-school-gpa-calculator": {
    intro: "A simple GPA calculator for middle school. Enter your letter grades from your report card and see your average on the 4.0 scale — every class counts the same.",
    steps: ["Enter one row per class from your report card.", "Use letters (A, B+) or percentages (91).", "Your GPA appears in the red circle; add or remove classes as you need."],
    formula: ["GPA = sum of grade points ÷ number of classes", "A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0"],
    tips: [
      "Middle school grades don't go on your college transcript, but they can decide placement in honors or advanced math in 9th grade.",
      "Some middle schools grade on a 1–4 standards scale instead of letters; that isn't a GPA, so this calculator won't match it.",
    ],
    faq: [
      { q: "Does middle school GPA matter?", a: "Colleges don't see it. It can matter for high school course placement, magnet or selective high school admission, and some scholarships for younger students." },
      { q: "What is a good GPA in middle school?", a: "A 3.0 or higher (a B average) is good; 3.5 and up usually qualifies for honor roll." },
      LETTER_FAQ,
    ],
    related: ["gpa-calculator", "grade-calculator", "test-grade-calculator", "letter-grade-to-gpa-calculator"],
  },
  "cumulative-gpa-calculator": {
    intro: "Find your new cumulative GPA after this semester. Enter your GPA and credits so far, then this term's GPA and credits, and see your overall GPA and how much it moved.",
    steps: [
      "Take your current cumulative GPA and total graded credits from your transcript or student portal.",
      "Enter this term's GPA and credits (work out the term GPA with the GPA calculator if you need to).",
      "The new cumulative GPA weights each part by its credits.",
    ],
    formula: ["Cumulative GPA = (old GPA × old credits + term GPA × term credits) ÷ (old credits + term credits)"],
    example: "3.2 over 45 credits plus 3.6 over 15 credits: (144 + 54) ÷ 60 = 3.30.",
    tips: [
      "The more credits you've completed, the less one semester can move your cumulative GPA — that's why early semesters matter.",
      "Transfer credits usually count toward your degree but not your GPA at the new school.",
    ],
    faq: [
      { q: "Is cumulative GPA the same as overall GPA?", a: "Yes. Cumulative or overall GPA covers every graded class you've taken at the school; term GPA covers one semester." },
      { q: "How much can one semester raise my GPA?", a: "It depends on how many credits you already have. With 30 credits done, a 4.0 semester of 15 credits can raise a 3.0 to about 3.33; with 90 credits done, the same semester only gets you to about 3.14." },
      { q: "Do repeated classes count twice?", a: "Policies differ. Many schools drop the first attempt from the GPA once you retake the class; others average both. Check your school's repeat policy." },
    ],
    related: ["raise-gpa-calculator", "college-gpa-calculator", "gpa-calculator", "gpa-to-percentage-calculator"],
  },
  "weighted-gpa-calculator": {
    intro: "Calculate your weighted GPA on a 5.0 scale. Honors classes add half a point and AP, IB and dual-enrollment classes add a full point, so an A in an AP class counts as 5.0.",
    steps: [
      "Enter each class and its grade.",
      "Mark honors and AP/IB classes. Leave regular classes as Regular.",
      "Adjust the bonus values if your school's policy is different.",
    ],
    formula: ["Weighted grade points = letter points + level bonus (no bonus on an F)", "Weighted GPA = Σ (weighted points × credits) ÷ Σ credits"],
    tips: [
      "Weighting rules are set by each school district; some cap weighted GPA at 4.5 or only weight grades of C and above.",
      "Selective colleges compare your schedule's rigor directly, so the weighted number matters less to them than the classes behind it.",
    ],
    faq: [
      { q: "Is weighted GPA out of 5.0?", a: "In most schools, yes: the top weighted grade is an A in an AP or IB class, worth 5.0. Some schools weight AP classes by 0.5 instead, which makes 4.5 the top." },
      { q: "Do colleges use weighted or unweighted GPA?", a: "Both appear on your application. Many colleges recalculate GPA on their own scale; the University of California, for example, gives extra points only for approved honors-level classes taken in 10th and 11th grade." },
      LETTER_FAQ,
    ],
    related: ["unweighted-gpa-calculator", "high-school-gpa-calculator", "gpa-scale-converter", "ap-score-calculator"],
  },
  "unweighted-gpa-calculator": {
    intro: "Calculate your unweighted GPA on the standard 4.0 scale. Every class counts the same regardless of level: an A is 4.0 whether it's in AP Chemistry or study hall.",
    steps: ["Enter each class and its grade.", "Set credits if your classes differ in length.", "The result is your GPA on a 4.0 scale."],
    formula: ["Unweighted GPA = Σ (grade points × credits) ÷ Σ credits", "A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0 …"],
    tips: ["Unweighted GPA is the easiest number to compare across schools, which is why scholarship forms often ask for it.", "To turn a weighted GPA into an unweighted one, recalculate from the letter grades — you can't just subtract a fixed amount."],
    faq: [
      { q: "Can unweighted GPA be above 4.0?", a: "No. 4.0 is the maximum on an unweighted scale. A GPA above 4.0 is weighted." },
      { q: "What is a good unweighted GPA?", a: "3.0 is about average for U.S. high school graduates, 3.5 is strong, and 3.8–4.0 is typical for admits to the most selective colleges." },
      LETTER_FAQ,
    ],
    related: ["weighted-gpa-calculator", "gpa-calculator", "gpa-to-percentage-calculator", "percentage-to-gpa-calculator"],
  },
  "raise-gpa-calculator": {
    intro: "See what GPA you'd need on your remaining classes to reach a target GPA — and whether it's even possible. Enter your current GPA, credits done, the GPA you want and how many credits you have left.",
    steps: [
      "Enter your current cumulative GPA and graded credits.",
      "Set a target GPA (for a scholarship, honors or grad school cutoff).",
      "Enter the credits you'll take before the deadline: one semester, a year, or the rest of your degree.",
      "If the target needs more than 4.0, it's out of reach in that time — try more credits or a lower target.",
    ],
    formula: ["Needed GPA = (target × (credits done + credits left) − current × credits done) ÷ credits left"],
    example: "From 3.1 over 60 credits to 3.4 with 30 credits left: (3.4 × 90 − 3.1 × 60) ÷ 30 = 4.0 — straight A's.",
    tips: ["Retaking a low grade, if your school replaces it, raises GPA faster than new A's.", "Summer and winter terms add credits sooner, which helps if a deadline is close."],
    faq: [
      { q: "How fast can I raise my GPA?", a: "It depends on how many credits you've completed. Early on a strong semester moves GPA a lot; after three years it takes many A's to move it a tenth of a point." },
      { q: "Can I raise my GPA from 2.5 to 3.0 in one semester?", a: "Only if you've completed few credits. With 15 credits done, 15 credits of 3.5 would do it; with 60 credits done you'd need a 5.0, which isn't possible on a 4.0 scale." },
    ],
    related: ["cumulative-gpa-calculator", "final-grade-calculator", "college-gpa-calculator", "gpa-calculator"],
  },
  "grade-calculator": {
    intro: "Calculate your grade in a class from weighted categories like homework, quizzes, tests and projects. Enter each category's average and its weight from the syllabus to see your overall percentage and letter grade.",
    steps: [
      "Copy the category weights from your syllabus (for example Tests 40%, Quizzes 20%).",
      "Enter your current average in each category.",
      "If some categories haven't started yet, leave them out: the result is your grade over the work so far.",
    ],
    formula: ["Grade = Σ (category average × weight) ÷ Σ weights"],
    example: "Homework 95% × 20 + Quizzes 86% × 20 + Tests 81% × 40 + Project 90% × 20 = 86.6%.",
    tips: ["If your teacher uses total points instead of percentages, divide points earned by points possible for each category first.", "Rounding rules vary: some teachers round 89.5 up to an A-, others don't."],
    faq: [
      { q: "My weights don't add up to 100 — is that a problem?", a: "No. The calculator divides by the total weight you entered, so mid-semester it shows your grade over the categories graded so far." },
      { q: "How do I calculate my grade with points instead of weights?", a: "Add up all the points you earned and divide by all the points possible. If every assignment is points-based, that's your grade — no weights needed." },
      { q: "What percentage is a B?", a: "On the common U.S. scale, 83–86% is a B, 80–82% a B- and 87–89% a B+." },
    ],
    related: ["final-grade-calculator", "weighted-grade-calculator", "test-grade-calculator", "gpa-calculator"],
  },
  "final-grade-calculator": {
    intro: "Find out what you need on your final exam to get the grade you want. Enter your current grade, the grade you're aiming for and how much the final is worth.",
    steps: [
      "Find your current grade in the class (your portal or the grade calculator).",
      "Look up how much the final counts in the syllabus — 15% to 25% is typical.",
      "Enter the grade you want; the table shows the score needed for every letter grade at once.",
    ],
    formula: ["Needed on final = (target − current × (1 − w)) ÷ w", "where w is the final's weight as a decimal (20% → 0.2)"],
    example: "Current 86%, target 90%, final worth 20%: (90 − 86 × 0.8) ÷ 0.2 = 106% — not possible without extra credit.",
    tips: ["Some teachers replace your lowest test with the final score — that can change the math in your favour.", "If the final is graded on a curve, aim a few points above the number you need."],
    faq: [
      { q: "What if I need more than 100% on the final?", a: "Then the target grade isn't reachable through the final alone. Ask about extra credit, dropped scores or revisions; otherwise aim for the next grade down — the table shows what each letter takes." },
      { q: "How much will a bad final hurt my grade?", a: "The 'If you skip it (0%)' line shows the worst case. With a final worth 20%, a 60 instead of 90 costs you 6 percentage points." },
      { q: "What if my class uses points?", a: "Divide your points so far by points possible to get your current grade, and the final's points by the total points in the course to get its weight." },
    ],
    related: ["grade-calculator", "semester-grade-calculator", "test-grade-calculator", "raise-gpa-calculator"],
  },
  "weighted-grade-calculator": {
    intro: "Average grades that count for different amounts. Enter each grade with its weight — percent of the class, credit hours or points — and get the weighted average.",
    steps: ["Enter each grade as a percentage.", "Enter its weight. Weights can be percentages (40) or any relative numbers (2 for double weight).", "The weighted average updates as you type."],
    formula: ["Weighted average = Σ (grade × weight) ÷ Σ weights"],
    tips: ["Weights don't have to sum to 100 — the calculator normalises them.", "A simple average treats every grade equally; use the average grade calculator for that."],
    faq: [
      { q: "What's the difference between a weighted and a simple average?", a: "A simple average adds the grades and divides by how many there are. A weighted average multiplies each grade by its weight first, so a test worth 40% counts four times as much as a quiz worth 10%." },
      { q: "Can I use points as weights?", a: "Yes. If a test is 100 points and a quiz 20 points, enter 100 and 20 as the weights." },
    ],
    related: ["grade-calculator", "average-grade-calculator", "final-grade-calculator", "gpa-calculator"],
  },
  "test-grade-calculator": {
    intro: "Turn the number of questions you got wrong into a percentage and letter grade. The table shows the score for every number wrong, so you can see what one more mistake costs.",
    steps: ["Enter the number of questions (or total points).", "Enter how many you got wrong (or points missed).", "Read your percentage and letter grade; the table lists the other outcomes."],
    formula: ["Score = (questions − wrong) ÷ questions × 100"],
    example: "6 wrong out of 40: 34 ÷ 40 = 85%, a B.",
    tips: ["For tests with questions worth different points, use points: total points and points missed.", "Teachers use this as an 'EZ grader' — the table doubles as a grading chart."],
    faq: [
      { q: "How much is each question worth?", a: "100 divided by the number of questions. On a 25-question test each question is 4%." },
      { q: "What is 17 out of 20 as a grade?", a: "85%, which is a B on the standard U.S. scale." },
    ],
    related: ["grade-calculator", "final-grade-calculator", "percentage-to-gpa-calculator", "average-grade-calculator"],
  },
  "average-grade-calculator": {
    intro: "Find the average of several grades when they all count the same — test scores, quarter grades or class averages.",
    steps: ["Enter each grade as a percentage.", "Add as many as you need.", "The average and its letter grade update instantly."],
    formula: ["Average = (grade 1 + grade 2 + … + grade n) ÷ n"],
    tips: ["If some grades count more than others, switch to the weighted grade calculator.", "To average letter grades, use the letter grade to GPA calculator."],
    faq: [
      { q: "How do I average percentages?", a: "Add them and divide by how many there are — but only if they're out of the same total. Tests out of different points should be averaged by total points instead." },
      { q: "What is the average of 88, 79, 92 and 85?", a: "86%, a B." },
    ],
    related: ["weighted-grade-calculator", "grade-calculator", "test-grade-calculator", "semester-grade-calculator"],
  },
  "semester-grade-calculator": {
    intro: "Combine two quarter grades and a semester exam into a semester grade. The default 40/40/20 split is the most common, and you can change it to match your school.",
    steps: ["Enter both quarter grades.", "Enter your semester exam score (or a guess).", "Set the weights from your school's grading policy."],
    formula: ["Semester grade = Q1 × w₁ + Q2 × w₂ + exam × w₃ (weights sum to 100%)"],
    tips: ["Some schools use 45/45/10 or exempt students with high grades from the exam.", "To find the exam score you need, use the final grade calculator with your quarter average as the current grade."],
    faq: [
      { q: "How are semester grades calculated?", a: "Most U.S. high schools average the two quarter grades and the semester exam, weighting each quarter 40% and the exam 20%. Check your student handbook for your district's split." },
      { q: "Is the semester grade what goes on my transcript?", a: "Usually yes: transcripts list semester (or final year) grades, not quarters, and GPA is calculated from those." },
    ],
    related: ["final-grade-calculator", "grade-calculator", "gpa-calculator", "average-grade-calculator"],
  },
  "sat-score-calculator": {
    intro: "Estimate your digital SAT score from the number of questions you got right in each section. Because the test is adaptive, tell the calculator whether your second module was the harder or easier one.",
    steps: [
      "Count right answers in Reading and Writing (out of 54) and in Math (out of 44).",
      "Choose which second module you got in each section — your Bluebook practice score report shows it.",
      "Read your estimated total (400–1600) and section scores (200–800).",
    ],
    formula: ["Total = Reading and Writing (200–800) + Math (200–800)", "Each section's score depends on right answers, which questions they were, and the module 2 route."],
    tips: ["There's no penalty for guessing, so never leave a question blank.", "Some questions in each module are unscored pretest items, so the same raw score can convert differently.", "For the most accurate number, take a full Bluebook practice test — it uses the real scoring."],
    faq: [
      { q: "How many questions can I miss for a 1400?", a: "Roughly 6–8 per section on the harder module 2 route, but it varies by test form and by which questions you miss." },
      { q: "Why can't I get above about 600 in a section?", a: "If module 1 goes poorly, you get the easier module 2, and the section score is capped well below 800. Getting most of module 1 right is the key to a high score." },
      { q: "What is a good SAT score?", a: "About 1030 is close to the national average. 1200 puts you above roughly three quarters of test takers, and 1400+ is competitive for selective colleges." },
    ],
    related: ["psat-score-calculator", "act-score-calculator", "ap-score-calculator", "high-school-gpa-calculator"],
  },
  "act-score-calculator": {
    intro: "Estimate your ACT section scores and composite from the number of questions you got right. Updated for the enhanced ACT: shorter sections and Science now optional.",
    steps: [
      "Enter right answers for English (out of 50), Math (45) and Reading (36).",
      "If you're taking Science, enter it too (out of 40) to see your STEM score.",
      "Your composite is the average of English, Math and Reading.",
    ],
    formula: ["Composite = (English + Math + Reading) ÷ 3, rounded to the nearest whole number", "STEM score = (Math + Science) ÷ 2"],
    tips: ["There's no penalty for wrong answers — fill in every bubble.", "Some questions in each section are unscored field-test items, so your raw score is slightly smaller than the number of questions.", "Many colleges superscore the ACT, combining your best section scores across test dates."],
    faq: [
      { q: "Is Science still part of the ACT?", a: "Since the 2025 changes Science is optional and no longer counts toward the composite. It still produces a Science score and a STEM score if you take it." },
      { q: "What is a good ACT score?", a: "The national average composite is about 19–20. A 24 is around the top quarter, and 30+ is competitive for selective colleges." },
      { q: "How is the ACT composite rounded?", a: "The average of the section scores is rounded to the nearest whole number, with .5 rounding up." },
    ],
    related: ["sat-score-calculator", "psat-score-calculator", "gpa-calculator", "ap-score-calculator"],
  },
  "psat-score-calculator": {
    intro: "Estimate your PSAT/NMSQT score and National Merit Selection Index from the number of questions you got right. The digital PSAT has the same structure as the SAT, scored from 320 to 1520.",
    steps: [
      "Enter right answers in Reading and Writing (out of 54) and Math (out of 44).",
      "Choose whether each second module was the harder or easier one.",
      "Read your total, section scores and Selection Index.",
    ],
    formula: ["Total = Reading and Writing (160–760) + Math (160–760)", "Selection Index = 2 × (RW ÷ 10) + (Math ÷ 10), from 48 to 228"],
    tips: ["Only the PSAT/NMSQT taken in 11th grade counts for National Merit.", "Commended and Semifinalist cutoffs change every year and differ by state."],
    faq: [
      { q: "What Selection Index do I need for National Merit?", a: "Semifinalist cutoffs are set by state each year and have ranged from about 207 to 223. Commended Student recognition has needed roughly 207–210 nationally." },
      { q: "Why does Reading and Writing count double?", a: "The Selection Index was designed when the PSAT had separate reading and writing scores. Doubling the combined section keeps the old balance." },
    ],
    related: ["sat-score-calculator", "act-score-calculator", "ap-score-calculator", "high-school-gpa-calculator"],
  },
  "uc-gpa-calculator": {
    intro: "Calculate your GPA the way the University of California does. UC uses only A–G courses from 10th and 11th grade, ignores plus and minus, and adds honors points for UC-approved honors, AP and IB courses — capped at eight semesters.",
    steps: [
      "Enter one row per semester grade in an A–G course taken from the summer after 9th grade through the summer after 11th grade. A year-long class is two rows.",
      "Drop the plus or minus: an A- is an A, a B+ is a B.",
      "Tick UC honors / AP / IB for UC-approved honors-level courses and transferable college courses.",
      "Read the capped weighted GPA (the one UC uses for its 3.0 minimum and most comparisons), plus the unweighted and fully weighted versions.",
    ],
    formula: [
      "Unweighted = (A=4, B=3, C=2, D=1, F=0 summed) ÷ number of semester grades",
      "Capped weighted = (points + honors points, max 8 and no more than 4 from 10th grade) ÷ number of grades",
      "Honors points only count for grades of C or better",
    ],
    example: "12 semester grades, 6 honors semesters (2 in 10th, 4 in 11th) with A's and B's: every honors point fits under the cap, so capped and fully weighted GPA match.",
    tips: [
      "9th and 12th grade don't count toward the UC GPA, though UC still sees them on your application.",
      "A D or F in an A–G course can be replaced by repeating it with a better grade by the summer after 11th grade.",
      "For non-residents, only AP and IB courses earn honors points — school-designated honors classes don't.",
      "Each UC campus also reports a fully weighted GPA in its admitted-student profiles, so it's worth knowing both numbers.",
    ],
    faq: [
      { q: "What GPA do you need for UC?", a: "The minimum is a 3.0 UC GPA for California residents and 3.4 for non-residents. Admitted students at the most selective campuses (UCLA, Berkeley) usually have capped GPAs near 4.0 and fully weighted GPAs above 4.2." },
      { q: "What's the difference between capped and fully weighted UC GPA?", a: "Capped GPA counts at most 8 semesters of honors points, with no more than 4 from 10th grade. Fully weighted GPA counts every UC-approved honors, AP, IB or college semester with a C or better." },
      { q: "Does UC count plus and minus grades?", a: "No. An A- counts as an A (4 points) and a B+ as a B (3 points) for high school courses." },
      { q: "Do 9th grade grades count for UC?", a: "Not in the UC GPA. Only A–G courses from the summer after 9th grade through the summer after 11th grade count, but you still need to complete the A–G requirements across all four years." },
    ],
    related: ["weighted-gpa-calculator", "high-school-gpa-calculator", "ap-score-calculator", "unweighted-gpa-calculator"],
  },
  "uf-gpa-calculator": {
    intro: "Estimate the GPA the University of Florida recalculates for freshman admission. UF counts core academic courses only, gives +1.0 for AP, IB, AICE and dual enrollment and +0.5 for honors, on a 4.0 base scale.",
    steps: [
      "Enter your core courses: English, math, science, history (social science) and foreign language.",
      "Add electives only if they're AP, IB or AICE — UF leaves other electives out.",
      "Choose each course's level so the right bonus is added.",
      "Use whole letter grades. UF doesn't publish how it treats plus and minus, so this follows its stated 4.0 scale.",
    ],
    formula: ["Recalculated GPA = Σ ((grade points + bonus) × credits) ÷ Σ credits", "A = 4, B = 3, C = 2, D = 1, F = 0; +1.0 AP/IB/AICE/dual enrollment, +0.5 honors/pre-AP/pre-IB/pre-AICE"],
    tips: [
      "UF reports a middle 50% weighted GPA of about 4.5–4.7 for admitted freshmen — that's this recalculated number, not your school's GPA.",
      "Dual-enrollment courses get the same +1.0 as AP under Florida Board of Governors rules.",
      "Course rigor matters: the recalculation rewards AP, IB, AICE and dual enrollment more than any other choice you control.",
    ],
    faq: [
      { q: "What GPA do you need to get into UF?", a: "UF's admitted freshmen typically have a recalculated weighted core GPA between about 4.5 and 4.7. Admission is holistic, so GPA, rigor, essays and activities all count." },
      { q: "Does UF recalculate GPA?", a: "Yes. UF recalculates a core weighted GPA from English, math, science, history and foreign language courses, plus AP, IB and AICE electives." },
      { q: "Does UF count plus and minus grades?", a: "UF's published rules don't say. This calculator uses whole letter grades on UF's stated 4.0 base scale." },
    ],
    related: ["weighted-gpa-calculator", "high-school-gpa-calculator", "uc-gpa-calculator", "ap-score-calculator"],
  },
  "ut-gpa-calculator": {
    intro: "Two UT calculators in one. Switch to UT Austin to calculate a college GPA on Austin's plus/minus scale (no A+), or to UT Knoxville to estimate the weighted core GPA the University of Tennessee uses for freshman admission.",
    steps: [
      "Pick UT Austin or UT Knoxville at the top of the course list.",
      "UT Austin: enter each course with its letter grade and credit hours. Leave out courses graded W, Q, I, X, S, U or CR.",
      "UT Knoxville: enter your core high school courses and mark honors, AP, IB, Cambridge and dual-enrollment classes.",
    ],
    formula: [
      "UT Austin: A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00 … D- = 0.67, F = 0; GPA = Σ (points × hours) ÷ Σ hours",
      "UT Knoxville core GPA: +0.5 honors, +1.0 AP/IB/Cambridge/dual enrollment, added to unweighted grades",
    ],
    tips: [
      "UT Austin freshman admission doesn't use a recalculated GPA: Texas students in the top 5% of their class are admitted automatically (for 2026–28), and others are reviewed holistically starting with class rank.",
      "UT Knoxville's core GPA uses 16 courses: 4 English, 4 math, 3 science, 1 U.S. history, 1 world or European history, 2 of one foreign language and 1 arts course.",
      "A 4.0+ UT core GPA is one of the routes to guaranteed admission for Tennessee residents.",
    ],
    faq: [
      { q: "Does UT Austin have an A+?", a: "No. UT Austin's highest grade is an A, worth 4.00. An A- is 3.67 and a B+ is 3.33." },
      { q: "What GPA do you need for UT Austin?", a: "For Texas residents, UT Austin admits most students by class rank: the top 5% of a Texas high school class is admitted automatically. There's no published GPA cutoff for holistic review." },
      { q: "How does UT Knoxville calculate GPA?", a: "It takes your unweighted grades in 16 core courses and adds 0.5 for honors and 1.0 for AP, IB, Cambridge and dual-enrollment courses, on a 4-point base scale." },
    ],
    related: ["college-gpa-calculator", "cumulative-gpa-calculator", "weighted-gpa-calculator", "asu-gpa-calculator"],
  },
  "asu-gpa-calculator": {
    intro: "Calculate your Arizona State University GPA on ASU's plus/minus scale. An A+ is worth 4.33 for a course, but ASU caps the cumulative GPA at 4.00, and there are no C-, D+ or D- grades.",
    steps: [
      "Enter each ASU course with its letter grade and credit hours.",
      "Leave out W, X, Y and other non-graded marks — they don't count in the GPA.",
      "If your average goes above 4.00 because of A+ grades, the result shows the capped GPA and the uncapped number.",
    ],
    formula: ["A+ = 4.33, A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00, B- = 2.67, C+ = 2.33, C = 2.00, D = 1.00, E = 0", "GPA = Σ (points × hours) ÷ Σ hours, capped at 4.00"],
    tips: [
      "Freshman admission uses a different number: an unweighted GPA in ASU's competency courses, where 3.00 is one of the admission routes and each subject area needs at least 2.00.",
      "Transfer and graduate programs often recalculate GPA with their own scale, so keep the uncapped number handy.",
    ],
    faq: [
      { q: "Does ASU give an A+?", a: "Yes. An A+ is worth 4.33 grade points for the course, but ASU caps the cumulative GPA at 4.00." },
      { q: "What is an E at ASU?", a: "E is ASU's failing grade, worth 0 points. ASU doesn't use F." },
      { q: "What GPA do you need to get into ASU?", a: "One admission route is a 3.00 unweighted GPA in ASU's competency courses (math, English, lab science, social science, second language and fine arts or CTE), with at least 2.00 in each area." },
    ],
    related: ["college-gpa-calculator", "cumulative-gpa-calculator", "ut-gpa-calculator", "raise-gpa-calculator"],
  },
  "lsac-gpa-calculator": {
    intro: "Calculate your law school GPA the way LSAC does. The Credential Assembly Service converts every graded undergraduate course to a 4.33 scale, where an A+ is worth 4.33 — so your LSAC GPA can differ from your transcript GPA.",
    steps: [
      "Enter every graded course taken before your first bachelor's degree, at every college you attended.",
      "Include repeated courses each time they appear on your transcript — LSAC counts both grades.",
      "Leave out pass/fail passes and non-punitive withdrawals.",
      "Mark dual-enrollment courses taken in high school: starting with the 2027–28 cycle they're excluded.",
    ],
    formula: ["A+ = 4.33, A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00, B- = 2.67, C+ = 2.33, C = 2.00, C- = 1.67, D+ = 1.33, D = 1.00, D- = 0.67, F = 0", "LSAC GPA = Σ (points × credit hours) ÷ Σ credit hours"],
    tips: [
      "If your school doesn't give A+ grades, your LSAC GPA can't go above 4.00 — and if it does, A+ grades can lift you above your transcript GPA.",
      "Grades removed under academic forgiveness count unless they no longer appear on the transcript.",
      "Graduate and post-degree coursework never counts toward the LSAC GPA.",
    ],
    faq: [
      { q: "Why is my LSAC GPA different from my college GPA?", a: "LSAC uses its own conversion (A+ = 4.33), counts every repeated attempt and combines grades from every school you attended, including community college and summer courses." },
      { q: "Do dual-enrollment classes count for LSAC GPA?", a: "Through the 2026–27 cycle they count if they're on a college transcript. Starting with the 2027–28 application cycle, college courses taken while in high school are excluded." },
      { q: "Do withdrawals count in LSAC GPA?", a: "A W counts only if your school treats it as punitive. Withdrawals that your school considers failing grades are counted as failures." },
    ],
    related: ["college-gpa-calculator", "cumulative-gpa-calculator", "raise-gpa-calculator", "gpa-to-percentage-calculator"],
  },
  "percentage-to-gpa-calculator": {
    intro: "Convert a percentage grade to a letter grade and grade points on the 4.0 scale, using the College Board's conversion table.",
    steps: ["Enter your percentage.", "See the letter grade and the 4.0-scale value; the table highlights your band."],
    formula: ["93–100 = A (4.0), 90–92 = A- (3.7), 87–89 = B+ (3.3), 83–86 = B (3.0) …", "Below 65 = F (0.0)"],
    tips: ["To convert an average across many classes, convert each class first and then average the grade points — not the percentages.", "Some schools use a 10-point scale (90–100 = A); check your handbook."],
    faq: [
      { q: "What is 85% on a 4.0 scale?", a: "85% is a B, which is 3.0 on the 4.0 scale." },
      { q: "What is 90% as a GPA?", a: "90% is an A-, worth 3.7. On schools with a 10-point scale it's an A (4.0)." },
    ],
    related: ["gpa-to-percentage-calculator", "letter-grade-to-gpa-calculator", "gpa-calculator", "gpa-scale-converter"],
  },
  "gpa-to-percentage-calculator": {
    intro: "Convert a GPA on the 4.0 scale to an approximate percentage grade. Useful for applications abroad and forms that ask for a percentage.",
    steps: ["Enter your GPA on a 4.0 scale.", "Read the approximate percentage and the letter grade it averages to."],
    formula: ["Percentage ≈ interpolated between the College Board's letter-grade bands (3.0 ≈ 84.5%, 3.7 ≈ 91%, 4.0 ≈ 96%)"],
    tips: ["Several universities publish their own conversion; if you're applying somewhere specific, use theirs.", "A weighted GPA should be converted to unweighted first."],
    faq: [
      { q: "What percentage is a 3.5 GPA?", a: "About 89–90%, between a B+ and an A-." },
      { q: "Is there an official GPA to percentage formula?", a: "No. Some schools use (GPA ÷ 4) × 100, which gives 87.5% for a 3.5. That's simple but less accurate than converting through letter-grade bands." },
    ],
    related: ["percentage-to-gpa-calculator", "gpa-scale-converter", "letter-grade-to-gpa-calculator", "gpa-calculator"],
  },
  "letter-grade-to-gpa-calculator": {
    intro: "Turn a list of letter grades into a GPA. Each class counts once, so it's the quickest way to check a report card.",
    steps: ["Pick each letter grade from the list.", "Add rows for every class.", "Read your average on the 4.0 scale."],
    formula: ["A/A+ = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, D- = 0.7, F = 0"],
    tips: ["If classes have different credits or honors weighting, use the full GPA calculator."],
    faq: [
      { q: "What GPA is all B's?", a: "Straight B's is a 3.0 GPA." },
      { q: "What GPA is half A's and half B's?", a: "About 3.5." },
      LETTER_FAQ,
    ],
    related: ["gpa-calculator", "percentage-to-gpa-calculator", "gpa-to-percentage-calculator", "middle-school-gpa-calculator"],
  },
  "gpa-scale-converter": {
    intro: "Convert a GPA between scales: 4.0, 5.0, 10-point and 100-point. Handy for comparing a weighted 5.0-scale GPA with a 4.0 requirement, or a GPA from another country.",
    steps: ["Enter your GPA and the scale it's on.", "Read the equivalent on the other scales."],
    formula: ["GPA on new scale = GPA ÷ old maximum × new maximum"],
    example: "4.2 on a 5.0 scale ÷ 5 × 4 = 3.36 on a 4.0 scale.",
    tips: ["Proportional conversion isn't the same as removing weighting. To get a true unweighted GPA, recalculate from letter grades.", "Credential-evaluation services (WES, ECE) use their own country-specific tables for international transcripts."],
    faq: [
      { q: "What is a 4.5 GPA on a 4.0 scale?", a: "Proportionally, 4.5 out of 5.0 is 3.6 out of 4.0. If it's a weighted GPA, your actual unweighted GPA could be higher or lower depending on which classes were weighted." },
      { q: "How do I convert a 10-point GPA to 4.0?", a: "Proportionally, divide by 10 and multiply by 4: an 8.5 becomes 3.4." },
    ],
    related: ["weighted-gpa-calculator", "gpa-to-percentage-calculator", "percentage-to-gpa-calculator", "unweighted-gpa-calculator"],
  },
};
