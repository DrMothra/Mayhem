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
    var brainZones = ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4'];
    var zoneDescriptions = ["Logical Attention: the rational mind working things out", "Word Generation: necessary for talking",
        "Verbal Expression: communicating what we're thinking", "Motor Planning: preparing to move the body. Also elevates mood",
        "Visual Categorisation: putting unknown things into known categories", "Biological Motion: ability to spot living organism",
        "Visual Exploration: looking around and examining the scene", "Large Line Patterns: making sense in patterns and lines",
        "Motion Verb: suggested and imagined motion of animate or inanimate objects", "Visual Meaningfulness: making sense of flicking images to be a representation of reality",
        "Response Competition: managing ambiguity or novelty, demanding confused responses", "Sensorimotor Willed Action: novel physical action requires concentration",
        "Emotional Expression: communicating what we’re feeling", "Emotional Attention: linking emotions to useful actions. Trust your gut instinct and stay alive!"];
    var zoneComments = ["pointy teeth, aversion to garlic… I think you’re a…", "VAMPIRE",
        "darling, I think you’ve turned into a vampire", "and as such, I’d better prepare to run away", "what are you doing with that cheese grater? Sweet Jesus, NO!",
        "and why has our settee started to behave like a giant mouth", "what the hell is happening to rest my living room!",
        "Those pot plants bear an uncanny resemblance to little daemons", "what do you mean ‘they’re coming to get me’?",
        "no I DON’T want to 'go into the light' it’s just a television", "hang on, you’re not a vampire after all, you’re a succubus. Blimey…",
        "I’d better decapitate you with these nail clippers - must pay attention", "URGHH, this is grotesque", "All quiet… Uh oh, got that spooky feeling again, better run"];

    var brainTextData = [];
    var brainRecord = {};
    for(var i=0; i<brainZones.length; ++i) {
        brainRecord = { zone: brainZones[i], descriptor: zoneDescriptions[i], comment: zoneComments[i]};
        brainTextData.push(brainRecord);
    }

    //Public access to these
    return {
        getNumZones: function() {
            return brainZones.length;
        },

        getBrainData: function() {
            return brainTextData;
        },

        getZoneName: function(zone) {
            if(zone <0 || zone >= brainZones.length) return null;

            return brainZones[zone];
        },

        getZoneDescription: function(name) {
            for(var i=0; i<brainZones.length; ++i) {
                if(brainZones[i] == name) {
                    var record = brainTextData[i];
                    return record.descriptor;
                }
            }

        }
    }
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
    this.currentLED = null;

    //Subscribe to pubnub
    this.channel = PubNubBuffer.subscribe("mayhemtony",
        "sub-c-2eafcf66-c636-11e3-8dcd-02ee2ddab7fe",
        5000,
        300);

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

    //Create 14 spheres for brain zones
    var sphere;
    var sphereMat;
    var sphereMesh;
    var xPos = 0;

    var zonePositions = [];
    var numZones = brainData.getNumZones();
    for(var i=0; i<numZones; ++i) {
        zonePositions.push(new THREE.Vector3());
    }
    zonePositions[0].x = 20;
    zonePositions[1].x = 20;
    zonePositions[1].y = 90;
    zonePositions[2].x = 50;
    zonePositions[2].y = 60;
    zonePositions[3].x = 80;
    zonePositions[3].y = 20;
    zonePositions[4].x = -20;
    zonePositions[5].x = -20;
    zonePositions[5].y = 90;
    zonePositions[6].x = -50;
    zonePositions[6].y = 60;
    zonePositions[7].x = -80;
    zonePositions[7].y = 20;

    for(var i=0; i<numZones; ++i) {
        sphere = new THREE.SphereGeometry(10);
        sphereMat = new THREE.MeshLambertMaterial( {color: 0xff0000});
        sphereMesh = new THREE.Mesh(sphere, sphereMat);
        sphereMesh.name = brainData.getZoneName(i);
        sphereMesh.position.set(zonePositions[i].x, zonePositions[i].y, zonePositions[i].z);
        this.scene.add(sphereMesh);
    }


    this.modelLoader.load( 'models/newBrain.obj', function ( object ) {

        _this.scene.add( object );
        _this.loadedModel = object;
        //object.name = 'brain';
        //Apply material to object
        object.traverse( function(child) {
            if(child instanceof THREE.Mesh) {
                child.name = 'brain';
                child.material = new THREE.MeshPhongMaterial( { color: 0x00ff00, transparent:true, opacity: 0.5});
            }
        })
    } );
};

Horror.prototype.update = function() {
    //See if anything in sight
    this.sightVector.x = this.sightVector.y = 0;
    this.sightVector.z = 0.5;
    this.projector.unprojectVector(this.sightVector, this.camera);
    var raycaster = new THREE.Raycaster(this.camera.position, this.sightVector.sub(this.camera.position).normalize());
    this.hoverObjects.length = 0;
    this.hoverObjects = raycaster.intersectObjects(this.scene.children, true);

    //Check hover actions
    if(this.hoverObjects.length != 0) {
        //Find relevant object
        for(var i=0; i<this.hoverObjects.length; ++i) {
            var name = this.hoverObjects[i].object.name;
            if(name != 'brain' && name != 'sight') {
                //Illuminate led
                this.updateZoneInfo(name);
                break;
            }
        }
    } else {
        this.updateZoneInfo(null);
    }

    //Update pubnub data
    var data = this.channel.getLastValue("raw00") * 90;
    data = data+'%';
    $('#barAF3').css('height', data);

    //Rotate brain model
    /*
    if(this.loadedModel) {
        this.loadedModel.rotation.y += this.rotInc
    }
    */

    BaseApp.prototype.update.call(this);
};

Horror.prototype.updateZoneInfo = function(name) {
    //Turn off current led
    if(this.currentLED != null || name == null) {
        $('#'+this.currentLED).attr('src', 'images/GreenOff.png');
    }
    //Illuminate led
    this.currentLED = name+'led';
    $('#'+this.currentLED).attr('src','images/GreenOn.png');

    //Update brain zone info
    $('#zoneId').html(name);
    $('#visCat').html(brainData.getZoneDescription(name));
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