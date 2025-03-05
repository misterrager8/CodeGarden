import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { addBranch, addRepo } from "../../../hooks";

export default function NewRepo({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) =>
        addRepo(e, name, (data) => {
          multiCtx.setCurrentRepo(data);
          setName("");
        })
      }>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Repo"
      />
    </form>
  );
}
