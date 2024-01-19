import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  exportAs: 'rating',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
})                
export class RatingComponent implements ControlValueAccessor {
  @Input() rating: number = 0;
  @Input() cursor: boolean = false;
  @Output() selectedRating = new EventEmitter<number>();
  hoveredIndex: number | null = null;

  get starsArray(): number[] {
    return new Array(5).fill(0);
  }

  isStarFilled(index: number): boolean {
    return this.hoveredIndex !== null ? index <= this.hoveredIndex : index < this.rating;
  }

  emitRatings(index: number) {
    this.hoveredIndex = index;
    this.hoveredIndex === null ? (this.hoveredIndex = 0) : '';
    this.selectedRating.emit(this.hoveredIndex + 1);
    this.onChange(this.hoveredIndex + 1); // Notify Angular forms that the value has changed
  }

  // Implement ControlValueAccessor methods
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.rating = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // You can implement this if your component needs to handle disabled state
  }
}
