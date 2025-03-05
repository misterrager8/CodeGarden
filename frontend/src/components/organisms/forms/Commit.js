import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { amendCommit, commit } from "../../../hooks";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";

export default function Commit({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [msg, setMsg] = useState("");

  const onChangeMsg = (e) => setMsg(e.target.value);

  return (
    <form
      className={className + " input-group"}
      onSubmit={(e) =>
        commit(e, multiCtx.currentRepo.name, msg, (data) => {
          multiCtx.setCurrentRepo(data.repo);
          multiCtx.setRepos(data.repos);
        })
      }>
      <Input onChange={onChangeMsg} value={msg} placeholder="Commit" />
      <Button
        text="Amend"
        icon="eraser-fill"
        // text="Amend Changes To Last Commit"
        onClick={() =>
          amendCommit(multiCtx.currentRepo.name, (data) => {
            multiCtx.setCurrentRepo(data.repo);
            multiCtx.setRepos(data.repos);
          })
        }
        className="border-0"
      />
    </form>
  );
}
