import { useContext } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { LogContext } from "../pages/History";

export default function LogItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const logCtx = useContext(LogContext);

  return (
    <div
      className={
        className +
        " log-item" +
        (logCtx.selectedCommit?.abbrev_hash === item.abbrev_hash
          ? " active"
          : "")
      }>
      <div>
        <div className="between mb-1">
          <div className="fw-bold text-truncate">
            {id === 0 && (
              <Button
                text="Undo"
                icon="arrow-return-left"
                className="border-0 purple"
                onClick={() => multiCtx.undoCommit()}
              />
            )}
            <a onClick={() => logCtx.setSelectedCommit(item)} title={item.name}>
              {item.name}
            </a>
          </div>
          <span className="small font-monospace">{item.abbrev_hash}</span>
        </div>
        <div className="between small fw-light">
          <span>{item.timestamp}</span>
          <span>{item.author}</span>
        </div>
      </div>
    </div>
  );
}
