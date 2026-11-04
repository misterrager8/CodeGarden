import { useContext, useState } from "react";
import Icon from "../atoms/Icon";
import { LogContext } from "../pages/History";
import Button from "../atoms/Button";

export default function LineItem({ item }) {
  const {
    selectedLine,
    lineFilter,
    setSelectedLine,
    blame,
    getFileAtCommit,
    fontSize,
    fileAtHash,
  } = useContext(LogContext);

  const [copied, setCopied] = useState(false);

  const copyLine = () => {
    navigator.clipboard.writeText(item.content.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <div
        style={{ whiteSpace: "nowrap" }}
        className={
          "line-item between w-100" +
          ((item.content.toLowerCase().includes(lineFilter.toLowerCase()) &&
            lineFilter !== "") ||
          selectedLine?.id === item?.id
            ? " active"
            : "")
        }>
        <div className="d-flex">
          <span className="line-number">
            <span className="me-3 font-monospace" style={{ whiteSpace: "pre" }}>
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
                  onClick={() =>
                    setSelectedLine(selectedLine?.id === item.id ? null : item)
                  }
                  name="picon:blame"
                />
              </>
            )}
          </span>
          <div
            style={{
              fontFamily: "monospace",
              whiteSpace: "pre",
              fontSize: `${fontSize}rem`,
            }}>
            {item.content || "\n"}
          </div>
        </div>
      </div>
      {item?.id === selectedLine?.id && blame && (
        <div
          style={{ cursor: "pointer", borderLeft: ".5px solid" }}
          onClick={() => getFileAtCommit()}
          className="ps-5 ms-5 my-3">
          <div>
            <div className="">{blame?.hashShort}</div>
            <div className="">{blame?.timestamp}</div>
          </div>
          <Button
            className="my-3"
            active={fileAtHash.length > 0}
            icon="bi-record2"
            text="See Line At Origin"
          />
          <div className="fst-italic" style={{ whiteSpace: "pre-wrap" }}>
            {blame?.summary}
          </div>
        </div>
      )}
    </>
  );
}
