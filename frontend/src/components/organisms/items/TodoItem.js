import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import InputGroup from "../../molecules/InputGroup";
import ButtonGroup from "../../molecules/ButtonGroup";
import Dropdown from "../../molecules/Dropdown";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";

export default function TodoItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);
  const [committing, setCommitting] = useState(false);

  const [name, setName] = useState("");
  const [branchName, setBranchName] = useState(
    `develop/${item.tag}/${item.id}`
  );
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [branching, setBranching] = useState(false);

  const [showDescription, setShowDescription] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBranchName = (e) => setBranchName(e.target.value);
  const onChangeDescription = (e) => setDescription(e.target.value);

  useEffect(() => {
    setName(item.name);
    setDescription(item.description || "");
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`(${item.tag}) ${item.name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className={
        className +
        " border-bottom mb-2 py-1" +
        (item.done ? " opacity-25" : "")
      }>
      <form
        onSubmit={(e) => {
          multiCtx.editTodo(
            e,
            item.id,
            name,
            item.tag,
            item.status,
            description
          );
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}>
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
          <Dropdown
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
                onClick={() => setCommitting(!committing)}
                className="border-0"
              />
              {committing && (
                <Button
                  icon="question-lg"
                  onClick={() => multiCtx.commitTodo(item.id)}
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
            className={"border-0" + (item.status === "active" ? " red" : " ")}
            icon={
              "bi bi-pin-angle" + (item.status === "active" ? "-fill" : "")
            }></Button>
          <Button
            border={branching}
            onClick={() => setBranching(!branching)}
            icon="bezier2"></Button>
          <Button
            className={
              (showDescription ? "" : " border-0") +
              (description?.length > 0 ? " purple" : "")
            }
            onClick={() => setShowDescription(!showDescription)}
            icon={
              "chat-left-text" + (description?.length > 0 ? "-fill" : "")
            }></Button>
          <Button
            icon={copied ? "hand-thumbs-up-fill" : "copy"}
            border={false}
            onClick={() => copyToClipboard()}
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
      {branching && (
        <form
          onSubmit={(e) => {
            multiCtx.addBranch(e, branchName);
            setBranching(false);
          }}
          className="input-group p-3">
          <Input value={branchName} onChange={onChangeBranchName} />
          <Button type_="submit" text="Create Branch" icon="bezier2" />
        </form>
      )}
    </div>
  );
}
