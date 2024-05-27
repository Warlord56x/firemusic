import { Component, ElementRef, ViewChild } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Router, withHashLocation } from "@angular/router";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    animations: [
        trigger("expandAnimation", [
            state("true", style({ width: "10rem", opacity: 1.0 })),
            state("false", style({ width: "2rem", opacity: 0.0 })),
            transition("false <=> true", animate("300ms ease-in-out")),
        ]),
    ],
})
export class AppComponent {
    @ViewChild("searchInput") searchInputRef?: ElementRef<HTMLInputElement>;
    search: boolean = false;

    protected readonly Breakpoints = Breakpoints;

    constructor(
        protected authService: AuthService,
        protected router: Router,
        readonly matIconRegistry: MatIconRegistry,
        readonly domSanitizer: DomSanitizer,
        protected bpObserver: BreakpointObserver,
        title: Title,
    ) {
        title.setTitle("Firemusic");
        matIconRegistry.addSvgIcon(
            "firemusic",
            domSanitizer.bypassSecurityTrustResourceUrl("fm_logo.svg"),
        );
    }

    toggleSearch() {
        this.search = !this.search;
        if (this.search) {
            this.searchInputRef!.nativeElement.focus();
        }
    }
}
