import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private imageDataSubject = new BehaviorSubject<string[]>([]);

  getImageData(): Observable<string[]> {
    return this.imageDataSubject.asObservable();
  }

  setImageData(data: string[]): void {
    this.imageDataSubject.next(data);
  }
}