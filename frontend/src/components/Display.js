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
  ];

  return (
    <div className={className}>
      <Nav />
      {multiCtx.currentRepo && (
        <>
          <div className="mini-top">
            <div className="fw-bold">{multiCtx.currentRepo?.name}</div>
            <div>
              <Icon name="bezier2" className="me-2" />
              {multiCtx.currentRepo?.current_branch.name}
            </div>
            <div className="d-flex">
              <div
                className={
                  "me-3 " +
                  (multiCtx.currentRepo?.todos.filter(
                    (todo) => todo.status !== "completed"
                  ).length > 0
                    ? "orange"
                    : "")
                }>
                <Icon name="check-all" className="me-2" />
                {
                  multiCtx.currentRepo?.todos.filter(
                    (todo) => todo.status !== "completed"
                  ).length
                }
              </div>
              <div
                className={
                  multiCtx.currentRepo?.diffs.length > 0 ? "orange" : ""
                }>
                <Icon name="pencil" className="me-2" />
                {multiCtx.currentRepo?.diffs.length}
              </div>
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
      )}
    </div>
  );
}
