function toggleDiv(divId) {
    $('#' + divId).fadeToggle();
}

function refreshDiv() {
    $('#pageContent').load(location.href + ' #pageContent');
}

function projectCreate() {
    $.post('project_create', {
        project_name : $('#projectName').val()
    }, function(data) {
        refreshDiv();
    });
}

function projectEdit(projectId) {
    $.post('project_edit', {
        id_ : projectId,
        project_name : $('#projectName' + projectId).val(),
        readme : $('#readme' + projectId).val(),
        start_date : $('#startDate' + projectId).val(),
        status : $('#status' + projectId).val(),
        github_url : $('#github_url' + projectId).val(),
        tools : $('#tools' + projectId).val()
    }, function(data) {
        refreshDiv();
    });
}

function projectDelete(projectId) {
    $.get('project_delete',  {
        id_ : projectId
    }, function (data) {
        refreshDiv();
    });
}

function todoCreate(projectId) {
    $.post('todo_create', {
        id_ : projectId,
        task : $('#task' + projectId).val()
    }, function(data) {
        refreshDiv();
    });
}

function todoEdit(todoId) {
    $.post('todo_edit', {
        id_ : todoId,
        item : $('#itemName' + todoId).val()
    }, function(data) {
        refreshDiv();
    });
}

function todoMark(todoId) {
    $.post('todo_mark', {
        id_ : todoId
    }, function(data) {
        refreshDiv();
    });
}

function todoDelete(todoId) {
    $.get('todo_delete', {
        id_ : todoId
    }, function(data) {
        refreshDiv();
    });
}