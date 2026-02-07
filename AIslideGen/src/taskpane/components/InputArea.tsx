import * as React from "react";
import { Textarea, makeStyles } from "@fluentui/react-components";
import type { Mode } from "./ModeSelector";

/* global HTMLTextAreaElement */

interface InputAreaProps {
  mode: Mode;
  value: string;
  onChange: (value: string) => void;
}

const placeholders: Record<Mode, string> = {
  generate:
    "Paste your rough notes or ideas here...\n\nExample:\n- Intro to our new product\n- Key features: fast, secure, easy to use\n- Pricing tiers\n- Call to action",
  summarize:
    "Paste a long text, article, or document to condense into key-point slides...",
  compare:
    "Describe the two things to compare...\n\nExample:\nReact vs Vue\n- Performance\n- Learning curve\n- Ecosystem",
  proscons:
    "Describe a topic to analyze pros and cons...\n\nExample:\nRemote work policy\n- Flexibility, productivity, talent pool\n- Communication, culture, oversight",
  research:
    "Enter a topic to research and generate content for...\n\nExample:\nAI in healthcare — recent trends, key players, market size, challenges",
};

const useStyles = makeStyles({
  wrapper: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "12px",
  },
  textarea: {
    width: "100%",
    minHeight: "160px",
  },
});

const InputArea: React.FC<InputAreaProps> = (props: InputAreaProps) => {
  const { mode, value, onChange } = props;
  const styles = useStyles();

  const handleChange = (_ev: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => {
    onChange(data.value);
  };

  return (
    <div className={styles.wrapper}>
      <Textarea
        className={styles.textarea}
        placeholder={placeholders[mode]}
        value={value}
        onChange={handleChange}
        resize="vertical"
        size="large"
      />
    </div>
  );
};

export default InputArea;
