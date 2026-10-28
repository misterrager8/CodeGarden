import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../Context";
import Nav from "./Nav";
import Changes from "./pages/Changes";
import Kanban from "./pages/Kanban";
import History from "./pages/History";
import Readme from "./pages/Readme";
import Branches from "./pages/Branches";
import { api } from "../util";
import { useHotkeys } from "react-hotkeys-hook";
import Icon from "./atoms/Icon";
import Input from "./atoms/Input";
import Button from "./atoms/Button";
import NewRepo from "./forms/NewRepo";

export default function Display() {
  const {
    theme,
    setTheme,
    currentRepo,
    currentPage,
    showSettings,
    setShowSettings,
    repos,
    getRepo,
  } = useContext(MultiContext);
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

  useHotkeys("meta+d", () => setTheme(theme === "light" ? "dark" : "light"), {
    preventDefault: true,
    enableOnFormTags: true,
  });

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="flex-mobile">
      <Nav />
      <div className="body">
        <div className="mini-top">
          <div className="fw-bold">
            <Icon name="bi:git" className="me-2" />
            {currentRepo?.name}
          </div>
          <div>
            <Icon name="bi:bezier2" className="me-2" />
            {currentRepo?.current_branch.name}
          </div>
        </div>
        {currentRepo ? (
          <>{pages.find((page) => page.value === currentPage)?.component}</>
        ) : (
          <>
            <div className="body d-flex">
              <div className="inner flex">
                {showSettings ? (
                  <>
                    <div className="mx-auto">
                      <Button
                        text="Repositories"
                        icon="lets-icons:back"
                        onClick={() => {
                          setShowSettings(false);
                        }}
                      />
                      <div className="my-3 p-2">
                        <Icon name="mdi:seed-outline" className="me-2" />
                        Home Directory
                      </div>
                      <Input disabled={true} value={settings?.home_dir} />
                      <div className="my-3 p-2">
                        <Icon
                          name="fluent:usb-port-20-filled"
                          className="me-2"
                        />
                        Port #
                      </div>
                      <Input disabled={true} value={settings?.port} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-75">
                      <div className="repo-items">
                        {repos.map((item) => (
                          <div
                            onClick={() => getRepo(item.name)}
                            className="repo-item">
                            <div className="fw-bold">{item.name}</div>
                            <div className="small">
                              {item.log?.[0]?.timestamp}
                            </div>
                            <div>
                              <Icon name="famicons:git-branch-sharp" />
                              <span className="ms-2">
                                {item.current_branch.name}
                              </span>
                            </div>
                            <div className="orange">
                              {item.diffs.length > 0 ? (
                                <>
                                  <Icon name="material-symbols-light:change-history-rounded" />
                                  <span className="ms-2">
                                    {item.diffs.length}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="orange">
                              {item.todos.filter(
                                (todo) => todo.status !== "completed",
                              ).length > 0 ? (
                                <>
                                  <Icon name="mdi:check-bold" />
                                  <span className="ms-2">
                                    {
                                      item.todos.filter(
                                        (todo) => todo.status !== "completed",
                                      ).length
                                    }
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
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
          </>
        )}
      </div>
    </div>
  );
}
