/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
    schema: {
        enabled: { default: true },
        rotationFactor: { default: 5 },
        minScale: { default: 5 },
        maxScale: { default: 50 },
    },

    init: function() {
        console.log(this);

        this.handleScale = this.handleScale.bind(this);
        this.handleRotation = this.handleRotation.bind(this);

        this.isVisible = false;
        this.initialScale = this.el.object3D.scale.clone();
        this.scaleFactor = 1;

        //var mychar = document.getElementById("debugText");
        // mychar.style.display = "none";

        // var loder = document.getElementById("arjs-loader");
        // loder.style.display = "none";
        var item1 = document.querySelector("#obj");

        console.log(item1);
        this.el.sceneEl.addEventListener("markerFound", (e) => {
            this.isVisible = true;
            console.log("found marker");
            // mychar.style.display = "block";
            console.log("this obj");
            console.log(this.nextSibling);
            console.log("this.el");
            console.log(this.el);
            item1.setAttribute('visible', "true");

        });


        this.el.sceneEl.addEventListener("markerLost", (e) => {
            this.isVisible = false;
            console.log("Lost marker");
            item1.setAttribute('visible', "false");

            item1.setAttribute('gltf-model', "G/Grindingbasin2.gltf");
            // mychar.style.display = "none";
        });
    },

    update: function() {

        if (this.data.enabled) {
            this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
            this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
        } else {
            this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
            this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
        }
    },

    remove: function() {
        this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
        this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    },

    handleRotation: function(event) {
        if (this.isVisible) {
            this.el.object3D.rotation.y +=
                event.detail.positionChange.x * this.data.rotationFactor;
            this.el.object3D.rotation.x +=
                event.detail.positionChange.y * this.data.rotationFactor;
        }
    },

    handleScale: function(event) {
        if (this.isVisible) {
            this.scaleFactor *=
                1 + event.detail.spreadChange / event.detail.startSpread;

            this.scaleFactor = Math.min(
                Math.max(this.scaleFactor, this.data.minScale),
                this.data.maxScale
            );

            this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
            this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
            this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
        }
    },
});