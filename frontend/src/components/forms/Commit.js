import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import Dropdown from "../atoms/Dropdown";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";

export default function Commit({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [msg, setMsg] = useState("");
  const [msgDetails, setMsgDetails] = useState("");
  const [addAll, setAddAll] = useState(false);
  const [tag, setTag] = useState(null);

  const [showTextarea, setShowTextarea] = useState(false);

  const onChangeMsg = (e) => setMsg(e.target.value);
  const onChangeMsgDetails = (e) => setMsgDetails(e.target.value);

  useEffect(() => {
    setMsg(`${tag ? "(" + tag + ") " : ""}${msg}`);
  }, [tag]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        multiCtx.commit(e, msg, addAll, msgDetails);
        setMsg("");
        setMsgDetails("");
      }}>
      <div className="input-group">
        <Dropdown
          target="pick-tag"
          showCaret
          icon="tag-fill"
          classNameBtn="border-0">
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
        <Dropdown
          target="commit-todo"
          showCaret
          icon="check-all"
          classNameBtn="border-0">
          {multiCtx.currentRepo.todos
            .filter((w) => !w.done)
            .map((x) => (
              <a
                key={x.id}
                onClick={() => multiCtx.commitTodo(x.id)}
                className="dropdown-item">
                <Icon name="check-all" className="me-2" />
                {x.toStr}
              </a>
            ))}
        </Dropdown>
        <Button
          active={showTextarea}
          onClick={() => setShowTextarea(!showTextarea)}
          icon="chat-square-text"
          border={false}></Button>
        <Button
          active={addAll}
          onClick={() => setAddAll(!addAll)}
          icon="lightning-charge-fill"
          border={false}></Button>
      </div>
      {showTextarea && (
        <textarea
          value={msgDetails}
          onChange={onChangeMsgDetails}
          className="form-control form-control-sm mt-2"
          placeholder="Description"
          rows={3}></textarea>
      )}
    </form>
  );
}
