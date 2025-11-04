import { useContext } from "react";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";
import { LogContext } from "../../templates/ChangesAndHistory/History";
import { SectionContext } from "../../templates/Display";

export default function LogItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const logCtx = useContext(LogContext);
  const sxnCtx = useContext(SectionContext);

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
                size="sm"
                onClick={() => multiCtx.undoCommit()}
              />
            )}
            <span
              onClick={() => {
                sxnCtx.isCurrentSection("history") &&
                  logCtx.setSelectedCommit(
                    logCtx.selectedCommit?.abbrev_hash === item.abbrev_hash
                      ? null
                      : item
                  );
              }}
              title={item.name}>
              {item.name}
            </span>
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
