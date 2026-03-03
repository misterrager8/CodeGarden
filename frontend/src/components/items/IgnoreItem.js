import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";

export default function IgnoreItem({ id, item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " between"}>
      <div className="small my-auto">{item.name}</div>
      <div>
        <ButtonGroup size="sm">
          {deleting && (
            <Button
              icon="fluent:question-32-filled"
              onClick={() => multiCtx.deleteIgnore(id)}
              className="border-0 red"
            />
          )}
          <Button
            icon="iwwa:delete"
            className="border-0 red"
            onClick={() => setDeleting(!deleting)}
          />
        </ButtonGroup>
      </div>
    </div>
  );
}
