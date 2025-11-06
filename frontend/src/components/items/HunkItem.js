import { useState } from "react";
import Icon from "../atoms/Icon";

export default function HunkItem({ item, added, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyHunk = () => {
    navigator.clipboard.writeText(`${item}\n`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      {item && (
        <div className={"hunk-item" + (added ? " green" : " red")}>
          <Icon
            className={"me-3 " + (hovered || copied ? "" : "invisible")}
            name={"clipboard" + (copied ? "-check" : "")}
          />
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}
            onClick={() => copyHunk()}
            className={className + (added ? " green" : " red")}>
            {item}
          </div>
        </div>
      )}
    </>
  );
}
