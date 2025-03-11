import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";

export default function NewTag({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  const addTag = (e) => {
    e.preventDefault();
    let tags_ = [...multiCtx.tags];
    tags_.push(name);
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
