import { useContext, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import ButtonGroup from "../../molecules/ButtonGroup";
import Button from "../../atoms/Button";
import { BranchContext } from "../../templates/Branches";
import Icon from "../../atoms/Icon";

export default function BranchItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const branchCtx = useContext(BranchContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={
        className +
        " between branch-item" +
        (item.name === branchCtx.selectedBranch?.name ? " active" : "")
      }>
      <div
        className="small my-1"
        onClick={() =>
          branchCtx.setSelectedBranch(
            branchCtx.selectedBranch === item ? null : item
          )
        }>
        <Icon className="me-2" name="bezier" />
        {item.name}
      </div>
      <div>
        <Button
          icon="basket2-fill"
          border={false}
          onClick={() => multiCtx.checkout(item.name)}
        />
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteBranch(item.name)}
            className="red"
            size="sm"
            border={false}
            icon="question-lg"
          />
        )}
        <Button
          className="red"
          size="sm"
          border={false}
          onClick={() => setDeleting(!deleting)}
          icon="x-lg"
        />
      </div>
    </div>
  );
}
