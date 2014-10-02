/**
 * Created by DrTone on 02/10/2014.
 */
//Horror related stuff

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

$(document).ready(function() {
    //Initialise app
    updateClock();
    setInterval(updateClock, 1000*60);

    //Highlighting
    $('li.filmList').on('click', function(evt) {
        console.log(evt);
        $('li.filmList').addClass('highLight');
    })
});