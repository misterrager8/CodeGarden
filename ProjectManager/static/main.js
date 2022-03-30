function toggleDiv(divId) {
    $('#' + divId).fadeToggle(250);
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function projectCreate() {
    $('#spinner').show();
    $.post('project_create', {
        name: $('#name').val()
    }, function(data) {
        refreshPage();
    });
}

function projectEdit(projectId) {
    $('#spinner').show();
    $.post('project_edit', {
        id_: projectId,
        name: $('#name').val()
    }, function(data) {
        refreshPage();
    });
}

function projectDelete(projectId) {
    $('#spinner').show();
    $.get('project_delete', {
        id_: projectId
    }, function(data) {
        refreshPage();
    });
}

function todoCreate(projectId) {
    $('#spinner').show();
    $.post('todo_create', {
        id_: projectId,
        item: $('#item').val()
    }, function(data) {
        refreshPage();
    });
}

function todoEdit(event, todoId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        $('#spinner').show();
        $.post('todo_edit', {
            id_: todoId,
            item: $('#item' + todoId).html()
        }, function(data) {
            refreshPage();
        });
    }
}

function todoDelete(todoId) {
    $('#spinner').show();
    $.get('todo_delete', {
        id_: todoId
    }, function(data) {
        refreshPage();
    });
}

function todoToggle(todoId) {
    $('#spinner').show();
    $.get('todo_toggle', {
        id_: todoId
    }, function(data) {
        refreshPage();
    });
}