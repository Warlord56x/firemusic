import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    @ViewChild('searchInput') searchInputRef?: ElementRef;
    title = 'firemusic';
    _search: boolean = false;

    constructor(
        protected authService: AuthService,
        matIconRegistry: MatIconRegistry,
        domSanitizer: DomSanitizer,
        private changeDetection: ChangeDetectorRef,
    ) {
        matIconRegistry.addSvgIcon(
            'firemusic',
            domSanitizer.bypassSecurityTrustResourceUrl('fm_logo.svg'),
        );
    }

    get search() {
        return this._search;
    }

    set search(v: boolean) {
        this._search = v;
        if (v) {
            this.changeDetection.detectChanges();
            this.searchInputRef!.nativeElement.focus();
        }
    }
}
