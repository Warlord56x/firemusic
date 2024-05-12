import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "../../shared/shaders/vertex.glsl";
import fragmentShader from "../../shared/shaders/fragment.glsl";
import colorTexture from "../../shared/utils/colors";
import { MusicService } from "../../shared/services/music.service";
import {
    freqConfig,
    getAllFrequencyData,
    getFrequencies,
} from "../../shared/utils/visualizerUtils";

@Component({
    selector: "app-three",
    template: "<div><canvas #canvas></canvas></div>",
    styleUrl: "./three.component.scss",
})
export class ThreeComponent implements AfterViewInit, OnDestroy {
    @ViewChild("canvas") private canvasRef!: ElementRef;
    @ViewChild("container") private containerRef!: ElementRef;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    private width: number = 0;
    private height: number = 0;

    private scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        75,
        this.width / this.height,
        0.1,
        1000,
    );
    private renderer: THREE.WebGLRenderer | null = null;

    private start = performance.now();

    private material = new THREE.ShaderMaterial({
        wireframe: true,
        uniforms: {
            colorTex: {
                value: colorTexture,
            },
            time: {
                value: 0.0,
            },
            bassFr: {
                value: 0.0,
            },
            treFr: {
                value: 0.0,
            },
            midFr: {
                value: 0.0,
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    private geometry = new THREE.IcosahedronGeometry(20, 10);
    private mesh = new THREE.Mesh(this.geometry, this.material);

    private animFrameId: number = -1;

    @HostListener("window:resize", ["$event"])
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer?.setSize(this.width, this.height, false);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }

    constructor(private musicService: MusicService) {}

    async ngAfterViewInit() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            canvas: this.canvas,
        });

        this.camera.position.z = 100;
        this.scene.add(this.mesh);

        this.onResize();

        new OrbitControls(this.camera, this.canvas).enablePan = false;

        const animate = () => {
            const allFreqData = getAllFrequencyData({
                aBass: this.musicService.bassAnalyser,
                aMid: this.musicService.midAnalyser,
                aTreble: this.musicService.trebleAnalyser,
            });

            let [bassFr, midFr, treFr] = getFrequencies(
                allFreqData,
                freqConfig,
            );

            Object.assign(this.material.uniforms, {
                bassFr: { value: bassFr },
                midFr: { value: midFr },
                treFr: { value: treFr },
                time: { value: 0.00025 * (performance.now() - this.start) },
            });

            this.mesh.rotation.x += 0.002;
            this.mesh.rotation.y += 0.002;
            this.mesh.rotation.z += 0.002;

            this.renderer?.render(this.scene, this.camera);
            this.animFrameId = requestAnimationFrame(animate);
        };
        animate();
    }

    ngOnDestroy(): void {
        this.scene.clear();
        cancelAnimationFrame(this.animFrameId);
    }
}
