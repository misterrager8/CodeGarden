import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { MultiContext } from "../../MultiContext";
import NewBranch from "../organisms/forms/NewBranch";
import BranchItem from "../organisms/items/BranchItem";

import { v4 as uuidv4 } from "uuid";
import Button from "../atoms/Button";
import { api } from "../../util";
import ButtonGroup from "../molecules/ButtonGroup";

export const BranchContext = createContext();

export default function Branches({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [comparison, setComparison] = useState(null);

  const [merging, setMerging] = useState(false);
  const [deleteHead, setDeleteHead] = useState(false);
  const [mergeMsg, setMergeMsg] = useState("");
  const onChangeMergeMsg = (e) => setMergeMsg(e.target.value);

  const merge = () => {
    multiCtx.setLoading(true);
    api(
      "merge_branch",
      {
        repository: multiCtx.currentRepo.name,
        parentBranch: selectedBranch.name,
        childBranch: multiCtx.currentRepo.current_branch.name,
        msg: mergeMsg,
        deleteHead: deleteHead,
      },
      (data) => {
        multiCtx.setCurrentRepo(data.repo);
        multiCtx.setLoading(false);
        setMerging(false);
        setSelectedBranch(null);
      }
    );
  };

  useEffect(() => {
    selectedBranch &&
      api(
        "compare_branches",
        {
          repository: multiCtx.currentRepo.name,
          baseBranch: selectedBranch.name,
          childBranch: multiCtx.currentRepo.current_branch.name,
        },
        (data) =>
          setComparison(multiCtx.currentRepo.log.slice(0, data.comparison))
      );
  }, [selectedBranch, multiCtx.currentRepo]);

  useEffect(() => {
    if (comparison) {
      let msg = "";
      for (let x = 0; x < comparison.length; x++) {
        msg += `- ${comparison[x].name}\n`;
      }
      setMergeMsg(msg);
    }
  }, [comparison, multiCtx.currentRepo]);

  const contextValue = {
    selectedBranch: selectedBranch,
    setSelectedBranch: setSelectedBranch,
  };

  return (
    <BranchContext.Provider value={contextValue}>
      <div className={className} style={{ height: "70vh" }}>
        <div className="row">
          <div className="col-3 border-end" style={{ height: "80vh" }}>
            <NewBranch className="my-3" />
            {multiCtx.currentRepo.branches.map((x) => (
              <Fragment key={uuidv4()}>
                {`* ${multiCtx.currentRepo.current_branch.name}` !== x.name && (
                  <BranchItem item={x} />
                )}
              </Fragment>
            ))}
          </div>
          {selectedBranch && (
            <div className="col-9 px-4">
              <div className="my-3">
                <span className="purple">
                  {multiCtx.currentRepo.current_branch?.name}
                </span>
                {" is "}
                <span className="purple">
                  {comparison?.length}{" "}
                  {`commit${comparison?.length > 1 ? "s" : ""}`}
                </span>
                {" ahead of "}
                <span className="purple">{selectedBranch?.name}.</span>
              </div>
              <div className="between mb-3">
                <ButtonGroup>
                  <Button
                    icon="sign-intersection-y-fill"
                    active={merging}
                    onClick={() => setMerging(!merging)}
                    text="Squash + Merge"
                  />
                  {merging && (
                    <Button
                      active={deleteHead}
                      className="red"
                      icon={deleteHead ? "check-circle-fill" : "circle"}
                      text={`Delete ${
                        multiCtx.currentRepo.current_branch?.name
                      }${!deleteHead ? "?" : ""}`}
                      onClick={() => setDeleteHead(!deleteHead)}
                    />
                  )}
                </ButtonGroup>
                {merging && (
                  <Button
                    className="green"
                    icon="chevron-double-right"
                    text="Confirm Merge"
                    border={false}
                    onClick={() => merge()}
                  />
                )}
              </div>
              {!merging ? (
                <div>
                  {comparison?.map((x) => (
                    <div className="between mb-1 border-bottom">
                      <div className="d-flex">
                        <div className="purple small py-1 me-2">
                          {x.abbrev_hash}
                        </div>
                        <div>{x.name}</div>
                      </div>
                      <div className="small py-1">{x.timestamp}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <textarea
                  onChange={onChangeMergeMsg}
                  rows={20}
                  className="form-control"
                  value={mergeMsg}></textarea>
              )}
            </div>
          )}
        </div>
      </div>
    </BranchContext.Provider>
  );
}
