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
  lastOpened: null,
};

const MultiContext = React.createContext();

const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));

function Icon({ className, name }) {
  return <i className={className + " bi bi-" + name}></i>;
}

function Button({
  className,
  type_ = "button",
  onClick,
  icon,
  text,
  size,
  tooltip,
}) {
  return (
    <button
      title={tooltip}
      type={type_}
      className={className + " btn" + (size === "sm" ? " btn-sm" : "")}
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-2" : "")}></i>}
      {text}
    </button>
  );
}

function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
  size,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={
        className + " form-control" + (size === "sm" ? " form-control-sm" : "")
      }
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}

function ButtonGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " btn-group" + (size === "sm" ? " btn-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function InputGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " input-group" + (size === "sm" ? " input-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function Spinner({ className }) {
  return (
    <span className={className + " spinner-border spinner-border-sm"}></span>
  );
}

function Badge({ className, icon, text }) {
  return (
    <span className={className + " badge"}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </span>
  );
}

function Dropdown({
  className,
  classNameBtn,
  classNameMenu,
  target,
  icon,
  children,
  text,
  autoClose = true,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-auto-close={autoClose}
        data-bs-toggle="dropdown"
        className={classNameBtn + " dropdown-toggle"}>
        {icon && <Icon name={icon} className="me-2" />}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}

function Heading({ className, size = 1, icon, text }) {
  return (
    <div className={className + " text-center h" + size}>
      {icon && <Icon name={icon} className="me-3" />}
      {text}
    </div>
  );
}

function HomePage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <>
      {multiCtx.currentRepo ? (
        <div className={className}>
          <div className="row h-100">
            <div className="col-3 h-100">
              <ChangesAndHistory />
              <hr className="my-4" />
              <Todos />
            </div>
            <div className="col-7">
              <Readme />
            </div>
            <div className="col-2">
              <hr className="my-4" />
              {multiCtx.currentRepo.stashes.length > 0 ? (
                <>
                  {multiCtx.currentRepo.stashes.map((x, idx) => (
                    <StashItem id={idx} item={x} />
                  ))}
                </>
              ) : (
                <div className="small m-auto opacity-50 text-center ">
                  No Stashes
                </div>
              )}
              <hr className="my-4" />
              <Ignored />
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex h-100">
          <div className="m-auto w-75">
            {multiCtx.repos.length !== 0 && (
              <div className="mb-4">
                <div className="row border-bottom mb-3 h5 py-2 ">
                  <div className="col-1"></div>
                  <div className="col">Name</div>
                  <div className="col"></div>
                  <div className="col">Current Branch</div>
                  <div className="col">Last Updated</div>
                </div>
                {multiCtx.repos.map((x) => (
                  <RepoListItem key={x.name} item={x} />
                ))}
                <hr />
              </div>
            )}
            <div className="text-center">
              <Button
                size="sm"
                icon="plus-lg"
                className="mx-auto"
                text="New Repository"
                onClick={() => multiCtx.setCurrentPage("new")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SettingsPage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className}>
      <Heading icon="gear" text="Settings" className="mb-4" />
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(multiCtx.settings, null, 4)}
      </div>
    </div>
  );
}

function NewRepoPage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className}>
      <div className="d-flex h-100">
        <CreateRepoForm className="w-50 m-auto" />
      </div>
    </div>
  );
}

function AboutPage({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [readme, setReadme] = React.useState("");

  React.useEffect(() => {
    multiCtx.setLoading(true);
    api("about", {}, (data) => {
      setReadme(data.readme);
      multiCtx.setLoading(false);
    });
  }, []);

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: window.markdownit().render(readme),
        }}></div>
    </div>
  );
}

function Display({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + ""} style={{ height: "700px" }}>
      {multiCtx.currentPage === "settings" ? (
        <SettingsPage />
      ) : multiCtx.currentPage === "about" ? (
        <AboutPage />
      ) : multiCtx.currentPage === "new" ? (
        <NewRepoPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [copied, setCopied] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    multiCtx.getRepos();
  }, []);

  const copyPath = () => {
    navigator.clipboard.writeText(multiCtx.currentRepo.path);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  const exportRepository = () => {
    multiCtx.setLoading(true);
    api(
      "export_repository",
      {
        name: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.setLoading(false);
      }
    );
  };

  const deleteRepository = () => {
    multiCtx.setLoading(true);
    api(
      "delete_repository",
      {
        name: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepos();
        multiCtx.setCurrentRepo(null);
        multiCtx.setLoading(false);
        setDeleting(false);
      }
    );
  };

  const push = () => {
    multiCtx.setLoading(true);
    api(
      "push",
      {
        name: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const pull = () => {
    multiCtx.setLoading(true);
    api(
      "pull",
      {
        name: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className={className + " between"}>
      <ButtonGroup size="sm">
        {multiCtx.loading && (
          <button className="btn border-0">
            <Spinner />
          </button>
        )}
        <Button
          onClick={() => {
            multiCtx.setCurrentPage("");
            multiCtx.setCurrentRepo(null);
            multiCtx.getRepos();
          }}
          className="border-0"
          text="code-garden"
          icon="flower2"
        />
        {multiCtx.currentRepo && (
          <Button
            icon="arrow-clockwise"
            // title="Refresh"
            className="border-0"
            onClick={() => {
              multiCtx.getRepo(multiCtx.currentRepo.name);
              multiCtx.getRepos();
            }}
          />
        )}
        <Dropdown
          classNameBtn="btn"
          target="repos"
          icon="git"
          className="btn-group btn-group-sm"
          text={
            multiCtx.currentRepo ? multiCtx.currentRepo.name : "Select Repo"
          }>
          <button
            className="dropdown-item small text-success between"
            onClick={() => multiCtx.setCurrentPage("new")}>
            <span>New Repository</span>
            <Icon className="p-1" name="plus-lg" />
          </button>
          {multiCtx.repos.map((x) => (
            <button
              key={x.name}
              className="dropdown-item small between"
              onClick={() => {
                multiCtx.setCurrentPage("");
                multiCtx.setCurrentRepo(x);
              }}>
              <span>{x.name}</span>
              <div>
                {x.diffs.length !== 0 && (
                  <span className="mx-1" style={{ color: "#D26D17" }}>
                    <Icon name="record-fill" className="" />
                    {x.diffs.length}
                  </span>
                )}
                {x.todos.length !== 0 && (
                  <span className="mx-1" style={{ color: "#499C42" }}>
                    <Icon name="check-all" className="" />
                    {x.todos.length}
                  </span>
                )}
              </div>
            </button>
          ))}
        </Dropdown>
        {multiCtx.currentRepo && (
          <Dropdown
            autoClose={false}
            className="btn-group btn-group-sm"
            icon="signpost-split-fill"
            classNameBtn="btn"
            target="branches"
            text={multiCtx.currentRepo.current_branch.name}>
            <ButtonGroup size="sm" className="w-100 px-1 mb-3">
              <Button
                onClick={() => push()}
                className="border-0"
                text="Push"
                icon="chevron-double-up"
              />
              <Button
                onClick={() => pull()}
                className="border-0"
                text="Pull"
                icon="chevron-double-down"
              />
            </ButtonGroup>
            <BranchForm className="px-2" />
            {multiCtx.currentRepo.branches.map((x) => (
              <>
                {`* ${multiCtx.currentRepo.current_branch.name}` !== x.name && (
                  <BranchItem item={x} />
                )}
              </>
            ))}
          </Dropdown>
        )}
      </ButtonGroup>
      <div>
        {multiCtx.currentRepo && (
          <ButtonGroup size="sm" className="me-3">
            <a
              title="See GitHub page for this repo."
              target="_blank"
              href={multiCtx.currentRepo.remote_url}
              className="btn">
              <Icon name="github" className="me-2" />
              GitHub
            </a>
            <Button
              onClick={() => exportRepository()}
              icon="save-fill"
              text="Export"
            />
            <Button
              onClick={() => copyPath()}
              icon={"clipboard" + (copied ? "-check" : "")}
              text="Copy Path"
            />
            {deleting && (
              <Button
                onClick={() => deleteRepository()}
                icon="question-lg"
                text="Delete Repo"
              />
            )}
            <Button
              onClick={() => setDeleting(!deleting)}
              icon="x-lg"
              text="Delete Repo"
            />
          </ButtonGroup>
        )}
        <ButtonGroup size="sm">
          <Button
            text={multiCtx.settings.theme}
            icon={
              multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"
            }
            className="text-capitalize"
            onClick={() =>
              multiCtx.setSettings({
                ...multiCtx.settings,
                theme: multiCtx.settings.theme === "light" ? "dark" : "light",
              })
            }
          />
          <Button
            text="Settings"
            icon="gear"
            className={multiCtx.currentPage === "settings" ? " active" : ""}
            onClick={() => multiCtx.setCurrentPage("settings")}
          />
          <Button
            className={multiCtx.currentPage === "about" ? " active" : ""}
            text="About"
            icon="info-circle"
            onClick={() => multiCtx.setCurrentPage("about")}
          />
        </ButtonGroup>
      </div>
    </div>
  );
}

function DiffItem({ item, className }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

  const resetFile = () => {
    multiCtx.setLoading(true);
    api(
      "reset_file",
      {
        repository: multiCtx.currentRepo.name,
        name: item.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className={className + " between p-1 diff-item"}>
      <span>
        <i className="bi bi-record me-2" style={{ color: item.color }}></i>
        {item.name}
      </span>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            icon="question-lg"
            className="border-0"
            onClick={() => resetFile()}
          />
        )}
        <Button
          icon="x-lg"
          className="border-0"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}

function LogItem({ item, id, className }) {
  const multiCtx = React.useContext(MultiContext);

  const revertCommit = () => {
    multiCtx.setLoading(true);
    api(
      "run_command",
      {
        repository: multiCtx.currentRepo.name,
        cmd: "git reset --soft HEAD~1",
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className={className + " py-2"}>
      <div>
        <div className="between mb-1">
          <div className="fw-bold text-truncate">
            {id === 0 && (
              <Button
                icon="rewind-fill"
                className="border-0 me-1"
                size="sm"
                onClick={() => revertCommit()}
              />
            )}
            <span title={item.name}>{item.name}</span>
          </div>
          <span className="small font-monospace">{item.abbrev_hash}</span>
        </div>
        <div className="between small fw-light">
          <span>{item.timestamp}</span>
          <span>{item.author}</span>
        </div>
      </div>
    </div>
  );
}

function TodoItem({ item, className }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

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
    multiCtx.setLoading(true);
    api(
      "delete_todo",
      {
        id: item.id,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const commitTodo = () => {
    multiCtx.setLoading(true);
    api(
      "commit_todo",
      {
        id: item.id,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const toggleTodo = () => {
    multiCtx.setLoading(true);
    api(
      "toggle_todo",
      {
        id: item.id,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const editTodo = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "edit_todo",
      {
        id: item.id,
        new_name: name,
        new_tag: tag,
        new_status: item.status,
        new_desc: description,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
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
      className={
        className +
        " border-bottom mb-2 py-1" +
        (item.done ? " opacity-25" : "")
      }>
      <InputGroup size="sm" className="mb-1">
        <ButtonGroup size="sm">
          {saved && (
            <span className="btn border-0">
              <i className="bi bi-floppy2"></i>
            </span>
          )}
          <span className="btn border-0">#{item.id}</span>
        </ButtonGroup>
        <Input
          required={true}
          className="border-0 fw-bold"
          value={name}
          onChange={onChangeName}
        />
        <Button
          // title="See detailed description of this TODO."
          className={showDescription ? "" : " border-0"}
          onClick={() => setShowDescription(!showDescription)}
          icon={
            "file-earmark" + (description?.length > 0 ? "-fill" : "")
          }></Button>
        <Dropdown
          className="btn-group btn-group-sm"
          target="edit-tags"
          classNameBtn="btn border-0"
          icon="tag-fill"
          text={tag}>
          {tags.map((x) => (
            <a key={x} onClick={() => setTag(x)} className="dropdown-item">
              {x}
            </a>
          ))}
        </Dropdown>
      </InputGroup>
      <InputGroup size="sm">
        {multiCtx.currentRepo.diffs.length > 0 && (
          <Button
            icon="file-earmark-diff"
            // title="Commit changes using this TODO as commit message."
            onClick={() => commitTodo()}
            className="border-0"
          />
        )}
        <Button
          icon="check-lg"
          onClick={() => toggleTodo()}
          className="border-0"
        />
        {item.status !== "completed" && (
          <Button
            // title="Toggle whether this TODO is actively being worked on."
            onClick={() => {
              multiCtx.setLoading(true);
              api(
                "edit_todo",
                {
                  id: item.id,
                  new_name: name,
                  new_tag: tag,
                  new_status: item.status === "open" ? "active" : "open",
                  new_desc: description,
                },
                function (data) {
                  multiCtx.getRepo(multiCtx.currentRepo.name);
                  multiCtx.setLoading(false);
                }
              );
            }}
            className={"border-0" + (item.status === "open" ? "" : " active")}
            icon={
              "bi bi-arrow" + (item.status === "open" ? "-up" : "-down")
            }></Button>
        )}
        <Button
          icon="x-lg"
          className="border-0"
          onClick={() => setDeleting(!deleting)}
        />
        {deleting && (
          <Button
            icon="question-lg"
            className="border-0"
            onClick={() => deleteTodo()}
          />
        )}
      </InputGroup>
      {showDescription && (
        <textarea
          rows={description.split("\n")?.length + 1}
          value={description}
          onChange={onChangeDescription}
          placeholder="Description"
          className="form-control form-control-sm my-3 desc"></textarea>
      )}
      <button className="invisible" type="submit"></button>
    </form>
  );
}

function IgnoreItem({ id, item, className }) {
  const [deleting, setDeleting] = React.useState(false);
  const multiCtx = React.useContext(MultiContext);

  const deleteIgnore = () => {
    multiCtx.setLoading(true);
    api(
      "delete_ignore",
      {
        repository: multiCtx.currentRepo.name,
        id: id,
      },
      function (data) {
        multiCtx.setLoading(false);
        multiCtx.getRepo(multiCtx.currentRepo.name);
      }
    );
  };

  return (
    <div className={className + " between"}>
      <div>{item.name}</div>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            icon="question-lg"
            onClick={() => deleteIgnore()}
            className="border-0"
          />
        )}
        <Button
          icon="x-lg"
          className="border-0"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}

function StashItem({ id, item, className }) {
  const [deleting, setDeleting] = React.useState(false);
  const multiCtx = React.useContext(MultiContext);

  const unstash = () => {
    multiCtx.setLoading(true);
    api(
      "unstash",
      {
        repository: multiCtx.currentRepo.name,
        id: id,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const dropStash = () => {
    multiCtx.setLoading(true);
    api(
      "drop_stash",
      {
        repository: multiCtx.currentRepo.name,
        id: id,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className="text-truncate">
      <ButtonGroup size="sm" className="me-1">
        <Button
          onClick={() => unstash()}
          className="border-0"
          icon="chevron-double-up"
        />
        <Button
          onClick={() => setDeleting(!deleting)}
          className="border-0"
          icon="x-lg"
        />
        {deleting && (
          <Button
            onClick={() => dropStash()}
            className="border-0"
            icon="question-lg"
          />
        )}
      </ButtonGroup>
      <span title={item} className="small">
        {item}
      </span>
    </div>
  );
}

function BranchItem({ id, item, className }) {
  const [deleting, setDeleting] = React.useState(false);
  const multiCtx = React.useContext(MultiContext);

  const checkout = () => {
    multiCtx.setLoading(true);
    api(
      "checkout_branch",
      {
        repository: multiCtx.currentRepo.name,
        name: item.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const deleteBranch = () => {
    multiCtx.setLoading(true);
    api(
      "delete_branch",
      {
        repository: multiCtx.currentRepo.name,
        name: item.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <div className={className + " px-3"}>
      <ButtonGroup size="sm" className="w-100">
        <Button
          size="sm"
          className="border-0 w-75 text-truncate"
          onClick={() => checkout(item.name)}
          text={item.name}
        />
        {!["main", "master"].includes(item.name) && (
          <>
            <Button
              className="border-0"
              onClick={() => setDeleting(!deleting)}
              icon="x-lg"
            />
            {deleting && (
              <Button
                className="border-0"
                onClick={() => deleteBranch()}
                icon="question-lg"
              />
            )}
          </>
        )}
      </ButtonGroup>
    </div>
  );
}

function RepoListItem({ item, className }) {
  const [copied, setCopied] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " row hover my-1"}>
      <div className="col-1">
        <ButtonGroup size="sm">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(item.path);
              setCopied(true);
              setTimeout(() => setCopied(false), 500);
            }}
            className="py-2 px-2 border-0"
            icon={"clipboard" + (copied ? "-check" : "")}
          />
          {item.remote_url && (
            <a
              target="_blank"
              href={item.remote_url}
              className="btn border-0 py-2 px-2">
              <Icon className="" name="github" />
            </a>
          )}
          <Button
            icon="x-lg"
            className="border-0"
            onClick={() => setDeleting(!deleting)}
          />
          {deleting && (
            <Button
              icon="question-lg"
              className="border-0"
              onClick={() => {
                multiCtx.setLoading(true);
                api(
                  "delete_repository",
                  {
                    name: item.name,
                  },
                  function (data) {
                    multiCtx.getRepos();
                    multiCtx.setLoading(false);
                  }
                );
              }}
            />
          )}
        </ButtonGroup>
      </div>
      <div className="col">
        <a
          onClick={() => {
            multiCtx.setCurrentPage("");
            multiCtx.setCurrentRepo(item);
          }}>
          {item.name}
        </a>
      </div>
      <div className="col">
        {item.branches.length > 1 && (
          <span className="mx-2">
            <Icon className="me-1" name="signpost-split-fill" />
            {item.branches.length}
          </span>
        )}
        {item.diffs.length !== 0 && (
          <span className="mx-2" style={{ color: "#D26D17" }}>
            <Icon className="me-1" name="record-fill" />
            {item.diffs.length}
          </span>
        )}
        {item.todos.length !== 0 && (
          <span className="mx-2" style={{ color: "#499C42" }}>
            <Icon className="me-1" name="check-all" />
            {item.todos.length}
          </span>
        )}
      </div>
      <div className="col">{item.current_branch.name}</div>
      <div className="col">{item.log[0].timestamp}</div>
    </div>
  );
}

function ChangesAndHistory({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [tab, setTab] = React.useState("changes");

  return (
    <div className={className} style={{ height: "35%" }}>
      <ButtonGroup size="sm" className="w-100 mb-3">
        <Button
          className={tab === "changes" ? "active" : ""}
          onClick={() => setTab("changes")}
          text={
            "Changes" +
            (multiCtx.currentRepo.diffs.length > 0
              ? ` (${multiCtx.currentRepo.diffs.length})`
              : "")
          }
        />
        <Button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
          text="History"
        />
      </ButtonGroup>
      {multiCtx.currentRepo.diffs.length !== 0 && tab === "changes" && (
        <CommitForm />
      )}
      <div
        style={{
          height:
            multiCtx.currentRepo.diffs.length !== 0 && tab === "changes"
              ? "72%"
              : "90%",
          overflow: "auto",
        }}>
        {tab === "changes" ? (
          <div>
            {multiCtx.currentRepo.diffs.length !== 0 ? (
              <>
                {multiCtx.currentRepo.diffs.map((x, id) => (
                  <DiffItem key={`diff${id}`} className="mb-1" item={x} />
                ))}
              </>
            ) : (
              <div className="d-flex h-100">
                <p className="m-auto opacity-50">No Changes</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {multiCtx.currentRepo.log.map((x, id) => (
              <LogItem key={`log${id}`} id={id} className="mb-1" item={x} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TodoForm({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("misc");

  const onChangeName = (e) => setName(e.target.value);

  const createTodo = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "create_todo",
      {
        repository: multiCtx.currentRepo.name,
        name: name,
        tag: tag,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
        setName("");
      }
    );
  };

  const clearCompleted = () => {
    multiCtx.setLoading(true);
    api(
      "clear_completed",
      {
        repo: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) => createTodo(e)}>
      <Input
        value={name}
        onChange={onChangeName}
        required={true}
        placeholder="New TODO"
      />
      <Dropdown
        icon="tag-fill"
        target="tags"
        text={tag}
        className="btn-group btn-group-sm"
        classNameBtn="btn border-0">
        {tags.map((x) => (
          <a
            key={`${x}-alt`}
            onClick={() => setTag(x)}
            className="dropdown-item">
            {x}
          </a>
        ))}
      </Dropdown>
      {multiCtx.currentRepo.todos.filter((x) => x.done).length !== 0 && (
        <Button
          size="sm"
          icon="x-lg"
          text={`Clear Completed (${
            multiCtx.currentRepo.todos.filter((x) => x.done).length
          })`}
          onClick={() => clearCompleted()}
          className="border-0"
        />
      )}
    </form>
  );
}

function BranchForm({ className }) {
  const [name, setName] = React.useState("");
  const multiCtx = React.useContext(MultiContext);

  const onChangeName = (e) => setName(e.target.value);

  const createBranch = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "create_branch",
      {
        repository: multiCtx.currentRepo.name,
        name: name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
        setName("");
      }
    );
  };

  return (
    <form onSubmit={(e) => createBranch(e)} className={className + ""}>
      <Input
        size="sm"
        value={name}
        required={true}
        onChange={onChangeName}
        placeholder="New Branch"
      />
    </form>
  );
}

function CommitForm({ className }) {
  const [msg, setMsg] = React.useState("");
  const [resetting, setResetting] = React.useState(false);
  const multiCtx = React.useContext(MultiContext);

  const onChangeMsg = (e) => setMsg(e.target.value);

  const commit = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "commit",
      {
        name: multiCtx.currentRepo.name,
        msg: msg,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
        setMsg("");
      }
    );
  };

  const amendCommit = () => {
    multiCtx.setLoading(true);
    api(
      "run_command",
      {
        repository: multiCtx.currentRepo.name,
        cmd: "git commit -a --amend --no-edit",
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const resetAll = () => {
    multiCtx.setLoading(true);
    api(
      "reset_all",
      {
        name: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  const stash = () => {
    multiCtx.setLoading(true);
    api(
      "push_stash",
      {
        repository: multiCtx.currentRepo.name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <form
      className={className + " input-group input-group-sm"}
      onSubmit={(e) => commit(e)}>
      <Input
        value={msg}
        onChange={onChangeMsg}
        required={true}
        placeholder="Commit"
      />
      <Button
        text="Stash"
        icon="archive"
        onClick={() => stash()}
        className="border-0"
      />
      <Button
        text="Amend"
        icon="eraser-fill"
        // text="Amend Changes To Last Commit"
        onClick={() => amendCommit()}
        className="border-0"
      />
      <Button
        text="Reset All"
        icon="x-lg"
        // text="Reset All"
        className="border-0"
        onClick={() => setResetting(!resetting)}
      />
      {resetting && (
        <Button
          icon="question-lg"
          className="border-0"
          onClick={() => resetAll()}
        />
      )}
    </form>
  );
}

function Todos({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className} style={{ height: "30%" }}>
      <TodoForm className="mb-3" />

      <div style={{ height: "90%", overflow: "auto" }}>
        {multiCtx.currentRepo.todos.length !== 0 ? (
          <>
            {multiCtx.currentRepo.todos.map((x) => (
              <TodoItem key={x.id} item={x} />
            ))}
          </>
        ) : (
          <div className="d-flex h-100">
            <p className="m-auto opacity-50">No TODOs</p>
          </div>
        )}
      </div>
    </div>
  );
}

function IgnoreForm({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");

  const createIgnore = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "create_ignore",
      {
        repository: multiCtx.currentRepo.name,
        name: name,
      },
      function (data) {
        multiCtx.getRepo(multiCtx.currentRepo.name);
        multiCtx.setLoading(false);
        setName("");
      }
    );
  };

  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      className={className + " input-group input-group-sm mb-3"}
      onSubmit={(e) => createIgnore(e)}>
      <Input
        required={true}
        value={name}
        onChange={onChangeName}
        placeholder="New Ignore Item"
      />
    </form>
  );
}

function Ignored({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className} style={{ height: "20%" }}>
      <IgnoreForm />
      <div style={{ height: "90%", overflow: "auto" }}>
        {multiCtx.currentRepo.ignored.length !== 0 ? (
          <>
            {multiCtx.currentRepo.ignored.map((x, id) => (
              <IgnoreItem className="mb-1" key={x.name} id={id} item={x} />
            ))}
          </>
        ) : (
          <div className="d-flex h-100">
            <p className="m-auto opacity-50">No Ignored</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Readme({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [tab, setTab] = React.useState("view");
  const [readme, setReadme] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const onChangeReadme = (e) => setReadme(e.target.value);

  const editReadme = () => {
    multiCtx.setLoading(true);
    api(
      "edit_readme",
      {
        name: multiCtx.currentRepo.name,
        content: readme,
      },
      function (data) {
        multiCtx.setLoading(false);
        setSaved(true);
        multiCtx.getRepo(multiCtx.currentRepo.name);
        setTimeout(function () {
          setSaved(false);
        }, 1500);
      }
    );
  };

  React.useEffect(() => {
    multiCtx.currentRepo && setReadme(multiCtx.currentRepo.readme.txt);
  }, [multiCtx.currentRepo]);

  return (
    <div className={className}>
      <ButtonGroup size="sm" className="mb-4">
        <Button
          onClick={() => setTab(tab === "edit" ? "view" : "edit")}
          text={tab === "edit" ? "View" : "Edit README"}
          icon={tab === "edit" ? "eye" : "pen"}
        />
        {tab === "edit" && (
          <Button
            onClick={() => editReadme()}
            text="Save"
            icon={saved ? "check-lg" : "floppy2"}
          />
        )}
      </ButtonGroup>
      <div style={{ height: "700px" }} className="d-flex">
        {tab === "edit" && (
          <textarea
            onChange={onChangeReadme}
            value={readme}
            className="form-control form-control-sm h-100 w-50"></textarea>
        )}
        <div
          className={
            "overflow-auto h-100 w-" + (tab === "edit" ? "50 px-3" : "100")
          }
          dangerouslySetInnerHTML={{
            __html: window.markdownit().render(readme),
          }}></div>
      </div>
    </div>
  );
}

function CreateRepoForm({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const createRepo = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "create_repository",
      {
        name: name,
        brief_descrip: description,
      },
      (data) => {
        multiCtx.setCurrentPage("");
        multiCtx.getRepo(data.name);
        multiCtx.getRepos();
        multiCtx.setLoading(false);
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
    multiCtx.setLoading(true);
    api("generate_name", {}, (data) => {
      setName(data.name);
      setDescription(`Created on ${new Date().toDateString()}`);
      multiCtx.setLoading(false);
    });
  };

  return (
    <form className={className} onSubmit={(e) => createRepo(e)}>
      <InputGroup size="sm" className="mb-3">
        <Input
          onChange={onChangeName}
          value={name}
          placeholder="Name"
          required={true}
        />
        <Button
          onClick={() => generateName()}
          icon="shuffle"
          text="Generate Name"
        />
      </InputGroup>
      <textarea
        onChange={onChangeDescription}
        value={description}
        rows="20"
        className="form-control form-control-sm mb-3"
        placeholder="Description"
        required></textarea>
      <Button
        size="sm"
        text="Initialize Repository"
        type_="submit"
        className="w-100"
      />
    </form>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("code-garden")) || defaultSettings
  );
  const [repos, setRepos] = React.useState([]);
  const [currentRepo, setCurrentRepo] = React.useState(null);

  const getRepos = () => {
    setLoading(true);
    api("repositories", {}, (data) => {
      setRepos(data.repositories_);
      setLoading(false);
    });
  };

  const getRepo = (name) => {
    setLoading(true);
    api("repository", { name: name }, (data) => {
      setCurrentRepo(data);
      setLoading(false);
    });
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    repos: repos,
    setRepos: setRepos,
    currentRepo: currentRepo,
    setCurrentRepo: setCurrentRepo,
    getRepos: getRepos,
    getRepo: getRepo,
  };

  React.useEffect(() => {
    localStorage.setItem("code-garden", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  React.useEffect(() => {
    currentPage !== "" && setCurrentRepo(null);
  }, [currentPage]);

  React.useEffect(() => {
    setSettings({
      ...settings,
      lastOpened: currentRepo ? currentRepo.name : null,
    });
  }, [currentRepo]);

  React.useEffect(() => {
    settings.lastOpened && getRepo(settings.lastOpened);
  }, []);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-4">
        <Nav />
        <hr />
        <Display />
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
