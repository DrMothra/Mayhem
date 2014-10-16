/**
 * Created by DrTone on 02/10/2014.
 */
/*

    */

//Film related stuff
var films = (function() {
    //Private stuff
    var currentFilmId = null;
    var currentFilmNum = null;
    var displayFilmNum = 0;
    var LIVE = 0;
    var WAIT = 1;
    var ENDED = 2;

    var filmSynopses = ["A super stylish slasher from the creators of Paranormal Activity and American Horror Story, playing like a cross between Zodiac and Scream.",
        "40th Anniversary screening of the horror masterpiece from Tobe Hooper that asks: 'who will survive, and what will be left of them?'",
        "Gory body horror mixed with satirical supernatural scares in this tale of making it big in Hollywood whatever the cost to your soul.",
            "Forced by the courts to return to live with her mum, a young criminal learns that her childhood home may be haunted... or worse.",
        "Animated adventure: from the traumatic murder of Bambi's mother at the hands of hunters, to his jubilant ascension as Prince of the Forest.",
        "This uproarious comedy spoof of the Airport series of disaster movies is full of quotable lines and slapstick gags that endure to this day."];

    var filmNames = ['The Town that Dreaded Sundown', 'The Texas Chainsaw Massacre', 'Starry Eyes', 'Housebound', 'Walt Disneys Bambi', 'Airplane!'];
    var filmTimes = ['31/10 22:00', '31/10 23:45', '01/11 20:00', '01/11 22:00','01/11 20:00', '01/11 22:00'];
    var filmStatus = [LIVE, WAIT, WAIT, WAIT, ENDED, ENDED];
    var filmRecords = [];
    var filmElements = ['name', 'time', 'status'];
    var defaultTweetText = 'Live text updates from the film screening will appear once this film has started';

    //Set up record for each film and store
    var TOTAL_FILMS = filmNames.length;

    //Public access to these
    return {
        setupFilms: function() {
            var record;
            for (var i = 0; i < TOTAL_FILMS; ++i) {
                record = { name: filmNames[i], time: filmTimes[i], status: filmStatus[i], synopsis: filmSynopses[i]};
                filmRecords.push(record);
            }
            //Populate page
            var id;
            for (var i = 1; i <= TOTAL_FILMS; ++i) {
                id = 'film' + i;
                for (var j = 0; j < filmElements.length; ++j) {
                    var filmElem = id + filmElements[j];
                    $('#' + filmElem).html(filmRecords[i - 1][filmElements[j]]);
                }
            }
        },

        highlightFilm: function (filmId) {
            //Highlight given film
            if(filmId == null) return;

            if (currentFilmId != null) {
                var elem = $('#selector' + currentFilmId);
            }
            currentFilmId = filmId;
            elem = $('#selector' + filmId);
            elem.html('==>');
            var film = filmId.indexOf('film');
            if (film >= 0) {
                currentFilmNum = parseInt(filmId.substr(film + 4, 1));
                if (isNaN(currentFilmNum)) {
                    currentFilmNum = null;
                } else {
                    --currentFilmNum;
                }
            }
        },

        updateSelectedFilm: function () {
            if(currentFilmNum == null) return;

            var elem = $('#selectedTitle');
            elem.html('==>' + filmNames[currentFilmNum]);
        },

        removeCurrentHighlight: function () {
            //Remove current film selection
            if(currentFilmId == null) return;

            var elem = $('#selector' + currentFilmId);
            elem.html('');
        },

        updateFilm: function() {
            //Highlight film
            if(currentFilmNum == null) return null;
            if(++currentFilmNum >= TOTAL_FILMS) currentFilmNum = 0;
            displayFilmNum = currentFilmNum +1;
            currentFilmId = 'film'+displayFilmNum;

            return currentFilmId;
        },
        updateSynopsis: function() {
            //Update film synopsis
            var synop = $('#synopsisText');
            synop.html(filmSynopses[currentFilmNum]);
        },

        updateStatus: function() {
            //Update title and status
            if(currentFilmNum == null) return;

            //Turn off all status leds
            var leds = ['mainStatusLiveLED', 'mainStatusWaitLED', 'mainStatusEndedLED'];
            var ledImagesOff = ['GreenOff.png', 'AmberOff.png', 'RedOff.png'];
            var ledImagesOn = ['GreenOn.png', 'AmberOn.png', 'RedOn.png'];
            var image;
            for(var i=0; i<leds.length; ++i) {
                image = $('#'+leds[i]);
                if(image) {
                    image.attr('src', 'images/'+ledImagesOff[i]);
                }
            }
            //Update film status
            var status = filmStatus[currentFilmNum];
            image = $('#'+leds[status]);
            image.attr('src', 'images/'+ledImagesOn[status]);
        },

        updateTwitter: function() {
            //Update twitter feed
            var text = currentFilmNum == 0 ? 'Ooo, sooo scary!!! #Scared' : defaultTweetText;
            $('#tweetText').html(text);
        }
    };
})();

var brainData = (function() {
    //Brain zones
    var brainZones = ['AF3', 'FC5', 'F7', 'F3', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4'];
})();

function updateClock() {
    //Get current time
    var date = new Date();
    //Day
    var day = date.getDate();
    if(day < 10) day = '0'+day;
    $('#day').html(day+'/');
    //Month
    var month = date.getMonth()+1;
    if(month < 10) month = '0'+month;
    $('#month').html(month);
    //Hour
    var hour = date.getHours();
    if(hour < 10) hour = '0'+hour;
    $('#hour').html(hour+':');
    //Minutes
    var minutes = date.getMinutes();
    if(minutes < 10) minutes = '0'+minutes;
    $('#minute').html(minutes);
}

//Init this app from base
function Horror() {
    BaseApp.call(this);
}

Horror.prototype = new BaseApp();

Horror.prototype.init = function(container) {
    //Animation
    this.rotInc = Math.PI/200;
    this.sightVector = new THREE.Vector3(0, 0, 0.5);

    BaseApp.prototype.init.call(this, container);
};

Horror.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    //Create grid
    var plane = new THREE.PlaneGeometry(300, 300);
    var texture = THREE.ImageUtils.loadTexture("images/gridNegativeHole.png");
    var planeMat = new THREE.MeshBasicMaterial( {map: texture, transparent: true, opacity: 0.5});
    var gridMesh = new THREE.Mesh(plane, planeMat);
    gridMesh.scale.set(1.0, 0.95, 1.0);
    gridMesh.position.x = 2.5;
    gridMesh.position.y = 10;
    gridMesh.position.z = -175;
    gridMesh.name = 'sight';
    //Add this to camera
    this.camera.add(gridMesh);
    this.scene.add(this.camera);

    //Load brain model
    this.modelLoader = new THREE.OBJLoader();
    var _this = this;

    //Test objects
    var sphere = new THREE.SphereGeometry(10);
    var sphereMat = new THREE.MeshLambertMaterial( {color: 0xff0000});
    var sphereMesh = new THREE.Mesh(sphere, sphereMat);
    sphereMesh.name = 'redBall';
    this.scene.add(sphereMesh);

    sphereMat = new THREE.MeshLambertMaterial( {color: 0x0000ff});
    sphereMesh = new THREE.Mesh(sphere, sphereMat);
    sphereMesh.position.x = 40;
    sphereMesh.name = 'blueBall';
    this.scene.add(sphereMesh);
    /*
    this.modelLoader.load( 'models/newBrain.obj', function ( object ) {

        _this.scene.add( object );
        _this.loadedModel = object;

    } );
    */
};

Horror.prototype.update = function update() {
    //See if anything in sight
    this.sightVector.x = this.sightVector.y = 0;
    this.sightVector.z = 0.5;
    this.projector.unprojectVector(this.sightVector, this.camera);
    var raycaster = new THREE.Raycaster(this.camera.position, this.sightVector.sub(this.camera.position).normalize());
    this.hoverObjects.length = 0;
    this.hoverObjects = raycaster.intersectObjects(this.scene.children, true);

    //Check hover actions
    $('#visCat').html('nothing');
    if(this.hoverObjects.length >= 2) {
        $('#visCat').html(this.hoverObjects[1].object.name);
    }

    //Rotate brain model
    /*
    if(this.loadedModel) {
        this.loadedModel.rotation.y += this.rotInc
    }
    */

    BaseApp.prototype.update.call(this);
};


$(document).ready(function() {
    //Update current time (every 30 secs should do)
    updateClock();
    setInterval(updateClock, 1000*30);

    //Set everything up
    films.setupFilms();

    //Select first film
    films.highlightFilm('film1');
    films.updateSynopsis();
    films.updateSelectedFilm();
    films.updateStatus();

    $('.pushButton img').on('click', function(evt) {
        console.log('clicked');
        films.removeCurrentHighlight();
        var film = films.updateFilm();
        films.highlightFilm(film);
        films.updateSynopsis();
        films.updateSelectedFilm();
        films.updateStatus();
    });

    //Set up visualisation
    var container = document.getElementById("WebGL-Output");
    var app = new Horror();
    app.init(container);
    app.createScene();

    app.run();

});