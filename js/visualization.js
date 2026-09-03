import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ========================================
// 3D FEEDER VISUALIZATION
// ========================================

const modelContainer = document.getElementById("feeder-model");
const modelStatus = document.getElementById("modelStatus");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xf5f5f5);


// ========================================
// CAMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
    15,
    modelContainer.clientWidth / modelContainer.clientHeight,
    0.01,
    100
);

camera.position.set(1.5, 0.3, 2);

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(
    modelContainer.clientWidth,
    modelContainer.clientHeight
);

modelContainer.appendChild(renderer.domElement);


// ========================================
// LIGHTING
// ========================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

directionalLight.position.set(2, 3, 2);

scene.add(directionalLight);


// ========================================
// CAMERA CONTROLS
// ========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.target.set(0.7, 0.1, 0);


// ========================================
// LOAD GLB
// ========================================

const loader = new GLTFLoader();

let feederModel = null;
let mixer = null;
let animations = [];

loader.load(
    "models/pet_feeder2.glb",

    function (gltf) {

        feederModel = gltf.scene;
        feederModel.scale.set(5, 5, 5);
        scene.add(feederModel);

        animations = gltf.animations;

        console.log("Model loaded");
        console.log("Animations:", animations);

        if (animations.length > 0) {

            mixer = new THREE.AnimationMixer(
                feederModel
            );
        }

        modelStatus.textContent = "Ready";
    },

    function (progress) {

        if (progress.total > 0) {

            console.log(
                "Loading:",
                (progress.loaded / progress.total * 100) + "%"
            );
        }
    },

    function (error) {

        console.error(
            "Error loading feeder:",
            error
        );

        modelStatus.textContent =
            "Failed to load model";
    }
);


// ========================================
// PLAY FEEDING ANIMATION
// ========================================

export function playFeedAnimation() {

    if (!mixer || animations.length === 0) {

        console.log("No animation available");

        return;
    }

    console.log("Playing feeding animation");

    const action = mixer.clipAction(
        animations[0]
    );

    action.reset();

    action.setLoop(
        THREE.LoopOnce
    );

    action.clampWhenFinished = true;

    action.play();

    modelStatus.textContent = "Feeding...";
}


// ========================================
// ANIMATION LOOP
// ========================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) {

        mixer.update(delta);
    }

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ========================================
// WINDOW RESIZE
// ========================================

window.addEventListener(
    "resize",
    function () {

        camera.aspect =
            modelContainer.clientWidth /
            modelContainer.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            modelContainer.clientWidth,
            modelContainer.clientHeight
        );
    }
);