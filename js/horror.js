//Brain visualisation

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

//Init this app from base
var RANDOM_FIRE_TIME = 1;
var ALPHA_TRANSITION_TIME = 20;
var ALPHA_STEADY_TIME = 10;
//Alpha states
var DOWN=0, OFF=1, UP=2, ON=3;
var guiLabelElem = null;

function Horror() {
    BaseApp.call(this);
}

Horror.prototype = new BaseApp();

Horror.prototype.init = function(container) {
    //Animation
    this.rotInc = 0.002;
    this.glowTime = 0;
    this.delta = 0;
    this.dataTime = 0;
    this.brainModel = null;
    this.alphaStates = [DOWN, OFF, UP, ON];
    this.currentAlphaState = DOWN;
    this.opacityTime = 0;
    this.brainTime = 0;
    this.startUpCheck = true;

    //Subscribe to pubnub
    this.channel = PubNubBuffer.subscribe("mayhempaul",
        "sub-c-2eafcf66-c636-11e3-8dcd-02ee2ddab7fe",
        1000,
        300);

    BaseApp.prototype.init.call(this, container);
};

Horror.prototype.createScene = function() {
    //Init base createsScene
    BaseApp.prototype.createScene.call(this);

    //Place marker where light is
    var boxGeom = new THREE.BoxGeometry(2, 2, 2);
    var boxMat = new THREE.MeshBasicMaterial( {color: 0xffffff});
    var box = new THREE.Mesh(boxGeom, boxMat);
    box.name = 'lightBox';
    var light = this.scene.getObjectByName('PointLight', true);
    if(light) {
        box.position.copy(light.position);
    }

    this.scene.add(box);

    //Root node
    this.root = new THREE.Object3D();
    this.root.name = 'root';
    this.scene.add(this.root);

    //Load brain model
    this.modelLoader = new THREE.OBJLoader();
    var _this = this;

    //Create 14 spheres for brain zones
    var sphere;
    var sphereMat;
    var sphereMesh;
    var sprite;
    var spriteMat;
    this.spriteMats = [];

    var zonePositions = [];
    var numZones = brainData.getNumZones();
    for(var i=0; i<numZones; ++i) {
        zonePositions.push(new THREE.Vector3());
    }
    //AF3
    zonePositions[0].x = 20;
    zonePositions[0].y = 60;
    zonePositions[0].z = 80;
    //F7
    zonePositions[1].x = 55;
    zonePositions[1].y = 10;
    zonePositions[1].z = 100;
    //F3
    zonePositions[2].x = 30;
    zonePositions[2].y = 70;
    zonePositions[2].z = 70;
    //FC5
    zonePositions[3].x = 40;
    zonePositions[3].y = 30;
    zonePositions[3].z = 60;
    //T7
    zonePositions[4].x = 65;
    zonePositions[4].y = -20;
    zonePositions[4].z = 0;
    //P7
    zonePositions[5].x = 55;
    zonePositions[5].y = -10;
    zonePositions[5].z = -30;
    //O1
    zonePositions[6].x = 20;
    zonePositions[6].y = 0;
    zonePositions[6].z = -70;
    //AF4
    zonePositions[13].x = -20;
    zonePositions[13].y = 60;
    zonePositions[13].z = 80;
    //F8
    zonePositions[12].x = -55;
    zonePositions[12].y = 10;
    zonePositions[12].z = 100;
    //F4
    zonePositions[11].x = -30;
    zonePositions[11].y = 70;
    zonePositions[11].z = 70;
    //FC6
    zonePositions[10].x = -40;
    zonePositions[10].y = 30;
    zonePositions[10].z = 60;
    //T8
    zonePositions[9].x = -65;
    zonePositions[9].y = -20;
    zonePositions[9].z = 0;
    //P8
    zonePositions[8].x = -55;
    zonePositions[8].y = -10;
    zonePositions[8].z = -30;
    //O2
    zonePositions[7].x = -20;
    zonePositions[7].y = 0;
    zonePositions[7].z = -70;

    var texture = THREE.ImageUtils.loadTexture('images/glowRed.png');

    this.sphereScale = 0.5;
    for(var i=0; i<numZones; ++i) {
        sphere = new THREE.SphereGeometry(5, 8, 8);
        //sphereMat = this.glowRedMat;
        sphereMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
        sphereMesh = new THREE.Mesh(sphere, sphereMat);
        sphereMesh.scale.multiplyScalar(this.sphereScale);
        sphereMesh.name = brainData.getZoneName(i);
        sphereMesh.position.set(zonePositions[i].x, zonePositions[i].y, zonePositions[i].z);

        //Add sprite to each mesh
        spriteMat = new THREE.SpriteMaterial( {map: texture, useScreenCoordinates: false, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthTest: false});
        sprite = new THREE.Sprite(spriteMat);
        this.spriteMats.push(spriteMat);
        sprite.scale.set(100, 100, 1);
        sphereMesh.add(sprite);
        this.root.add(sphereMesh);
    }


    this.modelLoader.load( 'models/newBrain.obj', function ( object ) {

        _this.root.add( object );
        _this.loadedModel = object;
        //Apply material to object
        object.traverse( function(child) {
            if(child instanceof THREE.Mesh) {
                child.name = 'brain';
                _this.brainModel = child;
                child.material = new THREE.MeshPhongMaterial( { color: 0x00ff00, transparent:true, opacity: 0.25});
            }
        })
    } );

};

Horror.prototype.createGUI = function() {
    //Create GUI for test dev only
    this.guiControls = new function() {
        this.SphereSize = 0.5;
        this.BrainOpacity = 0.25;
        this.CycleOpacity = false;
        this.GlowOpacity = 0.7;
        this.RotateSpeed = 0.002;
        this.SinewaveData = false;
        this.RandomData = false;
        this.NeuroData = true;
        //Light Pos
        this.LightX = 200;
        this.LightY = 200;
        this.LightZ = 200;
    };

    //Create GUI
    var gui = new dat.GUI();
    var _this = this;
    gui.add(this.guiControls, 'SphereSize', 0.1, 2).onChange(function(value) {
        _this.onSphereChange(value);
    });
    gui.add(this.guiControls, 'BrainOpacity', 0, 1).onChange(function(value) {
        _this.onBrainOpacity(value);
    });
    gui.add(this.guiControls, 'CycleOpacity', false);
    gui.add(this.guiControls, 'GlowOpacity', 0, 1).onChange(function(value) {
        _this.onGlowOpacity(value);
    });
    gui.add(this.guiControls, 'RotateSpeed', 0, 0.02).onChange(function(value) {
        _this.rotInc = value;
    });
    var sineData = gui.add(this.guiControls, 'SinewaveData', false).onChange(function(value) {
        //Ensure no other data generation
        if(value) {
            _this.guiControls.NeuroData = false;
            _this.guiControls.RandomData = false;
        }
    });
    sineData.listen();

    var randomData = gui.add(this.guiControls, 'RandomData', false).onChange(function(value) {
        //Ensure no other data generation
        if(value) {
            _this.guiControls.NeuroData = false;
            _this.guiControls.SinewaveData = false;
        }
    });
    randomData.listen();

    var NeuroData = gui.add(this.guiControls, 'NeuroData', false).onChange(function(value) {
        //Turn off other data generation
        if(value) {
            _this.guiControls.SinewaveData = false;
            _this.guiControls.RandomData = false;
        }
    });
    NeuroData.listen();

    this.lightPos = gui.addFolder('LightPos');
    this.lightPos.add(this.guiControls, 'LightX', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, -1);
    });
    this.lightPos.add(this.guiControls, 'LightY', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 0);
    });
    this.lightPos.add(this.guiControls, 'LightZ', -300, 300).onChange(function(value) {
        _this.changeLightPos(value, 1);
    });
};

Horror.prototype.onSphereChange = function(value) {
    //Change size of all spheres
    var sphere;
    for(var i=0; i<brainData.getNumZones(); ++i) {
        sphere = this.scene.getObjectByName(brainData.getZoneName(i), true);
        if(sphere) {
            sphere.scale.set(value, value, value);
        }
    }
};

Horror.prototype.onBrainOpacity = function(value) {
    //Change brain opacity
    var brain = this.scene.getObjectByName('brain', true);
    if(brain) {
        brain.material.opacity = value;
    }
};

Horror.prototype.onGlowOpacity = function(value) {
    //Change glow opacity
    for(var i=0; i<this.spriteMats.length; ++i) {
        this.spriteMats[i].opacity = value;
    }
};

Horror.prototype.changeLightPos = function(value, axis) {
    //Change light pos
    var light = this.scene.getObjectByName('PointLight', true);
    var box = this.scene.getObjectByName('lightBox', true);
    if(!light || !box) {
        console.log('No light or light box');
        return;
    }
    switch(axis) {
        case -1:
            //X-axis
            light.position.x = value;
            box.position.x = value;
            break;

        case 0:
            //Y-Axis
            light.position.y = value;
            box.position.y = value;
            break;

        case 1:
            //Z-Axis
            light.position.z = value;
            box.position.z = value;
            break;

        default:
            break;
    }
};

Horror.prototype.update = function() {
    //Update data
    this.delta = this.clock.getDelta();

    if(this.guiControls.SinewaveData) {
        this.updateDataFeed(false);
        for(var i=0; i<this.spriteMats.length; ++i) {
            this.spriteMats[i].opacity = (Math.sin(this.glowTime)/2.0) + 0.5;
        }
    }

    if(this.guiControls.NeuroData) {
        if(this.startUpCheck) {
            this.brainTime += this.delta;
        }
        for(var i=0; i<this.spriteMats.length; ++i) {
            this.lastData = this.channel.getLastValue(brainData.getZoneName(i));
            this.receivedData = this.lastData != undefined;
            if(this.receivedData) {
                this.spriteMats[i].opacity = this.lastData;
                this.brainTime = 0;
                this.startUpCheck = false;
            } else {
                if(this.brainTime >= 5 && this.startUpCheck) {
                    this.guiControls.SinewaveData = true;
                    this.guiControls.NeuroData = false;
                    this.brainTime = 0;
                    this.startUpCheck = false;
                }
            }
        }
        //See if this is replaying or live
        this.updateDataFeed(this.receivedData);
    }

    if(this.guiControls.RandomData) {
        this.updateDataFeed(false);
        this.dataTime += this.delta;
        if(this.dataTime > RANDOM_FIRE_TIME) {
            this.dataTime = 0;
            for(var i=0; i<this.spriteMats.length; ++i) {
                this.spriteMats[i].opacity = Math.random();
            }
        }
    }

    if(this.guiControls.CycleOpacity) {
        switch(this.currentAlphaState) {
            case DOWN:
                if(this.opacityTime == 0) {
                    this.opacityTime = this.guiControls.BrainOpacity * ALPHA_TRANSITION_TIME;
                }
                this.opacityTime -= this.delta;
                if(this.opacityTime <= 0){
                    this.opacityTime = 0;
                    this.currentAlphaState = OFF;
                }
                this.brainModel.material.opacity = this.opacityTime / ALPHA_TRANSITION_TIME;
                break;
            case OFF:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_STEADY_TIME) {
                    this.opacityTime = 0;
                    this.currentAlphaState = UP;
                }
                break;
            case UP:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_TRANSITION_TIME) {
                    this.opacityTime = 0;
                    this.currentAlphaState = ON;
                    this.brainModel.material.opacity = 1.0;
                } else {
                    this.brainModel.material.opacity = this.opacityTime / ALPHA_TRANSITION_TIME;
                }
                break;
            case ON:
                this.opacityTime += this.delta;
                if(this.opacityTime >= ALPHA_STEADY_TIME) {
                    this.opacityTime = ALPHA_TRANSITION_TIME;
                    this.currentAlphaState = DOWN;
                }
                break;
        }
    }

    this.glowTime += 0.1;

    //Rotate brain model
    if(this.loadedModel) {
        this.root.rotation.y += this.rotInc
    }


    BaseApp.prototype.update.call(this);
};

Horror.prototype.updateDataFeed = function(gotData) {
    var liveElem = $('#liveData');
    var replayElem = $('#replayData');
    this.liveData = this.channel.getLastValue('Live') == 2;

    if(this.liveData == undefined || !gotData) {
        liveElem.hide();
        replayElem.hide();
        return;
    }
    if(this.liveData) {
        liveElem.show();
        replayElem.hide();
    } else {
        liveElem.hide();
        replayElem.show();
    }
};

Horror.prototype.keydown = function(event) {
    //Do any key processing
    switch(event.keyCode) {
        case 72: //H
            var elem = $('#info');
            if(elem.is(':visible')) {
                elem.hide();
            } else {
                elem.show();
            }
            break;

        default :
            break;
    }
};

var TRANSITION_TIME = 500;
function showInfo() {
    //Hide image icon
    $('#infoTitle').hide();

    //Show text panel
    $('#infoContent').slideDown();
}

function hideInfo() {
    //Hide text panel
    $('#infoContent').slideUp();

    //Show image icon
    $('#infoTitle').slideDown();

    //Stop video playing
    player.pauseVideo();
}

var player;
function onYouTubePlayerAPIReady() {
    //Create global player
    player = new YT.Player('mayhemVid', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube vid ready');
}

$(document).ready(function() {
    //Sort out video
    $('#vidContent').fitVids();

    //Load YouTube API
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    //Set up visualisation
    //See if supported
    if(!Detector.webgl) {
        $('#notSupported').show();
    } else {
        var container = document.getElementById("WebGL-Output");
        var app = new Horror();
        app.init(container);
        app.createScene();
        app.createGUI();

        //Interaction
        $('#infoTitle').on('click', function() {
            showInfo();
        });

        $('#close').on('click', function() {
            hideInfo();
        });

        $(document).keydown(function(event) {
            app.keydown(event);
        });

        app.run();
    }

});
