import { useContext } from "react";
import { MultiContext } from "../../Context";
import StashItem from "../items/StashItem";
import { v4 as uuidv4 } from "uuid";
import Button from "../atoms/Button";

export default function Stashes({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const label = "stashes";

  return (
    <div className={className + " flex h-100"}>
      {multiCtx.currentRepo?.stashes.length > 0 ? (
        <div>
          {multiCtx.currentRepo?.stashes.map((x, idx) => (
            <StashItem key={uuidv4()} id={idx} item={x} />
          ))}
        </div>
      ) : (
        <div className="muted-text">No Stashes</div>
      )}
    </div>
  );
}
