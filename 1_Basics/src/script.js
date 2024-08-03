/****************************** Import ******************************/
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

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
// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
/* const geometry = new THREE.BufferGeometry()

const triNum = 300
const positionArray = new Float32Array(triNum * 3 * 3)
for (let i = 0; i < triNum * 3 * 3; i += 3){
    positionArray[i] = Math.cos(Math.random() * Math.PI)
    positionArray[i + 1] = Math.sin(positionArray[i] * Math.PI)
    positionArray[i + 2] = Math.cos(positionArray[i] * Math.PI)
}
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionAttribute) */

// Texture
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_basecolor.png')
/* const normalMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_normal.png')
const metallicMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_metallic.png')
const roughnessMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_roughness.png')
const heightMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_height.png')
const aoMap = textureLoader.load('textures/Kintsugi_001/Kintsugi_001_ambientOcclusion.png') */
colorMap.colorSpace = THREE.SRGBColorSpace
/* normalMap.colorSpace = THREE.SRGBColorSpace
metallicMap.colorSpace = THREE.SRGBColorSpace
roughnessMap.colorSpace = THREE.SRGBColorSpace
heightMap.colorSpace = THREE.SRGBColorSpace
aoMap.colorSpace = THREE.SRGBColorSpace */


// Material
debugObj.color = '#aab6f3'
const material = new THREE.MeshBasicMaterial({
    //color: debugObj.color,
    map: colorMap,
    wireframe: false,
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)

mesh.position.x = 0.5
mesh.position.z = -1
mesh.position.y = 0

scene.add(mesh)

/****************************** Debug GUI ******************************/
const cubeTweaks = gui.addFolder('Cube Tweaks')
//cubeTweaks.close() // close this folder by default
cubeTweaks.addColor(debugObj, 'color')
    .onChange(() => {
    material.color.set(debugObj.color)
})

cubeTweaks.add(material, 'wireframe')

debugObj.spin = () => {
    gsap.to(mesh.rotation, { duration: 2, y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks.add(debugObj, 'spin')

debugObj.subdivision = 2;
cubeTweaks.add(debugObj, 'subdivision')
    .min(1)
    .max(10)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
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
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
//const dist = camera.position.distanceTo(mesh.position)

camera.position.x = 1
camera.position.z = 3
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
controls.target.set(mesh.position.x, mesh.position.y, mesh.position.z)
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
    //mesh.rotation.y += 1 * deltaTime

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
