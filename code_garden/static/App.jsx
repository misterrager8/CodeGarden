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
        });
    }

    const createRepository = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('create_repository', {
            name: $('#new-repo-name').val(),
            brief_descrip: $('#new-repo-desc').val()
        }, function(data) {
            getRepo(data.name);
            setLoading(false);
            $('#new-repo').modal('toggle'); 
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

    const createTodo = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/create_todo', {
            name: currentRepo.name,
            description: $('#new-todo').val(),
            category: 'MISC'
        }, function(data) {
            setTodos(data.todos);
            setLoading(false);
            $('#new-todo').val('');
        })
    }

    const toggleTodo = (id) => {
        setLoading(true);
        $.get('/toggle_todo', {
            name: currentRepo.name,
            id: id
        }, function(data) {
            setTodos(data.todos);
            setLoading(false);
        })
    }

    const deleteTodo = (id) => {
        setLoading(true);
        $.get('/delete_todo', {
            name: currentRepo.name,
            id: id
        }, function(data) {
            setTodos(data.todos);
            setLoading(false);
        })
    }

    const commit = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/commit', {
            name: currentRepo.name,
            msg: $('#commit-msg').val()
        }, function(data) {
            getRepo(currentRepo.name);
        });
    }

    const createBranch = (e) => {
        e.preventDefault();
        setLoading(true);
        $.post('/create_branch', {
            repo: currentRepo.name,
            name: $('#new-branch').val()
        }, function(data) {
            getRepo(currentRepo.name);
            setLoading(false);
        });
    }

    const checkout = (branch) => {
        $.get('/checkout', {
            name: currentRepo.name,
            branch: branch
        }, function(data) {
            getRepo(name);
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
                    <a data-bs-target="#new-repo" data-bs-toggle="modal" className="dropdown-item small"><i className="bi bi-plus-circle"></i> New Repository</a>
                    {repos.map((x, id) => (
                        <a onClick={() => getRepo(x.name)} key={id} className="dropdown-item small">{x.name}</a>
                        ))}
                </div>
                {currentRepo.length !== 0 && (
                <span>
                    <a className="btn btn-sm text-secondary dropdown-toggle" data-bs-target="#branches" data-bs-toggle="dropdown"><i className="bi bi-signpost-split"></i> {currentRepo.current_branch}</a>
                    <div id="branches" className="dropdown-menu">
                        <form className="input-group input-group-sm p-1" onSubmit={(e) => createBranch(e)}>
                            <input autoComplete="off" className="form-control border-success" placeholder="New Branch" id="new-branch" />
                        </form>
                        {branches.map((x, id) => (
                            <a onClick={() => checkout(x)} key={id} className="dropdown-item small">{x}</a>
                            ))}
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
                            <form className="input-group input-group-sm my-2" onSubmit={(e) => commit(e)}>
                                <input className="form-control border-primary" placeholder="Commit" autoComplete="off" id="commit-msg" />
                            </form>
                            <div className="mb-3">
                            {diffs.map((x, id) => (
                                <div className="hover text-truncate" key={id}>
                                    <span className="me-2" style={{ color: x.color }}><i class="bi bi-circle"></i></span>
                                    <span>{x.name}</span>
                                </div>
                            ))}
                            </div>
                        </div>}

                        <p className="text-center heading fw-bold">History</p>
                        <div className="mb-3">
                        {log.map((x, id) => (
                            <div className="text-truncate mb-2" key={id}>
                                <div className="fw-bold">{x.msg}</div>
                                <div className="small">{x.timestamp}</div>
                            </div>
                        ))}
                        </div>

                        <p className="text-center heading fw-bold">TODOs</p>
                        <form className="input-group input-group-sm my-2" onSubmit={(e) => createTodo(e)}>
                            <input className="form-control" placeholder="New TODO" autoComplete="off" id="new-todo" />
                        </form>
                        <div className="mb-3">
                        {todos.map((x, id) => (
                            <div className={'hover input-group input-group-sm' + (x.done ? ' opacity-25' : '')} key={id}>
                                <a onClick={() => toggleTodo(id)} className={'btn btn-sm text-' + (x.done ? 'success' : 'muted')}><i className="bi bi-check-lg"></i></a>
                                <span className="btn text-secondary pe-0">{x.category}:</span>
                                <input autoComplete="off" className="form-control border-0" defaultValue={x.description}/>
                                <a onClick={() => deleteTodo(id)} className="btn btn-sm text-danger"><i className="bi bi-x-lg"></i></a>
                            </div>
                        ))}
                        </div>

                        <p className="text-center heading fw-bold">Ignored</p>
                        <div className="mb-3">
                        {ignored.map((x, id) => (
                            <div className="hover text-truncate" key={id}>{x}</div>
                        ))}
                        </div>
                    </div>

                    <div className="col-9" dangerouslySetInnerHTML={{__html:readme }}></div>
                </div>
            )}
        <div className="modal" id="new-repo">
            <div className="modal-dialog">
                <div className="modal-content p-4">
                    <form onSubmit={(e) => createRepository(e)}>
                        <input autoComplete="off" className="form-control mb-3" placeholder="Name" id="new-repo-name" />
                        <textarea rows="15" className="form-control mb-3" placeholder="Description" id="new-repo-desc"></textarea>
                        <button type="submit" className="btn btn-outline-success"> Initialize Repository</button>
                    </form>
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
