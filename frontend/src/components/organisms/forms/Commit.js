import { useContext, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";
import Dropdown from "../../molecules/Dropdown";
import Icon from "../../atoms/Icon";

export default function Commit({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [msg, setMsg] = useState("");
  const [addAll, setAddAll] = useState(false);
  const [tag, setTag] = useState(null);

  const onChangeMsg = (e) => setMsg(e.target.value);

  useEffect(() => {
    setMsg(`${tag ? "(" + tag + ") " : ""}${msg}`);
  }, [tag]);

  return (
    <form
      className={className + " input-group"}
      onSubmit={(e) => {
        multiCtx.commit(e, msg, addAll);
        setMsg("");
      }}>
      <Dropdown showCaret icon="tag-fill" classNameBtn="border-0">
        <a onClick={() => setTag(null)} className="dropdown-item">
          <Icon name="dash-lg" className="me-2" />
          No Tag
        </a>
        {multiCtx.tags.map((x) => (
          <a
            key={x.id}
            onClick={() => setTag(x.label)}
            className="dropdown-item">
            <Icon name="tags-fill" className="me-2" />
            {x.label}
          </a>
        ))}
      </Dropdown>
      <Input onChange={onChangeMsg} value={msg} placeholder="Commit" />
      <Button
        active={addAll}
        onClick={() => setAddAll(!addAll)}
        icon="lightning-charge-fill"
        border={false}></Button>
    </form>
  );
}
