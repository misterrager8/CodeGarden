import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import LogItem from "../../organisms/items/LogItem";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../Display";
import { api } from "../../../util";
import HunkItem from "../../organisms/items/HunkItem";
import ButtonGroup from "../../molecules/ButtonGroup";
import Button from "../../atoms/Button";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [commitDetails, setCommitDetails] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);
  const [mode, setMode] = useState("unified");

  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);

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

  const getFileAtCommit = (file) => {
    api(
      "get_file_at_commit",
      {
        name: multiCtx.currentRepo.name,
        path: file.path,
        abbrevHash: selectedCommit?.abbrev_hash,
      },
      (data) => {
        setFileDetails(data.info);
        setBefore(data.before);
        setAfter(data.after);
        setSelectedFile(file);
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

  const label = "history";

  const contextValue = {
    selectedCommit: selectedCommit,
    setSelectedCommit: setSelectedCommit,
    getCommit: getCommit,
  };

  return (
    <div className="flex">
      <div className="w-25 log">
        <LogContext.Provider value={contextValue}>
          {multiCtx.currentRepo?.log.map((x, idx) => (
            <LogItem key={uuidv4()} id={idx} item={x} />
          ))}
        </LogContext.Provider>
      </div>
      {sxnCtx.isCurrentSection(label) && (
        <div className="flex-75 file">
          {selectedCommit ? (
            <div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  height: "30vh",
                  overflowY: "auto",
                }}
                className="fst-italic small border-bottom px-4">
                {commitDetails?.commitInfo}
              </div>
              <div className="row">
                <div
                  className="col-3 border-end py-3"
                  style={{ height: "55vh", overflowY: "auto" }}>
                  <div className="small">
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
                        {x.name}
                      </div>
                    ))}
                  </div>
                </div>
                {selectedFile && (
                  <div className="col-9 ">
                    <ButtonGroup className="my-3">
                      <Button
                        active={mode === "before"}
                        icon="rewind-fill"
                        onClick={() => setMode("before")}
                        text="Before"
                      />
                      <Button
                        active={mode === "unified"}
                        icon="circle"
                        onClick={() => setMode("unified")}
                        text="Unified"
                      />
                      <Button
                        active={mode === "after"}
                        icon="fast-forward-fill"
                        onClick={() => setMode("after")}
                        text="After"
                      />
                    </ButtonGroup>
                    <div style={{ height: "45vh", overflowY: "auto" }}>
                      {mode === "unified" ? (
                        <div className="diff-content py-3">
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
                      ) : mode === "before" ? (
                        <div
                          className="font-monospace small"
                          style={{ whiteSpace: "pre-wrap" }}>
                          {before}
                        </div>
                      ) : mode === "after" ? (
                        <div
                          className="font-monospace small"
                          style={{ whiteSpace: "pre-wrap" }}>
                          {after}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                )}
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
