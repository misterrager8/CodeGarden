import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { MultiContext } from "../Context";
import Dropdown from "./atoms/Dropdown";
import Spinner from "./atoms/Spinner";
import RepoItem from "./items/RepoItem";

export default function Nav({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    multiCtx.getRepos();
  }, []);

  const copyPath = () => {
    navigator.clipboard.writeText(multiCtx.currentRepo.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={className + " nav-custom"}>
      <div className="between m-auto w-100 h-100">
        <div className="flex">
          <div className="flex">
            {multiCtx.loading ? (
              <div className="m-auto p-1">
                <Spinner />
              </div>
            ) : (
              <Button
                className="abbreviate"
                onClick={() => {
                  multiCtx.setCurrentRepo(null);
                  multiCtx.setShowSettings(false);
                }}
                text="code-garden"
                icon="flower2"
              />
            )}
            {multiCtx.currentRepo && (
              <Button
                onClick={() => multiCtx.getRepo(multiCtx.currentRepo?.name)}
                icon="arrow-clockwise"
              />
            )}
            <Dropdown
              classNameBtn="abbreviate"
              active={multiCtx.currentRepo}
              showCaret={false}
              text={multiCtx.currentRepo?.name || "Select Repo"}
              icon="git">
              {multiCtx.repos.map((repo) => (
                <RepoItem item={repo} />
              ))}
            </Dropdown>
          </div>
          <div className="divider"></div>
          {multiCtx.currentRepo && (
            <div className="flex">
              <Button
                className="abbreviate"
                active={multiCtx.currentPage === "branches"}
                onClick={() => multiCtx.setCurrentPage("branches")}
                icon="bezier2"
                text={multiCtx.currentRepo?.current_branch?.name}
              />
              <Button
                className={
                  "abbreviate " +
                  (multiCtx.currentRepo?.diffs.length > 0 ? "orange" : "")
                }
                active={multiCtx.currentPage === "changes"}
                onClick={() => {
                  multiCtx.setCurrentPage("changes");
                  multiCtx.getRepo(multiCtx.currentRepo?.name);
                }}
                icon="pencil"
                text={`Changes (${multiCtx.currentRepo?.diffs.length.toString()})`}
              />
              <Button
                className="abbreviate"
                text="History"
                active={multiCtx.currentPage === "history"}
                onClick={() => multiCtx.setCurrentPage("history")}
                icon="clock-history"
              />
              <Button
                className={
                  "abbreviate " +
                  (multiCtx.currentRepo?.todos.filter(
                    (todo) => todo.status !== "completed",
                  ).length > 0
                    ? "orange"
                    : "")
                }
                active={multiCtx.currentPage === "kanban"}
                onClick={() => multiCtx.setCurrentPage("kanban")}
                icon="check-all"
                text={`TODOs (${multiCtx.currentRepo?.todos
                  .filter((todo) => todo.status !== "completed")
                  .length.toString()})`}
              />
              <Button
                className="abbreviate"
                text="README"
                active={multiCtx.currentPage === "readme"}
                onClick={() => multiCtx.setCurrentPage("readme")}
                icon="book"
              />
              <div className="divider"></div>
              <Button
                className="abbreviate"
                text="Push"
                onClick={() => multiCtx.push()}
                icon="arrow-up"
              />
              <Button
                className="abbreviate"
                text="Pull"
                onClick={() => multiCtx.pull()}
                icon="arrow-down"
              />
            </div>
          )}
        </div>
        <div className="flex">
          {multiCtx.currentRepo && (
            <Dropdown classNameMenu="" icon="three-dots" autoClose="false">
              <a
                className="dropdown-item"
                onClick={() => {
                  multiCtx.exportRepo();
                  setExported(true);
                  setTimeout(() => setExported(false), 1500);
                }}>
                <i
                  className={
                    "me-2 bi bi-" + (!exported ? "save2" : "check-lg")
                  }></i>
                <span>Export Todos</span>
              </a>
              <a className="dropdown-item" onClick={() => copyPath()}>
                <i
                  className={
                    "me-2 bi bi-" + (copied ? "check-lg" : "clipboard")
                  }></i>
                <span>Copy Path</span>
              </a>
              <a
                target="_blank"
                className="dropdown-item"
                href={multiCtx.currentRepo?.remote_url}>
                <i className="me-2 bi bi-github"></i>
                <span>View GitHub</span>
              </a>
              <a
                className="dropdown-item red"
                onClick={() => setDeleting(!deleting)}>
                <i className="me-2 bi bi-trash2"></i>
                <span>Delete Repo</span>
              </a>
              {deleting && (
                <a
                  className="dropdown-item red text-center"
                  onClick={() => multiCtx.deleteRepo()}>
                  Delete
                  <i className="ms-2 bi bi-question-lg"></i>
                </a>
              )}
            </Dropdown>
          )}
          <div className="divider"></div>
          <a
            target="_blank"
            href="https://github.com/misterrager8/CodeGarden"
            className="btn btn-sm border-0">
            <i className="bi bi-info-circle" />
          </a>
          <Button
            active={!multiCtx.currentRepo && multiCtx.showSettings}
            icon="gear-fill"
            onClick={() => {
              multiCtx.setCurrentRepo(null);
              multiCtx.setShowSettings(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
