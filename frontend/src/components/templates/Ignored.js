import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import IgnoreItem from "../organisms/IgnoreItem";
import NewIgnored from "../organisms/forms/NewIgnored";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "./Display";
import Button from "../atoms/Button";

export default function Ignored({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const sxnCtx = useContext(SectionContext);
  const label = "ignored";

  return (
    <div className={className}>
      <Button
        text={sxnCtx.isCurrentSection(label) ? "Minimize" : "Maximize"}
        border={false}
        className="flex-grow-0 mb-1"
        icon={sxnCtx.isCurrentSection(label) ? "fullscreen-exit" : "fullscreen"}
        onClick={() =>
          sxnCtx.setCurrentSection(
            sxnCtx.isCurrentSection(label) ? null : label
          )
        }
      />
      <NewIgnored />
      <div>
        {multiCtx.currentRepo?.ignored.length > 0 ? (
          <div
            style={{
              height: !sxnCtx.isCurrentSection(label) ? "33vh" : "70vh",
              overflowY: "auto",
            }}>
            {multiCtx.currentRepo?.ignored.map((x, idx) => (
              <IgnoreItem id={idx} key={uuidv4()} item={x} />
            ))}
          </div>
        ) : (
          <div className="d-flex h-100">
            <span className="m-auto small opacity-50">No Ignored</span>
          </div>
        )}
      </div>
    </div>
  );
}
