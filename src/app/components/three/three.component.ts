import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'app-three',
    standalone: true,
    imports: [],
    template: '<canvas #canvas ></canvas>',
    styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
    @ViewChild('canvas', { static: true }) private canvasRef:
        | ElementRef
        | undefined;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef?.nativeElement;
    }

    ngAfterViewInit() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            canvas: this.canvas,
        });

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener(
            'resize',
            function () {
                width = window.innerWidth;
                height = window.innerHeight;
                camera.aspect = width / height;
                renderer.setSize(width, height);

                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false,
        );
    }
}
