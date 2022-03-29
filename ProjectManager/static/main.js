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