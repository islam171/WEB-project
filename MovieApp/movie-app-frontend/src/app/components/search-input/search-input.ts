import { Component, EventEmitter, Output, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput {
  @Output() searchChanged = new EventEmitter<string>();

  onSearchChange(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    this.searchChanged.emit(query);
  }
}
