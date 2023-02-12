function Navbar() {
    const [theme, setTheme] = React.useState(localStorage.getItem('CodeGarden'));

    const changeTheme = (theme_) => {
        localStorage.setItem('CodeGarden', theme_);
        document.documentElement.setAttribute('data-theme', theme_);
        setTheme(theme_);
    }

    React.useEffect(() => {
        changeTheme(theme);
    }, []);

    return (
        <nav className="sticky-top text-capitalize py-3">
            <div className="btn-group btn-group-sm">
                <a className="btn btn-outline-secondary dropdown-toggle" data-bs-target="#themes" data-bs-toggle="dropdown"><i className="bi bi-paint-bucket"></i> {theme}</a>
                <div id="themes" className="dropdown-menu text-center">
                    {theme !== 'light' && <a onClick={() => changeTheme('light')} className="dropdown-item small">light</a>}
                    {theme !== 'dark' && <a onClick={() => changeTheme('dark')} className="dropdown-item small">dark</a>}
                    {theme !== 'periwinkle' && <a onClick={() => changeTheme('periwinkle')} className="dropdown-item small">periwinkle</a>}
                    {theme !== 'vanilla' && <a onClick={() => changeTheme('vanilla')} className="dropdown-item small">vanilla</a>}
                    {theme !== 'lavender' && <a onClick={() => changeTheme('lavender')} className="dropdown-item small">lavender</a>}
                    {theme !== 'coral' && <a onClick={() => changeTheme('coral')} className="dropdown-item small">coral</a>}
                </div>
                <a className="btn btn-outline-secondary"><i className="bi bi-gear"></i> Settings</a>
                <a target="_blank" href="https://github.com/misterrager8/CodeGarden/" className="btn btn-outline-secondary"><i className="bi bi-info-circle"></i> About</a>
            </div>
        </nav>
        );
}

function NewBranchForm(props) {
    const [loading, setLoading] = React.useState(false);

    const createBranch = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/create_branch', {
            repo: props.repo.name,
            name: $('#new-branch').val()
        }, function(data) {
            props.callback(props.repo.name);
            setLoading(false);
        });
    }

    return (
        <div className="p-1">
            {loading && <span className="spinner-border spinner-border-sm"></span>}
            <form className="input-group input-group-sm" onSubmit={(e) => createBranch(e)}>
                <input required autoComplete="off" className="form-control border-success" placeholder="New Branch" id="new-branch" />
            </form>
        </div>
        );
}

function NewTodoForm(props) {
    const [loading, setLoading] = React.useState(false);

    const createTodo = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/create_todo', {
            name: props.repo.name,
            description: $('#new-todo').val()
        }, function(data) {
            props.callback(props.repo.name);
            setLoading(false);
            $('#new-todo').val('');
        });
    }

    return (
        <form className="input-group input-group-sm my-2" onSubmit={(e) => createTodo(e)}>
            <input required className="form-control" placeholder="New TODO" autoComplete="off" id="new-todo" />
        </form>
        );
}

function NewRepoForm(props) {
    const [loading, setLoading] = React.useState(false);
    const [mode, setMode] = React.useState('init');

    const createRepository = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/create_repository', {
            name: $('#new-repo-name').val(),
            brief_descrip: $('#new-repo-desc').val()
        }, function(data) {
            props.callback(data.name);
            setLoading(false);
            $('#new-repo').modal('toggle'); 
        });
    }

    const cloneRepository = () => {
        $.post('/clone_repository', {
            url: $('#git-url').val()
        }, function(data) {
            window.location.reload();
        });
    }

    const generateName = () => {
        let adjective;
        let noun;

        $.ajax({
            url: 'https://random-word-form.herokuapp.com/random/adjective',
            async: false,
            success: function(data) {
                adjective = data[0];
            }
        });

        $.ajax({
            url: 'https://random-word-form.herokuapp.com/random/noun',
            async: false,
            success: function(data) {
                noun = data[0];
            }
        });

        $('#new-repo-name').val(`${adjective.toLowerCase()}-${noun.toLowerCase()}`);
    }

    return (
        <div>
            <div className="btn-group btn-group-sm my-2 col-6 offset-3">
                <a onClick={() => setMode('init')} className={'btn btn-outline-secondary' + (mode === 'init' ? ' active' : '')}>Init</a>
                <a onClick={() => setMode('clone')} className={'btn btn-outline-secondary' + (mode === 'clone' ? ' active' : '')}>Clone</a>
            </div>
            {mode === 'init' ? (
                <form onSubmit={(e) => createRepository(e)}>
                    <div className="input-group input-group-sm mb-3">
                        <input required autoComplete="off" className="form-control" placeholder="Name" id="new-repo-name" />
                        <a className="btn btn-outline-primary" onClick={() => generateName()}><i className="bi bi-shuffle"></i> Random Name</a>
                    </div>
                    <textarea rows="15" className="form-control form-control-sm mb-3" placeholder="Description" id="new-repo-desc"></textarea>
                    <button type="submit" className="btn btn-sm btn-outline-success w-100"> Initialize Repository</button>
                </form>
                ) : (
                <form onSubmit={() => cloneRepository()}>
                    <input required autoComplete="off" className="form-control form-control-sm mb-3" placeholder="Git URL" id="git-url" />
                    <button type="submit" className="btn btn-sm btn-outline-success w-100"> Clone Repository</button>
                </form>
                )}
        </div>
        );
}

function CommitForm(props) {
    const [loading, setLoading] = React.useState(false);

    const commit = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/commit', {
            name: props.repo.name,
            msg: $('#commit-msg').val()
        }, function(data) {
            props.callback(props.repo.name);
        });
    }

    return (
        <form className="input-group input-group-sm my-2" onSubmit={(e) => commit(e)}>
            <input required className="form-control border-primary" placeholder="Commit" autoComplete="off" id="commit-msg" />
        </form>
        );
}

function BranchItem(props) {
    const [deleting, setDeleting] = React.useState(false);

    const checkout = () => {
        $.get('/checkout', {
            name: props.repo.name,
            branch: props.branch
        }, function(data) {
            props.callback(props.repo.name);
        });
    }

    const deleteBranch = () => {
        $.get('/delete_branch', {
            repo: props.repo.name,
            name: props.branch
        }, function(data) {
            props.callback(props.repo.name);
        });
    }

    return (
        <div className="dropdown-item small d-flex justify-content-between">
            <a onClick={() => checkout(props.branch)} className="">{props.branch}</a>
            <span className="">
                <a onClick={() => setDeleting(!deleting)} className="text-danger"><i className="bi bi-x-lg"></i></a>
                {deleting && <a onClick={() => deleteBranch(props.branch)} className="text-danger">Delete?</a>}
            </span>
        </div>
        );
}

function LogItem(props) {
    return (
        <div className="text-truncate mb-2">
            <div className="fw-bold">{props.item.msg}</div>
            <div className="small">{props.item.timestamp}</div>
        </div>
        );
}

function TodoItem(props) {
    const [loading, setLoading] = React.useState(false);

    const toggleTodo = () => {
        setLoading(true);
        $.get('/toggle_todo', {
            name: props.repo.name,
            id: props.id
        }, function(data) {
            props.callback(props.repo.name);
            setLoading(false);
        });
    }

    const deleteTodo = () => {
        setLoading(true);
        $.get('/delete_todo', {
            name: props.repo.name,
            id: props.id
        }, function(data) {
            props.callback(props.repo.name);
            setLoading(false);
        });
    }

    const commitTodo = () => {
        setLoading(true);
        $.get('/commit_todo', {
            name: props.repo.name,
            id: props.id,
        }, function(data) {
            props.callback(props.repo.name);
            setLoading(false);
        });
    }

    return (
        <div className={'hover input-group input-group-sm' + (props.todo.done ? ' opacity-25' : '')}>
            <a onClick={() => toggleTodo()} className={'px-1 btn text-' + (props.todo.done ? 'success' : 'muted')}><i className="bi bi-check-lg"></i></a>
            <a onClick={() => commitTodo()} className="px-1 btn text-secondary"><i className="bi bi-file-diff"></i></a>
            <input autoComplete="off" className="form-control border-0" defaultValue={props.todo.description}/>
            <a onClick={() => deleteTodo()} className="btn text-danger"><i className="bi bi-x-lg"></i></a>
        </div>
        );
}

function DiffItem(props) {
    const [loading, setLoading] = React.useState(false);

    const ignoreFile = () => {
        $.get('/ignore_file', {
            name: props.repo.name,
            path: props.item.path
        }, function (data) {
            props.callback(props.repo.name);
        });
    }

    const resetFile = () => {
        $.get('/reset_file', {
            name: props.repo.name,
            path: props.item.path
        }, function (data) {
            props.callback(props.repo.name);
        });
    }

    return (
        <div className="hover text-truncate d-flex justify-content-between">
            <div>
                <span className="me-2" style={{ color: props.item.color }}><i className="bi bi-circle"></i></span>
                <span>{props.item.name}</span>
            </div>
            <div>
                <a title="Add to gitignore" className="text-secondary me-1" onClick={() => ignoreFile(props.item.path)}><i className="bi bi-eye-slash"></i></a>
                <a className="text-danger me-1" onClick={() => resetFile(props.item.path)}><i className="bi bi-x-lg"></i></a>
            </div>
        </div>
        );
}

function Readme(props) {
    const [saved, setSaved] = React.useState(false);
    const [mode, setMode] = React.useState('view');

    const editReadme = () => {
        $.post('/edit_readme', {
            name: props.repo.name,
            txt: $('#txt').val()
        }, function(data) {
            props.callback(props.repo.name);
            setSaved(true);
            setTimeout(function() { setSaved(false); }, 1500);
        });
    }

    return (
        <div>
            <div className="btn-group btn-group-sm my-2 col-4 offset-4">
                <a onClick={() => setMode('view')} className={'btn btn-outline-secondary' + (mode === 'view' ? ' active' : '')}><i className="bi bi-eye"></i> View</a>
                <a onClick={() => setMode('edit')} className={'btn btn-outline-secondary' + (mode === 'edit' ? ' active' : '')}><i className="bi bi-pen"></i> Edit</a>
            </div>
            {mode === 'view' ? (
                <div dangerouslySetInnerHTML={{__html:props.readme.md }}></div>
                ) : (
                <div>
                    <a onClick={() => editReadme()} className="btn btn-sm btn-outline-success w-100 my-2"><i className={'bi bi-' + (saved ? 'check-lg' : 'save2')}></i>  {saved ? 'Saved.' : 'Save'}</a>
                    <textarea id="txt" className="form-control form-control-sm" defaultValue={props.readme.txt} rows="30"></textarea>
                </div>
                )}
        </div>
        );
}

function Dashboard() {
    const [loading, setLoading] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [repos, setRepos] = React.useState([]);
    const [currentRepo, setCurrentRepo] = React.useState([]);

    const [log, setLog] = React.useState([]);
    const [diffs, setDiffs] = React.useState([]);
    const [todos, setTodos] = React.useState([]);
    const [branches, setBranches] = React.useState([]);
    const [readme, setReadme] = React.useState([]);
    const [ignored, setIgnored] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        $.get('/get_repos', function(data) {
            setRepos(data.repos);
            localStorage.getItem('last-repo-opened') && getRepo(localStorage.getItem('last-repo-opened'));
            setLoading(false);
        });
    }, []);

    const getRepo = (name) => {
        setLoading(true);
        $.get('/get_repository', {
            name: name
        }, function(data) {
            setCurrentRepo(data.repo);
            setLog(data.log);
            setDiffs(data.diffs);
            setTodos(data.todos);
            setBranches(data.branches);
            setReadme(data.readme);
            setIgnored(data.ignored);

            setLoading(false);
            localStorage.setItem('last-repo-opened', data.repo.name);
        });
    }

    const deleteRepository = () => {
        $.get('/delete_repository', {
            name: currentRepo.name,
        }, function(data) {
            setCurrentRepo([]);
            setRepos(data.repos);
        });
    }

    const clearCompleted = () => {
        $.get('/clear_completed', {
            name: currentRepo.name
        }, function(data) {
            getRepo(currentRepo.name);
        });
    }

    const resetAll = () => {
        $.get('/reset_all', {
            name: currentRepo.name
        }, function (data) {
            getRepo(currentRepo.name);
        });
    }

    const copyPath = () => {
        navigator.clipboard.writeText(currentRepo.path);
        setCopied(true);
        setTimeout(function() { setCopied(false); }, 1500);
    }

    return (
        <div>
            <div>
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                {currentRepo.length !== 0 && <a onClick={() => getRepo(currentRepo.name)} className="btn btn-sm text-secondary"><i className="bi bi-arrow-clockwise"></i></a>}
                <a className="btn btn-sm text-secondary dropdown-toggle" data-bs-target="#repos" data-bs-toggle="dropdown"><i className="bi bi-git"></i> {currentRepo ==! [] ? 'Select Repository' : currentRepo.name}</a>
                <div id="repos" className="dropdown-menu">
                    <a data-bs-target="#new-repo" data-bs-toggle="modal" className="dropdown-item small text-success"><i className="bi bi-plus-circle"></i> New Repository</a>
                    {repos.map((x, id) => (<a onClick={() => getRepo(x.name)} key={id} className="dropdown-item small">{x.name}</a>))}
                </div>
                {currentRepo.length !== 0 && (
                <span>
                    <a className="btn btn-sm text-secondary dropdown-toggle" data-bs-target="#branches" data-bs-toggle="dropdown"><i className="bi bi-signpost-split"></i> {currentRepo.current_branch}</a>
                    <div id="branches" className="dropdown-menu">
                        <NewBranchForm repo={currentRepo} callback={getRepo}/>
                        {branches.map((x, id) => (<BranchItem key={id} repo={currentRepo} branch={x} callback={getRepo}/>))}
                    </div>
                    <a onClick={() => copyPath()} className={'btn btn-sm text-' + (copied?'success':'secondary')}><i className={'bi bi-' + (copied?'check-lg':'clipboard')}></i> Copy Path</a>
                    <a onClick={() => setDeleting(!deleting)} className="btn btn-sm text-danger"><i className="bi bi-x-circle"></i> Delete Repository</a>
                    {deleting && <a onClick={() => deleteRepository()} className="btn btn-sm text-danger">Delete?</a>}
                </span>)}
            </div>
            {currentRepo.length !== 0 && (
                <div className="row mt-4">
                    <div className="col-3">
                        {diffs.length !== 0 &&
                        <div>
                            <p className="text-center heading fw-bold">Changes</p>
                            <a title="This cannot be undone." className="btn btn-sm text-danger hover" onClick={() => resetAll()}>Reset All</a>
                            <CommitForm repo={currentRepo} callback={getRepo} />
                            <div className="mb-3">
                                {diffs.map((x, id) => (<DiffItem key={id} item={x} repo={currentRepo} callback={getRepo}/>))}
                            </div>
                        </div>}

                        <p className="text-center heading fw-bold">History</p>
                        <div className="mb-3">
                            {log.map((x, id) => (<LogItem key={id} item={x}/>))}
                        </div>

                        <p className="text-center heading fw-bold">TODOs</p>
                        <NewTodoForm repo={currentRepo} callback={getRepo} />
                        <a className="btn btn-sm text-warning" onClick={() => clearCompleted()}>Clear Completed</a>
                        <div className="mb-3">
                            {todos.map((x, id) => (<TodoItem todo={x} key={id} id={id} callback={getRepo} repo={currentRepo}/>))}
                        </div>

                        <p className="text-center heading fw-bold">Ignored</p>
                        <div className="mb-3">
                            {ignored.map((x, id) => (<div className="hover text-truncate" key={id}>{x}</div>))}
                        </div>
                    </div>
                    <div className="col-9">
                        <Readme repo={currentRepo} readme={readme} callback={getRepo} />
                    </div>
                </div>
            )}

            <div className="modal" id="new-repo">
                <div className="modal-dialog">
                    <div className="modal-content p-4">
                        <NewRepoForm callback={getRepo}/>
                    </div>
                </div>
            </div>

        </div>
        );
}

function App() {
    return (
        <div className="p-4">
            <Navbar/>
            <div className=""><Dashboard/></div>
        </div>
        );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
