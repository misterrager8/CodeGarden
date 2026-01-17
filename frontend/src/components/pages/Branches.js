import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../Context";
import BranchItem from "../items/BranchItem";
import ButtonGroup from "../atoms/ButtonGroup";
import Button from "../atoms/Button";
import { api } from "../../util";
import NewBranch from "../forms/NewBranch";

export const BranchContext = createContext();

export default function Branches({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [comparison, setComparison] = useState(null);

  const [merging, setMerging] = useState(false);
  const [deleteHead, setDeleteHead] = useState(false);
  const [mergeMsg, setMergeMsg] = useState("");
  const onChangeMergeMsg = (e) => setMergeMsg(e.target.value);

  const [sort, setSort] = useState("newest");

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Name", value: "name" },
  ];

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
    comparison && sortCommits();
  }, [sort, comparison, multiCtx.currentRepo]);

  const sortCommits = () => {
    let msg = "";
    let comparison_;
    if (sort === "newest") {
      comparison_ = comparison.sort(
        (x, y) => new Date(y.iso_timestamp) - new Date(x.iso_timestamp)
      );
    } else if (sort === "oldest") {
      comparison_ = comparison.sort(
        (x, y) => new Date(x.iso_timestamp) - new Date(y.iso_timestamp)
      );
    } else {
      comparison_ = comparison.map((x) => x.name).sort();
    }

    for (let x = 0; x < comparison.length; x++) {
      msg += `- ${
        ["newest", "oldest"].includes(sort)
          ? comparison_[x].name
          : comparison_[x]
      }\n`;
    }
    setMergeMsg(msg);
  };

  const contextValue = {
    selectedBranch: selectedBranch,
    setSelectedBranch: setSelectedBranch,
  };

  return (
    <div className={className + " h-100"}>
      <BranchContext.Provider value={contextValue}>
        <div className="flex h-100">
          <div className="col-25">
            <NewBranch className="mb-3" />
            {multiCtx.currentRepo.branches.map((branch) => (
              <>
                {`* ${multiCtx.currentRepo.current_branch.name}` !==
                  branch.name && <BranchItem item={branch} />}
              </>
            ))}
          </div>
          <div className="divider"></div>
          <div className="col-75">
            {selectedBranch && (
              <div className="selected-branch">
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
                <div className="flex w-100 mb-3">
                  <div>
                    <Button
                      icon="sign-intersection-y-fill"
                      active={merging}
                      onClick={() => setMerging(!merging)}
                      text="Squash + Merge"
                    />
                    {merging && (
                      <>
                        <Button
                          icon="filter-right"
                          className="non-btn"
                          text="Sort By"
                        />
                        {sortOptions.map((x) => (
                          <Button
                            active={x.value === sort}
                            onClick={() => setSort(x.value)}
                            text={x.label}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  {merging && (
                    <div>
                      <Button
                        active={deleteHead}
                        className="red"
                        icon={deleteHead ? "check-circle-fill" : "circle"}
                        text={`Delete ${
                          multiCtx.currentRepo.current_branch?.name
                        }${!deleteHead ? "?" : ""}`}
                        onClick={() => setDeleteHead(!deleteHead)}
                      />
                      <Button
                        className="green"
                        icon="chevron-double-right"
                        text="Confirm Merge"
                        border={false}
                        onClick={() => merge()}
                      />
                    </div>
                  )}
                </div>
                {!merging ? (
                  <div>
                    {comparison?.map((x) => (
                      <div className="comparison-item">
                        <div className="between w-100">
                          <div className="d-flex text-truncate">
                            <div className="small me-2 my-auto">
                              {x.abbrev_hash}
                            </div>
                            <div title={x.name} className="text-truncate">
                              {x.name}
                            </div>
                          </div>
                          <div className="small my-auto text-truncate">
                            {x.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    style={{ fontSize: ".875rem", fontFamily: "monospace" }}
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
    </div>
  );
}
