/*
## code-garden UI v2 (tabbed layout)
---
The first layout was heavily modeled after the UI for GitHub desktop, but now I want to try something new so it's easier from a dev standpoint to add new features and expand on them whenever necessary, rather than bunching everything up in an arbitrary arrangement.

#### Top Navbar (horizontal, full width)

- Logo / Home button
- Repos dropdown
    - Refresh button (if repo selected)
- Themes dropdown
- Settings
- About link

#### Side Navbar (vertical, 25-30% width, appears only if repo selected)

- Branches (as dropdown w/ create form)
- Changes
- Log
- TODOs
- README
- Docs (*)
- Ignored
- Options / Misc. fns.

#### Display Panel (taking up remainder of horizontal space)
*/

const ReposContext = React.createContext();
const CurrentRepoContext = React.createContext();
const LoadingContext = React.createContext();
const TabContext = React.createContext();

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

function BranchForm() {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  const onChangeName = (e) => setName(e.target.value);

  const createBranch = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_branch",
      {
        repository: currentRepo.name,
        name: name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
        setName("");
      }
    );
  };

  return (
    <form onSubmit={(e) => createBranch(e)} className="p-2">
      <input
        autoComplete="off"
        className="form-control form-control-sm"
        value={name}
        required
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}

function BranchItem({ item }) {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [deleting, setDeleting] = React.useState(false);

  const checkout = (name) => {
    setLoading(true);
    apiCall(
      "/checkout_branch",
      {
        repository: currentRepo.name,
        name: name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const mergeBranch = (otherBranch) => {
    setLoading(true);
    apiCall(
      "/merge_branch",
      {
        repository: currentRepo.name,
        name: currentRepo.current_branch.name,
        other_branch: otherBranch,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const deleteBranch = (name) => {
    setLoading(true);
    apiCall(
      "/delete_branch",
      {
        repository: currentRepo.name,
        name: name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <span>{item.name}</span>
      <div className="btn-group btn-group-sm">
        <button onClick={() => checkout(item.name)} className="btn border-0">
          <i className="bi bi-cart-check"></i>
        </button>
        <button onClick={() => mergeBranch(item.name)} className="btn border-0">
          <i className="bi bi-arrow-repeat"></i>
        </button>
        {deleting && (
          <button
            onClick={() => deleteBranch(item.name)}
            className="btn border-0">
            <i className="bi bi-question-lg"></i>
          </button>
        )}
        <button onClick={() => setDeleting(!deleting)} className="btn border-0">
          <i className="bi bi-trash2"></i>
        </button>
      </div>
    </div>
  );
}

function Branches() {
  const [showAll, setShowAll] = React.useState(false);
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  const push = () => {
    setLoading(true);
    apiCall(
      "/push",
      {
        name: currentRepo.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const pull = () => {
    setLoading(true);
    apiCall(
      "/pull",
      {
        name: currentRepo.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className="text-center small">Current Branch</div>
      <button
        onClick={() => setShowAll(!showAll)}
        className="btn dropdown-toggle border-0 w-100">
        <i className="me-2 bi bi-signpost-split"></i>
        {currentRepo.current_branch.name}
      </button>
      {showAll && (
        <div className="py-2">
          <BranchForm />
          <div className="mt-3 px-2">
            {currentRepo.branches.map((x) => (
              <>
                {`* ${currentRepo.current_branch.name}` !== x.name && (
                  <BranchItem item={x} key={x} />
                )}
              </>
            ))}
          </div>
        </div>
      )}
      <div className="btn-group btn-group-sm w-100 mt-3">
        <button className="btn border-0" onClick={() => push()}>
          <i className="bi bi-arrow-bar-up me-2"></i>Push
        </button>
        <button className="btn border-0" onClick={() => pull()}>
          <i className="bi bi-arrow-bar-down me-2"></i>Pull
        </button>
      </div>
      <hr />
    </>
  );
}

function TodoForm() {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("misc");
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  const onChangeName = (e) => setName(e.target.value);

  const createTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_todo",
      {
        repository: currentRepo.name,
        name: name,
        tag: tag,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
        setName("");
      }
    );
  };

  return (
    <form
      className="input-group input-group-sm"
      onSubmit={(e) => createTodo(e)}>
      <input
        value={name}
        onChange={onChangeName}
        autoComplete="off"
        className="form-control"
        required
        placeholder="New TODO"
      />
      <div className="btn-group dropdown">
        <a
          type="button"
          className="btn border-0 dropdown-toggle"
          data-bs-target="#tags"
          data-bs-toggle="dropdown">
          <i className="me-2 bi bi-tag"></i>
          {tag}
        </a>
        <div className="dropdown-menu" id="tags">
          {tags.map((x) => (
            <a
              key={`${x}-alt`}
              onClick={() => setTag(x)}
              className="dropdown-item">
              {x}
            </a>
          ))}
        </div>
      </div>

      <button type="submit" className="btn border-0">
        <i className="me-2 bi bi-plus-circle"></i>Add TODO
      </button>
    </form>
  );
}

function CommandForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepo, ,] = React.useContext(CurrentRepoContext);
  const [cmd, setCmd] = React.useState("");

  const onChangeCmd = (e) => setCmd(e.target.value);

  const runCommand = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/run_command",
      {
        repository: currentRepo.name,
        cmd: cmd,
      },
      function (data) {
        setCmd("");
        setLoading(false);
      }
    );
  };

  return (
    <form className="ms-2 p-1" onSubmit={(e) => runCommand(e)}>
      <input
        placeholder="Run Command"
        value={cmd}
        required
        onChange={onChangeCmd}
        autoComplete="off"
        className="form-control form-control-sm"></input>
    </form>
  );
}

function CommitForm() {
  const [msg, setMsg] = React.useState("");
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [tab, setTab] = React.useContext(TabContext);

  const onChangeMsg = (e) => setMsg(e.target.value);

  const commit = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/commit",
      {
        name: currentRepo.name,
        msg: msg,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
        setMsg("");
        setTab("log");
      }
    );
  };

  return (
    <form className="input-group input-group-sm" onSubmit={(e) => commit(e)}>
      <input
        value={msg}
        onChange={onChangeMsg}
        autoComplete="off"
        className="form-control"
        required
        placeholder="Commit"
      />
      <button type="submit" className="btn border-0">
        <i className="me-2 bi bi-file-earmark-diff"></i>Commit
      </button>
    </form>
  );
}

function DiffItem({ item }) {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [deleting, setDeleting] = React.useState(false);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  const resetFile = () => {
    setLoading(true);
    apiCall(
      "/reset_file",
      {
        repository: currentRepo.name,
        name: item.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <div>{item.name}</div>
      <div className="btn-group btn-group-sm">
        {deleting && (
          <button className="btn border-0" onClick={() => resetFile()}>
            <i className="bi bi-question-lg"></i>
          </button>
        )}
        <button className="btn border-0" onClick={() => setDeleting(!deleting)}>
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
    </div>
  );
}

function TodoItem({ item }) {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [deleting, setDeleting] = React.useState(false);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [tab, setTab] = React.useContext(TabContext);

  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeDescription = (e) => setDescription(e.target.value);

  React.useEffect(() => {
    setName(item.name);
    setTag(item.tag);
    setDescription(item.description || "");
  }, []);

  const deleteTodo = () => {
    setLoading(true);
    apiCall(
      "/delete_todo",
      {
        id: item.id,
      },
      function (data) {
        getRepo(currentRepo.name);
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
        getRepo(currentRepo.name);
        setLoading(false);
        setTab("log");
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
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const editTodo = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/edit_todo",
      {
        id: item.id,
        new_name: name,
        new_tag: tag,
        new_status: item.status,
        new_desc: description,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
        setSaved(true);
        setTimeout(function () {
          setSaved(false);
        }, 1000);
      }
    );
  };

  return (
    <form
      onSubmit={(e) => editTodo(e)}
      className={"border rounded mb-4 p-2" + (item.done ? " opacity-25" : "")}>
      <div className="d-flex justify-content-between">
        <div className="btn-group btn-group-sm">
          {saved && (
            <span className="btn border-0">
              <i className="bi bi-floppy2"></i>
            </span>
          )}
          <span className="btn border-0">#{item.id}</span>
        </div>
        <div className="btn-group dropdown">
          <a
            className="btn btn-sm border-0 dropdown-toggle"
            data-bs-toggle="dropdown"
            data-bs-target="#edit-tags">
            <i className="me-2 bi bi-tag-fill"></i>
            {tag}
          </a>
          <div className="dropdown-menu" id="edit-tags">
            {tags.map((x) => (
              <a key={x} onClick={() => setTag(x)} className="dropdown-item">
                {x}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="input-group mt-2">
        <input
          autoComplete="off"
          className="form-control border-0 fw-bold"
          value={name}
          onChange={onChangeName}
        />
        <a
          className={"btn" + (showDescription ? "" : " border-0")}
          onClick={() => setShowDescription(!showDescription)}>
          <i
            className={
              "bi bi-file-earmark-" +
              (description?.length > 0 ? "medical-fill" : "plus")
            }></i>
        </a>
      </div>
      {showDescription && (
        <textarea
          rows={description.split("\n")?.length + 1}
          value={description}
          onChange={onChangeDescription}
          placeholder="Description"
          className="form-control my-3 desc"></textarea>
      )}
      <div className="btn-group btn-group-sm">
        <a onClick={() => toggleTodo()} className="btn border-0">
          <i className="bi bi-check-lg"></i>
        </a>
        {item.status !== "completed" && (
          <a
            onClick={() => {
              setLoading(true);
              apiCall(
                "/edit_todo",
                {
                  id: item.id,
                  new_name: name,
                  new_tag: tag,
                  new_status: item.status === "open" ? "active" : "open",
                  new_desc: description,
                },
                function (data) {
                  getRepo(currentRepo.name);
                  setLoading(false);
                }
              );
            }}
            className="btn border-0">
            <i
              className={
                "bi bi-arrow" + (item.status === "open" ? "-right" : "-left")
              }></i>
          </a>
        )}
        {currentRepo.diffs.length > 0 && (
          <a onClick={() => commitTodo()} className="btn border-0">
            <i className="bi bi-file-earmark-diff"></i>
          </a>
        )}
        <a className="btn border-0" onClick={() => setDeleting(!deleting)}>
          <i className="bi bi-x-circle"></i>
        </a>
        {deleting && (
          <a className="btn border-0" onClick={() => deleteTodo()}>
            <i className="bi bi-question-lg"></i>
          </a>
        )}
      </div>
      <button className="invisible" type="submit"></button>
    </form>
  );
}

function LogItem({ item, id }) {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);

  const revertCommit = () => {
    setLoading(true);
    apiCall(
      "/run_command",
      {
        repository: currentRepo.name,
        cmd: "git reset --soft HEAD~1",
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <div>
        <span>{item.name}</span>
        {id === 0 && (
          <a onClick={() => revertCommit()} className="ms-4 small text-danger">
            Revert Commit
          </a>
        )}
      </div>
      <span>{item.timestamp}</span>
    </div>
  );
}

function IgnoreItem({ item }) {
  const [deleting, setDeleting] = React.useState(false);

  return (
    <div className="d-flex justify-content-between">
      <div>{item.name}</div>
      <div className="btn-group btn-group-sm">
        {deleting && (
          <button className="btn border-0">
            <i className="bi bi-question-lg"></i>
          </button>
        )}
        <button className="btn border-0" onClick={() => setDeleting(!deleting)}>
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
    </div>
  );
}

function Readme() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [mode, setMode] = React.useState("view");
  const [readme, setReadme] = React.useState("");
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [saved, setSaved] = React.useState(false);

  const onChangeReadme = (e) => setReadme(e.target.value);

  const editReadme = () => {
    setLoading(true);
    apiCall(
      "/edit_readme",
      {
        name: currentRepo.name,
        content: readme,
      },
      function (data) {
        setLoading(false);
        setSaved(true);
        getRepo(currentRepo.name);
        setTimeout(function () {
          setSaved(false);
        }, 1500);
      }
    );
  };

  React.useEffect(() => {
    currentRepo.length !== 0 && setReadme(currentRepo.readme.txt);
  }, [currentRepo]);

  return (
    <>
      <div className="btn-group btn-group-sm">
        {mode === "view" ? (
          <button onClick={() => setMode("edit")} className="btn">
            <i className="bi bi-pen"></i>
          </button>
        ) : (
          <>
            <button onClick={() => setMode("view")} className="btn">
              <i className="bi bi-eye"></i>
            </button>
            <button onClick={() => editReadme()} className="btn">
              <i className={"bi bi-" + (saved ? "check-lg" : "floppy2")}></i>
            </button>
          </>
        )}
      </div>
      <div className="mt-3" style={{ height: "650px" }}>
        {mode === "view" ? (
          <div
            dangerouslySetInnerHTML={{
              __html: currentRepo.readme.md,
            }}></div>
        ) : (
          <textarea
            onChange={onChangeReadme}
            value={readme}
            className="form-control h-100"></textarea>
        )}
      </div>
    </>
  );
}

function Changes() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [resetting, setResetting] = React.useState(false);

  const amendCommit = () => {
    setLoading(true);
    apiCall(
      "/run_command",
      {
        repository: currentRepo.name,
        cmd: "git commit -a --amend --no-edit",
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const resetAll = () => {
    setLoading(true);
    apiCall(
      "/reset_all",
      {
        name: currentRepo.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-100">
      {currentRepo.diffs.length > 0 && (
        <div className="btn-group btn-group-sm mb-3">
          <button onClick={() => amendCommit()} className="btn border-0">
            <i className="bi bi-eraser-fill me-2"></i>Amend Changes To Last
            Commit
          </button>
          <button
            className="btn border-0"
            onClick={() => setResetting(!resetting)}>
            <i className="me-2 bi bi-x-lg"></i>Reset All
          </button>
          {resetting && (
            <button className="btn border-0" onClick={() => resetAll()}>
              Reset All?
            </button>
          )}
        </div>
      )}
      {currentRepo.diffs.map((x, id) => (
        <DiffItem key={`${x.name}-${id}`} item={x} />
      ))}
      {currentRepo.diffs.length > 0 && (
        <>
          <div className="mt-3 ">
            <CommitForm />
          </div>
        </>
      )}
    </div>
  );
}

function Log() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  return (
    <div className="w-100">
      {currentRepo.log.map((x, id) => (
        <LogItem key={x.timestamp} item={x} id={id} />
      ))}
    </div>
  );
}

function Todos() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);

  const clearCompleted = () => {
    setLoading(true);
    apiCall(
      "/clear_completed",
      {
        repo: currentRepo.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-100">
      <div className="mb-3">
        <TodoForm />
      </div>
      <div className="row">
        <div className="col-4">
          <div className="text-center h5 mb-4">OPEN</div>
          {currentRepo.todos
            .filter((x) => x.status === "open")
            .map((x) => (
              <TodoItem key={x.id} item={x} />
            ))}
        </div>
        <div className="col-4">
          <div className="text-center h5 mb-4">ACTIVE</div>
          {currentRepo.todos
            .filter((x) => x.status === "active")
            .map((x) => (
              <TodoItem key={x.id} item={x} />
            ))}
        </div>
        <div className="col-4">
          <div className="text-center h5 mb-4">COMPLETE</div>
          {currentRepo.todos
            .filter((x) => x.status === "completed")
            .map((x) => (
              <TodoItem key={x.id} item={x} />
            ))}
          {currentRepo.todos.filter((x) => x.done).length !== 0 && (
            <div>
              <button onClick={() => clearCompleted()} className="btn border-0">
                Clear Completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Ignored() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);

  return (
    <div className="w-50">
      {currentRepo.ignored.map((x, id) => (
        <IgnoreItem key={x.name} item={x} />
      ))}
    </div>
  );
}

function DisplayPanel() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [tab, setTab] = React.useContext(TabContext);

  return (
    <>
      {currentRepo.length !== 0 && (
        <div className="col-10">
          <div className="p-2 h-100">
            {tab === "readme" ? (
              <Readme />
            ) : tab === "changes" ? (
              <Changes />
            ) : tab === "log" ? (
              <Log />
            ) : tab === "todos" ? (
              <Todos />
            ) : (
              <Ignored />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SideNav() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [tab, setTab] = React.useContext(TabContext);

  return (
    <>
      {currentRepo.length !== 0 && (
        <div className="col-2">
          <Branches />
          <div className="btn-group-vertical w-100">
            <button
              onClick={() => setTab("readme")}
              className={
                "btn border-0 d-flex px-5" + (tab === "readme" ? " active" : "")
              }>
              <i className="me-2 bi bi-book"></i>README
            </button>
            <button
              onClick={() => setTab("changes")}
              className={
                "btn border-0 d-flex px-5" +
                (tab === "changes" ? " active" : "")
              }>
              <i className="me-2 bi bi-file-earmark-diff"></i>Changes (
              {currentRepo.diffs.length})
            </button>
            <button
              onClick={() => setTab("log")}
              className={
                "btn border-0 d-flex px-5" + (tab === "log" ? " active" : "")
              }>
              <i className="me-2 bi bi-clock-history"></i>Log
            </button>
            <button
              onClick={() => setTab("todos")}
              className={
                "btn border-0 d-flex px-5" + (tab === "todos" ? " active" : "")
              }>
              <i className="me-2 bi bi-check2-all"></i>TODOs (
              {currentRepo.todos.filter((x) => !x.done).length})
            </button>
            <button
              onClick={() => setTab("ignored")}
              className={
                "btn border-0 d-flex px-5" +
                (tab === "ignored" ? " active" : "")
              }>
              <i className="me-2 bi bi-slash-circle"></i>Ignored (
              {currentRepo.ignored.length})
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function TopNav() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("CodeGarden") || "light"
  );
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [repos, setRepos, getRepos] = React.useContext(ReposContext);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("CodeGarden", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = [
    "light",
    "dark",
    "scarlet",
    "gold",
    "forest",
    "navy",
    "neon",
    "hornet",
    "xbox",
    "ocean",
  ];

  const copyPath = () => {
    navigator.clipboard.writeText(currentRepo.path);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  const exportRepository = () => {
    setLoading(true);
    apiCall(
      "/export_repository",
      {
        name: currentRepo.name,
      },
      function (data) {
        setLoading(false);
      }
    );
  };

  const deleteRepository = () => {
    setLoading(true);
    apiCall(
      "/delete_repository",
      {
        name: currentRepo.name,
      },
      function (data) {
        getRepos();
        setCurrentRepo([]);
        setLoading(false);
        setDeleting(false);
      }
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="btn-group">
        <button onClick={() => setCurrentRepo([])} className="btn border-0">
          {loading ? (
            <span className="me-2 spinner-border spinner-border-sm"></span>
          ) : (
            <i className="me-2 bi bi-flower2"></i>
          )}
          code-garden
        </button>
        <div>
          <button
            data-bs-toggle="dropdown"
            data-bs-target="#repos"
            className="btn dropdown-toggle me-3">
            <i className="me-2 bi bi-git"></i>
            {currentRepo.name || "Select Repo"}
          </button>
          <div id="repos" className="dropdown-menu">
            {repos.map((x) => (
              <button
                onClick={() => setCurrentRepo(x)}
                key={x.name}
                className={"dropdown-item d-flex"}>
                <span>{x.name}</span>
                <div>
                  {x.diffs.length > 0 && (
                    <i
                      title="There are uncommitted changes here."
                      className="bi bi-circle-fill text-primary me-1"></i>
                  )}
                  {x.current_branch.name !== "master" && (
                    <i
                      title="Non-master branch checked-out."
                      className="bi bi-sign-intersection-y-fill text-warning me-1"></i>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        {currentRepo.length !== 0 && (
          <div className="btn-group">
            <div className="vr"></div>
            <button
              className="btn border-0 ms-2"
              onClick={() => getRepo(currentRepo.name)}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
            <a className="btn border-0" onClick={() => copyPath()}>
              <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
            </a>
            {currentRepo.remote_url && (
              <a
                target="_blank"
                href={currentRepo.remote_url}
                className="btn border-0">
                <i className="bi bi-github"></i>
              </a>
            )}
            <a className="btn border-0" onClick={() => exportRepository()}>
              <i className="bi bi-filetype-json"></i>
            </a>
            <a className="btn border-0" onClick={() => setDeleting(!deleting)}>
              <i className="bi bi-trash2"></i>
            </a>
            {deleting && (
              <a className="btn border-0" onClick={() => deleteRepository()}>
                <i className="bi bi-question-lg"></i>
              </a>
            )}
            <CommandForm />
          </div>
        )}
      </div>
      <div className="btn-group">
        <div className="btn-group dropdown">
          <button
            data-bs-toggle="dropdown"
            data-bs-target="#themes"
            className="btn dropdown-toggle text-capitalize">
            <i className="me-2 bi bi-paint-bucket"></i>
            {theme}
          </button>
          <div id="themes" className="dropdown-menu text-center">
            {themes.map((x) => (
              <React.Fragment key={x}>
                {theme !== x && (
                  <a
                    onClick={() => setTheme(x)}
                    className="dropdown-item text-capitalize">
                    {x}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button className="btn">
          <i className="me-2 bi bi-gear"></i>Settings
        </button>
        <a
          target="_blank"
          href="http://github.com/misterrager8/CodeGarden"
          className="btn">
          <i className="me-2 bi bi-info-circle"></i>About
        </a>
      </div>
    </div>
  );
}

function MultiContext(props) {
  const [repos, setRepos] = React.useState([]);
  const [currentRepo, setCurrentRepo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [tab, setTab] = React.useState("readme");

  const getRepos = () => {
    setLoading(true);
    apiCall("/repositories", {}, (data) => {
      setRepos(data.repositories_);
      setLoading(false);
    });
  };

  const getRepo = (name) => {
    setLoading(true);
    apiCall("/repository", { name: name }, (data) => {
      setCurrentRepo(data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    getRepos();
    localStorage.getItem("last-repo-opened") &&
      getRepo(localStorage.getItem("last-repo-opened"));
  }, []);

  React.useEffect(() => {
    currentRepo.length !== 0 &&
      localStorage.setItem("last-repo-opened", currentRepo.name);
  }, [currentRepo]);

  return (
    <>
      <LoadingContext.Provider value={[loading, setLoading]}>
        <ReposContext.Provider value={[repos, setRepos, getRepos]}>
          <CurrentRepoContext.Provider
            value={[currentRepo, setCurrentRepo, getRepo]}>
            <TabContext.Provider value={[tab, setTab]}>
              {props.children}
            </TabContext.Provider>
          </CurrentRepoContext.Provider>
        </ReposContext.Provider>
      </LoadingContext.Provider>
    </>
  );
}

function App() {
  return (
    <MultiContext>
      <div className="p-4">
        <TopNav />
        <div className="row mt-4">
          <SideNav />
          <DisplayPanel />
        </div>
      </div>
    </MultiContext>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
