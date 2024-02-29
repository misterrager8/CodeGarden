const ReposContext = React.createContext();
const CurrentRepoContext = React.createContext();
const LoadingContext = React.createContext();
const TabContext = React.createContext();
const PageContext = React.createContext();
const SettingsContext = React.createContext();

const tags = [
  "misc",
  "bugfix",
  "refactor",
  "documentation",
  "feature",
  "tweak",
  "ui",
];

const defaultSettings = {
  theme: "light",
  tab: "readme",
  lastOpened: "",
};

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

function CreateRepoForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [, , getRepo] = React.useContext(CurrentRepoContext);
  const [, , getRepos] = React.useContext(ReposContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [page, setPage] = React.useContext(PageContext);

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
        getRepo(data.name);
        setLoading(false);
        setName("");
        setDescription("");
        setPage("repos");
        getRepos();
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
        <button
          title="Checkout branch."
          onClick={() => checkout(item.name)}
          className="btn border-0">
          <i className="bi bi-cart-check"></i>
        </button>
        <button
          title="Merge branch."
          onClick={() => mergeBranch(item.name)}
          className="btn border-0">
          <i className="bi bi-arrow-repeat"></i>
        </button>
        {!["master", "main"].includes(item.name) && (
          <>
            {deleting && (
              <button
                onClick={() => deleteBranch(item.name)}
                className="btn border-0">
                <i className="bi bi-question-lg"></i>
              </button>
            )}
            <button
              onClick={() => setDeleting(!deleting)}
              className="btn border-0">
              <i className="bi bi-x-circle"></i>
            </button>
          </>
        )}
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
        <i className="me-2 bi bi-signpost-split-fill"></i>
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
          <i className="bi bi-chevron-double-up me-2"></i>Push
        </button>
        <button className="btn border-0" onClick={() => pull()}>
          <i className="bi bi-chevron-double-down me-2"></i>Pull
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
        maxLength={50}
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
          <i className="me-2 bi bi-tag-fill"></i>
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
  const [currentRepo, , getRepo] = React.useContext(CurrentRepoContext);
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
        getRepo(currentRepo.name);
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
  const [settings, setSettings] = React.useContext(SettingsContext);

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
    <div className="d-flex justify-content-between p-1 diff-item">
      <span>
        <i className="bi bi-record-fill me-2" style={{ color: item.color }}></i>
        {item.name}
      </span>
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
          required
          autoComplete="off"
          maxLength={50}
          className="form-control border-0 fw-bold"
          value={name}
          onChange={onChangeName}
        />
        <a
          title="See detailed description of this TODO."
          className={"btn" + (showDescription ? "" : " border-0")}
          onClick={() => setShowDescription(!showDescription)}>
          <i
            className={
              "bi bi-file-earmark-" +
              (description?.length > 0 ? "medical-fill" : "plus")
            }></i>
        </a>
      </div>
      {(showDescription || item.status === "active") && (
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
            title="Toggle whether this TODO is actively being worked on."
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
                "bi bi-chevron-double" +
                (item.status === "open" ? "-right" : "-left")
              }></i>
          </a>
        )}
        {currentRepo.diffs.length > 0 && (
          <a
            title="Commit changes using this TODO as commit message."
            onClick={() => commitTodo()}
            className="btn border-0">
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
  const [showDetails, setShowDetails] = React.useState(false);
  const [details, setDetails] = React.useState("");

  const getCommit = () => {
    setLoading(true);
    apiCall(
      "/get_commit",
      {
        name: currentRepo.name,
        abbrev_hash: item.abbrev_hash,
      },
      function (data) {
        setLoading(false);
        setDetails(data.details);
      }
    );
  };

  React.useEffect(() => {
    showDetails ? getCommit() : setDetails("");
  }, [showDetails]);

  return (
    <>
      <a
        onClick={() => setShowDetails(!showDetails)}
        className={
          "d-flex justify-content-between p-1" +
          (showDetails ? "" : " log-item")
        }>
        <div className="d-flex justify-content-between w-50">
          <span>
            <i className="bi bi-code-slash me-2"></i>
            {item.name}
          </span>
          <span>{item.abbrev_hash}</span>
        </div>

        <span>{item.timestamp}</span>
      </a>
      {showDetails && (
        <>
          <hr />
          <div
            className="m-4 font-monospace p-4"
            style={{ whiteSpace: "pre-wrap" }}>
            {details}
          </div>
        </>
      )}
    </>
  );
}

function IgnoreForm() {
  const [, setLoading] = React.useContext(LoadingContext);
  const [currentRepo, , getRepo] = React.useContext(CurrentRepoContext);
  const [name, setName] = React.useState("");

  const createIgnore = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCall(
      "/create_ignore",
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

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form className="input-group mb-3" onSubmit={(e) => createIgnore(e)}>
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

function IgnoreItem({ id, item }) {
  const [deleting, setDeleting] = React.useState(false);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [loading, setLoading] = React.useContext(LoadingContext);

  const deleteIgnore = () => {
    setLoading(true);
    apiCall(
      "/delete_ignore",
      {
        repository: currentRepo.name,
        id: id,
      },
      function (data) {
        setLoading(false);
        getRepo(currentRepo.name);
      }
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <div>{item.name}</div>
      <div className="btn-group btn-group-sm">
        {deleting && (
          <button onClick={() => deleteIgnore()} className="btn border-0">
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
          <button onClick={() => setMode("edit")} className="btn border-0">
            <i className="bi bi-pen me-2"></i>Edit
          </button>
        ) : (
          <>
            <button onClick={() => setMode("view")} className="btn border-0">
              <i className="bi bi-eye me-2"></i>View
            </button>
            <button onClick={() => editReadme()} className="btn border-0">
              <i
                className={
                  "me-2 bi bi-" + (saved ? "check-lg" : "floppy2")
                }></i>
              Save
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
            className="form-control h-100 border-0"></textarea>
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
    <div className="w-100">
      {currentRepo.log.length > 0 && (
        <button
          onClick={() => revertCommit()}
          className="btn btn-sm border-0 mb-3">
          <i className="bi bi-dash-circle me-2"></i>
          Revert Previous Commit
        </button>
      )}
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

  const exportTodos = () => {
    setLoading(true);
    apiCall(
      "/export_todos",
      {
        name: currentRepo.name,
      },
      function (data) {
        getRepo(currentRepo.name);
        setLoading(false);
      }
    );
  };

  const importTodos = () => {
    setLoading(true);
    apiCall(
      "/import_todos",
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
      <div className="btn-group btn-group-sm mb-3">
        <button onClick={() => exportTodos()} className="btn border-0">
          <i className="bi bi-save2 me-2"></i>
          Export Todos
        </button>
        <button onClick={() => importTodos()} className="btn border-0">
          <i className="bi bi-save me-2"></i>
          Import Todos
        </button>
      </div>
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
              <button
                onClick={() => clearCompleted()}
                className="btn btn-sm border-0">
                <i className="bi bi-x-circle me-2"></i>Clear Completed
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
      <IgnoreForm />
      {currentRepo.ignored.map((x, id) => (
        <IgnoreItem key={x.name} id={id} item={x} />
      ))}
    </div>
  );
}

function DisplayPanel() {
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [settings, setSettings] = React.useContext(SettingsContext);

  return (
    <>
      {currentRepo.length !== 0 && (
        <div className="col-10">
          <div className="p-2 h-100">
            {settings.tab === "readme" ? (
              <Readme />
            ) : settings.tab === "changes" ? (
              <Changes />
            ) : settings.tab === "log" ? (
              <Log />
            ) : settings.tab === "todos" ? (
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
  const [settings, setSettings] = React.useContext(SettingsContext);

  return (
    <>
      {currentRepo.length !== 0 && (
        <div className="col-2">
          <Branches />
          <div className="w-100">
            <button
              onClick={() => setSettings({ ...settings, tab: "readme" })}
              className={
                "w-100 my-1 btn border-0 d-flex px-4" +
                (settings.tab === "readme" ? " active" : "")
              }>
              <i className="me-2 bi bi-book"></i>README
            </button>
            <button
              onClick={() => setSettings({ ...settings, tab: "changes" })}
              className={
                "w-100 my-1 btn border-0 d-flex justify-content-between px-4" +
                (settings.tab === "changes" ? " active" : "")
              }>
              <span>
                <i className="me-2 bi bi-file-earmark-diff"></i>Changes
              </span>
              <span className="small">{currentRepo.diffs.length}</span>
            </button>
            <button
              onClick={() => setSettings({ ...settings, tab: "log" })}
              className={
                "w-100 my-1 btn border-0 d-flex px-4" +
                (settings.tab === "log" ? " active" : "")
              }>
              <i className="me-2 bi bi-clock-history"></i>Log
            </button>
            <button
              onClick={() => setSettings({ ...settings, tab: "todos" })}
              className={
                "w-100 my-1 btn border-0 d-flex justify-content-between px-4" +
                (settings.tab === "todos" ? " active" : "")
              }>
              <span>
                <i className="me-2 bi bi-check2-all"></i>TODOs
              </span>
              <span className="small">
                {currentRepo.todos.filter((x) => !x.done).length}
              </span>
            </button>
            <button
              onClick={() => setSettings({ ...settings, tab: "ignored" })}
              className={
                "w-100 my-1 btn border-0 d-flex justify-content-between px-4" +
                (settings.tab === "ignored" ? " active" : "")
              }>
              <span>
                <i className="me-2 bi bi-eye-slash"></i>Ignored
              </span>
              <span className="small">{currentRepo.ignored.length}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function TopNav() {
  const [loading, setLoading] = React.useContext(LoadingContext);
  const [repos, setRepos, getRepos] = React.useContext(ReposContext);
  const [currentRepo, setCurrentRepo, getRepo] =
    React.useContext(CurrentRepoContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [page, setPage] = React.useContext(PageContext);
  const [settings, setSettings] = React.useContext(SettingsContext);

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
          <div id="repos" className="dropdown-menu" style={{ width: "250px" }}>
            <button
              onClick={() => setPage("new")}
              className={"dropdown-item d-flex justify-content-between"}>
              <span>
                <i className="me-2 bi bi-plus-circle"></i>New Repo
              </span>
            </button>
            {repos.map((x) => (
              <button
                onClick={() => {
                  setPage("repos");
                  setCurrentRepo(x);
                }}
                key={x.name}
                className={"dropdown-item d-flex justify-content-between"}>
                <span>{x.name}</span>
                <div>
                  {x.diffs.length > 0 && (
                    <i
                      title="There are uncommitted changes here."
                      className="bi bi-circle-fill text-primary me-2"></i>
                  )}
                  {x.current_branch.name !== "master" && (
                    <i
                      title="Non-master branch checked-out."
                      className="bi bi-signpost-split-fill text-warning"></i>
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
              title="Refresh"
              className="btn border-0 ms-2"
              onClick={() => {
                getRepo(currentRepo.name);
                getRepos();
              }}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
            <a
              title="Copy path"
              className="btn border-0"
              onClick={() => copyPath()}>
              <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
            </a>
            {currentRepo.remote_url && (
              <a
                title="See GitHub page for this repo."
                target="_blank"
                href={currentRepo.remote_url}
                className="btn border-0">
                <i className="bi bi-github"></i>
              </a>
            )}
            <a
              title="Export all info for this repo to a JSON file."
              className="btn border-0"
              onClick={() => exportRepository()}>
              <i className="bi bi-filetype-json"></i>
            </a>
            <a className="btn border-0" onClick={() => setDeleting(!deleting)}>
              <i className="bi bi-x-circle"></i>
            </a>
            {deleting && (
              <a className="btn border-0" onClick={() => deleteRepository()}>
                Delete Repo<i className="bi bi-question-lg"></i>
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
            {settings.theme}
          </button>
          <div id="themes" className="dropdown-menu text-center">
            {themes.map((x) => (
              <React.Fragment key={x}>
                {settings.theme !== x && (
                  <a
                    onClick={() => setSettings({ ...settings, theme: x })}
                    className="dropdown-item text-capitalize">
                    {x}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button className="btn" onClick={() => setPage("settings")}>
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

function App() {
  const [repos, setRepos] = React.useState([]);
  const [currentRepo, setCurrentRepo] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState("repos");
  const [config, setConfig] = React.useState([]);
  const [copied, setCopied] = React.useState(false);
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("CodeGarden")) || defaultSettings
  );

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

  const getConfig = () => {
    setLoading(true);
    apiCall("/settings", {}, (data) => {
      setConfig(data);
      setLoading(false);
    });
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 4));
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  React.useEffect(() => {
    localStorage.setItem("CodeGarden", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  React.useEffect(() => {
    getRepos();
    settings.lastOpened !== "" && getRepo(settings.lastOpened);
  }, []);

  React.useEffect(() => {
    setSettings({
      ...settings,
      lastOpened: currentRepo.length !== 0 ? currentRepo.name : "",
    });
  }, [currentRepo]);

  React.useEffect(() => {
    if (page !== "repos") {
      setCurrentRepo([]);
      page === "settings" ? getConfig() : setConfig([]);
    }
  }, [page]);

  return (
    <>
      <SettingsContext.Provider value={[settings, setSettings]}>
        <LoadingContext.Provider value={[loading, setLoading]}>
          <PageContext.Provider value={[page, setPage]}>
            <ReposContext.Provider value={[repos, setRepos, getRepos]}>
              <CurrentRepoContext.Provider
                value={[currentRepo, setCurrentRepo, getRepo]}>
                <div className="p-4">
                  <TopNav />
                  {page === "repos" ? (
                    <>
                      <div className="row mt-4 ">
                        <SideNav />
                        <DisplayPanel />
                      </div>
                    </>
                  ) : page === "settings" ? (
                    <div className="mt-4">
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {JSON.stringify({ ...config, ...settings }, null, 4)}
                      </div>
                      <button
                        className="btn border-0"
                        onClick={() => copyConfig()}>
                        <i
                          className={
                            "bi bi-clipboard" + (copied ? "-check" : "")
                          }></i>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <CreateRepoForm />
                    </div>
                  )}
                </div>
              </CurrentRepoContext.Provider>
            </ReposContext.Provider>
          </PageContext.Provider>
        </LoadingContext.Provider>
      </SettingsContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
