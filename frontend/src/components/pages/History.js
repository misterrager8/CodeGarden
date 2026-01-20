import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import LogItem from "../items/LogItem";
import { api } from "../../util";
import SearchFiles from "../forms/SearchFiles";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import LineItem from "../items/LineItem";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [summary, setSummary] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState(null);
  const [copied, setCopied] = useState(false);

  const [query, setQuery] = useState("");
  const [fontSize, setFontSize] = useState(0.875);
  const onChangeFontSize = (e) => setFontSize(e.target.value);

  const [showPastVersion, setShowPastVersion] = useState(false);

  const getFileAtCommit = () => {
    api(
      "get_file_at_point",
      {
        repository: multiCtx.currentRepo?.name,
        path: selectedFile?.relativePath,
        hash: selectedCommit?.abbrev_hash,
      },
      (data) => {
        setFileContents(data.file);
      },
    );
  };

  const getFilesAtCommit = () => {
    api(
      "get_files_at_point",
      {
        repository: multiCtx.currentRepo?.name,
        hash: selectedCommit?.abbrev_hash,
      },
      (data) => {
        setFiles(data.files.files);
        setSummary(data.files.summary);
      },
    );
  };

  useEffect(() => {
    setSelectedFile(null);
    selectedCommit && getFilesAtCommit();
  }, [selectedCommit]);

  useEffect(() => {
    selectedFile ? getFileAtCommit() : setFileContents(null);
    setShowPastVersion(false);
  }, [selectedFile]);

  useEffect(() => {
    multiCtx.currentRepo && setSelectedCommit(multiCtx.currentRepo?.log?.[0]);
  }, [multiCtx.currentRepo]);

  const contextValue = {
    selectedCommit: selectedCommit,
    setSelectedCommit: setSelectedCommit,
    selectedFile: selectedFile,
    setSelectedFile: setSelectedFile,
    query: query,
    setQuery: setQuery,
  };

  return (
    <LogContext.Provider value={contextValue}>
      <div className={className + " flex h-100"}>
        <div className="col-25">
          {multiCtx.currentRepo?.log.map((item, idx) => (
            <LogItem id={idx} item={item} />
          ))}
        </div>
        <div className="col-25">
          <SearchFiles className="mb-3" />
          <div className="mt-3" style={{ overflowY: "auto", height: "71vh" }}>
            {files
              .filter((w) => w.name.toLowerCase().startsWith(query))
              .map((x) => (
                <div
                  key={x.path}
                  className={
                    "file-item " +
                    (selectedFile?.path === x.path ? "active" : "")
                  }>
                  {x.changed && (
                    <Icon name="record-fill" className="me-2 red" />
                  )}
                  <a
                    onClick={() => {
                      if (selectedFile?.path !== x.path) {
                        setSelectedFile(x);
                        getFileAtCommit();
                      } else {
                        setSelectedFile(null);
                      }
                    }}>
                    {x.name}
                  </a>
                </div>
              ))}
          </div>
        </div>
        <div className="divider"></div>
        <div className="col-50 d-flex">
          {selectedFile ? (
            <div className="w-100">
              <div>
                <Button
                  text="Copy"
                  icon={copied ? "check-lg" : "clipboard"}
                  onClick={() => {
                    navigator.clipboard.writeText(fileContents);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1000);
                  }}
                />
                {selectedFile?.changed && (
                  <Button
                    active={showPastVersion}
                    onClick={() => setShowPastVersion(!showPastVersion)}
                    text={
                      "Show " +
                      (showPastVersion ? "Current" : "Previous") +
                      " Version"
                    }
                    icon={(showPastVersion ? "play" : "rewind") + "-fill"}
                  />
                )}
                <div className="code-scroll my-3">
                  <div
                    style={{
                      fontSize: `${fontSize}rem`,
                    }}>
                    {showPastVersion ? (
                      <>
                        {fileContents?.before?.split("\n").map((x, idx) => (
                          <LineItem item={x} idx={idx} />
                        ))}
                      </>
                    ) : (
                      <>
                        {fileContents?.after?.split("\n").map((x, idx) => (
                          <LineItem item={x} idx={idx} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <input
                  className="form-range"
                  type="range"
                  min={0.875}
                  max={10}
                  value={fontSize}
                  onChange={onChangeFontSize}
                  step={0.025}
                  autoComplete="off"
                />
                <span>
                  <Icon name="type" className="me-2" /> {fontSize} rem
                </span>
              </div>
            </div>
          ) : (
            <div className="muted-text">{summary}</div>
          )}
        </div>
      </div>
    </LogContext.Provider>
  );
}
