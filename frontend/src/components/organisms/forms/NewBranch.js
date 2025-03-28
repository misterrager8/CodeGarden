import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import { SectionContext } from "../../templates/Display";
import Button from "../../atoms/Button";

export default function NewBranch({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [name, setName] = useState("");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={
        className +
        " input-group input-group-sm" +
        (sxnCtx.isCurrentSection("branches") ? " mt-3" : "")
      }
      onSubmit={(e) => {
        multiCtx.addBranch(e, name);
        setName("");
      }}>
      <Button
        border={false}
        className="flex-grow-0"
        icon={
          sxnCtx.isCurrentSection("branches") ? "fullscreen-exit" : "fullscreen"
        }
        onClick={() =>
          sxnCtx.setCurrentSection(
            sxnCtx.isCurrentSection("branches") ? null : "branches"
          )
        }
      />
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}
