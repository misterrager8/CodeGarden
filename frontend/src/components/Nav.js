import { useContext, useEffect, useState } from "react";
import Button from "./atoms/Button";
import { MultiContext } from "../Context";
import Dropdown from "./atoms/Dropdown";
import Spinner from "./atoms/Spinner";
import RepoItem from "./items/RepoItem";
import Icon from "./atoms/Icon";

export default function Nav() {
  const {
    currentRepo,
    setCurrentRepo,
    setCurrentPage,
    currentPage,
    getRepo,
    getRepos,
    loading,
    repos,
    push,
    pull,
    theme,
    setTheme,
    exportRepo,
    deleteRepo,
    showSettings,
    setShowSettings,
  } = useContext(MultiContext);

  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

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
    getRepos();
  }, []);

  const copyPath = () => {
    navigator.clipboard.writeText(currentRepo.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    localStorage.setItem("garden-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="nav-custom between flex">
      <div className="flex">
        <button
          onClick={() => {
            setCurrentRepo(null);
            setShowSettings(false);
          }}
          className="btn border-0">
          {loading ? (
            <Spinner className="me-2" />
          ) : (
            <Icon name="bi:flower2" className="me-2" />
          )}
          <span>code-garden</span>
        </button>
        {currentRepo && (
          <Button
            onClick={() => getRepo(currentRepo?.name)}
            icon="bi:arrow-clockwise"
          />
        )}
        <Dropdown text={currentRepo?.name} icon="bi:git" target="repos">
          {repos.map((x) => (
            <RepoItem item={x} />
          ))}
        </Dropdown>

        {currentRepo && (
          <>
            <div className="divider"></div>
            <Button
              active={currentPage === "branches"}
              onClick={() => setCurrentPage("branches")}
              icon="bi:bezier2"
              text={currentRepo?.current_branch?.name}
            />
            <Button
              className={currentRepo?.diffs.length > 0 ? "orange" : ""}
              active={currentPage === "changes"}
              onClick={() => setCurrentPage("changes")}
              icon="bi:pencil"
              text={
                "Changes" +
                (currentRepo?.diffs.length > 0
                  ? ` (${currentRepo?.diffs.length})`
                  : "")
              }
            />
            <Button
              text="History"
              active={currentPage === "history"}
              onClick={() => setCurrentPage("history")}
              icon="bi:clock"
            />
            <Button
              className={
                currentRepo?.todos.filter((x) => x.status !== "completed")
                  .length > 0
                  ? "orange"
                  : ""
              }
              active={currentPage === "kanban"}
              onClick={() => setCurrentPage("kanban")}
              icon="bi:check-lg"
              text={
                "TODOs" +
                (currentRepo?.todos.filter((x) => x.status !== "completed")
                  .length > 0
                  ? ` (${
                      currentRepo?.todos.filter((x) => x.status !== "completed")
                        .length
                    })`
                  : "")
              }
            />
            <Button
              text="README"
              active={currentPage === "readme"}
              onClick={() => setCurrentPage("readme")}
              icon="bi:book"
            />
          </>
        )}
      </div>
      <div className="flex">
        {currentRepo && (
          <>
            <Button text="Push" onClick={() => push()} icon="bi:caret-up" />
            <Button text="Pull" onClick={() => pull()} icon="bi:caret-down" />
            <Dropdown showCaret={false} icon="bi:three-dots" autoClose="false">
              <a
                className="dropdown-item"
                onClick={() => {
                  exportRepo();
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
                href={currentRepo?.remote_url}>
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
                  onClick={() => deleteRepo()}>
                  Delete
                  <Icon name="fluent:question-32-filled" className="ms-2" />
                </a>
              )}
            </Dropdown>
            <div className="divider"></div>
          </>
        )}
        <a
          target="_blank"
          href="https://github.com/misterrager8/CodeGarden"
          className="btn border-0">
          <Icon name="bi:info-circle" />
        </a>
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          icon={"bi:" + (theme === "light" ? "moon" : "sun") + "-fill"}
        />
        <Button
          active={!currentRepo && showSettings}
          icon="bi:gear"
          onClick={() => {
            setCurrentRepo(null);
            setShowSettings(true);
          }}
        />
      </div>
    </div>
  );
}
