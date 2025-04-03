import { useState, useEffect, useContext } from "react";
import Button from "../atoms/Button";
import ButtonGroup from "../molecules/ButtonGroup";
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

  return (
    <div className={className + " between"}>
      <ButtonGroup>
        <Button
          onClick={() => multiCtx.setCurrentRepo(null)}
          text="code-garden"
          border={false}
          icon="flower2"
        />
        {multiCtx.loading && (
          <button className="btn btn-sm non-btn">
            <Spinner />
          </button>
        )}
        <Button
          onClick={() => multiCtx.getRepo(multiCtx.currentRepo?.name)}
          icon="arrow-clockwise"
          border={false}
        />

        <Dropdown
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
        {multiCtx.currentRepo && (
          <>
            <Button
              active={sxnCtx.isCurrentSection("branches")}
              border={false}
              onClick={() =>
                sxnCtx.setCurrentSection(
                  sxnCtx.isCurrentSection("branches") ? null : "branches"
                )
              }
              icon="bezier2">
              <span className="ms-2 small">Current Branch: </span>
              <span className="f">
                {multiCtx.currentRepo.current_branch.name}
              </span>
            </Button>
            <Button
              border={false}
              text="Push"
              icon="arrow-up"
              onClick={() => multiCtx.push()}
            />
            <Button
              border={false}
              text="Pull"
              icon="arrow-down"
              onClick={() => multiCtx.pull()}
            />
          </>
        )}
      </ButtonGroup>
      <div>
        {multiCtx.currentRepo && (
          <ButtonGroup className="me-3">
            {multiCtx.currentRepo.remote_url && (
              <a
                title="See GitHub page for this repo."
                target="_blank"
                href={multiCtx.currentRepo.remote_url}
                className="btn">
                <Icon name="github" className="me-2" />
                GitHub
              </a>
            )}
            <Button
              onClick={() => {
                multiCtx.exportRepo();
                setExported(true);
                setTimeout(() => setExported(false), 1500);
              }}
              text="Export"
              icon={!exported ? "save2" : "check-lg"}
            />
            <Button
              text="Copy Path"
              icon={!copied ? "clipboard" : "check-lg"}
              onClick={() => copyPath()}
            />
            <Button
              onClick={() => setDeleting(!deleting)}
              className="red"
              text="Delete Repo"
              icon="x-lg"
            />
            {deleting && (
              <Button
                onClick={() => multiCtx.deleteRepo()}
                className="red"
                icon="question-lg"
              />
            )}
          </ButtonGroup>
        )}
        <ButtonGroup>
          <Button
            active={sxnCtx.isCurrentSection("config")}
            onClick={() =>
              sxnCtx.setCurrentSection(
                sxnCtx.isCurrentSection("config") ? null : "config"
              )
            }
            icon="gear"
            text="Settings"
          />
          <a
            href="https://github.com/misterrager8/CodeGarden"
            target="_blank"
            className="btn btn-sm ">
            <i className="bi bi-info-circle me-2"></i>About
          </a>
          <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-capitalize"
            icon={(theme === "light" ? "sun" : "moon") + "-fill"}
          />
        </ButtonGroup>
      </div>
    </div>
  );
}
