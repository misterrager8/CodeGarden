$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('project_mgmt_theme'));
});

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('project_mgmt_theme', theme);
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function addProject() {
    $('#spinner').show();
    $.post('add_project', {
        name: $('#name').val(),
        tagline: $('#tagline').val()
    }, function(data) {
        refreshPage();
    });
}

function editProject(projectId) {
    $('#spinner').show();
    $.post('edit_project', {
        id_: projectId,
        name: $('#name' + projectId).val(),
        tagline: $('#tagline' + projectId).val(),
        readme: $('#readme' + projectId).val()
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

function addTodo(projectId) {
    $('#spinner').show();
    $.post('add_todo', {
        id_: projectId,
        desc: $('#todoFor' + projectId).val()
    }, function(data) {
        refreshPage();
    });
}

function editTodo(todoId) {
    $('#spinner').show();
    $.post('edit_todo', {
        id_: todoId,
        desc: $('#editTodo' + todoId).val(),
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
