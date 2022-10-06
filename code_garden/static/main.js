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
