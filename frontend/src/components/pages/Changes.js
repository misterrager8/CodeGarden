import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import DiffItem from "../items/DiffItem";
import Commit from "../forms/Commit";
import { api } from "../../util";
import Button from "../atoms/Button";
import NewStash from "../forms/NewStash";
import Icon from "../atoms/Icon";
import HunkItem from "../items/HunkItem";
import { v4 as uuidv4 } from "uuid";
import Stashes from "./Stashes";
import Ignored from "./Ignored";

export const DiffContext = createContext();

export default function Changes({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [resetting, setResetting] = useState(false);
  const [stashing, setStashing] = useState(false);

  const [stagedDiffs, setStagedDiffs] = useState([]);
  const [unstagedDiffs, setUnstagedDiffs] = useState([]);

  const [selectedDiff, setSelectedDiff] = useState(null);
  const [diffDetails, setDiffDetails] = useState([]);

  const label = "changes";

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
    <DiffContext.Provider value={contextValue}>
      <div className={className + " flex h-100"}>
        <div className="col-25">
          {multiCtx.currentRepo?.diffs.length > 0 && (
            <>
              {stashing ? (
                <NewStash className="mb-3" />
              ) : (
                <Commit className="mb-3" />
              )}
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
            </>
          )}

          <div>
            {stagedDiffs.map((item) => (
              <DiffItem key={uuidv4()} item={item} />
            ))}
            {stagedDiffs.length > 0 && (
              <div className="between my-2">
                <div></div>
                <span
                  onClick={() => multiCtx.unstageAll()}
                  className="px-1 red"
                  style={{ fontSize: ".7rem", cursor: "pointer" }}>
                  <Icon className="me-1" name="dash-lg" />
                  Unstage All
                </span>
              </div>
            )}

            {unstagedDiffs.map((item) => (
              <DiffItem key={uuidv4()} item={item} />
            ))}
            {unstagedDiffs.length > 0 && (
              <div className="between my-2">
                <div></div>
                <span
                  onClick={() => multiCtx.stageAll()}
                  className="px-1 green"
                  style={{ fontSize: ".7rem", cursor: "pointer" }}>
                  <Icon className="me-1" name="plus-lg" />
                  Stage All
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="divider"></div>
        <div className="col-50 d-flex">
          {selectedDiff ? (
            <div className="px-5 diff-content">
              {diffDetails.map((x) => (
                <div className="pb-4">
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
            <div className="muted-text">None</div>
          )}
        </div>
        <div className="divider"></div>
        <div className="col-25">
          <Stashes />
          <Ignored />
        </div>
      </div>
    </DiffContext.Provider>
  );
}
