import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { DatabaseService } from "../../../shared/services/database.service";
import { map, Observable, startWith } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
    selector: "app-tag-chip-input",
    templateUrl: "./tag-chip-input.component.html",
    styleUrl: "./tag-chip-input.component.scss",
})
export class TagChipInputComponent implements OnInit {
    @Input() initialTags: string[] = [];
    @Output() public tagsChange = new EventEmitter<string[]>();
    @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    tagCtrl = new FormControl("");
    filteredTags: Observable<string[]>;
    tags: string[] = [];
    allTags: string[] = this.databaseService.tags;

    constructor(readonly databaseService: DatabaseService) {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) =>
                tag ? this._filter(tag) : this.allTags.slice(),
            ),
        );
    }

    ngOnInit() {
        this.tags = this.initialTags;
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || "").trim();
        if (value) {
            this.tags.push(value);
        }
        event.chipInput!.clear();
        this.tagCtrl.setValue(null);
        this.tagsChange.next(this.tags);
    }

    remove(fruit: string): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        this.tagsChange.next(this.tags);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        console.log(this.tags);
        this.tags.push(event.option.viewValue);
        this.tagInput.nativeElement.value = "";
        this.tagCtrl.setValue(null);
        this.tagsChange.next(this.tags);
    }

    private _filter(value: string): string[] {
        return this.allTags.filter((tag) =>
            tag.toLowerCase().includes(value.toLowerCase()),
        );
    }
}
