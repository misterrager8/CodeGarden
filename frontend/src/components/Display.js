import { useContext } from "react";
import { MultiContext } from "../Context";
import Nav from "./Nav";
import Changes from "./pages/Changes";
import Kanban from "./pages/Kanban";
import History from "./pages/History";
import Readme from "./pages/Readme";
import Stashes from "./pages/Stashes";
import Ignored from "./pages/Ignored";
import Branches from "./pages/Branches";
import Icon from "./atoms/Icon";
import Files from "./pages/Files";
import RepoItem from "./items/RepoItem";
import NewRepo from "./forms/NewRepo";

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const pages = [
    {
      value: "changes",
      component: <Changes />,
    },
    {
      value: "kanban",
      component: <Kanban />,
    },
    {
      value: "history",
      component: <History />,
    },
    {
      value: "readme",
      component: <Readme />,
    },
    {
      value: "stashes",
      component: <Stashes />,
    },
    {
      value: "ignored",
      component: <Ignored />,
    },
    {
      value: "branches",
      component: <Branches />,
    },
    {
      value: "files",
      component: <Files />,
    },
  ];

  return (
    <div className={className}>
      <Nav />
      {multiCtx.currentRepo ? (
        <>
          <div className="mini-top">
            <div className="fw-bold">
              <Icon name="git" className="me-2" />
              {multiCtx.currentRepo?.name}
            </div>
            <div>
              <Icon name="bezier2" className="me-2" />
              {multiCtx.currentRepo?.current_branch.name}
            </div>
          </div>
          <div className="body d-flex">
            <div className="inner">
              {
                pages.find((page) => page.value === multiCtx.currentPage)
                  ?.component
              }
            </div>
          </div>
        </>
      ) : (
        <div className="body d-flex">
          <div className="inner d-flex">
            <div className="col-75">
              <div className="repo-items">
                {multiCtx.repos.map((item) => (
                  <a
                    onClick={() => multiCtx.getRepo(item.name)}
                    className={
                      "repo-item " +
                      (multiCtx.currentRepo?.name === item.name
                        ? " active"
                        : "")
                    }>
                    <div className="col">{item.name}</div>
                    <div className="col d-flex">
                      <Icon name="clock" />
                      <div className="ms-2">{item.log?.[0]?.timestamp}</div>
                    </div>
                    <div className="col d-flex">
                      <Icon name="bezier2" />
                      <div className="ms-2">{item.current_branch.name}</div>
                    </div>
                    <div className="col">
                      {item.diffs.length > 0 && (
                        <span className="ps-2 orange">
                          <i className="me-1 bi bi-record-fill"></i>
                          {item.diffs.length}
                        </span>
                      )}
                      {item.todos.filter((todo) => todo.status !== "completed")
                        .length > 0 && (
                        <span className="ps-2 orange">
                          <i className="me-1 bi bi-check-all"></i>
                          {
                            item.todos.filter(
                              (todo) => todo.status !== "completed"
                            ).length
                          }
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="divider"></div>
            <div className="col-25">
              <NewRepo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
