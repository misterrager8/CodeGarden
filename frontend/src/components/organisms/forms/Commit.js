import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";

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
    </form>
  );
}
