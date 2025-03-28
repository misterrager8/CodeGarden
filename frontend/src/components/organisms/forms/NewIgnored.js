import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";
import { SectionContext } from "../../templates/Display";

export default function NewIgnored({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const label = "ignored";

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm my-3"}
      onSubmit={(e) => {
        multiCtx.addIgnore(e, name);
        setName("");
      }}>
      <Button
        border={false}
        className="flex-grow-0"
        icon={
          sxnCtx.isCurrentSection(label)
            ? "fullscreen-exit"
            : "arrows-fullscreen"
        }
        onClick={() =>
          sxnCtx.setCurrentSection(
            sxnCtx.isCurrentSection(label) ? null : label
          )
        }
      />
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Ignore Item"
      />
    </form>
  );
}
