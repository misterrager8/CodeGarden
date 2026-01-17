import { useState } from "react";
import Icon from "../atoms/Icon";

export default function LineItem({ item, idx }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copyLine = () => {
    navigator.clipboard.writeText(item.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className="line-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span className="line-number" onClick={() => copyLine()}>
        {(idx + 1).toString().padStart(2, " ")}
        <Icon
          name={copied ? "check-lg" : "clipboard"}
          className={"ms-2" + (hovered ? "" : " invisible")}
        />
      </span>
      <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {item}
      </div>
    </div>
  );
}
