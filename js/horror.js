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
function Horror() {
    BaseApp.call(this);
}

Horror.prototype = new BaseApp();

Horror.prototype.init = function(container) {
    //Animation
    this.rotInc = Math.PI/200;

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

    //Load brain model
    this.modelLoader = new THREE.OBJLoader();
    var _this = this;

    //Create 14 spheres for brain zones
    var sphere;
    var sphereMat;
    var sphereMesh;

    this.glowRedMat = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                "intensity" : { type: "f", value: 1.5 },
                "glowTexture": { type: "t", value: THREE.ImageUtils.loadTexture("images/glowRed.png") }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            transparent: true
        }
    );

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

    var texture = THREE.ImageUtils.loadTexture('images/glowRed.png');

    for(var i=0; i<numZones; ++i) {
        sphere = new THREE.SphereGeometry(5, 8, 8);
        //sphereMat = this.glowRedMat;
        sphereMat = new THREE.MeshPhongMaterial( {color: 0xff0000});
        sphereMesh = new THREE.Mesh(sphere, sphereMat);
        sphereMesh.name = brainData.getZoneName(i);
        sphereMesh.position.set(zonePositions[i].x, zonePositions[i].y, zonePositions[i].z);
        this.scene.add(sphereMesh);
    }

    this.modelLoader.load( 'models/newBrain.obj', function ( object ) {

        _this.scene.add( object );
        _this.loadedModel = object;
        //Apply material to object
        //Create shader material


        object.traverse( function(child) {
            if(child instanceof THREE.Mesh) {
                child.name = 'brain';
                child.material = new THREE.MeshPhongMaterial( { color: 0x00ff00, transparent:true, opacity: 0.25});
            }
        })
    } );
};

Horror.prototype.update = function() {
    //Update pubnub data
    var data =

    this.glowRedMat.uniforms.intensity.value =  this.channel.getLastValue("raw00");
    //Rotate brain model
    /*
     if(this.loadedModel) {
     this.loadedModel.rotation.y += this.rotInc
     }
     */

    BaseApp.prototype.update.call(this);
};


$(document).ready(function() {
    //Set up visualisation
    var container = document.getElementById("WebGL-Output");
    var app = new Horror();
    app.init(container);
    app.createScene();

    app.run();
});
