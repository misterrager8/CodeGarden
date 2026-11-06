import { useContext } from "react";
import { MultiContext } from "../../Context";
import Button from "../atoms/Button";
import { LogContext } from "../pages/History";
import Icon from "../atoms/Icon";

export default function LogItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const logCtx = useContext(LogContext);

  return (
    <>
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
            <div className="d-flex align-items-center gap-1">
              <span className="small font-monospace">{item.abbrev_hash}</span>
              {id < multiCtx.currentRepo?.unpushed && (
                <Icon className="orange" name="bi:record-fill" />
              )}
            </div>
          </div>
          <div className="between small fw-light">
            <span>{item.timestamp}</span>
            <span>{item.author}</span>
          </div>
        </div>
      </div>

      {id === 0 && logCtx.page === 1 && (
        <div className="d-fle">
          <Button
            tooltip="Undo Commit"
            text="Undo"
            icon="bi:eraser-fill"
            className="border-0 purple w-100"
            onClick={() => multiCtx.undoCommit()}
          />
        </div>
      )}
    </>
  );
}
