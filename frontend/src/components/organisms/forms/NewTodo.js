import { createContext, useContext, useEffect, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { SectionContext } from "../../templates/Display";
import NewTag from "./NewTag";
import ButtonGroup from "../../molecules/ButtonGroup";
import TagItem from "../TagItem";
import Icon from "../../atoms/Icon";

export const TagContext = createContext();

export default function NewTodo({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
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
    <TagContext.Provider value={contextValue}>
      <form
        className={className + " input-group input-group-sm mt-3"}
        onSubmit={(e) => {
          multiCtx.addTodo(e, name, tag);
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
        {multiCtx.currentRepo.todos.filter((x) => x.done).length !== 0 &&
          !sxnCtx.isCurrentSection("todos") && (
            <Button
              border={false}
              size="sm"
              icon="x-lg"
              text={`${
                multiCtx.currentRepo.todos.filter((x) => x.done).length
              } Done`}
              onClick={() => multiCtx.clearCompleted()}
              className="orange"
            />
          )}
      </form>
    </TagContext.Provider>
  );
}
