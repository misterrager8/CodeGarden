import { useContext, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import ButtonGroup from "../../molecules/ButtonGroup";
import Button from "../../atoms/Button";
import { SectionContext } from "../../templates/Display";
import { DiffContext } from "../../templates/ChangesAndHistory/Changes";

export default function DiffItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const sxnCtx = useContext(SectionContext);
  const diffCtx = useContext(DiffContext);

  return (
    <div
      className={
        className +
        " between diff-item" +
        (diffCtx.selectedDiff === item ? " active" : "")
      }>
      <span
        className="small py-1 flex-grow-1"
        onClick={() => {
          sxnCtx.isCurrentSection("changes-history") &&
            diffCtx.setSelectedDiff(
              diffCtx.selectedDiff === item ? null : item
            );
        }}>
        <i
          className={"me-2 bi bi-record" + (item.staged ? "-fill" : "")}
          style={{ color: item.color }}></i>
        {item.name}
      </span>

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
