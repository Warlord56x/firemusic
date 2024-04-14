import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
    selector: 'app-three',
    standalone: true,
    imports: [FlexLayoutModule],
    template: '<div fxFlexFill #div><canvas #canvas></canvas></div>',
    styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
    @ViewChild('canvas', { static: true }) private canvasRef:
        | ElementRef
        | undefined;
    @ViewChild('div') private divRef: ElementRef | undefined;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef?.nativeElement;
    }
    public get div(): HTMLDivElement {
        return this.divRef?.nativeElement;
    }

    private width: number = window.innerWidth;
    private height: number = window.innerHeight;

    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(
        75,
        this.width / this.height,
        0.1,
        1000,
    );
    private renderer: THREE.WebGLRenderer | null = null;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
        this.renderer?.setSize(this.width, this.height, false);
    }

    ngAfterViewInit() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            canvas: this.canvas,
        });
        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;

        this.camera.position.z = 5;

        this.renderer.setSize(this.width, this.height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        this.scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            this.renderer?.render(this.scene, this.camera);
        };

        animate();
    }
}
