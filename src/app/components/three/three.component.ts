import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
    selector: 'app-three',
    standalone: true,
    imports: [FlexLayoutModule],
    template: '<div fxFlex ><canvas fxFlexFill #canvas></canvas></div>',
    styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
    @ViewChild('canvas', { static: true }) private canvasRef:
        | ElementRef
        | undefined;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef?.nativeElement;
    }

    private start: number = performance.now();

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera | undefined;
    private renderer: THREE.WebGLRenderer | null = null;

    modelLoader: GLTFLoader = new GLTFLoader();

    mouse = new THREE.Vector2();
    v2 = new THREE.Vector2();

    hitplane = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.MeshBasicMaterial(),
    );

    raycaster = new THREE.Raycaster();

    uniforms = {
        uTime: {
            value: 0.00025 * (performance.now() - this.start),
            type: 'f',
        },
        uPos0: { value: new THREE.Vector2() },
        uPos1: { value: new THREE.Vector3(0, 0, 0) },
    };

    vel = new THREE.Vector2();

    constructor() {}

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.camera) {
            this.camera.aspect = this.width / this.height;

            this.camera.updateProjectionMatrix();
        }

        this.renderer?.setSize(this.width, this.height, false);
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(ev: MouseEvent): void {
        let x = ev.clientX / window.innerWidth - 0.5;
        let y = ev.clientY / window.innerHeight - 0.5;

        this.v2.x = x * 2;
        this.v2.y = -y * 2;
        this.raycaster.setFromCamera(this.v2, this.camera!);

        let intersects = this.raycaster.intersectObject(this.hitplane);

        if (intersects.length > 0) {
            let first = intersects[0];
            this.mouse.x = first.point.x;
            this.mouse.y = first.point.z;
        }
    }

    async ngAfterViewInit() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            canvas: this.canvas,
        });
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000,
        );

        this.camera.position.z = 20;
        this.camera.position.y = 20;

        this.renderer.setSize(this.width, this.height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const model = await this.modelLoader.loadAsync(
            'assets/models/dice.glb',
        );

        let dice: THREE.Mesh;
        model.scene.traverse((child) => {
            if (child.type === 'Mesh') {
                dice = child as THREE.Mesh;
            }
        });

        dice = dice!;
        dice.geometry.scale(100, 100, 100);

        this.threeContent(dice.geometry);

        const light = new THREE.DirectionalLight();
        light.position.set(0, 30, 0);
        light.target.position.set(0, 0, 0);
        this.scene.add(light);
        const ambient = new THREE.AmbientLight();
        this.scene.add(ambient);

        new OrbitControls(this.camera, this.canvas).enablePan = false;

        const animate = () => {
            requestAnimationFrame(animate);

            this.uniforms.uTime.value =
                0.00025 * (performance.now() - this.start);

            // Lerp uPos0 to mouse
            let v3 = new THREE.Vector2();
            v3.copy(this.mouse);
            v3.sub(this.uniforms.uPos0.value);
            v3.multiplyScalar(0.08);
            this.uniforms.uPos0.value.add(v3);

            // Get uPos1 Lerp speed
            v3.copy(this.uniforms.uPos0.value);
            v3.sub(this.uniforms.uPos1.value);
            v3.multiplyScalar(0.05);

            // Lerp the speed
            v3.sub(this.vel);
            v3.multiplyScalar(0.05);
            this.vel.add(v3);

            // Add the lerped velocity
            const v = new THREE.Vector3(this.vel.x, this.vel.y, 0);
            this.uniforms.uPos1.value.add(v);

            this.renderer?.render(this.scene, this.camera!);

            if (this.camera && this.renderer) {
                this.renderer?.render(this.scene, this.camera);
            }
        };

        animate();
    }

    threeContent(diceGeom: THREE.BufferGeometry) {
        let grid = 55;
        let size = 0.5;
        let gridSize = grid * size;
        let geometry = diceGeom;
        let material = new THREE.MeshPhysicalMaterial({
            color: 0x1084ff,
            metalness: 0,
            roughness: 0.0,
        });
        let mesh = new THREE.InstancedMesh(geometry, material, grid * grid);
        this.scene.add(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        let dummy = new THREE.Object3D();

        let vertexHead = `

        // Vertex Head

uniform vec2 uPos0;
uniform vec2 uPos1;

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
\tmat4 m = rotationMatrix(axis, angle);
\treturn (m * vec4(v, 1.0)).xyz;
}
  uniform float uTime;
  void main(){

`;
        let projectVertex = `

vec4 position = instanceMatrix[3];
float toCenter = length(position.xz);
transformed.y += sin(uTime * 2. + toCenter) * 0.3;

transformed = rotate(transformed, vec3(0., 1., 1. ),  uTime + toCenter * 0.4 );
transformed.y += sin(uTime * 2. + toCenter) * 0.3;

float mouseTrail = sdSegment(position.xz, uPos0, uPos1);
mouseTrail = smoothstep(1., 3. , mouseTrail) ;

transformed *= 1. + (1.0-mouseTrail) * 2.;

transformed = rotate(transformed, vec3(0., 1., 1. ), mouseTrail * 3.14 +  uTime + toCenter * 0.4 );

transformed.y += -2.9 * (1.-mouseTrail);

        // Code goes above this
        vec4 mvPosition = vec4( transformed, 1.0 );

        #ifdef USE_INSTANCING

          mvPosition = instanceMatrix * mvPosition;

        #endif

        mvPosition = modelViewMatrix * mvPosition;

        gl_Position = projectionMatrix * mvPosition;
`;

        let i = 0;
        const totalColor =
            material.color.r + material.color.g + material.color.b;
        const color = new THREE.Color();
        const weights = new THREE.Vector3();
        weights.x = material.color.r;
        weights.y = material.color.g;
        weights.z = material.color.b;
        weights.divideScalar(totalColor);
        weights.multiplyScalar(-0.5);
        weights.addScalar(1);
        for (let x = 0; x < grid; x++)
            for (let y = 0; y < grid; y++) {
                dummy.position.set(
                    x * size - gridSize / 2 + size / 2,
                    0,
                    y * size - gridSize / 2 + size / 2,
                );

                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);

                let center = 1 - dummy.position.length() * 0.18;
                color.set(
                    center * weights.x + (1 - weights.x),
                    center * weights.y + (1 - weights.y),
                    center * weights.z + (1 - weights.z),
                );
                mesh.setColorAt(i, color);

                i++;
            }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();

        mesh.material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                vertexHead,
            );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                projectVertex,
            );
            shader.uniforms = {
                ...shader.uniforms,
                ...this.uniforms,
            };
        };

        mesh.customDepthMaterial = new THREE.MeshDepthMaterial();
        mesh.customDepthMaterial.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                vertexHead,
            );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                projectVertex,
            );
            shader.uniforms = {
                ...shader.uniforms,
                ...this.uniforms,
            };
            shader.depthPacking = THREE.RGBADepthPacking;
        };
        this.hitplane.scale.setScalar(20);
        this.hitplane.rotation.x = -Math.PI / 2;
        this.hitplane.updateMatrix();
        this.hitplane.updateMatrixWorld();
    }
}
