import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import Dropdown from "../atoms/Dropdown";
import Icon from "../atoms/Icon";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function NewTodo({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const label = "todos";

  const [name, setName] = useState("");
  const [tag, setTag] = useState(multiCtx.tags[0].label);

  const onChangeName = (e) => setName(e.target.value);

  const contextValue = {
    tag: tag,
    setTag: setTag,
  };

  useEffect(() => {
    setTag(multiCtx.tags[0].label);
  }, [multiCtx.tags]);

  return (
    <div>
      <form
        className={className + " input-group input-group-sm mt-3"}
        onSubmit={(e) => {
          multiCtx.addTodo(e, name, tag);
          setName("");
        }}>
        <Dropdown icon="tag-fill" text={tag} classNameBtn="border-0">
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
        <Input
          value={name}
          onChange={onChangeName}
          required={true}
          placeholder="New TODO"
        />
        {multiCtx.currentRepo.todos.filter((x) => x.done).length !== 0 && (
          <Button
            border={false}
            size="sm"
            icon="eraser-fill"
            text={`${
              multiCtx.currentRepo.todos.filter((x) => x.done).length
            } Done`}
            onClick={() => multiCtx.clearCompleted()}
            className="red"
          />
        )}
      </form>
    </div>
  );
}
