import { useContext } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { LogContext } from "../pages/History";

export default function SearchFiles({ className = "" }) {
  const logCtx = useContext(LogContext);

  const onChangeQuery = (e) => logCtx.setQuery(e.target.value);

  return (
    <div className={className + " d-flex"}>
      {logCtx.query !== "" && (
        <Button icon="eraser-fill" onClick={() => logCtx.setQuery("")} />
      )}
      <Input
        value={logCtx.query}
        onChange={onChangeQuery}
        placeholder="Search Files"
      />
    </div>
  );
}
