import { Component, OnDestroy, OnInit } from "@angular/core";
import { DatabaseService } from "../../shared/services/database.service";
import { AuthService } from "../../shared/services/auth.service";
import { Observable, of, Subscription } from "rxjs";
import { Music } from "../../shared/utils/music";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

interface CardData {
    music: Music;
    cols: number;
    rows: number;
}

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnDestroy, OnInit {
    cards$: Observable<CardData[]> = new Observable();
    musics: CardData[] | undefined;

    breakSubscription: Subscription | undefined;

    constructor(
        private databaseService: DatabaseService,
        private authService: AuthService,
        private breakpointObserver: BreakpointObserver,
    ) {}

    ngOnInit(): void {
        this.getCards().then((res) => {
            const cardData = res.map((music) => {
                return { music: music, cols: 1, rows: 1 };
            });
            this.cards$ = of(cardData);
            this.musics = cardData;

            this.breakSubscription = this.breakpointObserver
                .observe(Breakpoints.Handset)
                .subscribe(({ matches }) => {
                    this.musics?.forEach(
                        (musicData) => (musicData.cols = matches ? 2 : 1),
                    );
                });
        });
    }

    async getCards() {
        return await this.databaseService.getUserMusics(
            this.authService.user!.uid,
        );
    }

    ngOnDestroy(): void {
        this.breakSubscription?.unsubscribe();
    }
}
