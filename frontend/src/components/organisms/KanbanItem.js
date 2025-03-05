import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import InputGroup from "../molecules/InputGroup";
import ButtonGroup from "../molecules/ButtonGroup";
import Dropdown from "../molecules/Dropdown";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { api, tags } from "../../util";
import { commitTodo, deleteTodo, editTodo, toggleTodo } from "../../hooks";

export default function KanbanItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [committing, setCommitting] = useState(false);

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeDescription = (e) => setDescription(e.target.value);

  useEffect(() => {
    setName(item.name);
    setTag(item.tag);
    setDescription(item.description || "");
  }, []);

  // const commitTodo = () => {};

  return (
    <form
      onSubmit={(e) =>
        editTodo(
          e,
          item.id,
          name,
          tag,
          item.status,
          description,
          multiCtx.currentRepo.name,
          (data) => {
            multiCtx.setCurrentRepo(data.repo);
            multiCtx.setRepos(data.repos);
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }
        )
      }
      className={
        className + " kanban mb-2 p-3" + (item.done ? " opacity-25" : "")
      }>
      <InputGroup size="sm" className="mb-1">
        <ButtonGroup size="sm">
          {saved && (
            <span className="btn border-0">
              <i className="bi bi-floppy2"></i>
            </span>
          )}
          <span className="btn border-0">#{item.id}</span>
        </ButtonGroup>
        <Input
          required={true}
          className="border-0 fw-bold"
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
          text={tag}>
          {tags.map((x) => (
            <a key={x} onClick={() => setTag(x)} className="dropdown-item">
              {x}
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
                onClick={() =>
                  commitTodo(item.id, (data) => {
                    multiCtx.setCurrentRepo(data.repo);
                    multiCtx.setRepos(data.repos);
                  })
                }
                className="border-0"
              />
            )}
          </>
        )}
        <Button
          icon="check-lg"
          onClick={() =>
            toggleTodo(item.id, multiCtx.currentRepo.name, (data) => {
              multiCtx.setCurrentRepo(data.repo);
              multiCtx.setRepos(data.repos);
            })
          }
          className="border-0"
        />
        {item.status !== "completed" && (
          <Button
            title="Toggle whether this TODO is actively being worked on."
            onClick={() =>
              editTodo(
                null,
                item.id,
                name,
                tag,
                item.status === "open" ? "active" : "open",
                description,
                multiCtx.currentRepo.name,
                (data) => {
                  multiCtx.setCurrentRepo(data.repo);
                  multiCtx.setRepos(data.repos);
                }
              )
            }
            border={false}
            icon={
              "bi bi-chevron-double" +
              (item.status === "open" ? "-right" : "-left")
            }></Button>
        )}
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
            onClick={() =>
              deleteTodo(item.id, multiCtx.currentRepo.name, (data) => {
                multiCtx.setCurrentRepo(data.repo);
                multiCtx.setRepos(data.repos);
              })
            }
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
