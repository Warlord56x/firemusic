import { Component } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";

@Component({
    selector: "app-verify-email",
    templateUrl: "./verify-email.component.html",
    styleUrl: "./verify-email.component.scss",
})
export class VerifyEmailComponent {
    constructor(protected authService: AuthService) {}
}
