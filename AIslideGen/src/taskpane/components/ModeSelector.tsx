import * as React from "react";
import { TabList, Tab, makeStyles, tokens } from "@fluentui/react-components";
import type { SelectionEvents, TabValue } from "@fluentui/react-components";
import {
  SlideText24Regular,
  TextBulletListSquare24Regular,
  ArrowSwap24Regular,
  ScaleFill24Regular,
  Search24Regular,
} from "@fluentui/react-icons";

export type Mode = "generate" | "summarize" | "compare" | "proscons" | "research";

interface ModeSelectorProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const useStyles = makeStyles({
  wrapper: {
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

const ModeSelector: React.FC<ModeSelectorProps> = (props: ModeSelectorProps) => {
  const { selectedMode, onModeChange } = props;
  const styles = useStyles();

  const handleTabSelect = (_event: SelectionEvents, data: { value: TabValue }) => {
    onModeChange(data.value as Mode);
  };

  return (
    <div className={styles.wrapper}>
      <TabList selectedValue={selectedMode} onTabSelect={handleTabSelect} size="small">
        <Tab value="generate" icon={<SlideText24Regular />}>
          Generate
        </Tab>
        <Tab value="summarize" icon={<TextBulletListSquare24Regular />}>
          Summarize
        </Tab>
        <Tab value="compare" icon={<ArrowSwap24Regular />}>
          Compare
        </Tab>
        <Tab value="proscons" icon={<ScaleFill24Regular />}>
          Pros & Cons
        </Tab>
        <Tab value="research" icon={<Search24Regular />}>
          Research
        </Tab>
      </TabList>
    </div>
  );
};

export default ModeSelector;
