import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import { api } from "../../util";
// import { v4 as uuidv4 } from "uuid";
import Button from "../atoms/Button";
import SearchFiles from "../forms/SearchFiles";
import Dropdown from "../atoms/Dropdown";

export const FileContext = createContext();

export default function Files({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);

  const [pastFile, setPastFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");

  const getFiles = () => {
    api("get_files", { repository: multiCtx.currentRepo?.name }, (data) => {
      setFiles(data.files);
      setSelectedFile(null);
      setSelectedCommit(null);
      setPastFile(null);
    });
  };

  const getFileHistory = () => {
    api(
      "get_file_history",
      { repository: multiCtx.currentRepo?.name, path: selectedFile?.path },
      (data) => {
        setHistory(data.commits);
      }
    );
  };

  const getFileAtCommit = () => {
    api(
      "get_file_at_point",
      {
        repository: multiCtx.currentRepo?.name,
        path: selectedFile?.relativePath,
        hash: selectedCommit?.abbrev_hash,
      },
      (data) => setPastFile(data.file)
    );
  };

  useEffect(() => {
    getFiles();
  }, [multiCtx.currentRepo]);

  useEffect(() => {
    selectedFile ? getFileHistory() : setHistory([]);
    setSelectedCommit(null);
    // setPastFile(null);
  }, [selectedFile]);

  useEffect(() => {
    selectedCommit ? getFileAtCommit() : setPastFile(null);
  }, [selectedCommit]);

  const contextValue = {
    query: query,
    setQuery: setQuery,
  };

  return (
    <FileContext.Provider value={contextValue}>
      <div className={className + " flex"}>
        <div className="col-25">
          <SearchFiles className="mb-3" />
          <div style={{ overflowY: "auto", height: "77vh" }}>
            {files
              .filter((w) => w.name.toLowerCase().startsWith(query))
              .map((x) => (
                <div
                  className={
                    "file-item " +
                    (selectedFile?.path === x.path ? "active" : "")
                  }>
                  <a
                    onClick={() =>
                      setSelectedFile(selectedFile?.path === x.path ? null : x)
                    }>
                    {x.name}
                  </a>
                </div>
              ))}
          </div>
        </div>
        <div className="col-75">
          {selectedFile && (
            <>
              {selectedCommit && (
                <Button
                  className="px-1"
                  icon="x"
                  onClick={() => setSelectedCommit(null)}
                />
              )}
              <Dropdown
                icon="clock-history"
                classNameMenu="h-75 overflow-y-auto"
                target="commits"
                text={selectedCommit ? selectedCommit?.name : "Select Commit"}>
                {history.map((item) => (
                  <div
                    onClick={() =>
                      setSelectedCommit(
                        selectedCommit?.abbrev_hash === item.abbrev_hash
                          ? null
                          : item
                      )
                    }
                    className={
                      className +
                      " between dropdown-item" +
                      (selectedCommit?.abbrev_hash === item.abbrev_hash
                        ? " active"
                        : "")
                    }>
                    {item.name}
                    <span>{item.timestamp}</span>
                  </div>
                ))}
              </Dropdown>
              <Button
                text="Copy"
                icon={copied ? "check-lg" : "clipboard"}
                onClick={() => {
                  navigator.clipboard.writeText(pastFile);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
              />
            </>
          )}
          <div
            className="mt-3 px-2"
            style={{
              overflowY: "auto",
              height: "78vh",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              fontSize: "small",
            }}>
            {pastFile && <div className="d-flex flex-row-reverse mb-2"></div>}
            {pastFile}
          </div>
        </div>
      </div>
    </FileContext.Provider>
  );
}
