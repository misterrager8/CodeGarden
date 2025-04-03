import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import LogItem from "../../organisms/items/LogItem";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../Display";
import { api } from "../../../util";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitDetails, setCommitDetails] = useState(null);

  const getCommit = () => {
    api(
      "get_commit",
      {
        name: multiCtx.currentRepo.name,
        abbrev_hash: selectedCommit?.abbrev_hash,
      },
      (data) => setCommitDetails(data.details)
    );
  };

  useEffect(() => {
    selectedCommit && getCommit();
  }, [selectedCommit]);

  const label = "changes-history";

  const contextValue = {
    selectedCommit: selectedCommit,
    setSelectedCommit: setSelectedCommit,
    getCommit: getCommit,
  };

  return (
    <div className="row">
      <div
        style={{
          height: !sxnCtx.isCurrentSection(label) ? "30vh" : "70vh",
          overflowY: "auto",
        }}
        className={
          "col" + (!sxnCtx.isCurrentSection(label) ? "" : "-3 border-end")
        }>
        <LogContext.Provider value={contextValue}>
          {multiCtx.currentRepo?.log.map((x, idx) => (
            <LogItem key={uuidv4()} id={idx} item={x} />
          ))}
        </LogContext.Provider>
      </div>
      {sxnCtx.isCurrentSection(label) && (
        <div className="col-9">
          {selectedCommit ? (
            <div
              className="px-5 font-monospace small"
              style={{
                whiteSpace: "pre-wrap",
                height: "78vh",
                overflowY: "auto",
              }}>
              {commitDetails}
            </div>
          ) : (
            <div className="d-flex h-100">
              <div className="muted-label-center">No Commits Selected</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
