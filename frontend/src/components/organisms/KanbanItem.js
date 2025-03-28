import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import InputGroup from "../molecules/InputGroup";
import ButtonGroup from "../molecules/ButtonGroup";
import Dropdown from "../molecules/Dropdown";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { api, tags } from "../../util";
import Icon from "../atoms/Icon";

export default function KanbanItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [committing, setCommitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeDescription = (e) => setDescription(e.target.value);

  useEffect(() => {
    setName(item.name);
    setDescription(item.description || "");
  }, []);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.editTodo(e, item.id, name, item.tag, item.status, description);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }}
      className={
        className + " kanban mb-2 p-2" + (item.done ? " opacity-25" : "")
      }>
      <InputGroup size="sm" className="mb-1">
        <ButtonGroup size="sm">
          {saved && (
            <span className="btn border-0">
              <i className="bi bi-floppy2"></i>
            </span>
          )}
          <div className="me-1">
            <span className="badge">#{item.id}</span>
          </div>
        </ButtonGroup>
        <Input
          required={true}
          className="border-0 fst-italic"
          value={name}
          onChange={onChangeName}
        />
        <Button
          // title="See detailed description of this TODO."
          className={showDescription ? "" : " border-0"}
          onClick={() => setShowDescription(!showDescription)}
          icon={
            "file-earmark" + (description?.length > 0 ? "-fill" : "")
          }></Button>
        <Dropdown
          // className="btn-group btn-group-sm"
          target="edit-tags"
          classNameBtn="btn border-0"
          icon="tag-fill"
          text={item.tag}>
          {multiCtx.tags.map((x) => (
            <a
              key={x.id}
              onClick={() =>
                multiCtx.editTodo(
                  null,
                  item.id,
                  name,
                  x.label,
                  item.status,
                  description
                )
              }
              className="dropdown-item">
              <Icon name="tags-fill" className="me-2" />
              {x.label}
            </a>
          ))}
        </Dropdown>
      </InputGroup>
      <InputGroup size="sm">
        {multiCtx.currentRepo.diffs.length > 0 && (
          <>
            <Button
              icon="file-earmark-diff"
              // title="Commit changes using this TODO as commit message."
              onClick={() => setCommitting(!committing)}
              className="border-0"
            />
            {committing && (
              <Button
                icon="question-lg"
                // title="Commit changes using this TODO as commit message."
                onClick={() => multiCtx.commitTodo(item.id)}
                className="border-0"
              />
            )}
          </>
        )}
        <Button
          icon="check-lg"
          onClick={() => multiCtx.toggleTodo(item.id)}
          className="border-0"
        />
        <Button
          className={item.status === "active" ? "red" : ""}
          title="Toggle whether this TODO is actively being worked on."
          onClick={() =>
            multiCtx.editTodo(
              null,
              item.id,
              name,
              item.tag,
              item.status === "open"
                ? "active"
                : item.status === "completed"
                ? "active"
                : "open",
              description
            )
          }
          border={false}
          icon={
            "bi bi-pin-angle" + (item.status === "active" ? "-fill" : "")
          }></Button>
        <Button
          icon="copy"
          border={false}
          onClick={() => multiCtx.duplicateTodo(item.id)}
        />
        <Button
          className="red"
          icon="x-lg"
          border={false}
          onClick={() => setDeleting(!deleting)}
        />
        {deleting && (
          <Button
            className="red"
            icon="question-lg"
            border={false}
            onClick={() => multiCtx.deleteTodo(item.id)}
          />
        )}
      </InputGroup>
      {showDescription && (
        <textarea
          rows={description.split("\n")?.length + 1}
          value={description}
          onChange={onChangeDescription}
          placeholder="Description"
          className="form-control form-control-sm my-3 desc"></textarea>
      )}
      <button className="d-none" type="submit"></button>
    </form>
  );
}
