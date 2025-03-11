import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";

export default function Commit({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [msg, setMsg] = useState("");

  const onChangeMsg = (e) => setMsg(e.target.value);

  return (
    <form
      className={className + " input-group"}
      onSubmit={(e) => {
        multiCtx.commit(e, msg);
        setMsg("");
      }}>
      <Input onChange={onChangeMsg} value={msg} placeholder="Commit" />
      <Button
        text="Amend"
        icon="eraser-fill"
        // text="Amend Changes To Last Commit"
        onClick={() => multiCtx.amendCommit()}
        className="border-0"
      />
    </form>
  );
}
