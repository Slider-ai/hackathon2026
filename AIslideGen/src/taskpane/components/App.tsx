import * as React from "react";
import { useState } from "react";
import Header from "./Header";
import ModeSelector from "./ModeSelector";
import InputArea from "./InputArea";
import OptionsRow from "./OptionsRow";
import OutputPreview from "./OutputPreview";
import { Button, Spinner, makeStyles, tokens } from "@fluentui/react-components";
import { Sparkle24Filled } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import type { Mode } from "./ModeSelector";
import type { Tone } from "./OptionsRow";
import type { GeneratedSlide } from "./OutputPreview";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground2,
  },
  generateRow: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "16px",
    paddingBottom: "4px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  generateButton: {
    width: "100%",
  },
});

function generateMockSlides(input: string, mode: Mode, slideCount: number, _tone: Tone): GeneratedSlide[] {
  const topic = input.trim().split("\n")[0] || "Untitled";

  const generators: Record<Mode, () => GeneratedSlide[]> = {
    generate: () =>
      Array.from({ length: slideCount }, (_, i) => ({
        title: i === 0 ? topic : `Section ${i}`,
        bullets:
          i === 0
            ? ["Overview of key points", "Agenda for the presentation", `${slideCount} slides total`]
            : [`Key point ${i}.1 based on your notes`, `Key point ${i}.2 with supporting detail`, `Key point ${i}.3 — actionable takeaway`],
      })),
    summarize: () => [
      { title: "Executive Summary", bullets: ["Core thesis distilled from your text", "3 key findings highlighted", "Recommended next steps"] },
      { title: "Key Takeaways", bullets: ["Takeaway 1 — most impactful insight", "Takeaway 2 — supporting evidence", "Takeaway 3 — call to action"] },
    ],
    compare: () => [
      { title: `Comparison: ${topic}`, bullets: ["Side-by-side overview", "Criteria for evaluation", "At-a-glance verdict"] },
      { title: "Detailed Breakdown", bullets: ["Performance & speed", "Ease of use & learning curve", "Ecosystem & community support"] },
      { title: "Recommendation", bullets: ["Best for teams: Option A", "Best for solo devs: Option B", "Overall winner based on criteria"] },
    ],
    proscons: () => [
      { title: `Pros: ${topic}`, bullets: ["Advantage 1 — high impact", "Advantage 2 — cost effective", "Advantage 3 — scalable"] },
      { title: `Cons: ${topic}`, bullets: ["Drawback 1 — implementation cost", "Drawback 2 — learning curve", "Drawback 3 — limited flexibility"] },
      { title: "Verdict", bullets: ["Net positive for most use cases", "Mitigations for top risks", "Recommended with conditions"] },
    ],
    research: () => [
      { title: `Research: ${topic}`, bullets: ["Market size & growth trajectory", "Key players & competitive landscape", "Recent trends (2024-2025)"] },
      { title: "Key Findings", bullets: ["Finding 1 with data point", "Finding 2 with source reference", "Finding 3 with industry impact"] },
      { title: "Implications & Next Steps", bullets: ["Strategic opportunity identified", "Risk factors to monitor", "Recommended actions"] },
    ],
  };

  return generators[mode]();
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();

  const [mode, setMode] = useState<Mode>("generate");
  const [inputText, setInputText] = useState<string>("");
  const [slideCount, setSlideCount] = useState<number>(3);
  const [tone, setTone] = useState<Tone>("professional");
  const [generatedSlides, setGeneratedSlides] = useState<GeneratedSlide[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const slides = generateMockSlides(inputText, mode, slideCount, tone);
    setGeneratedSlides(slides);
    setIsGenerating(false);
  };

  const formatSlideText = (slide: GeneratedSlide): string => {
    const bullets = slide.bullets.map((b) => `\u2022 ${b}`).join("\n");
    return `${slide.title}\n\n${bullets}`;
  };

  const handleInsertSlide = async (slide: GeneratedSlide) => {
    await insertText(formatSlideText(slide));
  };

  const handleInsertAll = async () => {
    for (const slide of generatedSlides) {
      await insertText(formatSlideText(slide));
    }
  };

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} />
      <ModeSelector selectedMode={mode} onModeChange={setMode} />
      <InputArea mode={mode} value={inputText} onChange={setInputText} />
      <OptionsRow
        slideCount={slideCount}
        onSlideCountChange={setSlideCount}
        tone={tone}
        onToneChange={setTone}
      />
      <div className={styles.generateRow}>
        <Button
          className={styles.generateButton}
          appearance="primary"
          icon={isGenerating ? <Spinner size="tiny" /> : <Sparkle24Filled />}
          disabled={isGenerating || !inputText.trim()}
          onClick={handleGenerate}
          size="large"
        >
          {isGenerating ? "Generating..." : "Generate Slides"}
        </Button>
      </div>
      <OutputPreview
        slides={generatedSlides}
        onInsertSlide={handleInsertSlide}
        onInsertAll={handleInsertAll}
      />
    </div>
  );
};

export default App;
