function toggleDiv(divId) {
    $('#' + divId).fadeToggle();
}

$('#projectCreateForm').on('submit', function(event) {
    event.preventDefault();
    $.post('create', { project_name : $('#projectName').val() }, function(data) { $('#allProjects').load(location.href + ' #allProjects'); });
    $('#projectName').val('');
});