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

interface FreqConfig {
    bass: { min: number; max: number };
    mid: { min: number; max: number };
    tre: { min: number; max: number };
}

interface Frequency {
    bass: Uint8Array;
    mid: Uint8Array;
    tre: Uint8Array;
}

@Component({
    selector: "app-three",
    template: "<div fxFlex ><canvas fxFlexFill #canvas></canvas></div>",
    styleUrl: "./three.component.scss",
})
export class ThreeComponent implements AfterViewInit, OnDestroy {
    @ViewChild("canvas", { static: true }) private canvasRef!: ElementRef;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef?.nativeElement;
    }

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        75,
        this.width / this.height,
        0.1,
        1000,
    );
    private renderer: THREE.WebGLRenderer | null = null;

    private start = performance.now();
    private freqConfig: FreqConfig = {
        bass: {
            min: 0.0,
            max: 8.0,
        },
        mid: {
            min: 0.0,
            max: 4.0,
        },
        tre: {
            min: 0.0,
            max: 2.0,
        },
    };

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

    getFrequencyData(analyser: AnalyserNode) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    private fractionate(val: number, minVal: number, maxVal: number) {
        return (val - minVal) / (maxVal - minVal);
    }

    private modulate(
        val: number,
        minVal: number,
        maxVal: number,
        outMin: number,
        outMax: number,
    ) {
        const fr = this.fractionate(val, minVal, maxVal);
        const delta = outMax - outMin;
        return outMin + fr * delta;
    }

    private avg(arr: Uint8Array) {
        const total = arr.reduce((sum, b) => {
            return sum + b;
        });
        return total / arr.length;
    }

    private max(arr: Uint8Array) {
        return arr.reduce((a, b) => {
            return Math.max(a, b);
        });
    }

    private getFrequencies({ bass, mid, tre }: Frequency, config: FreqConfig) {
        const b = this.max(bass) / bass.length;
        const m = this.avg(mid) / tre.length;
        const t = this.avg(tre) / tre.length;

        const bassFr = this.modulate(
            Math.pow(b, 0.8),
            0.0,
            1.0,
            config.bass.min || 0.0,
            config.bass.max || 8.0,
        );
        const midFr = this.modulate(
            m,
            0.0,
            1.0,
            config.mid.min || 0.0,
            config.mid.max || 4.0,
        );
        const treFr = this.modulate(
            t,
            0.0,
            1.0,
            config.tre.min || 0.0,
            config.tre.max || 2.0,
        );

        return [bassFr, midFr, treFr];
    }

    @HostListener("window:resize", ["$event"])
    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();

        this.renderer?.setSize(this.width, this.height, false);
    }

    constructor(private musicService: MusicService) {}

    async ngAfterViewInit() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            canvas: this.canvas,
        });
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.position.z = 100;
        this.scene.add(this.mesh);

        this.renderer.setSize(this.width, this.height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        new OrbitControls(this.camera, this.canvas).enablePan = false;

        const animate = () => {
            // Get the frequency data arrays
            const bassData = this.getFrequencyData(
                this.musicService.bassAnalyser,
            );
            const midData = this.getFrequencyData(
                this.musicService.midAnalyser,
            );
            const trebleData = this.getFrequencyData(
                this.musicService.trebleAnalyser,
            );

            let [bassFr, midFr, treFr] = this.getFrequencies(
                {
                    bass: bassData,
                    mid: midData,
                    tre: trebleData,
                },
                this.freqConfig,
            );

            bassFr *= 7;
            midFr *= 7;
            treFr *= 7;

            this.material.uniforms["bassFr"].value = bassFr;
            this.material.uniforms["treFr"].value = treFr;
            this.material.uniforms["midFr"].value = midFr;

            this.material.uniforms["time"].value =
                0.00025 * (performance.now() - this.start);

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
