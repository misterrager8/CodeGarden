import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import { checkout, deleteBranch } from "../../hooks";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";

export default function BranchItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " dropdown-item between"}>
      <a
        className="my-1"
        onClick={() =>
          checkout(item.name, multiCtx.currentRepo.name, (data) => {
            multiCtx.setCurrentRepo(data.repo);
            multiCtx.setRepos(data.repos);
          })
        }>
        {item.name}
      </a>
      <div>
        {deleting && (
          <Button
            onClick={() =>
              deleteBranch(multiCtx.currentRepo.name, item.name, (data) => {
                multiCtx.setCurrentRepo(data.repo);
                multiCtx.setRepos(data.repos);
              })
            }
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
