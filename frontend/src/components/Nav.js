import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { MultiContext } from "../Context";
import Dropdown from "./atoms/Dropdown";
import Spinner from "./atoms/Spinner";
import RepoItem from "./items/RepoItem";
import Icon from "./atoms/Icon";

export default function Nav({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("garden-theme"));

  const themes = [
    "light",
    "ocean-eggplant",
    "ketchup-blueberry",
    "ketchup-butter",
    "eggplant-regal",
    "ocean-emerald",
    "carrot-firetruck",
    "pumpkin-sunset",
    "concord-ocean",
    "raven-evergreen",
    "tangy-sky",
    "dark",
    "ruby-tulip",
    "eggplant-concord",
    "marigold-sapphire",
    "tulip-aqua",
    "pineapple-plum",
    "sunrise-strawberry",
    "corn-denim",
    "lavender-denim",
    "moss-sapphire",
    "ice-emerald",
  ];

  useEffect(() => {
    multiCtx.getRepos();
  }, []);

  const copyPath = () => {
    navigator.clipboard.writeText(multiCtx.currentRepo.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    localStorage.setItem("garden-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
                icon="bi:flower2"
              />
            )}
            {multiCtx.currentRepo && (
              <Button
                onClick={() => multiCtx.getRepo(multiCtx.currentRepo?.name)}
                icon="icon-park-outline:refresh"
              />
            )}
            <Dropdown
              classNameBtn="abbreviate"
              active={multiCtx.currentRepo}
              showCaret={false}
              text={multiCtx.currentRepo?.name || "Select Repo"}
              icon="bi:git">
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
                icon="famicons:git-branch-sharp"
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
                icon="material-symbols-light:change-history-rounded"
                text={`Changes (${multiCtx.currentRepo?.diffs.length.toString()})`}
              />
              <Button
                className="abbreviate"
                text="History"
                active={multiCtx.currentPage === "history"}
                onClick={() => multiCtx.setCurrentPage("history")}
                icon="mingcute:history-fill"
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
                icon="mdi:check-bold"
                text={`TODOs (${multiCtx.currentRepo?.todos
                  .filter((todo) => todo.status !== "completed")
                  .length.toString()})`}
              />
              <Button
                className="abbreviate"
                text="README"
                active={multiCtx.currentPage === "readme"}
                onClick={() => multiCtx.setCurrentPage("readme")}
                icon="la:readme"
              />
              <div className="divider"></div>
              <Button
                className="abbreviate"
                text="Push"
                onClick={() => multiCtx.push()}
                icon="game-icons:push"
              />
              <Button
                className="abbreviate"
                text="Pull"
                onClick={() => multiCtx.pull()}
                icon="game-icons:pull"
              />
            </div>
          )}
        </div>
        <div className="flex">
          {multiCtx.currentRepo && (
            <Dropdown
              showCaret={false}
              icon="grommet-icons:more"
              autoClose="false">
              <a
                className="dropdown-item"
                onClick={() => {
                  multiCtx.exportRepo();
                  setExported(true);
                  setTimeout(() => setExported(false), 1500);
                }}>
                <Icon
                  className="me-2"
                  name={!exported ? "solar:export-bold" : "mdi:check-bold"}
                />
                <span>Export Todos</span>
              </a>
              <a className="dropdown-item" onClick={() => copyPath()}>
                <Icon
                  name={copied ? "mdi:check-bold" : "solar:clipboard-linear"}
                  className="me-2"
                />
                <span>Copy Path</span>
              </a>
              <a
                target="_blank"
                className="dropdown-item"
                href={multiCtx.currentRepo?.remote_url}>
                <Icon name="jam:github" className="me-2" />
                <span>View GitHub</span>
              </a>
              <a
                className="dropdown-item red"
                onClick={() => setDeleting(!deleting)}>
                <Icon name="iwwa:delete" className="me-2" />
                <span>Delete Repo</span>
              </a>
              {deleting && (
                <a
                  className="dropdown-item red text-center"
                  onClick={() => multiCtx.deleteRepo()}>
                  Delete
                  <Icon name="fluent:question-32-filled" className="ms-2" />
                </a>
              )}
            </Dropdown>
          )}
          <div className="divider"></div>
          <a
            target="_blank"
            href="https://github.com/misterrager8/CodeGarden"
            className="btn btn-sm border-0">
            <Icon name="ep:info-filled" />
          </a>
          <Dropdown
            classNameBtn="abbreviate"
            showCaret={false}
            icon="oui:color">
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
          <Button
            active={!multiCtx.currentRepo && multiCtx.showSettings}
            icon="ic:round-settings"
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
