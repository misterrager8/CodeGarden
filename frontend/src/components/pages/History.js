import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import LogItem from "../items/LogItem";
import { api } from "../../util";
import HunkItem from "../items/HunkItem";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Dropdown from "../atoms/Dropdown";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [commitDetails, setCommitDetails] = useState(null);
  const [fileDetails, setFileDetails] = useState([]);
  const [mode, setMode] = useState("unified");

  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => setQuery(e.target.value);

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
        name: multiCtx.currentRepo?.name,
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
      setQuery("");
    }
  }, [selectedCommit]);

  const contextValue = {
    selectedCommit: selectedCommit,
    setSelectedCommit: setSelectedCommit,
    getCommit: getCommit,
  };

  return (
    <LogContext.Provider value={contextValue}>
      <div className={className + " flex h-100"}>
        <div className="col-25">
          {multiCtx.currentRepo?.log.map((item, idx) => (
            <LogItem id={idx} item={item} />
          ))}
        </div>
        <div className="divider"></div>
        <div className="col-75 d-flex">
          {selectedCommit ? (
            <div className="w-100">
              <div className="flex h-100">
                {/* <div className="col-25">
                  <div className="mb-3 d-flex">
                    {query !== "" && (
                      <Button icon="eraser-fill" onClick={() => setQuery("")} />
                    )}
                    <Input
                      value={query}
                      onChange={onChangeQuery}
                      placeholder="Search"
                    />
                  </div>
                  {commitDetails?.files
                    .filter((x) => x.name.toLowerCase().startsWith(query))
                    .map((file) => (
                      <div
                        className={
                          "file-item " +
                          (selectedFile?.path === file.path ? "active" : "")
                        }>
                        <a
                          onClick={() => {
                            selectedFile?.path !== file.path
                              ? getFileAtCommit(file)
                              : setSelectedFile(null);
                          }}>
                          {file.name}
                        </a>
                      </div>
                    ))}
                </div> */}
                {/* <div className="divider"></div> */}
                <div className="w-100">
                  <div className="between text-truncate">
                    <div className="d-flex text-truncate">
                      {selectedFile && (
                        <Button
                          className="px-0"
                          icon="x"
                          onClick={() => setSelectedFile(null)}
                        />
                      )}
                      <Dropdown
                        icon="file-earmark"
                        classNameBtn="text-truncate"
                        taget="history-files"
                        text={
                          !selectedFile ? "Select File" : selectedFile.name
                        }>
                        {commitDetails?.files
                          .filter((x) => x.name.toLowerCase().startsWith(query))
                          .map((file) => (
                            <a
                              className={
                                "dropdown-item " +
                                (selectedFile?.path === file.path
                                  ? "active"
                                  : "")
                              }
                              onClick={() => {
                                selectedFile?.path !== file.path
                                  ? getFileAtCommit(file)
                                  : setSelectedFile(null);
                              }}>
                              {file.name}
                            </a>
                          ))}
                      </Dropdown>
                    </div>

                    {selectedFile && (
                      <div className="d-flex">
                        <Button
                          active={mode === "before"}
                          text="Before"
                          icon="rewind-fill"
                          onClick={() => setMode("before")}
                        />
                        <Button
                          active={mode === "unified"}
                          text="Unified"
                          icon="record-fill"
                          onClick={() => setMode("unified")}
                        />
                        <Button
                          active={mode === "after"}
                          text="After"
                          icon="fast-forward-fill"
                          onClick={() => setMode("after")}
                        />
                      </div>
                    )}
                  </div>

                  {selectedFile ? (
                    <div className="mt-3">
                      <div className="code-scroll">
                        {mode === "unified" && (
                          <>
                            {fileDetails.map((x) => (
                              <div className="pb-4">
                                {/* {x.id} */}
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
                          </>
                        )}
                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                            fontSize: "small",
                          }}>
                          {mode === "before"
                            ? before
                            : mode === "after"
                            ? after
                            : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        fontSize: ".875rem",
                      }}
                      className="my-3">
                      {commitDetails?.commitInfo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="muted-text">None</div>
          )}
        </div>
      </div>
    </LogContext.Provider>
  );
}
