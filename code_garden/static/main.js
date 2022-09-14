$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
});

function changeTheme(theme) {
    localStorage.setItem('CodeGarden', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
}

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
    $('#navContent').load(location.href + ' #navContent');
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function copyPath() {
    var x = $('#repoPath');
    x.show();
    x.select();
    document.execCommand('copy');
    x.hide();
    $('#copyIcon').toggleClass('bi-check-lg bi-clipboard');
    setTimeout(function() { $('#copyIcon').toggleClass('bi-check-lg bi-clipboard'); }, 2000);
}

function sendToCommit(idx) {
    $('#msg').val($('#todoDesc' + idx).val());
}