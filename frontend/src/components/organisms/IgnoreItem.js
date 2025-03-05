import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import { deleteIgnore } from "../../hooks";

export default function IgnoreItem({ id, item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " between"}>
      <div>{item.name}</div>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            icon="question-lg"
            onClick={() =>
              deleteIgnore(multiCtx.currentRepo.name, id, (data) => {
                multiCtx.setCurrentRepo(data.repo);
                multiCtx.setRepos(data.repos);
              })
            }
            className="border-0 red"
          />
        )}
        <Button
          icon="x-lg"
          className="border-0 red"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}
