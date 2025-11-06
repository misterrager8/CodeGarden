import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";
import { DiffContext } from "../pages/Changes";

export default function DiffItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const diffCtx = useContext(DiffContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={
        className +
        " between diff-item" +
        (diffCtx.selectedDiff?.path === item.path ? " active" : "")
      }>
      <a
        className="my-auto flex-grow-1"
        onClick={() =>
          diffCtx.setSelectedDiff(
            diffCtx.selectedDiff?.path === item.path ? null : item
          )
        }>
        <i
          className={"me-2 bi bi-record" + (item.staged ? "-fill" : "")}
          style={{ color: item.color }}></i>
        {item.name}
      </a>

      <ButtonGroup size="sm">
        <Button
          icon={(item.staged ? "dash" : "plus") + "-lg"}
          border={false}
          className={item.staged ? "orange" : "green"}
          onClick={() =>
            multiCtx.toggleStage(item.path, item.type_, item.staged)
          }
        />
        {deleting && (
          <Button
            icon="question-lg"
            border={false}
            className="red"
            onClick={() => multiCtx.resetFile(item.path)}
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
