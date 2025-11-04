import { useState, useEffect, useContext } from "react";
import Button from "../atoms/Button";
import { MultiContext } from "../../MultiContext";
import Dropdown from "../molecules/Dropdown";
import Spinner from "../atoms/Spinner";
import Icon from "../atoms/Icon";
import NewRepo from "./forms/NewRepo";

import { v4 as uuidv4 } from "uuid";
import { SectionContext } from "../templates/Display";

export default function Nav({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const sxnCtx = useContext(SectionContext);
  const [deleting, setDeleting] = useState(false);

  const [exported, setExported] = useState(false);
  const [copied, setCopied] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("code-garden-theme") || "light"
  );

  const copyPath = () => {
    navigator.clipboard.writeText(multiCtx.currentRepo.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    localStorage.setItem("code-garden-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    multiCtx.getRepos();
  }, []);

  const themes = ["light", "dark", "eggshell", "pine", "ocean"];

  return (
    <div className={className + " nav-custom"}>
      <div className="my-auto between w-100">
        <div className="d-flex">
          <Button
            className="me-1"
            onClick={() => multiCtx.setCurrentRepo(null)}
            border={false}
            icon="flower2"
          />
          {multiCtx.loading && (
            <button className="btn btn-sm non-btn">
              <Spinner />
            </button>
          )}
          <Button
            className="mx-1"
            onClick={() => multiCtx.getRepo(multiCtx.currentRepo?.name)}
            icon="arrow-clockwise"
            border={false}
          />

          <Dropdown
            classNameBtn="border-0 mx-1"
            target="repos"
            icon="git"
            text={
              multiCtx.currentRepo ? multiCtx.currentRepo.name : "Select Repo"
            }>
            <NewRepo className="p-2" />
            {multiCtx.repos?.map((x) => (
              <a
                key={uuidv4()}
                onClick={() => multiCtx.getRepo(x.name)}
                className={
                  "dropdown-item between" +
                  (multiCtx.currentRepo?.name === x.name ? " active" : "")
                }>
                <span>{x.name}</span>

                <div>
                  {x.diffs.length !== 0 && (
                    <span className="orange mx-1">
                      <Icon name="record-fill" className="" />
                      {x.diffs.length}
                    </span>
                  )}
                  {x.todos.filter((x) => x.status !== "completed").length !==
                    0 && (
                    <span className="green mx-1">
                      <Icon name="check-all" className="" />
                      {x.todos.filter((x) => x.status !== "completed").length}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </Dropdown>

          <div className="border-start mx-2"></div>

          {multiCtx.currentRepo && (
            <>
              <Button
                active={sxnCtx.currentSection === "changes"}
                onClick={() => sxnCtx.setCurrentSection("changes")}
                className={
                  "mx-1" +
                  (multiCtx.currentRepo.diffs.length > 0 ? " orange" : "")
                }
                border={false}
                text={
                  multiCtx.currentRepo.diffs.length > 0
                    ? multiCtx.currentRepo.diffs.length
                    : ""
                }
                icon="pencil"
              />
              <Button
                text={
                  multiCtx.currentRepo.todos.filter(
                    (x) => x.status !== "completed"
                  ).length > 0
                    ? multiCtx.currentRepo.todos.filter(
                        (x) => x.status !== "completed"
                      ).length
                    : ""
                }
                active={sxnCtx.currentSection === "todos"}
                onClick={() => sxnCtx.setCurrentSection("todos")}
                className={
                  "mx-1" +
                  (multiCtx.currentRepo.todos.filter(
                    (x) => x.status !== "completed"
                  ).length > 0
                    ? " orange"
                    : "")
                }
                border={false}
                icon="check-all"
              />
              <Button
                active={sxnCtx.currentSection === "history"}
                onClick={() => sxnCtx.setCurrentSection("history")}
                className="mx-1"
                border={false}
                icon="clock-history"
              />
              <Button
                active={sxnCtx.currentSection === "readme"}
                onClick={() => sxnCtx.setCurrentSection("readme")}
                className="mx-1"
                border={false}
                icon="book"
              />
              <Button
                active={sxnCtx.currentSection === "stashes"}
                onClick={() => sxnCtx.setCurrentSection("stashes")}
                className="mx-1"
                border={false}
                icon="archive"
                text={
                  multiCtx.currentRepo.stashes.length > 0
                    ? multiCtx.currentRepo.stashes.length
                    : ""
                }
              />
              <Button
                active={sxnCtx.currentSection === "ignored"}
                onClick={() => sxnCtx.setCurrentSection("ignored")}
                className="mx-1"
                border={false}
                icon="eye-slash-fill"
              />
            </>
          )}

          {multiCtx.currentRepo && (
            <>
              <div className="border-start mx-2"></div>
              <Button
                className="mx-1"
                active={sxnCtx.isCurrentSection("branches")}
                border={false}
                onClick={() => sxnCtx.setCurrentSection("branches")}
                text={multiCtx.currentRepo.current_branch.name}
                icon="bezier2"
              />
              <Button
                className="mx-1"
                border={false}
                icon="arrow-up"
                onClick={() => multiCtx.push()}
              />
              <Button
                className="mx-1"
                border={false}
                icon="arrow-down"
                onClick={() => multiCtx.pull()}
              />
            </>
          )}
        </div>
        <div className="d-flex">
          {multiCtx.currentRepo && (
            <>
              {multiCtx.currentRepo.remote_url && (
                <a
                  title="See GitHub page for this repo."
                  target="_blank"
                  href={multiCtx.currentRepo.remote_url}
                  className="btn btn-sm border-0 mx-1">
                  <Icon name="github" />
                </a>
              )}
              <Button
                className="mx-1"
                border={false}
                onClick={() => {
                  multiCtx.exportRepo();
                  setExported(true);
                  setTimeout(() => setExported(false), 1500);
                }}
                icon={!exported ? "save2" : "check-lg"}
              />
              <Button
                className="mx-1"
                border={false}
                icon={!copied ? "clipboard" : "check-lg"}
                onClick={() => copyPath()}
              />
              {deleting && (
                <Button
                  border={false}
                  onClick={() => multiCtx.deleteRepo()}
                  className="red mx-1"
                  icon="question-lg"
                />
              )}
              <Button
                border={false}
                onClick={() => setDeleting(!deleting)}
                className="red mx-1"
                icon="trash2"
              />
              <div className="border-start mx-2"></div>
            </>
          )}
          <a
            href="https://github.com/misterrager8/CodeGarden"
            target="_blank"
            className="btn btn-sm border-0 mx-1">
            <i className="bi bi-info-circle"></i>
          </a>
          <Dropdown
            classNameMenu="text-center"
            showCaret={false}
            classNameBtn="text-capitalize ms-1 border-0"
            icon="paint-bucket">
            {themes.map((x) => (
              <a
                onClick={() => setTheme(x)}
                className={
                  "text-capitalize dropdown-item" +
                  (theme === x ? " active" : "")
                }>
                {x}
              </a>
            ))}{" "}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
