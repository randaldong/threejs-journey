/****************************** Import ******************************/
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

/****************************** Debug GUI ******************************/
const gui = new GUI({
    width: 300,
    title: 'Debug GUI',
    closeFolders: false,

})
// gui.close()
// gui.hide()

// Toggle between open/close of the debug GUI
window.addEventListener('keydown', (event) => {
    if (event.key === 'g')
        gui.open(gui._closed)
})

// Toggle the visibility of the debug GUI
window.addEventListener('keydown', (event) => {
    if (event.key === 'h')
        gui.show(gui._hidden)
})

const debugObj = {}

/****************************** Canvas ******************************/
const canvas = document.querySelector('canvas.webgl')

/****************************** Scene ******************************/
const scene = new THREE.Scene()

/****************************** Object ******************************/
// Texture
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const colorKintsugi = textureLoader.load('textures/Kintsugi/basecolor.png')
const normalKintsugi = textureLoader.load('textures/Kintsugi/normal.png')
const metallicKintsugi = textureLoader.load('textures/Kintsugi/metallic.png')
const roughnessKintsugi = textureLoader.load('textures/Kintsugi/roughness.png')
const heightKintsugi = textureLoader.load('textures/Kintsugi/height.png')
const aoKintsugi = textureLoader.load('textures/Kintsugi/ambientOcclusion.png')
colorKintsugi.colorSpace = THREE.SRGBColorSpace

const colorObsidian = textureLoader.load('textures/Obsidian/basecolor.png')
const normalObsidian = textureLoader.load('textures/Obsidian/normal.png')
const alphaObsidian = textureLoader.load('textures/Obsidian/translucency.png')
const roughnessObsidian = textureLoader.load('textures/Obsidian/roughness.png')
const heightObsidian = textureLoader.load('textures/Obsidian/height.png')
const aoObsidian = textureLoader.load('textures/Obsidian/ambientOcclusion.png')
colorObsidian.colorSpace = THREE.SRGBColorSpace

const colorRedTile = textureLoader.load('textures/RedTile/basecolor.png')
const normalRedTile = textureLoader.load('textures/RedTile/normal.png')
const metallicRedTile = textureLoader.load('textures/RedTile/metallic.png')
const roughnessRedTile = textureLoader.load('textures/RedTile/roughness.png')
const heightRedTile = textureLoader.load('textures/RedTile/height.png')
const aoRedTile = textureLoader.load('textures/RedTile/ambientOcclusion.png')
colorRedTile.colorSpace = THREE.SRGBColorSpace


// Material
//debugObj.color = '#aab6f3'
const kintsugi = new THREE.MeshStandardMaterial()
kintsugi.map = colorKintsugi
kintsugi.normalMap = normalKintsugi
kintsugi.metalnessMap = metallicKintsugi
kintsugi.roughnessMap = roughnessKintsugi
kintsugi.displacementMap = heightKintsugi
kintsugi.displacementScale = 0.1
kintsugi.aoMap = aoKintsugi

const obsidian = new THREE.MeshStandardMaterial()
obsidian.map = colorObsidian
obsidian.normalMap = normalObsidian
obsidian.roughnessMap = roughnessObsidian
obsidian.displacementMap = heightObsidian
obsidian.displacementScale = 0.1
obsidian.aoMap = aoObsidian

const redTile = new THREE.MeshStandardMaterial()
redTile.map = colorRedTile
redTile.normalMap = normalRedTile
redTile.metalnessMap = metallicRedTile
redTile.roughnessMap = roughnessRedTile
redTile.displacementMap = heightRedTile
obsidian.displacementScale = 0.1
redTile.aoMap = aoRedTile

// Mesh
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    obsidian
)
sphere.position.x = -2

const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    redTile
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.2, 16, 32),
    kintsugi
)
torus.position.x = 2

scene.add(sphere, box, torus)

// Light
/* const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.y = 3
scene.add(pointLight) */

// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('textures/EnvironmentMap/leadenhall_market_2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap

})


/****************************** Debug GUI ******************************/
const boxTweaks = gui.addFolder('Box Tweaks')
//boxTweaks.close() // close this folder by default
/* boxTweaks.addColor(debugObj, 'color')
    .onChange(() => {
    obsidian.color.set(debugObj.color)
}) */

boxTweaks.add(obsidian, 'wireframe')

debugObj.spin = () => {
    gsap.to(box.rotation, { duration: 2, y: box.rotation.y + Math.PI * 2 })
}
boxTweaks.add(debugObj, 'spin')

debugObj.subdivision = 2;
boxTweaks.add(debugObj, 'subdivision')
    .min(1)
    .max(10)
    .step(1)
    .onFinishChange(() => {
        box.geometry.dispose()
        box.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debugObj.subdivision, debugObj.subdivision, debugObj.subdivision
        )
    })

/****************************** Viewport ******************************/
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Listen to the resize event
window.addEventListener('resize', () => {
    // Update size
    size.width = window.innerWidth
    size.height = window.innerHeight

    // Update camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

// Listen to the double click event for toggling fullscreen
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) { // Safari
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen()
        }
        
    }
})

/****************************** Camera ******************************/
const camera = new THREE.PerspectiveCamera(45, size.width / size.height)
//const dist = camera.position.distanceTo(mesh.position)

camera.position.x = 1
camera.position.z = 6
camera.position.y = 1

scene.add(camera)

/****************************** Control ******************************/
/*          Custom Controls          */
const cursor = {
    x: 0,
    y: 0,
}
// Cursor coordinates upon mouse move
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / size.width - 0.5
    cursor.y = -(event.clientY / size.height - 0.5)
})

/*          Three.js Controls          */
// OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(box.position.x, box.position.y, box.position.z)
controls.update()

/****************************** Renderer ******************************/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.render(scene, camera)

/****************************** Animation ******************************/
// Clock
const clock = new THREE.Clock()

// Animation Loop
const tick = () => {
    // Time
    const deltaTime = clock.getDelta ()

    // Update Object
    sphere.rotation.y += 0.2 * deltaTime
    box.rotation.y += 0.2 * deltaTime
    torus.rotation.y += 0.2 * deltaTime
    
    sphere.rotation.x -= 0.5 * deltaTime
    box.rotation.x -= 0.5 * deltaTime
    torus.rotation.x -= 0.5 * deltaTime


    // Update Camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 1.5 + mesh.position.x
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 1.5 + mesh.position.z
    // camera.position.y = cursor.y * 2 + mesh.position.y
    // camera.lookAt(mesh.position)

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
