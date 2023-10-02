const LoadingContext = React.createContext();
const CurrentRepoContext = React.createContext();

const tags = [
  "misc",
  "bugfix",
  "refactor",
  "documentation",
  "feature",
  "tweak",
  "ui",
];

const apiCall = (url, args, callback) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
};

function CreateBranchForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, , getRepository] =
    React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState("");

  const createBranch = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_branch",
      {
        repository: currentRepository.name,
        name: name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        setName("");
      }
    );
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={(e) => createBranch(e)} className="p-2">
      <input
        autoComplete="off"
        className="form-control"
        value={name}
        required
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}

function CommandForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, ,] = React.useContext(CurrentRepoContext);
  const [cmd, setCmd] = React.useState("");

  const onChangeCmd = (e) => {
    setCmd(e.target.value);
  };

  const runCommand = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/run_command",
      {
        repository: currentRepository.name,
        cmd: cmd,
      },
      function (data) {
        setCmd("");
        setLoading(false);
      }
    );
  };

  return (
    <form className="m-2" onSubmit={(e) => runCommand(e)}>
      <input
        placeholder="Run Command"
        value={cmd}
        required
        onChange={onChangeCmd}
        autoComplete="off"
        className="form-control"></input>
    </form>
  );
}

function CommitForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, , getRepository] =
    React.useContext(CurrentRepoContext);
  const [msg, setMsg] = React.useState("");

  const onChangeMsg = (e) => {
    setMsg(e.target.value);
  };

  const commit = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/commit",
      {
        name: currentRepository.name,
        msg: msg,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        setMsg("");
      }
    );
  };

  return (
    <>
      <form onSubmit={(e) => commit(e)} className="input-group mb-2">
        <input
          value={msg}
          onChange={onChangeMsg}
          autoComplete="off"
          className="form-control"
          placeholder="Commit"
        />
        <button type="submit" className="btn ">
          Commit
        </button>
      </form>
    </>
  );
}

function CreateTodoForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, , getRepository] =
    React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");

  const createTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_todo",
      {
        repository: currentRepository.name,
        name: name,
        tag: tag,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        setName("");
        setTag("");
      }
    );
  };

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form className="input-group mb-2" onSubmit={(e) => createTodo(e)}>
      <input
        required
        autoComplete="off"
        className="form-control"
        value={name}
        onChange={onChangeName}
        placeholder="New TODO"
      />
      <button
        type="button"
        className="btn dropdown-toggle"
        data-bs-target="#tags"
        data-bs-toggle="dropdown">
        <i className="me-2 bi bi-tag-fill"></i>
        {tag}
      </button>
      <div id="tags" className="dropdown-menu text-center">
        {tags.map((x) => (
          <>
            {x !== tag && (
              <button
                type="button"
                onClick={() => setTag(x)}
                className="dropdown-item">
                {x}
              </button>
            )}
          </>
        ))}
      </div>
      <button type="submit" className="btn ">
        Add
      </button>
    </form>
  );
}

function TodoItem({ item }) {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, , getRepository] =
    React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState(item.name);
  const [tag, setTag] = React.useState(item.tag);
  const [deleting, setDeleting] = React.useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeTag = (e) => setTag(e.target.value);

  const editTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/edit_todo",
      {
        id: item.id,
        new_name: name,
        new_tag: tag,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const deleteTodo = () => {
    setLoading(true);
    apiCall(
      "/delete_todo",
      {
        id: item.id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const toggleTodo = () => {
    setLoading(true);
    apiCall(
      "/toggle_todo",
      {
        id: item.id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const commitTodo = () => {
    setLoading(true);
    apiCall(
      "/commit_todo",
      {
        id: item.id,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  return (
    <>
      <form
        onSubmit={(e) => editTodo(e)}
        className={"input-group mb-1 " + (item.done ? "opacity-50" : "hover")}>
        <a
          onClick={() => toggleTodo()}
          className={
            "px-1 btn border-0 text-" + (item.done ? "success" : "secondary")
          }>
          <i className="bi bi-check-lg"></i>
        </a>
        <a onClick={() => commitTodo()} className="px-1 btn border-0">
          <i className="bi bi-file-diff"></i>
        </a>
        <input
          onChange={onChangeName}
          value={name}
          autoComplete="off"
          className="form-control border-0"
        />
        <select className="badge w-25" onChange={onChangeTag}>
          {tags.map((x) => (
            <option value={x} selected={x == tag}>
              {x}
            </option>
          ))}
        </select>
        {deleting && (
          <a onClick={() => deleteTodo()} className="btn border-0 text-danger">
            <i className="bi bi-question-lg"></i>
          </a>
        )}
        <a
          onClick={() => setDeleting(!deleting)}
          className="btn border-0 text-danger">
          <i className="bi bi-x-lg"></i>
        </a>
        <button type="submit" className="d-none"></button>
      </form>
    </>
  );
}

function CreateIgnoreForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepository, , getRepository] =
    React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState("");

  const createIgnore = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_ignore",
      {
        repository: currentRepository.name,
        name: name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
        setName("");
      }
    );
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <form className="input-group mb-2" onSubmit={(e) => createIgnore(e)}>
      <input
        required
        autoComplete="off"
        className="form-control"
        value={name}
        onChange={onChangeName}
        placeholder="New Ignore Item"
      />
      <button type="submit" className="btn ">
        Ignore Item
      </button>
    </form>
  );
}

function CreateRepoForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [, , getRepository] = React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createRepo = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_repository",
      {
        name: name,
        brief_descrip: description,
      },
      (data) => {
        getRepository(data.name);
        setLoading(false);
        setName("");
        setDescription("");
      }
    );
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const generateName = () => {
    apiCall("/generate_name", {}, (data) => {
      setName(data.name);
      setDescription(`Created on ${new Date().toDateString()}`);
    });
  };

  return (
    <form onSubmit={(e) => createRepo(e)}>
      <div className="input-group mb-3">
        <input
          onChange={onChangeName}
          value={name}
          autoComplete="off"
          className="form-control"
          placeholder="Name"
          required
        />
        <a onClick={() => generateName()} className="btn">
          <i className="bi bi-shuffle"></i> Generate Name
        </a>
      </div>
      <textarea
        onChange={onChangeDescription}
        value={description}
        rows="20"
        className="form-control mb-3"
        placeholder="Description"
        required></textarea>
      <button type="submit" className="btn w-100">
        Initialize Repository
      </button>
    </form>
  );
}

function CloneRepoForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [url, setUrl] = React.useState("");

  const onChangeUrl = (e) => {
    setUrl(e.target.value);
  };

  const cloneRepository = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/clone_repository",
      {
        url: url,
      },
      function (data) {
        setLoading(false);
        setUrl("");
      }
    );
  };

  return (
    <>
      <form onSubmit={(e) => cloneRepository(e)} className="input-group">
        <input
          autoComplete="off"
          className="form-control"
          placeholder="Git URL"
          value={url}
          onChange={onChangeUrl}
          required
        />
        <button type="submit" className="btn">
          Clone Repository
        </button>
      </form>
    </>
  );
}

function App() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("CodeGarden") || "light"
  );

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
  const [readme, setReadme] = React.useState("");
  const [ignored, setIgnored] = React.useState([]);

  const onChangeReadme = (e) => {
    setReadme(e.target.value);
  };

  React.useEffect(() => {
    localStorage.setItem("CodeGarden", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const exitAll = () => {
    setCurrentRepository([]);
    setPage("repo");
  };

  const getRepositories = () => {
    setLoading(true);
    apiCall("/repositories", {}, (data) => {
      setRepositories(data.repositories_);
      setLoading(false);
    });
  };

  const deleteRepository = () => {
    setLoading(true);
    apiCall(
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
    apiCall(
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
    apiCall(
      "/edit_readme",
      {
        name: currentRepository.name,
        content: readme,
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
    apiCall("/repository", { name: name }, (data) => {
      setCurrentRepository(data);
      setBranches(data.branches);
      setLog(data.log);
      setTodos(data.todos);
      setDiffs(data.diffs);
      setReadme(data.readme);
      setIgnored(data.ignored);
      setLoading(false);
      localStorage.setItem("last-repo-opened", data.name);
    });
  };

  const deleteBranch = (name) => {
    setLoading(true);
    apiCall(
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
    apiCall(
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
    apiCall(
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

  const deleteIgnore = (id) => {
    setLoading(true);
    apiCall(
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
    apiCall(
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

  const revertCommit = () => {
    setLoading(true);
    apiCall(
      "/run_command",
      {
        repository: currentRepository.name,
        cmd: "git reset --soft HEAD~1",
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const push = () => {
    setLoading(true);
    apiCall(
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
    apiCall(
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
    apiCall("/settings", {}, function (data) {
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

  React.useEffect(() => {
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

  const clearCompleted = () => {
    setLoading(true);
    apiCall(
      "/clear_completed",
      {
        repo: currentRepository.name,
      },
      function (data) {
        getRepository(currentRepository.name);
        setLoading(false);
      }
    );
  };

  const themes = [
    "light",
    "dark",
    "lavender",
    "bumblebee",
    "sprite",
    "caramel",
    "raspberry",
  ];

  return (
    <LoadingContext.Provider value={[loading, setLoading]}>
      <CurrentRepoContext.Provider
        value={[currentRepository, setCurrentRepository, getRepository]}>
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
                    className="dropdown-item text-success">
                    <i className="bi bi-plus-circle"></i> New Repository
                  </a>
                  {repositories.map((x, id) => (
                    <a
                      key={id}
                      onClick={() => getRepository(x.name)}
                      className={
                        "dropdown-item d-flex justify-content-between " +
                        (x.name === currentRepository.name && "active")
                      }>
                      <span>{x.name}</span>
                      <div>
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
                      </div>
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
                      <CreateBranchForm />
                      {branches.map((x, id) => (
                        <>
                          {x.name !==
                            "* " + currentRepository.current_branch && (
                            <div key={id} className="dropdown-item">
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
                    <CommandForm />
                    <a onClick={() => copyPath()} className="dropdown-item">
                      <i className="bi bi-clipboard"></i> Copy Path
                    </a>
                    {currentRepository.remote_url && (
                      <a
                        target="_blank"
                        href={currentRepository.remote_url}
                        className="dropdown-item">
                        <i className="bi bi-github"></i> View GitHub
                      </a>
                    )}
                    <a
                      onClick={() => exportRepository()}
                      className="dropdown-item">
                      <i className="bi bi-filetype-json"></i> Export To JSON
                    </a>
                    <a
                      onClick={() => setDeleting(!deleting)}
                      className="dropdown-item text-danger">
                      <i className="bi bi-trash2"></i> Delete Repository
                    </a>
                  </div>
                  {copied && (
                    <span className="heading">
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
                          onClick={() => setTheme(x)}
                          className="dropdown-item text-capitalize">
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
                              <CommitForm />
                              <div className="text-center">
                                <a
                                  title="This cannot be undone."
                                  className="text-danger hover"
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
                              <div className="small fw-light">
                                {x.timestamp}
                              </div>
                              {id === 0 && (
                                <a
                                  onClick={() => revertCommit()}
                                  className="small text-danger">
                                  Revert Commit
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mb-3">
                        <CreateTodoForm />
                        <div>
                          {currentRepository.todos.map((x, id) => (
                            <TodoItem key={x.id} item={x} />
                          ))}
                        </div>
                        {currentRepository.todos.filter((x) => x.done)
                          .length !== 0 && (
                          <button
                            onClick={() => clearCompleted()}
                            className="btn border-0">
                            Clear Completed
                          </button>
                        )}
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
                          <CreateIgnoreForm />
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
                      <div className="scroll">
                        {mode === "view" ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: currentRepository.readme.md,
                            }}></div>
                        ) : (
                          <textarea
                            rows="23"
                            className="form-control h-100"
                            value={readme.txt}
                            onChange={onChangeReadme}></textarea>
                        )}
                      </div>
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
                  defaultValue={config.PORT}
                  key={config.PORT}
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
                  defaultValue={config.HOME_DIR}
                  key={config.HOME_DIR}
                />
                <label for="home-dir" className="small heading">
                  Home Directory
                </label>
              </div>
            </div>
          )}
          {page === "new" && (
            <div>
              <div className="d-flex">
                <div
                  className="btn-group mb-3"
                  style={{ margin: "auto", display: "block" }}>
                  <a
                    className={"btn  " + (createMode === "init" && "active")}
                    onClick={() => setCreateMode("init")}>
                    Create New
                  </a>
                  <a
                    className={"btn  " + (createMode === "clone" && "active")}
                    onClick={() => setCreateMode("clone")}>
                    Clone Existing
                  </a>
                </div>
              </div>
              <div className="px-5">
                {createMode === "init" ? <CreateRepoForm /> : <CloneRepoForm />}
              </div>
            </div>
          )}
        </div>
      </CurrentRepoContext.Provider>
    </LoadingContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
