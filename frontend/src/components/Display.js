import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../Context";
import Nav from "./Nav";
import Changes from "./pages/Changes";
import Kanban from "./pages/Kanban";
import History from "./pages/History";
import Readme from "./pages/Readme";
import Branches from "./pages/Branches";
import Icon from "./atoms/Icon";
import NewRepo from "./forms/NewRepo";
import Dropdown from "./atoms/Dropdown";
import Button from "./atoms/Button";
import Input from "./atoms/Input";
import { api } from "../util";

export default function Display({ className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [theme, setTheme] = useState(localStorage.getItem("garden-theme"));
  const [settings, setSettings] = useState(null);

  const getSettings = () => {
    api("settings", {}, (data) => setSettings(data));
  };

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
      value: "branches",
      component: <Branches />,
    },
  ];

  const themes = [
    "light",
    "orchard",
    "green-tea",
    "summer-blue",
    "sunrise",
    "dark",
    "cranberry",
    "pine",
    "winterfresh",
    "coffee",
    "pumpkin",
  ];

  useEffect(() => {
    localStorage.setItem("garden-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    getSettings();
  }, []);

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
          <div className="inner flex">
            {multiCtx.showSettings ? (
              <>
                <div className="mx-auto">
                  <Button
                    text="Repositories"
                    icon="chevron-left"
                    onClick={() => {
                      multiCtx.setShowSettings(false);
                    }}
                  />
                  <div className="my-3 p-2">
                    <Icon name="paint-bucket" className="me-2" /> UI Theme
                  </div>
                  <div className="">
                    {themes.map((x) => (
                      <Button
                        text={x}
                        className={
                          "text-capitalize" + (theme === x ? " active" : "")
                        }
                        onClick={() => setTheme(x)}
                      />
                    ))}
                  </div>
                  <div className="my-3 p-2">
                    <Icon name="house-fill" className="me-2" />
                    Home Directory
                  </div>
                  <Input disabled={true} value={settings?.home_dir} />

                  <div className="my-3 p-2">
                    <Icon name="paint-bucket" className="me-2" />
                    Port #
                  </div>
                  <Input disabled={true} value={settings?.port} />
                </div>
              </>
            ) : (
              <>
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
                        <div className="col-4 text-truncate">{item.name}</div>
                        <div className="col d-flex text-truncate">
                          <Icon name="clock" />
                          <div className="ms-2 text-truncate">
                            {item.log?.[0]?.timestamp}
                          </div>
                        </div>
                        <div className="col d-flex text-truncate">
                          <Icon name="bezier2" />
                          <div className="ms-2 text-truncate">
                            {item.current_branch.name}
                          </div>
                        </div>
                        <div className="col">
                          {item.diffs.length > 0 && (
                            <span className="ps-2 orange">
                              <i className="me-1 bi bi-record-fill"></i>
                              {item.diffs.length}
                            </span>
                          )}
                          {item.todos.filter(
                            (todo) => todo.status !== "completed",
                          ).length > 0 && (
                            <span className="ps-2 orange">
                              <i className="me-1 bi bi-check-all"></i>
                              {
                                item.todos.filter(
                                  (todo) => todo.status !== "completed",
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
