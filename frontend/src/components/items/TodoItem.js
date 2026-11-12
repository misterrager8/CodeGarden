import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import Input from "../atoms/Input";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

export default function TodoItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const [name, setName] = useState("");
  const [branchName, setBranchName] = useState(
    `develop/${item.tag}/${item.id}`,
  );
  const [description, setDescription] = useState("");

  const [branching, setBranching] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBranchName = (e) => setBranchName(e.target.value);

  useEffect(() => {
    setName(item.name);
    setDescription(item.description || "");
  }, []);

  return (
    <div
      className={
        "todo-item2" + (item.status === "completed" ? " opacity-25" : "")
      }>
      <div className="d-flex gap-1">
        <div className="px-1">
          <Button
            icon="mdi:check-bold"
            onClick={() => multiCtx.toggleTodo(item.id)}
            className={
              "border-0" + (item.status === "completed" ? " green" : "")
            }
          />
        </div>
        <textarea onChange={onChangeName} value={name}></textarea>
        <div className="px-1">
          <Button
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
                description,
              )
            }
            className={
              "border-0" + (item.status === "active" ? " orange" : " ")
            }
            icon={
              "bi:chevron-double-" +
              (item.status === "active" ? "left" : "right")
            }></Button>
        </div>
      </div>
      <div className="d-flex flex-row-reverse justify-content-between mt-2 align-items-center">
        <a
          className={" badge"}
          data-bs-target={`${item.id}-tags`}
          data-bs-toggle="dropdown">
          <Icon name="bi:tag" />
          <span className={"ms-2"}>{item.tag}</span>
        </a>
        <div id={`${item.id}-tags`} className={"dropdown-menu "}>
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
                  description,
                )
              }
              className="dropdown-item">
              <Icon name="tabler:tag-filled" className="me-2" />
              {x.label}
            </a>
          ))}
        </div>
        <div className="d-flex gap-1">
          {item.name !== name && (
            <Button
              onClick={(e) =>
                multiCtx.editTodo(
                  e,
                  item.id,
                  name,
                  item.tag,
                  item.status,
                  description,
                )
              }
              className="orange"
              icon="bi:floppy"
            />
          )}

          {multiCtx.currentRepo?.diffs.length > 0 &&
            item.status !== "completed" && (
              <>
                <Button
                  active={committing}
                  icon="at-icons:git-commit"
                  onClick={() => setCommitting(!committing)}
                  className="border-0 orange"
                />
                {committing && (
                  <>
                    <Button
                      icon="streamline-plump:business-progress-bar-2-solid"
                      active={inProgress}
                      onClick={() => setInProgress(!inProgress)}
                    />
                    <Button
                      icon="fluent:question-32-filled"
                      onClick={() => multiCtx.commitTodo(item.id, inProgress)}
                    />
                  </>
                )}
              </>
            )}
          <div className="d-flex gap-1">
            <Button
              active={branching}
              onClick={() => setBranching(!branching)}
              icon="iconmind:branch-flow-outline-bold"></Button>
            <Button
              className="red"
              icon="iwwa:delete"
              border={false}
              onClick={() => setDeleting(!deleting)}
            />
            {deleting && (
              <Button
                className="red"
                icon="fluent:question-32-filled"
                border={false}
                onClick={() => multiCtx.deleteTodo(item.id)}
              />
            )}

            <button className="d-none" type="submit"></button>
          </div>
        </div>
      </div>
      {branching && (
        <form
          onSubmit={(e) => {
            multiCtx.addBranch(e, branchName);
            setBranching(false);
          }}
          className="mt-3 d-flex flex-column gap-2">
          <Input value={branchName} onChange={onChangeBranchName} />
          <Button
            type_="submit"
            text="Create Branch"
            icon="iconmind:branch-flow-outline-bold"
          />
        </form>
      )}
    </div>
  );
}
