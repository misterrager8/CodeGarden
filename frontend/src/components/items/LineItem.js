import { useContext, useState } from "react";
import Icon from "../atoms/Icon";
import { api } from "../../util";
import { MultiContext } from "../../Context";
import { LogContext } from "../pages/History";

export default function LineItem({ item, idx }) {
  const multiCtx = useContext(MultiContext);
  const logCtx = useContext(LogContext);

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [blame, setBlame] = useState(null);

  const copyLine = () => {
    navigator.clipboard.writeText(item.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const getBlame = () =>
    api(
      "blame",
      {
        repository: multiCtx.currentRepo?.name,
        hash: logCtx.selectedCommit?.abbrev_hash,
        line_number: idx,
        path: logCtx.selectedFile?.path,
      },
      (data) => setBlame(data.blame),
    );

  return (
    <>
      <div
        className="line-item between"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div className="d-flex">
          <span className="line-number">
            <span className="me-3">
              {(idx + 1).toString().padStart(2, " ")}
            </span>
            <Icon
              onClick={() => copyLine()}
              name={copied ? "check-lg" : "clipboard"}
              className={"me-3" + (hovered ? "" : " invisible")}
            />
            <Icon
              onClick={() => {
                blame ? setBlame(null) : getBlame();
              }}
              name="git"
              className={"" + (hovered ? "" : " invisible")}
            />
          </span>
          <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {item}
          </div>
        </div>
      </div>
      {blame && <div className="blame">{blame}</div>}
    </>
  );
}
