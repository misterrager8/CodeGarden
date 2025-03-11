import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";

export default function NewIgnored({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm mb-3"}
      onSubmit={(e) => {
        multiCtx.addIgnore(e, name);
        setName("");
      }}>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Ignore Item"
      />
    </form>
  );
}
