import { useContext, useState } from "react";
import { MultiContext } from "../../MultiContext";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "../atoms/Button";
import DiffItem from "../organisms/DiffItem";
import LogItem from "../organisms/LogItem";
import Commit from "../organisms/forms/Commit";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "./Display";

export default function ChangesAndHistory({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const [tab, setTab] = useState("changes");
  const [resetting, setResetting] = useState(false);

  const label = "changes-history";

  return (
    <div
      className={
        className + (sxnCtx.isCurrentSection(label) ? " w-75 mx-auto" : "")
      }>
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
      <ButtonGroup className="w-100">
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
      <div className="mt-4">
        {tab === "changes" ? (
          <>
            {multiCtx.currentRepo?.diffs.length === 0 ? (
              <div className="d-flex" style={{ height: "30vh" }}>
                <span className="m-auto opacity-50 small">No Changes</span>
              </div>
            ) : (
              <>
                <Commit className="mb-2" />
                <div className="text-center mb-2">
                  <Button
                    className="red"
                    text="Reset All"
                    border={false}
                    onClick={() => setResetting(!resetting)}
                  />
                  {resetting && (
                    <Button
                      className="red"
                      icon="question-lg"
                      border={false}
                      onClick={() => multiCtx.resetAll()}
                    />
                  )}
                </div>
                <div
                  style={{
                    height: !sxnCtx.isCurrentSection(label) ? "20vh" : "60vh",
                    overflowY: "auto",
                  }}>
                  {multiCtx.currentRepo?.diffs.map((x) => (
                    <DiffItem key={uuidv4()} item={x} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            style={{
              height: !sxnCtx.isCurrentSection(label) ? "30vh" : "70vh",
              overflowY: "auto",
            }}>
            {multiCtx.currentRepo?.log.map((x, idx) => (
              <LogItem key={uuidv4()} id={idx} item={x} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
