import { useContext, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { addTodo, clearCompleted } from "../../../hooks";
import { SectionContext } from "../../templates/Display";

export default function NewTodo({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [name, setName] = useState("");
  const [tag, setTag] = useState("misc");

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) =>
        addTodo(e, name, tag, multiCtx.currentRepo.name, (data) => {
          multiCtx.setCurrentRepo(data.repo);
          multiCtx.setRepos(data.repos);
          setName("");
        })
      }>
      <Input
        value={name}
        onChange={onChangeName}
        required={true}
        placeholder="New TODO"
      />
      <Dropdown
        icon="tag-fill"
        target="tags"
        text={tag}
        className="btn-group btn-group-sm"
        classNameBtn="btn border-0">
        {tags.map((x) => (
          <a
            key={`${x}-alt`}
            onClick={() => setTag(x)}
            className="dropdown-item">
            {x}
          </a>
        ))}
      </Dropdown>
      {multiCtx.currentRepo.todos.filter((x) => x.done).length !== 0 &&
        !sxnCtx.isCurrentSection("todos") && (
          <Button
            border={false}
            size="sm"
            icon="x-lg"
            text={`${
              multiCtx.currentRepo.todos.filter((x) => x.done).length
            } Done`}
            onClick={() =>
              clearCompleted(multiCtx.currentRepo.name, (data) => {
                multiCtx.setCurrentRepo(data.repo);
                multiCtx.setRepos(data.repos);
              })
            }
            className="orange"
          />
        )}
    </form>
  );
}
