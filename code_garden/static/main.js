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

function addTodo(name) {
    $('#spinner').show();
    $.post('add_todo', {
        name: name,
        description: $('#description').val(),
        type: $('#type').val()
    }, function(data) {
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function commit(name) {
    $('#spinner').show();
    $.post('commit', {
        name: name,
        type: $('#commitType').val(),
        msg: $('#commitMsg').val()
    }, function(data) {
        reloadDiv('status');
        reloadDiv('log');
        $('#spinner').hide();
    })
}

function commitTodo(name, idx) {
    $('#spinner').show();
    $.get('commit_todo', {
        name: name,
        idx: idx
    }, function(data) {
        reloadDiv('status');
        reloadDiv('log');
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function markTodo(name, idx) {
    $('#spinner').show();
    $.get('mark_todo', {
        name: name,
        idx: idx
    }, function(data) {
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function editTodo(name, idx) {
    $('#spinner').show();
    $.post('edit_todo', {
        name: name,
        idx: idx,
        description: $('#description' + idx).val()
    }, function(data) {
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function deleteTodo(name, idx) {
    $('#spinner').show();
    $.get('delete_todo', {
        name: name,
        idx: idx
    }, function(data) {
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function clearCompleted(name) {
    $('#spinner').show();
    $.get('clear_completed', {
        name: name,
    }, function(data) {
        reloadDiv('todos');
        $('#spinner').hide();
    })
}

function showDiff(repoPath, filePath) {
    $('#spinner').show();
    $.get('show_diff', {
        repo_path: repoPath,
        file_path: filePath
    }, function(data) {
        $('#diff').html('');
        $('#diff').append(`<div style="white-space: pre-wrap" class="font-monospace">${data}</div>`);
        $('#readmeBtn').removeClass('invisible');
        $('#spinner').hide();
    })
}

function ignore(idx, repoPath) {
    $('#spinner').show();
    $.get('ignore', {
        idx: idx,
        repo_path: repoPath
    }, function(data) {
        reloadDiv('status');
        $('#spinner').hide();
    })
}

function unignore(idx, repoPath) {
    $('#spinner').show();
    $.get('unignore', {
        idx: idx,
        repo_path: repoPath
    }, function(data) {
        reloadDiv('ignore');
        $('#spinner').hide();
    })
}

function reset(idx, repoPath) {
    $('#spinner').show();
    $.get('reset', {
        idx: idx,
        repo_path: repoPath
    }, function(data) {
        reloadDiv('status');
        $('#spinner').hide();
    })
}

function copyPath() {
    copyThis = document.getElementById('copyThis');
    copyThis.style.display = 'block';
    copyThis.select();
    document.execCommand('copy');
    copyThis.style.display = 'none';
}

function showCheck(elem) {
    check = $(`<i class="bi bi-check-lg text-success"></i>`);
    $(elem).append(check);
    setTimeout(function() {$(check).remove()}, 1000);
}
