import { Component, OnInit, Input, EventEmitter, Output, Renderer2, OnDestroy } from "@angular/core";
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export const FilterActions = {
    TRIGGER: "TRIGGER",
    RESET: "RESET",
    APPLY: "APPLY",
};


@Component({
    selector: "app-dropdown-search",
    templateUrl: "./search_dropdown.component.html",
    styleUrls: ["./search_dropdown.component.scss"]
})
export class DropDownSearchComponent implements OnInit, OnDestroy {
    public formItem = new FormControl();
    public filteredOptions: any = [];

    @Input() localSearch = true;
    @Input() showFilter: boolean;
    @Input() resetFilter: boolean;
    @Input() filterUrl: string;
    @Input() filterOptionsSize: string;
    @Input() options: any;
    @Input() filterKey: any;
    @Input() filterValueKey: any;
    @Input() filterDisplayKey: any;
    @Input() filterClearKey: any;
    @Input() filterLabel: any;
    @Input() selectedValue: any;
    @Input() selectedObj: any = {};
    @Input() filterOptionType: any;
    @Input() filterListener: Subject<boolean>;

    @Output() filterClicked = new EventEmitter();
    @Output() filterSelected = new EventEmitter();
    @Output() filterCleared = new EventEmitter();

    @Output() filterListenerLocal: any;


    constructor(
        private renderer: Renderer2,
    ) {
        this.renderer.listen('window', 'click', () => {
            this.showFilter = false;
        });
    }

    ngOnInit() {
        this.filteredOptions = this.formItem.valueChanges.pipe(startWith(''),
            map((value: any) => this.filterOptions(value)));


        this.filterListenerLocal = this.filterListener.subscribe((data: any) => {
            const { type, value, key } = data;
            if (type === FilterActions.TRIGGER) {
                if (this.filterKey === key) {
                    this.showFilter = !this.showFilter;
                } else {
                    this.showFilter = false;
                }
            } else if (type === FilterActions.APPLY && this.filterKey === key) {
                this.selectedObj = value;
                this.selectedValue = value._id;
                this.showFilter = false;
            }
        });
    }

    onFilterClick(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.filterClicked.emit(this.filterKey);
    }

    onFilterSelected(event: any, value: any) {
        event.preventDefault();
        event.stopPropagation();
        this.filterSelected.emit({ value, key: this.filterKey });
    }

    onFilterClear() {
        this.formItem.reset();
    }

    onSearchBarClick(event: any) {
        event.preventDefault();
        event.stopPropagation();
    }

    filterOptions(value: any) {
        if (value) {
            return this.options.filter((option: any) => {
                return option[this.filterValueKey].toLowerCase().includes(value.toLowerCase());
            });
        } else {
            return this.options;
        }
    }

    removeAppliedFilter() {
        this.formItem.reset();
        this.filterCleared.emit({ value: {}, key: this.filterKey });
    }

    ngOnDestroy() {
        this.filterListenerLocal.unsubscribe();
    }

}
