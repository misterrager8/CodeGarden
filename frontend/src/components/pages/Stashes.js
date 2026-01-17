import { useContext } from "react";
import { MultiContext } from "../../Context";
import StashItem from "../items/StashItem";
import { v4 as uuidv4 } from "uuid";

export default function Stashes({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div className={className + " flex h-50"}>
      {multiCtx.currentRepo?.stashes.length > 0 ? (
        <div className="w-100">
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
