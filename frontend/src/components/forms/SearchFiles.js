import { useContext } from "react";
import Input from "../atoms/Input";
import { FileContext } from "../pages/Files";
import Button from "../atoms/Button";

export default function SearchFiles({ className = "" }) {
  const fileCtx = useContext(FileContext);

  const onChangeQuery = (e) => fileCtx.setQuery(e.target.value);

  return (
    <div className={className + " d-flex"}>
      {fileCtx.query !== "" && (
        <Button icon="eraser-fill" onClick={() => fileCtx.setQuery("")} />
      )}
      <Input
        value={fileCtx.query}
        onChange={onChangeQuery}
        placeholder="Search Files"
      />
    </div>
  );
}
