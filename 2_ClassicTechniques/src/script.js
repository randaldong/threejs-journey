/****************************** Import ******************************/
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

/****************************** Debug GUI ******************************/
const gui = new GUI({
    width: 300,
    title: "Debug GUI",
    closeFolders: true,

})

// gui.close()
// gui.hide()

// Toggle between open/close of the debug GUI
window.addEventListener("keydown", (event) => {
    if (event.key === "g")
        gui.open(gui._closed)
})

// Toggle the visibility of the debug GUI
window.addEventListener("keydown", (event) => {
    if (event.key === "h")
        gui.show(gui._hidden)
})

const debugObj = {}

/****************************** Canvas ******************************/
const canvas = document.querySelector('canvas.webgl')

/****************************** Scene ******************************/
const scene = new THREE.Scene()

/****************************** Object ******************************/
/*          Geometry          */
const geometry = new THREE.BoxGeometry(1, 1, 1)


/*          Texture          */


/*          Material          */
const material = new THREE.MeshBasicMaterial({ color: '#aab6f3' })


/*          Mesh          */
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


/*          3D Text          */


/*          Light          */


/*          Environment Map          */



/****************************** Viewport ******************************/
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Listen to the resize event
window.addEventListener("resize", () => {
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
window.addEventListener("dblclick", () => {
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/****************************** Control ******************************/
// OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(box.position.x, box.position.y, box.position.z)
controls.update()

/****************************** Renderer ******************************/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
//renderer.render(scene, camera)

/****************************** Animation ******************************/
// Clock
const clock = new THREE.Clock()

// Animation Loop
const tick = () => {
    // Time
    const deltaTime = clock.getDelta ()

    // Update Object

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()