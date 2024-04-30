import { Component } from "@angular/core";
import { FlexModule } from "@angular/flex-layout";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { AuthService } from "../../shared/services/auth.service";
import { MusicPlayerComponent } from "../music-player/music-player.component";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [
        FlexModule,
        MatButton,
        NgIf,
        RouterLink,
        MatIcon,
        MusicPlayerComponent,
    ],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    constructor(protected authService: AuthService) {}
}
