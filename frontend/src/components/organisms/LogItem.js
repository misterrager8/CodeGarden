import { useContext } from "react";
import { MultiContext } from "../../MultiContext";
import Button from "../atoms/Button";
import { undoCommit } from "../../hooks";

export default function LogItem({ item, id, className = "" }) {
  const multiCtx = useContext(MultiContext);

  return (
    <div className={className + " py-2"}>
      <div>
        <div className="between mb-1">
          <div className="fw-bold text-truncate">
            {id === 0 && (
              <Button
                icon="rewind-fill"
                className="border-0 me-1"
                size="sm"
                onClick={() =>
                  undoCommit(multiCtx.currentRepo.name, (data) => {
                    multiCtx.setCurrentRepo(data.repo);
                    multiCtx.setRepos(data.repos);
                  })
                }
              />
            )}
            <span title={item.name}>{item.name}</span>
          </div>
          <span className="small font-monospace">{item.abbrev_hash}</span>
        </div>
        <div className="between small fw-light">
          <span>{item.timestamp}</span>
          <span>{item.author}</span>
        </div>
      </div>
    </div>
  );
}
