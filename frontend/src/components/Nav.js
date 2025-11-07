import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { MultiContext } from "../Context";
import Dropdown from "./atoms/Dropdown";
import Spinner from "./atoms/Spinner";
import RepoItem from "./items/RepoItem";
import NewRepo from "./forms/NewRepo";

export default function Nav({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [theme, setTheme] = useState(localStorage.getItem("garden-theme"));
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const themes = [
    "light",
    "cotton-candy",
    "manila",
    "lavender",
    "dark",
    "coffee",
    "forest",
    "orchid",
  ];

  useEffect(() => {
    localStorage.setItem("garden-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
                onClick={() => multiCtx.setCurrentRepo(null)}
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
              <div className="px-3 mb-1">
                <NewRepo />
              </div>
              {multiCtx.repos.map((repo) => (
                <RepoItem item={repo} />
              ))}
            </Dropdown>
          </div>
          <div className="divider"></div>
          {multiCtx.currentRepo && (
            <div className="flex">
              <Button
                className={
                  multiCtx.currentRepo?.diffs.length > 0 ? "orange" : ""
                }
                active={multiCtx.currentPage === "changes"}
                onClick={() => multiCtx.setCurrentPage("changes")}
                icon="pencil"
                text={multiCtx.currentRepo?.diffs.length.toString()}
              />
              <Button
                className={
                  multiCtx.currentRepo?.todos.filter(
                    (todo) => todo.status !== "completed"
                  ).length > 0
                    ? "orange"
                    : ""
                }
                active={multiCtx.currentPage === "kanban"}
                onClick={() => multiCtx.setCurrentPage("kanban")}
                icon="check-all"
                text={multiCtx.currentRepo?.todos
                  .filter((todo) => todo.status !== "completed")
                  .length.toString()}
              />
              <Button
                active={multiCtx.currentPage === "history"}
                onClick={() => multiCtx.setCurrentPage("history")}
                icon="clock-history"
              />

              <Button
                active={multiCtx.currentPage === "readme"}
                onClick={() => multiCtx.setCurrentPage("readme")}
                icon="book"
              />
              <Button
                active={multiCtx.currentPage === "stashes"}
                onClick={() => multiCtx.setCurrentPage("stashes")}
                icon="archive"
              />
              <Button
                active={multiCtx.currentPage === "ignored"}
                onClick={() => multiCtx.setCurrentPage("ignored")}
                icon="eye-slash-fill"
              />
              <div className="divider"></div>
              <Button
                className="abbreviate"
                active={multiCtx.currentPage === "branches"}
                onClick={() => multiCtx.setCurrentPage("branches")}
                icon="bezier2"
                text={multiCtx.currentRepo?.current_branch?.name}
              />
              <Button onClick={() => multiCtx.push()} icon="arrow-up" />
              <Button onClick={() => multiCtx.pull()} icon="arrow-down" />
            </div>
          )}
        </div>
        <div className="flex">
          {multiCtx.currentRepo && (
            <>
              <Button
                onClick={() => {
                  multiCtx.exportRepo();
                  setExported(true);
                  setTimeout(() => setExported(false), 1500);
                }}
                icon={!exported ? "save2" : "check-lg"}
              />
              <Button
                onClick={() => copyPath()}
                icon={copied ? "check-lg" : "clipboard"}
              />
              <a
                href={multiCtx.currentRepo?.remote_url}
                className="btn btn-sm border-0"
                target="_blank">
                <i className="bi bi-github"></i>
              </a>
              {deleting && (
                <Button
                  className="red"
                  onClick={() => multiCtx.deleteRepo()}
                  icon="question-lg"
                />
              )}
              <Button
                className="red"
                onClick={() => setDeleting(!deleting)}
                icon="trash2"
              />
            </>
          )}
          <div className="divider"></div>
          <a
            target="_blank"
            href="https://github.com/misterrager8/CodeGarden"
            className="btn btn-sm border-0">
            <i className="bi bi-info-circle" />
          </a>
          <Dropdown
            classNameBtn="abbreviate"
            showCaret={false}
            icon="paint-bucket">
            {themes.map((x) => (
              <a
                className={
                  "dropdown-item text-capitalize text-center" +
                  (theme === x ? " active" : "")
                }
                onClick={() => setTheme(x)}>
                {x}
              </a>
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
