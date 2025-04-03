import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import IgnoreItem from "../organisms/items/IgnoreItem";
import NewIgnored from "../organisms/forms/NewIgnored";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "./Display";

export default function Ignored({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const sxnCtx = useContext(SectionContext);
  const label = "ignored";

  return (
    <div className={className}>
      <NewIgnored />
      <div>
        {multiCtx.currentRepo?.ignored.length > 0 ? (
          <div
            style={{
              height: !sxnCtx.isCurrentSection(label) ? "35vh" : "70vh",
              overflowY: "auto",
            }}>
            {multiCtx.currentRepo?.ignored.map((x, idx) => (
              <IgnoreItem id={idx} key={uuidv4()} item={x} />
            ))}
          </div>
        ) : (
          <div
            style={{
              height: !sxnCtx.isCurrentSection(label) ? "35vh" : "70vh",
              display: "flex",
            }}>
            <span className="muted-label-center">No Ignored</span>
          </div>
        )}
      </div>
    </div>
  );
}
