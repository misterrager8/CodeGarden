import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Button from "../atoms/Button";
import { TagContext } from "./forms/NewTodo";
import ButtonGroup from "../molecules/ButtonGroup";
import Icon from "../atoms/Icon";
import Input from "../atoms/Input";

export default function TagItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const tagCtx = useContext(TagContext);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(item.label);
  const onChangeName = (e) => setName(e.target.value);

  const deleteTag = () => {
    let tags_ = [...multiCtx.tags].filter((x) => x.id !== item.id);
    multiCtx.setTags(tags_);
  };

  const editTag = (e) => {
    e.preventDefault();
    let tags_ = [...multiCtx.tags];
    tags_.find((x) => x.id === item.id).label = name;
    multiCtx.setTags(tags_);

    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  const filteredTodos = () =>
    multiCtx.currentRepo.todos.filter(
      (x) => x.tag === item.label && x.status !== "completed"
    ).length;

  return (
    <form className={className + " input-group"} onSubmit={(e) => editTag(e)}>
      {saved && (
        <Button className="non-btn green" icon="floppy2" border={false} />
      )}
      <Input className="border-0" onChange={onChangeName} value={name} />
      {filteredTodos() > 0 && (
        <Button
          icon="tags-fill"
          border={false}
          text={filteredTodos().toString()}
        />
      )}
      {deleting && (
        <Button
          onClick={() => deleteTag()}
          className="red"
          icon="question-lg"
          border={false}
        />
      )}
      <Button
        onClick={() => setDeleting(!deleting)}
        className="red"
        icon="x-lg"
        border={false}
      />
    </form>
  );
}
