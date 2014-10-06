/**
 * Created by DrTone on 02/10/2014.
 */
//Horror related stuff
var TOTAL_FILMS = 4;
var currentFilmId = null;
var currentFilmNum = null;

var filmSynopses = ["A visiting actress in Washington, D.C., notices dramatic and dangerous changes"+
        "in the behavior and physical make-up of her 12-year-old daughter. Meanwhile, a"+
        "young priest at nearby Georgetown University begins to doubt his faith while"+
        "dealing with his mother's terminal sickness. And, book-ending the story, a frail,"+
        "elderly priest recognizes the necessity for a show-down with an old demonic enemy.",
        "A big massacre with a chain saw and blood and stuff",
        "The hills are alive, etc., etc.",
        "Hammer horror with Christopher Lee and Barbera Shelley where four travellers go on holiday to" +
        "Transylvania."];

var filmNames = ['The Exorcist', 'The Texas Chainsaw Massacre', 'The Sound of Music', 'Dracula : Prince of Darkness'];
var filmTimes = ['31 : 10 : 22 : 00', '31 : 10 : 23 : 45', '01 : 11 : 20 : 00', '01 : 11 : 22 : 00'];
var filmStatus = ['LIVE', 'PENDING', 'PENDING', 'PENDING'];
var filmRecords = [];
var filmElements = ['name', 'time', 'status'];
var defaultTweetText = 'Live text updates from the film screening will appear once this film has started';

function setupFilms() {
    //Set up record for each film and store
    var record;
    for(var i=0; i<TOTAL_FILMS; ++i) {
        record = { name: filmNames[i], time: filmTimes[i], status: filmStatus[i], synopsis: filmSynopses[i]};
        filmRecords.push(record);
    }
    //Populate page
    var id;
    for(var i=1; i<=TOTAL_FILMS; ++i) {
        id = 'film'+i;
        for(var j=0; j<filmElements.length; ++j) {
            var filmElem = id + filmElements[j];
            $('#'+filmElem).html(filmRecords[i-1][filmElements[j]]);
        }
    }
}

function updateClock() {
    //Get current time
    var date = new Date();
    //Day
    var day = date.getDate();
    if(day < 10) day = '0'+day;
    $('#day').html(day+':');
    //Month
    var month = date.getMonth()+1;
    if(month < 10) month = '0'+month;
    $('#month').html(month+':');
    //Hour
    var hour = date.getHours();
    if(hour < 10) hour = '0'+hour;
    $('#hour').html(hour+':');
    //Minutes
    var minutes = date.getMinutes();
    if(minutes < 10) minutes = '0'+minutes;
    $('#minute').html(minutes);
}

function highlightFilm(filmId) {
    //Highlight given film
    if(currentFilmId != null) {
        var elem = $('#'+currentFilmId);
        elem.removeClass('highLight');
        elem.addClass('noHighlight');
    }
    currentFilmId = filmId;
    elem = $('#'+filmId);
    elem.removeClass('noHighlight');
    elem.addClass('highLight');
    var film = filmId.indexOf('film');
    if(film >= 0) {
        currentFilmNum = parseInt(filmId.substr(film+4, 1));
        if(isNaN(currentFilmNum)) {
            currentFilmNum = null;
        } else {
            --currentFilmNum;
        }
    }
}

function updateSynopsis(filmId) {
    //Update film synopsis
    var synop = $('#filmSynopsis');
    //synop.removeClass('padOut');
    //synop.addClass('paddingSmall');
    synop.html(filmSynopses[currentFilmNum]);
}

function updateThumbnail() {
    //Update film image
    var image = $('#thumbnail');
    switch(currentFilmId) {
        case 'film1':
            image.attr('src', 'images/exorcist.jpg');
            break;
        case 'film2':
            image.attr('src', 'images/texas.jpg');
            break;
        case 'film3':
            image.attr('src', 'images/sound.jpg');
            break;
        case 'film4':
            image.attr('src', 'images/dracula.jpg');
            break;
        default:
            console.log('Could not update thumbnail', currentFilmId);
            break;
    }
}

function updateStatus() {
    //Update title and status
    if(currentFilmNum != null) {
        var record = filmRecords[currentFilmNum];
        $('#filmName').html(record['name']);
        $('#filmStatus').html(record['status']);
    } else {
        console.log('No current film ', currentFilmNum);
    }
}

function updateTwitter() {
    //Update twitter feed
    var text = currentFilmNum == 0 ? 'Ooo, sooo scary!!!' : defaultTweetText;
    $('#tweetText').html(text);
}

$(document).ready(function() {
    //Initialise app
    updateClock();
    setInterval(updateClock, 1000*60);

    setupFilms();

    $('.filmList li').addClass('noHighlight');

    //Highlighting
    $('.filmList li').on('click', function(evt) {
        highlightFilm(evt.currentTarget.id);
        updateSynopsis();
        updateThumbnail();
        updateStatus();
        updateTwitter();
    })
});