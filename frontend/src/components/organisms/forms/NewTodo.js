import { createContext, useContext, useState } from "react";
import Input from "../../atoms/Input";
import Dropdown from "../../molecules/Dropdown";
import Button from "../../atoms/Button";
import { tags } from "../../../util";
import { MultiContext } from "../../../MultiContext";
import { SectionContext } from "../../templates/Display";
import NewTag from "./NewTag";
import ButtonGroup from "../../molecules/ButtonGroup";
import TagItem from "../TagItem";

export const TagContext = createContext();

export default function NewTodo({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [name, setName] = useState("");
  const [tag, setTag] = useState("misc");
  const [showtags, setShowTags] = useState(false);

  const onChangeName = (e) => setName(e.target.value);

  const contextValue = {
    tag: tag,
    setTag: setTag,
  };

  return (
    <TagContext.Provider value={contextValue}>
      <form
        className={className + " input-group input-group-sm"}
        onSubmit={(e) => {
          multiCtx.addTodo(e, name, tag);
          setName("");
        }}>
        <Button
          icon="tag-fill"
          text={tag}
          className="border-0"
          onClick={() => setShowTags(!showtags)}
        />
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

      {showtags && (
        <div
          className="dropdown-menu show overflow-auto"
          style={{ height: "230px" }}>
          <div className="p-2">
            <NewTag />
          </div>
          {multiCtx.tags.map((x, idx) => (
            <TagItem id={idx} item={x} />
          ))}
        </div>
      )}
    </TagContext.Provider>
  );
}
