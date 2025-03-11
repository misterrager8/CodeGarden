import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import Button from "../atoms/Button";
import { TagContext } from "./forms/NewTodo";
import ButtonGroup from "../molecules/ButtonGroup";

export default function TagItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const tagCtx = useContext(TagContext);
  const [deleting, setDeleting] = useState(false);

  const deleteTag = () => {
    let tags_ = [...multiCtx.tags].filter((x) => x !== item);
    multiCtx.setTags(tags_);
  };

  return (
    <div className={className + " dropdown-item between"}>
      <a
        key={`${item}-alt`}
        onClick={() => tagCtx.setTag(item)}
        className="p-1">
        {item}
      </a>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            border={false}
            onClick={() => deleteTag()}
            icon="question-lg"
          />
        )}
        <Button
          border={false}
          onClick={() => setDeleting(!deleting)}
          icon="x-lg"
        />
      </ButtonGroup>
    </div>
  );
}
