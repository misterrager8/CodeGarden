import { useContext, useState } from "react";
import Icon from "../atoms/Icon";
import { api } from "../../util";
import { MultiContext } from "../../Context";
import { LogContext } from "../pages/History";

export default function LineItem({ item }) {
  const { currentRepo } = useContext(MultiContext);
  const { selectedCommit, selectedFile, lineFilter } = useContext(LogContext);

  const [copied, setCopied] = useState(false);
  const [blame, setBlame] = useState(null);
  const [fileAtHash, setFileAtHash] = useState([]);

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
            {item.content !== "" && (
              <>
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
              </>
            )}
          </span>
          <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {item.content}
          </div>
        </div>
      </div>
      {blame && (
        <div>
          <div className="blame">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (fileAtHash.length === 0) {
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
                      setFileAtHash(fileContents_);
                    },
                  );
                } else {
                  setFileAtHash([]);
                }
              }}
              className="me-2 fw-bold">
              <Icon
                name={
                  "bi:" + (fileAtHash.length > 0 ? "x-lg" : "caret-down-fill")
                }
                className="me-1"
              />
              {blame?.hash}
            </span>
            <span>{blame?.content}</span>
          </div>
          <div
            className=""
            style={{
              marginLeft: "100px",
              marginBottom: "20px",
              // paddingLeft: "30px",
              borderLeft: ".5px dashed",
            }}>
            {fileAtHash.map((x, idx) => (
              <div
                className="font-monospace"
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "small",
                  backgroundColor: idx === item.id ? "#fd9843" : null,
                  color: idx === item.id ? "black" : null,
                  paddingLeft: "20px",
                }}>
                {x.content || "\n"}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
