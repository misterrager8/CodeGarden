function App() {
  const [theme, setTheme] = React.useState(localStorage.getItem("CodeGarden"));

  const [tab, setTab] = React.useState("diffs");
  const [page, setPage] = React.useState("repo");
  const [mode, setMode] = React.useState("view");
  const [createMode, setCreateMode] = React.useState("init");

  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showIgnored, setShowIgnored] = React.useState(false);

  const [config, setConfig] = React.useState([]);

  const [repositories, setRepositories] = React.useState([]);
  const [currentRepository, setCurrentRepository] = React.useState([]);

  const [branches, setBranches] = React.useState([]);
  const [log, setLog] = React.useState([]);
  const [todos, setTodos] = React.useState([]);
  const [diffs, setDiffs] = React.useState([]);
  const [readme, setReadme] = React.useState([]);
  const [ignored, setIgnored] = React.useState([]);

  const changeTheme = (theme_) => {
    localStorage.setItem("CodeGarden", theme_);
    document.documentElement.setAttribute("data-theme", theme_);
    setTheme(theme_);
  };

  const exitAll = () => {
    setCurrentRepository([]);
    setPage("repo");
  };

  const getRepositories = () => {
    setLoading(true);
    $.get("/repositories", function (data) {
      setRepositories(data.repositories_);
      setLoading(false);
    });
  };

  const createRepository = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/create_repository",
      {
        name: $("#new-repo-name").val(),
        brief_descrip: $("#new-repo-desc").val(),
      },
      function (data) {
        getRepository(data.name);
        setLoading(false);
      }
    );
  };

  const cloneRepository = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/clone_repository",
      {
        url: $("#git-url").val(),
      },
      function (data) {
        setLoading(false);
        // window.location.reload();
      }
    );
  };

  const deleteRepository = () => {
    setLoading(true);
    $.get(
      "/delete_repository",
      {
        name: currentRepository.name,
      },
      function (data) {
        getRepositories();
        setCurrentRepository([]);
        setLoading(false);
        setDeleting(false);
      }
    );
  };

  const exportRepository = () => {
    setLoading(true);
    $.get(
      "/export_repository",
      {
        name: currentRepository.name,
      },
      function (data) {
        setLoading(false);
      }
    );
  };

  const editReadme = () => {
    setLoading(true);
    $.post(
      "/edit_readme",
      {
        name: currentRepository.name,
        content: $("#content").val(),
      },
      function (data) {
        setLoading(false);
        setSaved(true);
        getRepository(currentRepository.name);
        setTimeout(function () {
          setSaved(false);
        }, 1500);
      }
    );
  };

  const getRepository = (name) => {
    setLoading(true);
    $.get(
      "/repository",
      {
        name: name,
      },
      function (data) {
        setCurrentRepository(data);
        setBranches(data.branches);
        setLog(data.log);
        setTodos(data.todos);
        setDiffs(data.diffs);
        setReadme(data.readme);
        setIgnored(data.ignored);
        setLoading(false);
        localStorage.setItem("last-repo-opened", data.name);
      }
    );
  };

  const commit = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/commit",
      {
        name: currentRepository.name,
        msg: $("#new-commit").val(),
      },
      function (data) {
        getRepositories();
        getRepository(currentRepository.name);
        setTab("log");
        setLoading(false);
        $("#new-commit").val("");
      }
    );
  };

  const commitTodo = (id) => {
    setLoading(true);
    $.post(
      "/commit",
      {
        name: currentRepository.name,
        msg: $("#todo-name" + id).val(),
      },
      function (data) {
        toggleTodo(id);
        getRepositories();
        getRepository(currentRepository.name);
        setTab("log");
        deleteTodo(id);
        setLoading(false);
      }
    );
  };

  const createBranch = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/create_branch",
      {
        repository: currentRepository.name,
        name: $("#new-branch").val(),
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        $("#new-branch").val("");
      }
    );
  };

  const deleteBranch = (name) => {
    setLoading(true);
    $.get(
      "/delete_branch",
      {
        repository: currentRepository.name,
        name: name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const checkoutBranch = (name) => {
    setLoading(true);
    $.get(
      "/checkout_branch",
      {
        repository: currentRepository.name,
        name: name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const mergeBranch = (otherBranch) => {
    setLoading(true);
    $.get(
      "/merge_branch",
      {
        repository: currentRepository.name,
        name: currentRepository.current_branch,
        other_branch: otherBranch,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const createTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/create_todo",
      {
        repository: currentRepository.name,
        name: $("#new-todo").val(),
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        $("#new-todo").val("");
      }
    );
  };

  const editTodo = (e, id) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/edit_todo",
      {
        repository: currentRepository.name,
        id: id,
        new_name: $("#todo-name" + id).val(),
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const deleteTodo = (id) => {
    setLoading(true);
    $.get(
      "/delete_todo",
      {
        repository: currentRepository.name,
        id: id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const toggleTodo = (id) => {
    setLoading(true);
    $.get(
      "/toggle_todo",
      {
        repository: currentRepository.name,
        id: id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const createIgnore = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/create_ignore",
      {
        repository: currentRepository.name,
        name: $("#new-ignore").val(),
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        $("#new-ignore").val("");
      }
    );
  };

  const deleteIgnore = (id) => {
    setLoading(true);
    $.get(
      "/delete_ignore",
      {
        repository: currentRepository.name,
        id: id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const resetAll = () => {
    setLoading(true);
    $.get(
      "/reset_all",
      {
        name: currentRepository.name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const push = () => {
    setLoading(true);
    $.get(
      "/push",
      {
        name: currentRepository.name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const resetFile = (name) => {
    setLoading(true);
    $.get(
      "/reset_file",
      {
        repository: currentRepository.name,
        name: name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const getSettings = () => {
    setLoading(true);
    $.get("/settings", function (data) {
      setConfig(data);
      setLoading(false);
    });
  };

  const copyPath = () => {
    navigator.clipboard.writeText(currentRepository.path);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  const runCommand = (e) => {
    e.preventDefault();
    setLoading(true);
    $.post(
      "/run_command",
      {
        repository: currentRepository.name,
        cmd: $("#cmd").val(),
      },
      function (data) {
        $("#cmd").val("");
        setLoading(false);
      }
    );
  };

  React.useEffect(() => {
    changeTheme(theme);
    getRepositories();
    localStorage.getItem("last-repo-opened") &&
      getRepository(localStorage.getItem("last-repo-opened"));
  }, []);

  React.useEffect(() => {
    page !== "repo" && setCurrentRepository([]);
    page === "settings" && getSettings();
  }, [page]);

  React.useEffect(() => {
    currentRepository.length !== 0 && setPage("repo");
  }, [currentRepository]);

  const themes = ["light", "dark", "royal"];

  return (
    <div className="p-4">
      <nav className="py-2 sticky-top">
        <div className="btn-group">
          <a onClick={() => exitAll()} className="btn border-0">
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-flower2"></i>
            )}
          </a>
          {currentRepository.length !== 0 && (
            <a
              onClick={() => getRepository(currentRepository.name)}
              className="btn border-0">
              <i className="bi bi-arrow-clockwise"></i>
            </a>
          )}
          <div className="btn-group dropdown">
            <a
              className={
                "btn dropdown-toggle " +
                (currentRepository.length !== 0 && "active")
              }
              data-bs-toggle="dropdown"
              data-bs-target="#repositories">
              <i className="bi bi-git me-2"></i>
              {currentRepository.length === 0
                ? "Select Repository"
                : currentRepository.name}
            </a>
            <div className="dropdown-menu" id="repositories">
              <a
                onClick={() => setPage("new")}
                className="dropdown-item small text-success">
                <i className="bi bi-plus-circle"></i> New Repository
              </a>
              {repositories.map((x, id) => (
                <a
                  key={id}
                  onClick={() => getRepository(x.name)}
                  className={
                    "dropdown-item small " +
                    (x.name === currentRepository.name && "active")
                  }>
                  {x.diffs.length > 0 && (
                    <i
                      title="There are uncommitted changes here."
                      className="bi bi-circle-fill text-primary me-1"></i>
                  )}
                  {x.current_branch !== "master" && (
                    <i
                      title="Non-master branch checked-out."
                      className="bi bi-sign-intersection-y-fill text-warning me-1"></i>
                  )}
                  <span>{x.name}</span>
                </a>
              ))}
            </div>
          </div>
          {currentRepository.length !== 0 && (
            <>
              <div className="btn-group dropdown">
                <a
                  className="btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-target="#branches">
                  <i className="bi bi-signpost-split me-2"></i>
                  {currentRepository.current_branch}
                </a>
                <div className="dropdown-menu" id="branches">
                  <div className="text-center pb-2">
                    <div className="small text-muted">Current Branch</div>
                    <div className="fst-italic">
                      {currentRepository.current_branch}
                    </div>
                  </div>
                  <div className="btn-group p-2 w-100">
                    <a onClick={() => push()} className="btn">
                      <i className="bi bi-arrow-right"></i> Push
                    </a>
                  </div>
                  <form
                    onSubmit={(e) => createBranch(e)}
                    className="input-group p-2">
                    <input
                      id="new-branch"
                      autoComplete="off"
                      className="form-control"
                      placeholder="New Branch"
                    />
                  </form>
                  {branches.map((x, id) => (
                    <>
                      {x.name !== "* " + currentRepository.current_branch && (
                        <div key={id} className="dropdown-item small">
                          <a
                            className=""
                            onClick={() => checkoutBranch(x.name)}>
                            {x.name}
                          </a>
                          <span className="float-end">
                            <a onClick={() => mergeBranch(x.name)}>
                              <i className="bi bi-sign-merge-left"></i>
                            </a>
                            <a
                              className="text-danger ps-2"
                              onClick={() => deleteBranch(x.name)}>
                              <i className="bi bi-trash2"></i>
                            </a>
                          </span>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
              <a
                className="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-target="#options">
                <i className="bi bi-three-dots"></i> Options
              </a>
              <div className="dropdown-menu" id="options">
                <form className="m-2" onSubmit={(e) => runCommand(e)}>
                  <input
                    placeholder="Run Command"
                    id="cmd"
                    autoComplete="off"
                    className="form-control"></input>
                </form>
                <a onClick={() => copyPath()} className="dropdown-item small">
                  <i className="bi bi-clipboard"></i> Copy Path
                </a>
                {currentRepository.remote_url && (
                  <a
                    target="_blank"
                    href={currentRepository.remote_url}
                    className="dropdown-item small">
                    <i className="bi bi-github"></i> View GitHub
                  </a>
                )}
                <a
                  onClick={() => exportRepository()}
                  className="dropdown-item small">
                  <i className="bi bi-filetype-json"></i> Export To JSON
                </a>
                <a
                  onClick={() => setDeleting(!deleting)}
                  className="dropdown-item small text-danger">
                  <i className="bi bi-trash2"></i> Delete Repository
                </a>
              </div>
              {copied && (
                <span className="small heading">
                  <i className="bi bi-check-lg"></i> Copied.
                </span>
              )}
              {deleting && (
                <a
                  className="btn border-0 text-danger"
                  onClick={() => deleteRepository()}>
                  Delete?
                </a>
              )}
            </>
          )}
        </div>
        <span className="float-end btn-group">
          <div className="dropdown btn-group">
            <a
              className="btn dropdown-toggle text-capitalize"
              data-bs-toggle="dropdown"
              data-bs-target="#themes">
              <i className="bi bi-paint-bucket me-1"></i> {theme}
            </a>
            <div className="dropdown-menu text-center" id="themes">
              {themes.map((x) => (
                <>
                  {theme !== x && (
                    <a
                      onClick={() => changeTheme(x)}
                      className="dropdown-item small text-capitalize">
                      {x}
                    </a>
                  )}
                </>
              ))}
            </div>
          </div>
          <a
            onClick={() => setPage("settings")}
            className={"btn " + (page === "settings" && "active")}>
            <i className="bi bi-gear"></i> Settings
          </a>
          <a
            target="_blank"
            href="http://github.com/misterrager8/CodeGarden"
            className="btn">
            <i className="bi bi-info-circle"></i> About
          </a>
        </span>
      </nav>
      {page === "repo" && (
        <div>
          {currentRepository.length !== 0 && (
            <div>
              <div className="row mt-3">
                <div className="col-3">
                  <div className="btn-group mb-2 w-100">
                    <a
                      onClick={() => setTab("diffs")}
                      className={"btn  " + (tab === "diffs" && " active")}>
                      Changes
                    </a>
                    <a
                      onClick={() => setTab("log")}
                      className={"btn  " + (tab === "log" && " active")}>
                      Log
                    </a>
                  </div>
                  {tab === "diffs" ? (
                    <div className="mb-3">
                      {currentRepository.diffs.length !== 0 && (
                        <div>
                          <form
                            onSubmit={(e) => commit(e)}
                            className="input-group mb-2">
                            <input
                              id="new-commit"
                              autoComplete="off"
                              className="form-control"
                              placeholder="Commit"
                            />
                            <button type="submit" className="btn ">
                              Commit
                            </button>
                          </form>
                          <div className="text-center">
                            <a
                              title="This cannot be undone."
                              className="small text-danger hover"
                              onClick={() => resetAll()}>
                              Reset All
                            </a>
                          </div>
                        </div>
                      )}
                      <div>
                        {currentRepository.diffs.length === 0 && (
                          <div className="text-center small opacity-50 py-2">
                            No Changes.
                          </div>
                        )}
                        {currentRepository.diffs.map((x, id) => (
                          <div key={id} className="row hover">
                            <div className="col">{x.name}</div>
                            <span className="col">
                              <a
                                onClick={() => resetFile(x.name)}
                                className="float-end btn border-0 text-danger">
                                <i className="bi bi-x-lg"></i>
                              </a>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      {currentRepository.log.map((x, id) => (
                        <div key={id} className="text-truncate mb-2">
                          <div className="fst-italic">{x.name}</div>
                          <div className="small fw-light">{x.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-3">
                    <form
                      onSubmit={(e) => createTodo(e)}
                      className="input-group mb-2">
                      <input
                        id="new-todo"
                        autoComplete="off"
                        className="form-control"
                        placeholder="New TODO"
                      />
                      <button type="submit" className="btn ">
                        Create TODO
                      </button>
                    </form>
                    <div>
                      {currentRepository.todos.map((x, id) => (
                        <form
                          onSubmit={(e) => editTodo(e, id)}
                          key={id}
                          className={
                            "input-group " + (x.done ? "opacity-50" : "hover")
                          }>
                          <a
                            onClick={() => toggleTodo(id)}
                            className={
                              "px-1 btn border-0 text-" +
                              (x.done ? "success" : "secondary")
                            }>
                            <i className="bi bi-check-lg"></i>
                          </a>
                          <a
                            onClick={() => commitTodo(id)}
                            className="px-1 btn border-0">
                            <i className="bi bi-file-diff"></i>
                          </a>
                          <input
                            id={"todo-name" + id}
                            key={id}
                            defaultValue={x.name}
                            autoComplete="off"
                            className="form-control border-0"
                          />
                          <a
                            onClick={() => deleteTodo(id)}
                            className="btn border-0 text-danger">
                            <i className="bi bi-x-lg"></i>
                          </a>
                        </form>
                      ))}
                    </div>
                  </div>

                  <a
                    className="btn my-2"
                    onClick={() => setShowIgnored(!showIgnored)}>
                    <i
                      className={
                        "me-2 bi bi-" + (showIgnored ? "eye-slash" : "eye")
                      }></i>
                    {showIgnored ? "Hide" : "Show"} Ignored
                  </a>
                  {showIgnored && (
                    <div>
                      <form
                        onSubmit={(e) => createIgnore(e)}
                        className="input-group mb-2">
                        <input
                          id="new-ignore"
                          autoComplete="off"
                          className="form-control"
                          placeholder="New Ignore Item"
                        />
                        <button type="submit" className="btn ">
                          Ignore Item
                        </button>
                      </form>
                      {currentRepository.ignored.map((x, id) => (
                        <div key={id} className="row hover text-truncate">
                          <div className="col">{x.name}</div>
                          <span className="col">
                            <a
                              onClick={() => deleteIgnore(id)}
                              className="float-end btn border-0 text-danger">
                              <i className="bi bi-x-lg"></i>
                            </a>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-9">
                  <div className="btn-group mb-3">
                    <a
                      onClick={() => setMode("view")}
                      className={"btn  " + (mode === "view" && " active")}>
                      <i className="bi bi-eye"></i> View
                    </a>
                    <a
                      onClick={() => setMode("edit")}
                      className={"btn  " + (mode === "edit" && " active")}>
                      <i className="bi bi-pen"></i> Edit
                    </a>
                    {mode === "edit" && (
                      <a onClick={() => editReadme()} className="btn">
                        <i
                          className={
                            "me-2 bi bi-" + (saved ? "check-lg" : "save2")
                          }></i>
                        {saved ? "Saved." : "Save README"}
                      </a>
                    )}
                  </div>
                  {mode === "view" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentRepository.readme.md,
                      }}></div>
                  ) : (
                    <textarea
                      rows="23"
                      id="content"
                      className="form-control"
                      defaultValue={currentRepository.readme.txt}
                      key={currentRepository.name}></textarea>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {page === "settings" && (
        <div>
          <div className="form-floating m-1">
            <input
              autoComplete="off"
              className="form-control border-0"
              id="port"
              defaultValue={config.port}
              key={config.port}
            />
            <label for="port" className="small heading">
              Port
            </label>
          </div>
          <div className="form-floating m-1">
            <input
              autoComplete="off"
              className="form-control border-0"
              id="home-dir"
              defaultValue={config.home_dir}
              key={config.home_dir}
            />
            <label for="home-dir" className="small heading">
              Home Directory
            </label>
          </div>
        </div>
      )}
      {page === "new" && (
        <div>
          <div className="btn-group mb-3">
            <a
              className={"btn  " + (createMode === "init" && "active")}
              onClick={() => setCreateMode("init")}>
              Init
            </a>
            <a
              className={"btn  " + (createMode === "clone" && "active")}
              onClick={() => setCreateMode("clone")}>
              Clone
            </a>
          </div>
          {createMode === "init" ? (
            <form onSubmit={(e) => createRepository(e)}>
              <div className="input-group mb-2">
                <input
                  autoComplete="off"
                  className="form-control"
                  placeholder="Name"
                  id="new-repo-name"
                  required
                />
                <a className="btn">
                  <i className="bi bi-shuffle"></i> Generate Name
                </a>
              </div>
              <textarea
                rows="20"
                className="form-control mb-2"
                placeholder="Description"
                id="new-repo-desc"
                required></textarea>
              <button type="submit" className="btn w-100">
                Initialize Repository
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => cloneRepository(e)} className="input-group">
              <input
                autoComplete="off"
                className="form-control"
                placeholder="Git URL"
                id="git-url"
                required
              />
              <button type="submit" className="btn w-100">
                Clone Repository
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
