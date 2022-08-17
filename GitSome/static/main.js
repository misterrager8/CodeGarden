$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('GitSome'));
});

function changeTheme(theme) {
    localStorage.setItem('GitSome', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('GitSome'));
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function pinRepo(repoId) {
    $('#spinner').show();
    $.get('pin_repo', {
        id_: repoId
    }, function(data) {
       refreshPage(); 
    });
}

function deleteRepo(repoId) {
    $('#spinner').show();
    $.get('delete_repo', {
        id_: repoId
    }, function(data) {
       refreshPage(); 
    });
}

function addTodo(repoId) {
    $('#spinner').show();
    $.post('add_todo', {
        id_: repoId,
        task: $('#task').val()
    }, function(data) {
       $('#kanban').load(location.href + ' #kanban');
       $('#spinner').hide();
    });
}

function editTodo(todoId) {
    $('#spinner').show();
    $.post('edit_todo', {
        id_: todoId,
        task: $('#editTodo' + todoId).val(),
        note: $('#noteFor' + todoId).val()
    }, function(data) {
       $('#kanban').load(location.href + ' #kanban');
       $('#spinner').hide();
    });
}

function deleteTodo(todoId) {
    $('#spinner').show();
    $.get('delete_todo', {
        id_: todoId
    }, function(data) {
       $('#kanban').load(location.href + ' #kanban');
       $('#spinner').hide();
    });
}

function markTodo(todoId) {
    $('#spinner').show();
    $.get('mark_todo', {
        id_: todoId
    }, function(data) {
       $('#kanban').load(location.href + ' #kanban');
       $('#spinner').hide();
    });
}

function commitTodo(todoId) {
    $('#spinner').show();
    $.get('commit_todo', {
        id_: todoId
    }, function(data) {
       $('#kanban').load(location.href + ' #kanban');
       $('#spinner').hide();
    });
}

function gitCommand(repoId, cmd) {
    $('#spinner').show();
    $.get('git_command', {
        id_: repoId,
        cmd: cmd
    }, function(data) {
        $('#spinner').hide();
        $('#refreshThis').text(data);
    });
}

function exportTodos(repoId) {
    $.get('export_todos', {
        id_: repoId
    }, function(data) {
        $('#exportIcon').toggleClass('bi-file-earmark-arrow-down bi-check-lg bg-success');
        setTimeout(function() { $('#exportIcon').toggleClass('bi-file-earmark-arrow-down bi-check-lg bg-success'); }, 2000)
    });
}

function copyPath() {
    var x = $('#copyPath');
    x.show();
    x.select();
    document.execCommand('copy');
    x.hide();
    $('#copyIcon').toggleClass('text-success bi-check-lg bi-clipboard');
    setTimeout(function() { $('#copyIcon').toggleClass('text-success bi-check-lg bi-clipboard'); }, 2000);
}
