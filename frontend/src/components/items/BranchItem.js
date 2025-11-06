import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import { BranchContext } from "../pages/Branches";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";

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
      <a
        className="small my-auto"
        onClick={() =>
          branchCtx.setSelectedBranch(
            branchCtx.selectedBranch === item ? null : item
          )
        }>
        <Icon className="me-2" name="bezier" />
        {item.name}
      </a>
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
