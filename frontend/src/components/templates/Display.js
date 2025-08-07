import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import { MultiContext } from "../../MultiContext";
import Changes from "./Changes";
import History from "./History";
import Todos from "./Todos";
import Ignored from "./Ignored";
import Stashes from "./Stashes";
import Readme from "./Readme";
import Branches from "./Branches";
import Repos from "./Repos";
import Spinner from "../atoms/Spinner";
import Icon from "../atoms/Icon";

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [expandNav, setExpandNav] = useState(false);
  const [repositories, setRepositories] = useState([]);

  const [theme, setTheme] = useState(
    localStorage.getItem("code-garden") || "light"
  );

  useEffect(() => {
    localStorage.setItem("code-garden", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const pages = [
    {
      name: "changes",
      icon: "pencil",
      text: "Changes",
      component: <Changes />,
    },
    {
      name: "history",
      icon: "clock-history",
      text: "History",
      component: <History />,
    },
    {
      name: "todos",
      icon: "check-all",
      text: "TODOs",
      component: <Todos />,
    },
    {
      name: "ignored",
      icon: "eye-slash",
      text: "Ignored",
      component: <Ignored />,
    },
    {
      name: "stashes",
      icon: "archive",
      text: "Stashes",
      component: <Stashes />,
    },
    {
      name: "readme",
      icon: "book",
      text: "README",
      component: <Readme />,
    },
    {
      name: "branches",
      icon: "bezier",
      text: "Branches",
      component: <Branches />,
    },
    {
      name: "repositories",
      icon: "git",
      text: "All Repos",
      component: <Repos />,
    },
  ];

  return (
    <div className="p-4">
      {multiCtx.currentPage !== "repositories" && (
        <div className="between mb-3">
          <div className="d-flex non-btn">
            <Icon name="git" className="me-2" />
            <div>{multiCtx.currentRepo?.name}</div>
          </div>
          <div className="text-capitalize d-flex non-btn">
            <Icon name="circle" className="me-2" />
            <div>{multiCtx.currentPage}</div>
          </div>
          <div className="d-flex non-btn">
            <Icon name="bezier2" className="me-2" />
            <div>{multiCtx.currentRepo?.current_branch.name}</div>
          </div>
        </div>
      )}
      <div className={"nav-custom" + (expandNav ? " show" : "")}>
        {multiCtx.loading ? (
          <Spinner />
        ) : (
          <Button
            active={expandNav}
            text={expandNav ? "code-garden" : null}
            // onClick={() => setExpandNav(!expandNav)}
            className="nav-toggle w-100"
            size={"sm"}
            icon="flower2"
            border={false}
          />
        )}
        <hr className="my-2" />

        <div className="">
          {multiCtx.currentRepo && (
            <>
              <Button
                active={multiCtx.currentPage === "changes"}
                onClick={() => multiCtx.setCurrentPage("changes")}
                size="sm"
                border={false}
                icon="pencil"
                className={
                  "w-100 my-2" +
                  (multiCtx.currentRepo.diffs.length > 0 ? " orange" : "")
                }
                text={
                  (expandNav ? "Changes" : "") +
                  (multiCtx.currentRepo.diffs.length > 0
                    ? multiCtx.currentRepo.diffs.length
                    : "")
                }
              />
              <Button
                active={multiCtx.currentPage === "history"}
                onClick={() => multiCtx.setCurrentPage("history")}
                size="sm"
                border={false}
                icon="clock-history"
                className="w-100 my-2"
                text={expandNav ? "History" : ""}
              />
              <Button
                active={multiCtx.currentPage === "todos"}
                onClick={() => multiCtx.setCurrentPage("todos")}
                size="sm"
                border={false}
                icon="check-all"
                className={
                  "w-100 my-2" +
                  (multiCtx.currentRepo.todos.filter((x) => !x.done).length > 0
                    ? " orange"
                    : "")
                }
                text={
                  (expandNav ? "TODOs" : "") +
                  (multiCtx.currentRepo.todos.filter((x) => !x.done).length > 0
                    ? multiCtx.currentRepo.todos.filter((x) => !x.done).length
                    : "")
                }
              />
              <Button
                active={multiCtx.currentPage === "ignored"}
                onClick={() => multiCtx.setCurrentPage("ignored")}
                size="sm"
                border={false}
                icon="eye-slash"
                className="w-100 my-2"
                text={expandNav ? "Ignored" : ""}
              />
              <Button
                active={multiCtx.currentPage === "stashes"}
                onClick={() => multiCtx.setCurrentPage("stashes")}
                size="sm"
                border={false}
                icon="archive"
                className="w-100 my-2"
                text={
                  (expandNav ? "Stashes" : "") +
                  (multiCtx.currentRepo.stashes.length > 0
                    ? multiCtx.currentRepo.stashes.length
                    : "")
                }
              />
              <Button
                active={multiCtx.currentPage === "readme"}
                onClick={() => multiCtx.setCurrentPage("readme")}
                size="sm"
                border={false}
                icon="book"
                className="w-100 my-2"
                text={expandNav ? "README" : ""}
              />
              <Button
                active={multiCtx.currentPage === "branches"}
                onClick={() => multiCtx.setCurrentPage("branches")}
                size="sm"
                border={false}
                icon="bezier"
                className="w-100 my-2"
                text={
                  (expandNav ? "Branches" : "") +
                  (multiCtx.currentRepo.branches.length > 0
                    ? multiCtx.currentRepo.branches.length
                    : "")
                }
              />
            </>
          )}
          <Button
            active={multiCtx.currentPage === "repositories"}
            onClick={() => multiCtx.setCurrentPage("repositories")}
            size="sm"
            border={false}
            icon="git"
            className="w-100 my-2"
            text={expandNav ? "All Repos" : ""}
          />
        </div>

        <div className="bottom">
          <Button
            text={expandNav ? theme : null}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            size={"sm"}
            className=" text-capitalize w-100"
            icon={theme === "light" ? "sun-fill" : "moon-fill"}
            border={false}
          />
        </div>
      </div>

      <div className="">
        {pages.find((x) => x.name === multiCtx.currentPage)?.component}
      </div>
    </div>
  );
}
