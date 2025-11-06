import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";
import { api } from "../../util";

export default function StashItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  const unstash = () => {
    multiCtx.setLoading(true);
    api(
      "unstash",
      {
        repository: multiCtx.currentRepo.name,
        id: id,
      },
      function (data) {
        multiCtx.setCurrentRepo(data.repo);
        multiCtx.setRepos(data.repos);
        multiCtx.setLoading(false);
      }
    );
  };

  const dropStash = () => {
    multiCtx.setLoading(true);
    api(
      "drop_stash",
      {
        repository: multiCtx.currentRepo.name,
        id: id,
      },
      function (data) {
        multiCtx.setCurrentRepo(data.repo);
        multiCtx.setRepos(data.repos);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className={className + " stash-item between"}>
      <div className="d-flex text-truncate ">
        <Button
          border={false}
          icon="chevron-double-up"
          className="purple me-1"
          onClick={() => unstash()}
        />
        <div className="small py-1">{item}</div>
      </div>
      <ButtonGroup>
        {deleting && (
          <Button
            border={false}
            icon="question-lg"
            className="red"
            onClick={() => dropStash()}
          />
        )}
        <Button
          border={false}
          icon="x-lg"
          className="red"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}