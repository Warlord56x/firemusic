import { Component, ViewChild } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'firemusic';

    constructor(
        protected auth: AuthService,
        matIconRegistry: MatIconRegistry,
        domSanitizer: DomSanitizer,
    ) {
        matIconRegistry.addSvgIcon(
            'firemusic',
            domSanitizer.bypassSecurityTrustResourceUrl('fm_logo.svg'),
        );
    }
}
