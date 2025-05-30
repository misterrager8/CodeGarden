import { useContext, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import ButtonGroup from "../../molecules/ButtonGroup";
import Button from "../../atoms/Button";

export default function IgnoreItem({ id, item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " between ignore-item"}>
      <div className="small py-1">{item.name}</div>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            icon="question-lg"
            onClick={() => multiCtx.deleteIgnore(id)}
            className="border-0 red"
          />
        )}
        <Button
          icon="x-lg"
          className="border-0 red"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}
