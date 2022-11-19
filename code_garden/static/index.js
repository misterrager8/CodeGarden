$(document).ready(function() {
    localStorage.getItem('CodeGarden') === 'dark' ? setDark() : setLight();
    loadAll(localStorage.getItem('lastRepoOpened'));
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

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function readme(name) {
    $.get('get_readme', {
        name: name
    }, function(data) {
        $('#panelreadme').html(data);
    });
}

function diffs(name) {
    $.get('get_diffs', {
        name: name
    }, function(data) {
        $('#paneldiffs').html(`
            <form class="mb-4" onsubmit="event.preventDefault(); commit('${name}');">
                <input id="msg" autocomplete="off" class="form-control form-control-sm" placeholder="Commit" required>
            </form>
            `);
        for (let[id, x] of data.diffs.entries()) {
            $('#paneldiffs').append(`
                <div>
                    <a class="font-monospace hover" onclick=""><i class="bi bi-circle" style="color: ${x.color}"></i> ${x.name}</a><br>
                </div>
                `);
        }
    });
}

function todos(name) {
    $.get('get_todos', {
        name: name
    }, function(data) {
        $('#paneltodos').html(`
            <form onsubmit="event.preventDefault(); createTodo('${name}');">
                <input id="description" autocomplete="off" class="form-control form-control-sm border-success my-2" placeholder="New TODO" required>
            </form>
            `);
        for (let[id, x] of data.todos.entries()) {
            $('#paneltodos').append(`
                <div class="hover input-group input-group-sm ${x.done ? 'opacity-25' : ''}">
                    <a onclick="toggleTodo('${name}', '${id}')" class="btn"><i class="bi bi-check-lg text-${x.done ? 'success' : 'secondary'}"></i></a>
                    <input id="editTodo${id}" autocomplete="off" class="form-control p-0 border-0" value="${x.description}" onchange="editTodo('${name}', '${id}')">
                    <a onclick="deleteTodo('${name}', '${id}')" class="btn text-danger"><i class="bi bi-x-lg"></i></a>
                </div>
                `);
        }
    });
}

function log(name) {
    $.get('get_log', {
        name: name
    }, function(data) {
        $('#panellog').html('');
        for (x of data.log) {
            $('#panellog').append(`
                <div class="py-1">
                    <span class="fw-bold">${x.msg}</span><br>
                    <small class="fst-italic">${x.timestamp}</small>
                </div>
                `);
        }
    });
}

function branches(name) {
    $.get('get_branches', {
        name: name
    }, function(data) {
        $('#panelbranches').html('');
        for (x of data.branches) {
            $('#panelbranches').append(`
                <div>
                    <a class="hover" onclick="">${x}</a>
                </div>
                `);
        }
    });
}

function loadAll(name) {
    $('#spinner').show();
    $('#current').text(name);
    localStorage.setItem('lastRepoOpened', name);
    $('#x').html(`
        <div class="text-center">
            <p class="font-custom fs-1">${name}</p>
            <div>
                <a class="btn btn-sm btn-outline-secondary"><i class="bi bi-clipboard"></i> Copy Path</a>
                <a class="btn btn-sm btn-outline-danger"><i class="bi bi-trash2"></i> Delete</a>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-3">
                <div class="col-12">
                    <a class="btn text-secondary" onclick="diffs('${name}')">DIFFS <i class="bi bi-arrow-clockwise"></i></a>
                    <div id="paneldiffs"></div>
                </div>
                <div class="col-12 mt-4">
                    <a class="btn text-secondary" onclick="log('${name}')">LOG <i class="bi bi-arrow-clockwise"></i></a>
                    <div id="panellog"></div>
                </div>
                <div class="col-12 mt-4">
                    <a class="btn text-secondary" onclick="todos('${name}')">TODOS <i class="bi bi-arrow-clockwise"></i></a>
                    <div id="paneltodos"></div>
                </div>
                <div class="col-12 mt-4">
                    <a class="btn text-secondary" onclick="branches('${name}')">BRANCHES <i class="bi bi-arrow-clockwise"></i></a>
                    <div id="panelbranches"></div>
                </div>
            </div>
            <div class="col-9">
                <a class="btn text-secondary" onclick="readme('${name}')">README <i class="bi bi-arrow-clockwise"></i></a>
                <div id="panelreadme"></div>
            </div>
        </div>
        `);
    readme(name);
    diffs(name);
    todos(name);
    log(name);
    branches(name);
    $('#spinner').hide();
}

function commit(name) {
    $.post('commit', {
        name: name,
        msg: $('#msg').val()
    }, function(data) {
        loadAll(name);
    });
}

function createTodo(name) {
    $.post('create_todo', {
        name: name,
        description: $('#description').val()
    }, function(data) {
        todos(name);
    });
}

function editTodo(name, id) {
    $.post('edit_todo', {
        name: name,
        id: id,
        description: $('#editTodo' + id).val()
    }, function(data) {
        todos(name);
    });
}

function toggleTodo(name, id) {
    $.get('toggle_todo', {
        name: name,
        id: id
    }, function(data) {
        todos(name);
    });
}

function deleteTodo(name, id) {
    $.get('delete_todo', {
        name: name,
        id: id
    }, function(data) {
        todos(name);
    });
}
