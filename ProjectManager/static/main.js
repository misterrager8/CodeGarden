function toggleDiv(divId) {
    $('#' + divId).fadeToggle();
}

function projectCreate() {
    $.post('project_create', { project_name : $('#projectName').val() }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
        $('#projectName').val('');
    });
}

function projectEdit(projectId) {
    $.post('project_edit', {
        id_ : projectId,
        project_name : $('#projectName' + projectId).val(),
        descrip : $('#descrip' + projectId).val(),
        status : $('#status' + projectId).val(),
        github_url : $('#github_url' + projectId).val(),
        tools : $('#tools' + projectId).val()
    }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
        $('#projectName').val('');
    });
}

function projectDelete(projectId) {
    $.get('project_delete',  { id_ : projectId }, function (data) {
        $('#allProjects').load(location.href + ' #allProjects');
    });
}

function todoCreate(projectId) {
    $.post('todo_create', { id_ : projectId, task : $('#task' + projectId).val() }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
        $('#task' + projectId).val('');
    });
}

function todoEdit(todoId) {
    $.post('todo_edit', { id_ : todoId, item : $('#itemName' + todoId).val() }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
    });
}

function todoMark(todoId) {
    $.post('todo_mark', { id_ : todoId }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
    });
}

function todoDelete(todoId) {
    $.get('todo_delete', { id_ : todoId }, function(data) {
        $('#allProjects').load(location.href + ' #allProjects');
    });
}