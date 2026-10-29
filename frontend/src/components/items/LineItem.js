import { useContext, useState } from "react";
import Icon from "../atoms/Icon";
import { api } from "../../util";
import { MultiContext } from "../../Context";
import { LogContext } from "../pages/History";

export default function LineItem({ item }) {
  const { currentRepo } = useContext(MultiContext);
  const {
    selectedCommit,
    selectedFile,
    lineFilter,
    setSummary,
    setFiles,
    setFileContents,
  } = useContext(LogContext);

  const [copied, setCopied] = useState(false);
  const [blame, setBlame] = useState(null);

  const copyLine = () => {
    navigator.clipboard.writeText(item.content.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const getBlame = () =>
    api(
      "blame",
      {
        repository: currentRepo?.name,
        hash: selectedCommit?.abbrev_hash,
        line_number: item.id + 1,
        path: selectedFile?.path,
      },
      (data) => setBlame(data.blame),
    );

  return (
    <>
      <div
        className={
          "line-item between" +
          (item.content.toLowerCase().includes(lineFilter.toLowerCase()) &&
          lineFilter !== ""
            ? " active"
            : "")
        }>
        <div className="d-flex">
          <span className="line-number">
            <span
              className="me-3 font-monospace"
              style={{ whiteSpace: "pre-wrap" }}>
              {(item.id + 1).toString().padStart(3)}
            </span>
            <Icon
              onClick={() => copyLine()}
              name={copied ? "mdi:check-bold" : "solar:clipboard-linear"}
              className="me-3"
            />
            <Icon
              onClick={() => {
                blame ? setBlame(null) : getBlame();
              }}
              name="picon:blame"
            />
          </span>
          <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {item.content}
          </div>
        </div>
      </div>
      {blame && (
        <div className="blame">
          <span
            onClick={() => {
              api(
                "get_file_at_point",
                {
                  repository: currentRepo?.name,
                  path: selectedFile?.relativePath,
                  hash: blame?.hash,
                },
                (data) => {
                  let fileContents_ = data.file?.after
                    .split("\n")
                    .map((x, idx) => {
                      return { content: x, id: idx };
                    });
                  setFileContents(fileContents_);
                },
              );
            }}
            className="me-2 fw-bold">
            {blame?.hash}
          </span>
          <span>{blame?.content}</span>
        </div>
      )}
    </>
  );
}
