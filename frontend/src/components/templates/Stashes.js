import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import StashItem from "../organisms/StashItem";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "./Display";
import Button from "../atoms/Button";

export default function Stashes({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const sxnCtx = useContext(SectionContext);
  const label = "stashes";

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
      <>
        {multiCtx.currentRepo?.stashes.length > 0 ? (
          <div style={{ height: "35vh", overflowY: "auto" }}>
            {multiCtx.currentRepo?.stashes.map((x) => (
              <StashItem key={uuidv4()} item={x} />
            ))}
          </div>
        ) : (
          <div className="d-flex" style={{ height: "35vh" }}>
            <span className="m-auto small opacity-50">No Stashes</span>
          </div>
        )}
      </>
    </div>
  );
}
