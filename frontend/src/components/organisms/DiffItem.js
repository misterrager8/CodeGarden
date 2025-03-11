import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";

export default function DiffItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " between p-1 diff-item"}>
      <span>
        <i className="bi bi-record me-2" style={{ color: item.color }}></i>
        {item.name}
      </span>

      <ButtonGroup size="sm">
        {deleting && (
          <Button
            icon="question-lg"
            border={false}
            className="red"
            onClick={() => multiCtx.resetFile(item.name)}
          />
        )}
        <Button
          icon="x-lg"
          border={false}
          className="red"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}
