import { useContext, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import ButtonGroup from "../../molecules/ButtonGroup";
import Button from "../../atoms/Button";
import { SectionContext } from "../Display";
import Changes from "./Changes";
import History from "./History";

export default function Container({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const [tab, setTab] = useState("changes");

  const label = "changes-history";

  return (
    <div
      className={className + (sxnCtx.isCurrentSection(label) ? " pt-3" : "")}>
      <div className="d-flex">
        <ButtonGroup
          className={"col" + (sxnCtx.isCurrentSection(label) ? "-3 pe-3" : "")}>
          <Button
            border={false}
            className="flex-grow-0"
            icon={
              sxnCtx.isCurrentSection(label)
                ? "arrow-left"
                : "box-arrow-up-right"
            }
            onClick={() =>
              sxnCtx.setCurrentSection(
                sxnCtx.isCurrentSection(label) ? null : label
              )
            }
          />
          <Button
            active={tab === "changes"}
            text={`Changes${
              multiCtx.currentRepo.diffs.length > 0
                ? ` (${multiCtx.currentRepo.diffs.length})`
                : ""
            }`}
            onClick={() => setTab("changes")}
          />
          <Button
            active={tab === "history"}
            text="History"
            onClick={() => setTab("history")}
          />
        </ButtonGroup>
      </div>
      <div className="mt-3">
        {tab === "changes" ? <Changes /> : <History />}
      </div>
    </div>
  );
}
