$(document).ready(function() {{
    localStorage.getItem('CodeGarden') === 'dark' ? setDark() : setLight();
}});

function setDark() {{
    localStorage.setItem('CodeGarden', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
    $('#dark').show();
    $('#light').hide();
}}

function setLight() {{
    localStorage.setItem('CodeGarden', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
    $('#light').show();
    $('#dark').hide();
}}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function reloadDiv(divId) {
    $('#' + divId).load(location.href + ' #' + divId);
}

function addTodo(path) {
    $.post('add_todo', {
        path: path,
        description: $('#description').val()
    }, function(data) {
        reloadDiv('todos');
    })
}

function markTodo(path, idx) {
    $.get('mark_todo', {
        path: path,
        idx: idx
    }, function(data) {
        reloadDiv('todos');
    })
}

function editTodo(path, idx) {
    $.post('edit_todo', {
        path: path,
        idx: idx,
        description: $('#description' + idx).val()
    }, function(data) {
        reloadDiv('todos');
    })
}

function deleteTodo(path, idx) {
    $.get('delete_todo', {
        path: path,
        idx: idx
    }, function(data) {
        reloadDiv('todos');
    })
}

function clearCompleted(path) {
    $.get('clear_completed', {
        path: path,
    }, function(data) {
        reloadDiv('todos');
    })
}

function showDiff(repoPath, filePath) {
    $.get('show_diff', {
        repo_path: repoPath,
        file_path: filePath
    }, function(data) {
        $('#diff').html('');
        $('#diff').append(`<div style="white-space: pre-wrap" class="font-monospace">${data}</div>`);
        $('#readmeBtn').removeClass('invisible');
    })
}

function ignore(idx, repoPath) {
    $.get('ignore', {
        idx: idx,
        repo_path: repoPath
    }, function(data) {
        reloadDiv('status');
    })
}

function reset(idx, repoPath) {
    $.get('reset', {
        idx: idx,
        repo_path: repoPath
    }, function(data) {
        reloadDiv('status');
    })
}
