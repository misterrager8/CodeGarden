import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import { v4 as uuidv4 } from "uuid";

export default function NewTag({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  const addTag = (e) => {
    e.preventDefault();
    let tags_ = [...multiCtx.tags];
    tags_.push({ label: name, id: uuidv4() });
    multiCtx.setTags(tags_);
    setName("");
  };

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) => addTag(e)}>
      <Input
        value={name}
        onChange={onChangeName}
        required={true}
        placeholder="New Tag"
      />
    </form>
  );
}
