import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
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
        " between diff-item text-truncate" +
        (diffCtx.selectedDiff?.path === item.path ? " active" : "")
      }>
      <a
        className="my-auto flex-grow-1 text-truncate"
        onClick={() =>
          diffCtx.setSelectedDiff(
            diffCtx.selectedDiff?.path === item.path ? null : item,
          )
        }>
        <i
          className={"me-2 bi bi-record" + (item.staged ? "-fill" : "")}
          style={{ color: item.color }}></i>
        {item.name}
      </a>

      <div>
        <Button
          icon={
            item.staged
              ? "material-symbols:remove-rounded"
              : "mynaui:plus-solid"
          }
          border={false}
          className={item.staged ? "orange" : "green"}
          onClick={() =>
            multiCtx.toggleStage(item.path, item.type_, item.staged)
          }
        />
        <Button
          icon="bx:hide"
          border={false}
          onClick={() => multiCtx.addIgnore(null, item.name)}
        />
        {deleting && (
          <Button
            icon="fluent:question-32-filled"
            border={false}
            className="red"
            onClick={() => multiCtx.resetFile(item.path)}
          />
        )}
        <Button
          icon="iwwa:delete"
          border={false}
          className="red"
          onClick={() => setDeleting(!deleting)}
        />
      </div>
    </div>
  );
}
