$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
});

function changeTheme(theme) {
    localStorage.setItem('CodeGarden', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('CodeGarden'));
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}
