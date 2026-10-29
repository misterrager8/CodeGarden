import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import LogItem from "../items/LogItem";
import { api } from "../../util";
import SearchFiles from "../forms/SearchFiles";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import LineItem from "../items/LineItem";
import Input from "../atoms/Input";
import { v4 as uuidv4 } from "uuid";

export const LogContext = createContext();

export default function History({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [selectedCommit, setSelectedCommit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [summary, setSummary] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState([]);
  const [copied, setCopied] = useState(false);

  const [query, setQuery] = useState("");

  const [lineFilter, setLineFilter] = useState("");
  const onChangeLineFilter = (e) => setLineFilter(e.target.value);

  const [fontSize, setFontSize] = useState(0.875);
  const onChangeFontSize = (e) => setFontSize(e.target.value);

  const [filteredLinesOnly, setFilteredLinesOnly] = useState(false);

  const getFileAtCommit = () => {
    api(
      "get_file_at_point",
      {
        repository: multiCtx.currentRepo?.name,
        path: selectedFile?.relativePath,
        hash: selectedCommit?.abbrev_hash,
      },
      (data) => {
        let fileContents_ = data.file?.after.split("\n").map((x, idx) => {
          return { content: x, id: idx };
        });
        setFileContents(fileContents_);
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
    selectedFile ? getFileAtCommit() : setFileContents([]);
    setLineFilter("");
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
    lineFilter: lineFilter,
    setFiles: setFiles,
    setSummary: setSummary,
    fileContents: fileContents,
    setFileContents: setFileContents,
  };

  return (
    <LogContext.Provider value={contextValue}>
      <div className={className + " flex h-100"}>
        {!selectedFile && (
          <div className="col-25">
            {multiCtx.currentRepo?.log.map((item, idx) => (
              <LogItem id={idx} item={item} />
            ))}
          </div>
        )}
        <div className="col-25">
          <SearchFiles className="mb-3" />
          <div
            className="mt-3"
            style={{ overflowY: "auto", height: "71vh", padding: "5px" }}>
            {files
              .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
              .map((x) => (
                <div
                  onClick={() => {
                    if (selectedFile?.path !== x.path) {
                      setSelectedFile(x);
                      getFileAtCommit();
                    }
                  }}
                  key={x.path}
                  className={
                    "file-item text-truncate " +
                    (selectedFile?.path === x.path ? "active" : "")
                  }>
                  {x.changed && (
                    <Icon
                      name="material-symbols-light:change-history-rounded"
                      className="me-2 red"
                    />
                  )}
                  <span>{x.name}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="divider"></div>
        <div className={"d-flex col-" + (selectedFile ? "75" : "50")}>
          {selectedFile ? (
            <div className="w-100">
              <div>
                <span
                  onClick={() => setSelectedFile(null)}
                  className="small"
                  style={{ cursor: "pointer" }}>
                  <Icon name="bi:caret-left-fill" className="me-1" />
                  {selectedCommit?.name}
                </span>
                <div className="d-flex between w-100 mt-3">
                  <Button
                    text="Copy"
                    icon={copied ? "mdi:check-bold" : "solar:clipboard-linear"}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        fileContents?.map((x) => x.content).join("\n"),
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1000);
                    }}
                  />
                  <div className="d-flex flex-row-reverse w-75">
                    <Input
                      placeholder="Search Lines"
                      className="w-75"
                      value={lineFilter}
                      onChange={onChangeLineFilter}
                    />
                    {lineFilter !== "" && (
                      <div className="my-auto">
                        <Button
                          active={filteredLinesOnly}
                          onClick={() =>
                            setFilteredLinesOnly(!filteredLinesOnly)
                          }
                          icon="bi:search"
                          text={
                            fileContents
                              ?.map((x) => x.content)
                              .filter((x) =>
                                x
                                  .toLowerCase()
                                  .includes(lineFilter.toLowerCase()),
                              ).length
                          }
                        />
                        <Button
                          onClick={() => setLineFilter("")}
                          icon="bi:eraser"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="code-scroll my-3">
                  <div
                    style={{
                      fontSize: `${fontSize}rem`,
                    }}>
                    {fileContents
                      // .map((x) => x.content)
                      .filter((x) =>
                        filteredLinesOnly
                          ? x.content
                              .toLowerCase()
                              .includes(lineFilter.toLowerCase())
                          : x !== null,
                      )
                      .map((x) => (
                        <LineItem key={uuidv4()} item={x} />
                      ))}
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
                  <Icon name="fe:text-size" className="me-2" /> {fontSize} rem
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
