import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";
import DiffItem from "../../organisms/items/DiffItem";
import Commit from "../../organisms/forms/Commit";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../Display";
import { api } from "../../../util";

export const DiffContext = createContext();

export default function Changes({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const [resetting, setResetting] = useState(false);

  const [selectedDiff, setSelectedDiff] = useState(null);
  const [diffDetails, setDiffDetails] = useState(null);

  const label = "changes-history";

  const getDiff = () => {
    api(
      "get_diff",
      { repository: multiCtx.currentRepo.name, path: selectedDiff.path },
      (data) => setDiffDetails(data.details)
    );
  };

  useEffect(() => {
    selectedDiff ? getDiff() : setDiffDetails(null);
  }, [selectedDiff]);

  const contextValue = {
    selectedDiff: selectedDiff,
    setSelectedDiff: setSelectedDiff,

    diffDetails: diffDetails,
    setDiffDetails: setDiffDetails,
  };

  return (
    <>
      {multiCtx.currentRepo?.diffs.length === 0 ? (
        <div
          className={
            "d-flex border-end" +
            (sxnCtx.isCurrentSection(label) ? " col-3 pe-3" : "")
          }
          style={{ height: "30vh" }}>
          <span className="muted-label-center">No Changes</span>
        </div>
      ) : (
        <div className="row">
          <div
            className={
              "col" + (sxnCtx.isCurrentSection(label) ? "-3 border-end" : "")
            }>
            <Commit className="mb-2" />
            <div className="text-center mb-2">
              <Button
                text="Amend"
                icon="vector-pen"
                onClick={() => multiCtx.amendCommit()}
                className="border-0"
              />
              <Button
                icon="eraser-fill"
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
              <DiffContext.Provider value={contextValue}>
                {multiCtx.currentRepo?.diffs.map((x) => (
                  <DiffItem key={uuidv4()} item={x} />
                ))}
              </DiffContext.Provider>
            </div>
          </div>
          {sxnCtx.isCurrentSection(label) && (
            <div className="col-9">
              {selectedDiff ? (
                <div className="px-5 diff-content">{diffDetails}</div>
              ) : (
                <div className="d-flex h-100">
                  <div className="muted-label-center">No Changes Selected</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
