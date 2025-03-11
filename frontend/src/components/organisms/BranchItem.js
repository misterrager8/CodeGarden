import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import { BranchContext } from "../templates/Branches";

export default function BranchItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const branchCtx = useContext(BranchContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={
        className +
        " between branch" +
        (item.name === branchCtx.selectedBranch?.name ? " active" : "")
      }>
      <ButtonGroup>
        <Button
          icon="cart-check"
          border={false}
          onClick={() => multiCtx.checkout(item.name)}
        />
        <Button
          className="non-btn"
          text={item.name}
          border={false}
          onClick={() =>
            branchCtx.setSelectedBranch(
              branchCtx.selectedBranch === item ? null : item
            )
          }
        />
      </ButtonGroup>
      <div>
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
