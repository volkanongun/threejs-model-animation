import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'

const spider = new URL('../assets/spider.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(5, 5, 5);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

const assetLoader = new GLTFLoader();

const gui = new dat.GUI()
const guiOptions = {
    playAnimation : false
}

gui.add(guiOptions, 'playAnimation').onChange((e)=>{
    if(e)
        action.play()
    else
        action.stop()
})

let mixer, action
assetLoader.load(spider.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);

    console.log(model, " MODEL <<<")

    mixer = new THREE.AnimationMixer(model)

    const clips = gltf.animations

    console.log(clips, " CLIPS <<<")
    const clip = THREE.AnimationClip.findByName(clips, "Spider_walk_cycle")
    action = mixer.clipAction(clip)

    // plays all actions at the same time
    // clips.forEach((clip) => {
    //     const action = mixer.clipAction(clip)
    //     action.play()
    // })

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock()
function animate() {
    
    if(mixer)
        mixer.update(clock.getDelta())

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});