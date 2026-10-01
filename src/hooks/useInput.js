import { useState } from "react";

export default function useInput(initial = "") {
  const [value, setValue] = useState(initial);
  const onChange = (e) => setValue(e?.target ? e.target.value : e);
  return [value, onChange, setValue];
}
