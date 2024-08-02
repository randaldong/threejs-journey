/****************************** Import ******************************/
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/****************************** Canvas ******************************/
const canvas = document.querySelector('canvas.webgl')

/****************************** Scene ******************************/
const scene = new THREE.Scene()

/****************************** Object ******************************/
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: "#aab6f3" })
const mesh = new THREE.Mesh(geometry, material)

mesh.position.x = 0.5
mesh.position.z = -1
mesh.position.y = 0

scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/****************************** Camera ******************************/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
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
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
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
renderer.setSize(sizes.width, sizes.height)
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
