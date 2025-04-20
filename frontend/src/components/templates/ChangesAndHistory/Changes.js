import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../../MultiContext";
import Button from "../../atoms/Button";
import DiffItem from "../../organisms/items/DiffItem";
import Commit from "../../organisms/forms/Commit";
import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../Display";
import { api } from "../../../util";
import NewStash from "../../organisms/forms/NewStash";
import Icon from "../../atoms/Icon";
import HunkItem from "../../organisms/items/HunkItem";

export const DiffContext = createContext();

export default function Changes({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const [resetting, setResetting] = useState(false);
  const [stashing, setStashing] = useState(false);

  const [stagedDiffs, setStagedDiffs] = useState([]);
  const [unstagedDiffs, setUnstagedDiffs] = useState([]);

  const [selectedDiff, setSelectedDiff] = useState(null);
  const [diffDetails, setDiffDetails] = useState([]);

  const label = "changes-history";

  const getDiff = () => {
    api(
      "get_diff",
      { repository: multiCtx.currentRepo.name, path: selectedDiff.path },
      (data) => setDiffDetails(data.details)
    );
  };

  useEffect(() => {
    selectedDiff ? getDiff() : setDiffDetails([]);
  }, [selectedDiff]);

  useEffect(() => {
    setUnstagedDiffs(multiCtx.currentRepo?.diffs.filter((x) => !x.staged));
    setStagedDiffs(multiCtx.currentRepo?.diffs.filter((x) => x.staged));
  }, [multiCtx.currentRepo]);

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
            <div className="mb-2">{!stashing ? <Commit /> : <NewStash />}</div>
            <div className="text-center mb-2">
              <Button
                text="Amend"
                icon="vector-pen"
                onClick={() => multiCtx.amendCommit()}
                className="border-0"
              />
              <Button
                onClick={() => setStashing(!stashing)}
                text="Stash"
                icon="archive"
                active={stashing}
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
                {stagedDiffs.length > 0 && (
                  <>
                    <div className="muted-label mb-1">Staged</div>
                    {stagedDiffs.map((x) => (
                      <DiffItem key={uuidv4()} item={x} />
                    ))}
                    <div className="between mt-2">
                      <div></div>
                      <span
                        onClick={() => multiCtx.unstageAll()}
                        className="px-1 red"
                        style={{ fontSize: ".7rem", cursor: "pointer" }}>
                        <Icon className="me-1" name="dash-lg" />
                        Unstage All
                      </span>
                    </div>
                  </>
                )}
                {unstagedDiffs.length > 0 && (
                  <>
                    <div className="between my-1">
                      <div className="muted-label">Unstaged</div>
                    </div>
                    {unstagedDiffs.map((x) => (
                      <DiffItem key={uuidv4()} item={x} />
                    ))}
                    <div className="between mt-2">
                      <div></div>
                      <span
                        onClick={() => multiCtx.stageAll()}
                        className="px-1 green"
                        style={{ fontSize: ".7rem", cursor: "pointer" }}>
                        <Icon className="me-1" name="plus-lg" />
                        Stage All
                      </span>
                    </div>
                  </>
                )}
              </DiffContext.Provider>
            </div>
          </div>
          {sxnCtx.isCurrentSection(label) && (
            <div className="col-9">
              {selectedDiff ? (
                <div className="px-5 diff-content">
                  {diffDetails.map((x) => (
                    <div className="pb-4">
                      {x.id}
                      <HunkItem
                        added={false}
                        item={x.lines
                          .filter((y) => !y.added)
                          .map((z) => z.content)
                          .join("\n")}
                      />
                      <HunkItem
                        added={true}
                        item={x.lines
                          .filter((y) => y.added)
                          .map((z) => z.content)
                          .join("\n")}
                      />
                    </div>
                  ))}
                </div>
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
