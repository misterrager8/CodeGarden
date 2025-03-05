import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { addIgnore } from "../../../hooks";

export default function NewIgnored({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm mb-3"}
      onSubmit={(e) =>
        addIgnore(e, name, multiCtx.currentRepo.name, (data) => {
          multiCtx.setCurrentRepo(data.repo);
          multiCtx.setRepos(data.repos);
          setName("");
        })
      }>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Ignore Item"
      />
    </form>
  );
}
