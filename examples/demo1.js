import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const renderer = new THREE.WebGPURenderer()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('skyblue')
camera.position.set(0, 2, 0)
scene.add(new THREE.AxesHelper())

{ // ground
    const geom = new THREE.PlaneGeometry(10, 10).rotateX(Math.PI/-2)
    const mat = new THREE.MeshStandardMaterial()
    const mesh = new THREE.Mesh(geom, mat)
    scene.add(mesh)
}

const videoEl = document.querySelector('video')
await videoEl.play()

{ // light 0 (on the left, colorSpace=non-SRGB)
    const light = new THREE.ProjectorLight('white', 5, 4, Math.PI / 10, 1, 0)
    light.position.set(-2, 2, 0)
    light.target = new THREE.Object3D()
    light.target.position.set(0, -1, 0)
    light.add(light.target)

    light.map = new THREE.VideoTexture(videoEl)
    light.map.colorSpace = THREE.NoColorSpace

    scene.add(light)
    scene.add(new THREE.SpotLightHelper(light))
}

{ // light 1 (on the right, colorSpace=SRGB)
    const light = new THREE.ProjectorLight('white', 5, 4, Math.PI / 10, 1, 0)
    light.position.set(2, 2, 0)
    light.target = new THREE.Object3D()
    light.target.position.set(0, -1, 0)
    light.add(light.target)

    light.map = new THREE.VideoTexture(videoEl)
    light.map.colorSpace = THREE.SRGBColorSpace

    scene.add(light)
    scene.add(new THREE.SpotLightHelper(light))
}

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
  controls.update()
})

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', () => resize(innerWidth, innerHeight))
dispatchEvent(new Event('resize'))
document.body.prepend(renderer.domElement)