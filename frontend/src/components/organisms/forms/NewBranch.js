import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { addBranch } from "../../../hooks";

export default function NewBranch({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) =>
        addBranch(e, name, multiCtx.currentRepo.name, (data) => {
          multiCtx.setCurrentRepo(data.repo);
          multiCtx.setRepo(data.repos);
          setName("");
        })
      }>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}
