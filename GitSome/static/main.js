$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('project_mgmt_theme'));
});

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('project_mgmt_theme', theme);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function suggestName() {
    $('#spinner').show();
    $.get('suggest_name', {
        filepath: $('#filepath').val()
    }, function(data) {
        $('#name').val(data);
        $('#spinner').hide();
    });
}

function addProject() {
    $('#spinner').show();
    $.post('add_project', {
        name: $('#name').val(),
        filepath: $('#filepath').val()
    }, function(data) {
       refreshPage(); 
    });
}

function pinProject(projectId) {
    $('#spinner').show();
    $.get('pin_project', {
        id_: projectId
    }, function(data) {
       refreshPage(); 
    });
}

function deleteProject(projectId) {
    $('#spinner').show();
    $.get('delete_project', {
        id_: projectId
    }, function(data) {
       refreshPage(); 
    });
}

function saveReadme(projectId) {
    $('#spinner').show();
    $.post('save_readme', {
        id_: projectId,
        readme: $('#readme').val()
    }, function(data) {
       refreshPage(); 
    });
}

function addTodo(projectId) {
    $('#spinner').show();
    $.post('add_todo', {
        id_: projectId,
        task: $('#task').val()
    }, function(data) {
       refreshPage(); 
    });
}

function editTodo(todoId) {
    $('#spinner').show();
    $.post('edit_todo', {
        id_: todoId,
        task: $('#editTodo' + todoId).val(),
        note: $('#noteFor' + todoId).val()
    }, function(data) {
       refreshPage();
    });
}

function deleteTodo(todoId) {
    $('#spinner').show();
    $.get('delete_todo', {
        id_: todoId
    }, function(data) {
       refreshPage(); 
    });
}

function markTodo(todoId) {
    $('#spinner').show();
    $.get('mark_todo', {
        id_: todoId
    }, function(data) {
       refreshPage(); 
    });
}

function doingTodo(todoId) {
    $('#spinner').show();
    $.get('doing_todo', {
        id_: todoId
    }, function(data) {
       refreshPage(); 
    });
}

function commitTodo(todoId) {
    $('#spinner').show();
    $.get('commit_todo', {
        id_: todoId
    }, function(data) {
       refreshPage(); 
    });
}

function gitCommand(projectId, cmd) {
    $('#spinner').show();
    $.get('git_command', {
        id_: projectId,
        cmd: cmd
    }, function(data) {
        $('#spinner').hide();
        $('#refreshThis').text(data);
    });
}

function exportTodos(projectId) {
    $.get('export_todos', {
        id_: projectId
    }, function(data) {
        $('#exportIcon').toggleClass('bi-file-earmark-arrow-down bi-check-lg bg-success');
        setTimeout(function() { $('#exportIcon').toggleClass('bi-file-earmark-arrow-down bi-check-lg bg-success'); }, 2000)
    });
}

function previewReadme() {
    $.get('preview_readme', {
        readme: $('#readme').val()
    }, function(data) {
        $('#preview').html(data);
    });
}

function copyPath() {
    var x = $('#copyPath');
    x.show();
    x.select();
    document.execCommand('copy');
    x.hide();
    $('#copyIcon').toggleClass('bg-success bi-check-lg bi-clipboard');
    setTimeout(function() { $('#copyIcon').toggleClass('bg-success bi-check-lg bi-clipboard'); }, 2000);
}
