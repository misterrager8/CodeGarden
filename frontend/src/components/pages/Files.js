import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import { api } from "../../util";
import LogItem from "../items/LogItem";
import { v4 as uuidv4 } from "uuid";

export default function Files({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);

  const [pastFile, setPastFile] = useState(null);

  const getFiles = () => {
    api("get_files", { repository: multiCtx.currentRepo?.name }, (data) =>
      setFiles(data.files)
    );
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
  }, []);

  useEffect(() => {
    selectedFile ? getFileHistory() : setHistory([]);
  }, [selectedFile]);

  useEffect(() => {
    selectedCommit ? getFileAtCommit() : setPastFile(null);
  }, [selectedCommit]);

  return (
    <div className={className + " d-flex"}>
      <div className="col-25" style={{ overflowY: "auto", height: "85vh" }}>
        {files.map((x) => (
          <div
            className={
              "file-item " + (selectedFile?.path === x.path ? "active" : "")
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
      <div className="col-25" style={{ overflowY: "auto", height: "85vh" }}>
        {history.map((item) => (
          <div
            className={
              className +
              " log-item" +
              (selectedCommit?.abbrev_hash === item.abbrev_hash
                ? " active"
                : "")
            }>
            <div>
              <div className="between mb-1">
                <div className="fw-bold text-truncate">
                  <a
                    onClick={() =>
                      setSelectedCommit(
                        selectedCommit?.abbrev_hash === item.abbrev_hash
                          ? null
                          : item
                      )
                    }
                    title={item.name}>
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
        ))}
      </div>
      <div
        className="col-50 px-5"
        style={{
          overflowY: "auto",
          height: "85vh",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          fontSize: "small",
        }}>
        {pastFile}
      </div>
    </div>
  );
}
