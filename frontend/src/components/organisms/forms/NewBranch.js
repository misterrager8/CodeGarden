import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";

export default function NewBranch({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) => {
        multiCtx.addBranch(e, name);
        setName("");
      }}>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}
