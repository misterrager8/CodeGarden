import { useContext } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { LogContext } from "../pages/History";

export default function LogItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const logCtx = useContext(LogContext);

  return (
    <div className="d-flex">
      {id === 0 && (
        <Button
          tooltip="Undo Commit"
          // text="Undo"
          icon="ic:baseline-undo"
          className="border-0 purple px-1"
          onClick={() => multiCtx.undoCommit()}
        />
      )}
      <div
        onClick={() => logCtx.setSelectedCommit(item)}
        className={
          className +
          " log-item w-100" +
          (logCtx.selectedCommit?.abbrev_hash === item.abbrev_hash
            ? " active"
            : "")
        }>
        <div>
          <div className="between mb-1">
            <div className="fw-bold text-truncate">
              <a title={item.name}>{item.name}</a>
            </div>
            <span className="small font-monospace">{item.abbrev_hash}</span>
          </div>
          <div className="between small fw-light">
            <span>{item.timestamp}</span>
            <span>{item.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
