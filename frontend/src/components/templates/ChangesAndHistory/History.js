import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import LogItem from "../../organisms/items/LogItem";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../Display";
import { api } from "../../../util";
import HunkItem from "../../organisms/items/HunkItem";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [commitDetails, setCommitDetails] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);

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

  const getFileAtCommit = (path) => {
    api(
      "get_file_at_commit",
      {
        name: multiCtx.currentRepo.name,
        path: path,
        abbrevHash: selectedCommit?.abbrev_hash,
      },
      (data) => {
        setFileDetails(data.info);
        setSelectedFile(path);
      }
    );
  };

  useEffect(() => {
    if (selectedCommit) {
      setFileDetails([]);
      setSelectedFile(null);
      getCommit();
    }
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
            <div className="row">
              <div className="col-3 border-end">
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    height: "25vh",
                    overflowY: "auto",
                  }}
                  className="fst-italic small">
                  {commitDetails?.commitInfo}
                </div>
                <div
                  className="small"
                  style={{
                    height: "53vh",
                    overflowY: "auto",
                  }}>
                  <hr className="mb-4" />
                  {commitDetails?.files.map((x) => (
                    <div
                      className={
                        "file-item" + (selectedFile === x ? " active" : "")
                      }
                      onClick={() => {
                        if (selectedFile !== x) {
                          getFileAtCommit(x);
                        } else {
                          setSelectedFile(null);
                        }
                      }}
                      style={{ cursor: "pointer" }}>
                      {x}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-9 diff-content">
                {fileDetails.map((x) => (
                  <div className="pb-4">
                    {x.id}
                    <HunkItem
                      added={false}
                      item={x.lines
                        .filter((y) => !y.added)
                        .map((z) => z.content)
                        .join("\n")}
                    />
                    <HunkItem
                      added={true}
                      item={x.lines
                        .filter((y) => y.added)
                        .map((z) => z.content)
                        .join("\n")}
                    />
                  </div>
                ))}
              </div>
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
