/****************************** Import ******************************/
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js"

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


/*          Texture          */


/*          Material          */
const material1 = new THREE.MeshStandardMaterial({ color: '#FFF1AF' })
material1.roughness = 0.3

const material2 = new THREE.MeshStandardMaterial({ color: '#dca5b9' })
material2.roughness = 0.3

const material3 = new THREE.MeshStandardMaterial({ color: '#aab6f3' })
material3.roughness = 0.3


/*          Mesh          */
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshStandardMaterial({ color: "#838C8C" })
)
ground.rotation.x = -Math.PI * 0.5
ground.position.y = -1.2

const mesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    material1
)
mesh1.position.x = -2

const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
    material2
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 20, 45),
    material3
)
mesh3.position.x = 2

scene.add(ground, mesh1, mesh2, mesh3)

/*          3D Text          */


/*          Light          */
const ambientLight = new THREE.AmbientLight("#ffffff", 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight("#F4FFA0", 0.9)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight("#0000ff", "#00ff00", 0.9)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight("#ff9000", 1.5)
pointLight.position.set(-1, -0.9, 0.5)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight("#ff004e", 6, 1, 1)
rectAreaLight.position.set(3, -0.9, 0.5)
rectAreaLight.lookAt(mesh3.position)
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight("#00ee78", 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(1, 1.8, 1)
scene.add(spotLight)
spotLight.target.position.set(-0.5, 0, -0.5)
scene.add(spotLight.target)

/*          Light Helpers          */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

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
const camera = new THREE.PerspectiveCamera(45, size.width / size.height)
camera.position.z = 6
scene.add(camera)

/****************************** Control ******************************/
// OrbitControls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
//controls.target.set(box.position.x, box.position.y, box.position.z)
controls.update()

/****************************** Renderer ******************************/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width, size.height)
//renderer.render(scene, camera)

/****************************** Animation ******************************/
// Clock
const clock = new THREE.Clock()

// Animation Loop
const tick = () => {
    // Time
    const deltaTime = clock.getDelta ()

    // Update Object
    mesh1.rotation.y += 0.1 * deltaTime
    mesh2.rotation.y += 0.1 * deltaTime
    mesh3.rotation.y += 0.1 * deltaTime
    
    mesh1.rotation.x -= 0.2 * deltaTime
    mesh2.rotation.x -= 0.2 * deltaTime
    mesh3.rotation.x -= 0.2 * deltaTime

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()