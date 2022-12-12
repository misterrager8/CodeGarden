$(document).ready(function() {
    localStorage.getItem('CodeGarden') === 'dark' ? setDark() : setLight();
    getRepo(localStorage.getItem('lastRepoOpened'));
});

function setDark() {
    localStorage.setItem('CodeGarden', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
    $('#dark').show();
    $('#light').hide();
}

function setLight() {
    localStorage.setItem('CodeGarden', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
    $('#light').show();
    $('#dark').hide();
}

function settingsPage() {
    $.get('settings', function(data) {
        $('#index').html(`<a onclick="getRepo('${localStorage.getItem('lastRepoOpened')}');" class="btn btn-sm text-secondary"><i class="bi bi-arrow-left"></i> Back</a>`);
        for (x in data) {
            $('#index').append(`
                <div class="form-floating mb-1">
                    <input id="${x}" name="${x}" autocomplete="off" class="form-control border-0" value="${data[x]}">
                    <label for="${x}">${x}</label>
                </div>
                `);
        }
    });
}

function createRepoPage() {
    $('#index').html(`
        <div>
            <a onclick="getRepo('${localStorage.getItem('lastRepoOpened')}');" class="btn btn-sm text-secondary"><i class="bi bi-arrow-left"></i> Back</a>
            <form onsubmit="event.preventDefault(); createRepository();" class="mt-3">
                <div class="input-group input-group-sm mb-3">
                    <input autocomplete="off" class="form-control" id="name" placeholder="Name" required>
                    <a onclick="generateRepoName()" class="btn btn-outline-primary">Generate Name <i class="bi bi-shuffle"></i></a>
                </div>
                <textarea rows=10 autocomplete="off" class="form-control form-control-sm mb-3" id="briefDescrip" placeholder="Description"></textarea>
                <button type="submit" class="btn btn-sm btn-outline-success w-100">Create New Repository</button>
            </form>
        </div>
        `);
}

const repo = (repo_) => `
<div class="row">
    <div class="col-3">
        <div class="col-12">
            <div class="btn-group btn-group-sm w-100 mb-2">
                <a id="changes" class="btn btn-outline-secondary" onclick="getDiff('${repo_}')">Changes</a>
                <a id="history" onclick="getLog('${repo_}')" class="btn btn-outline-secondary">History</a>
            </div>
            <div id="sideStage"></div>
            <a onclick="$('#ignored').fadeToggle(150)" class="btn btn-sm text-secondary p-0 my-2"><i class="bi bi-eye-slash"></i> Show Ignored</a>
            <div id="ignored" style="display: none"></div>
        </div>
        <div class="col-12 mt-3">
            <div id="commit"></div>
            <form onsubmit="event.preventDefault(); commit('${repo_}');">
                <input id="msg" autocomplete="off" class="form-control form-control-sm mb-2" placeholder="Commit Message" required>
                <button class="btn btn-sm btn-outline-primary w-100">Commit</button>
            </form>
        </div>
        <div class="col-12 mt-3">
            <div id="todos"></div>
        </div>
    </div>
    <div class="col-9" id="stage"></div>
</div>
<div class="pt-5">
    <a onclick="copyPath()" class="btn btn-sm text-secondary"><i class="bi bi-clipboard" id="clipboard"></i> Copy Path</a>
    <a class="btn btn-sm text-danger"><i class="bi bi-trash2"></i> Delete</a>
</div>
`;

const diffItem = (item, repo_) => `
<a title="Add to gitignore" class="text-secondary me-1" onclick="ignoreFile('${repo_}', '${item.path}')"><i class="bi bi-eye-slash"></i></a>
<a class="text-danger me-1" onclick="resetFile('${repo_}', '${item.path}')"><i class="bi bi-x-lg"></i></a>
<a onclick="getFile('${item.path}')" class="hover">
    <span>${item.name}</span>
    <span class="float-end" style="color: ${item.color}"><i class="bi bi-circle"></i></span>
</a><br>
`;

const logItem = (item) => `
<div class="mb-2 hover">
    <a>
        <div class="fw-bold">${item.msg}</div>
        <div class="fw-light small text-muted">${item.timestamp}</div>
    </a>
</div>
`;

const todoItem = (item, repo_, id) => `
<div class="hover input-group input-group-sm mb-1 ${item.done ? 'opacity-25' : ''}">
    <a onclick="toggleTodo('${repo_}', '${id}')" class="mx-2 text-${item.done ? 'success' : 'secondary'}"><i class="bi bi-check-lg"></i></a>
    <a onclick="commitTodo('${repo_}', '${id}')" class="text-secondary"><i class="bi bi-file-diff"></i></a>
    <span class="cat-badge ms-1" style="color:${getCategoryColor(item.category)}">${item.category}:</span>
    <input onchange="editTodo('${repo_}', '${id}')" id="description${id}" autocomplete="off" class="form-control border-0" value="${item.description}">
    <a onclick="deleteTodo('${repo_}', '${id}')" class="text-danger"><i class="bi bi-x-lg"></i></a>
</div>
`;

const addTodoForm = (repo_) => `
<form onsubmit="event.preventDefault(); addTodo('${repo_}');" class="input-group input-group-sm mt-4 mb-2">
    <a data-bs-toggle="dropdown" data-bs-target="#categories" class="btn" id="selected">
        <span class="text-secondary"><i class="bi bi-caret-down-fill"></i></span>
    </a>
    <input id="category" type="hidden" value="MISC">
    <div id="categories" class="dropdown-menu">
        <a onclick="selectCategory('FEATURE')" class="btn"><span style="color: #0d6efd"><i class="bi bi-node-plus"></i> FEATURE</span></a><br>
        <a onclick="selectCategory('TWEAK')" class="btn"><span style="color: #fd7e14"><i class="bi bi-wrench-adjustable"></i> TWEAK</span></a><br>
        <a onclick="selectCategory('CHORE')" class="btn"><span style="color: #6f42c1"><i class="bi bi-list-check"></i> CHORE</span></a><br>
        <a onclick="selectCategory('BUGFIX')" class="btn"><span style="color: #dc3545"><i class="bi bi-bug"></i> BUGFIX</span></a><br>
        <a onclick="selectCategory('MISC')" class="btn"><span class="text-secondary"><i class="bi bi-circle"></i> MISC</span></a>
    </div>
    <input id="description" autocomplete="off" class="form-control" placeholder="TODO">
</form>
`;

function getDiff(name) {
    $('#spinner').show();
    $('#changes').addClass('active');
    $('#history').removeClass('active');
    $('#sideStage').html('');
    $.get('get_diffs', {
        name: name
    }, function (data) {
        $('#sideStage').html(`<div class="small text-center">${data.diffs.length} changed files</div>`);
        for (x of data.diffs) {
            $('#sideStage').append(diffItem(x, name));
        }
        $('#spinner').hide();
    });
}

function getIgnored(name) {
    $.get('get_ignored', {
        name: name
    }, function (data) {
        for (x of data.ignored) {
            $('#ignored').append(`<div><a class="hover">${x}</a></div>`);
        }
        $('#spinner').hide();
    });
}

function getLog(name) {
    $('#spinner').show();
    $('#changes').removeClass('active');
    $('#history').addClass('active');
    $('#sideStage').html('');
    $.get('get_log', {
        name: name
    }, function (data) {
        for (x of data.log) {
            $('#sideStage').append(logItem(x));
        }
        $('#spinner').hide();
    });
}

function getReadme(name) {
    $('#spinner').show();
    $.get('get_readme', {
        name: name
    }, function (data) {
        $('#stage').html(data);
        $('#spinner').hide();
    });
}

function getTodos(name) {
    $('#spinner').show();
    $.get('get_todos', {
        name: name
    }, function (data) {
        $('#todos').html(`${addTodoForm(name)}<div><a class="btn btn-sm text-warning" onclick="clearCompleted('${name}')">Clear Completed</a></div>`);
        for (let [id, x] of data.todos.entries()) {
            $('#todos').append(todoItem(x, name, id));
        }
        $('#spinner').hide();
    });
}

function getBranches(name) {
    $('#spinner').show();
    $.get('get_branches', {
        name: name
    }, function (data) {
        $('#branches').append(`
            <form onsubmit="event.preventDefault(); createBranch('${name}')">
                <input id="newBranch" autocomplete="off" class="form-control form-control-sm border-success" placeholder="New Branch">
            </form>
            `);
        for (x of data.branches) {
            if (!x.startsWith('* ')) {
                $('#branches').append(`
                    <div class="dropdown-item d-flex justify-content-between">
                        <a onclick="checkout('${name}', '${x}')">${x}</a>
                        <a onclick="merge('${name}', '${x}')"><i class="bi bi-sign-merge-left"></i></a>
                    </div>
                    `);
            }
        }
        $('#spinner').hide();
    });
}

function getFile(path) {
    $('#spinner').show();
    $.get('get_file', {
        path: path
    }, function (data) {
        $('#stage').html(`
            <a class="btn btn-sm text-secondary mb-3" onclick="getReadme('${localStorage.getItem('lastRepoOpened')}')"><i class="bi bi-arrow-left"></i> Back</a>
            <div class="font-monospace" style="white-space:pre-wrap; font-size: 0.9em" id="file"></div>
            `);
        $('#file').text(data);
        $('#spinner').hide();
    });
}

function ignoreFile(name, path) {
    $('#spinner').show();
    $.get('ignore_file', {
        name: name,
        path: path
    }, function (data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function resetFile(name, path) {
    $('#spinner').show();
    $.get('reset_file', {
        name: name,
        path: path
    }, function (data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function getRepo(name) {
    $('#spinner').show();
    $.get('get_repository', {
        name: name
    }, function (data) {
        localStorage.setItem('lastRepoOpened', name);
        $('#current').html(`<i class="bi bi-git text-muted"> Repo: </i> ${name}`);
        $('#index').html(repo(name));
        $('#branchSelect').remove();
        $('#push').remove();
        $('#copy').remove();
        $('#refresh').remove();
        $('#nav').append(`
            <li class="nav-item dropdown me-3" id="branchSelect">
                <a data-bs-toggle="dropdown" data-bs-target="#branches" class="nav-link dropdown-toggle">
                    <i class="bi bi-signpost-split text-muted"> Branch: </i> ${data.current_branch}
                </a>
                <div class="dropdown-menu" id="branches">
                </div>
            </li>
            <li class="nav-item" id="push">
                <a class="nav-link" onclick="push('${name}')">
                    <i class="bi bi-github text-muted"> Remote: origin </i> Push <i class="bi bi-arrow-up-short"></i>
                </a>
            </li>
            <li class="nav-item" id="refresh">
                <a onclick="getRepo('${name}')" class="nav-link"><i class="bi bi-arrow-clockwise"></i></a>
            </li>
            <input id="copy" value="${data.path}" style="display:none">
            `);
        $('#refresh').insertBefore($('#current').parent());
        getBranches(name);
        getDiff(name);
        getReadme(name);
        getTodos(name);
        getIgnored(name)
        $('#spinner').hide();
    });
}

function createRepository() {
    $('#spinner').show();
    $.post('create_repository', {
        name: $('#name').val(),
        brief_descrip: $('#briefDescrip').val()
    }, function(data) {
        getRepo($('#name').val());
        $('#spinner').hide();
    });
}

function addTodo(name) {
    $('#spinner').show();
    $.post('create_todo', {
        name: name,
        category: $('#category').val(),
        description: $('#description').val()
    }, function(data) {
        getTodos(name);
        $('#spinner').hide();
    });
}

function editTodo(name, id) {
    $('#spinner').show();
    $.post('edit_todo', {
        name: name,
        id: id,
        description: $('#description' + id).val()
    }, function(data) {
        getTodos(name);
        $('#spinner').hide();
    });
}

function deleteTodo(name, id) {
    $('#spinner').show();
    $.get('delete_todo', {
        name: name,
        id: id,
    }, function(data) {
        getTodos(name);
        $('#spinner').hide();
    });
}

function commitTodo(name, id) {
    $('#spinner').show();
    $.get('commit_todo', {
        name: name,
        id: id,
    }, function(data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function clearCompleted(name) {
    $('#spinner').show();
    $.get('clear_completed', {
        name: name
    }, function(data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function toggleTodo(name, id) {
    $('#spinner').show();
    $.get('toggle_todo', {
        name: name,
        id: id,
    }, function(data) {
        getTodos(name);
        $('#spinner').hide();
    });
}

function commit(name) {
    $('#spinner').show();
    $.post('commit', {
        name: name,
        msg: $('#msg').val()
    }, function(data) {
        $('#spinner').hide();
        alert(data);
        getRepo(name);
        $('#spinner').hide();
    });
}

function checkout(name, branch) {
    $('#spinner').show();
    $.get('checkout', {
        name: name,
        branch: branch
    }, function(data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function merge(name, branch) {
    $('#spinner').show();
    $.get('merge', {
        name: name,
        branch: branch
    }, function(data) {
        getRepo(name);
        $('#spinner').hide();
        alert(data);
    });
}

function createBranch(name) {
    $('#spinner').show();
    $.post('create_branch', {
        repo: name,
        name: $('#newBranch').val()
    }, function(data) {
        getRepo(name);
        $('#spinner').hide();
    });
}

function push(name) {
    $('#spinner').show();
    $.get('push', {
        name: name
    }, function(data) {
        alert(data);
        getRepo(name);
        $('#spinner').hide();
    });
}

function generateRepoName() {
    $.get('generate_repo_name', function(data) {
        $('#name').val(data);
    });
}

function selectCategory(cat) {
    $('#category').val(cat);
    switch(cat) {
        case 'FEATURE':
            $('#selected').html(`<span style="color: #0d6efd"><i class="bi bi-node-plus"></i></span>`);
            break;
        case 'TWEAK':
            $('#selected').html(`<span style="color: #fd7e14"><i class="bi-wrench-adjustable"></i></span>`);
            break;
        case 'CHORE':
            $('#selected').html(`<span style="color: #6f42c1"><i class="bi-list-check"></i></span>`);
            break;
        case 'BUGFIX':
            $('#selected').html(`<span style="color: #dc3545"><i class="bi-bug"></i></span>`);
            break;
        case 'MISC':
            $('#selected').html(`<span class="text-secondary"><i class="bi-caret-down-fill"></i></span>`);
    }
}

function copyPath() {
    copyThis = document.getElementById('copy');
    copyThis.style.display = 'block';
    copyThis.select();
    document.execCommand('copy');
    copyThis.style.display = 'none';
    $('#clipboard').toggleClass(['bi-clipboard', 'bi-clipboard-check', 'text-success']);
    setTimeout(function() { $('#clipboard').toggleClass(['bi-clipboard', 'bi-clipboard-check', 'text-success']); }, 1500);
}

function getCategoryColor(category) {
    switch(category) {
        case 'FEATURE':
            x = '#0d6efd';
            return x;
            break;
        case 'TWEAK':
            x = '#fd7e14';
            return x;
            break;
        case 'CHORE':
            x = '#6f42c1';
            return x;
            break;
        case 'BUGFIX':
            x = '#dc3545';
            return x;
            break;
        case 'MISC':
            x = 'gray';
            return x;
    }
}
