import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private imageDataSubject = new BehaviorSubject<File[]>([]);

   getImageData(): Observable<File[]> {
    console.log(this.imageDataSubject.value)
    return this.imageDataSubject.asObservable();
  }
  
  setImageData(data: File): void {
    const images = this.imageDataSubject.value
    this.imageDataSubject.next([...images, data]);
  }

  removeImageData(position: number): void{
    const images = this.imageDataSubject.getValue();
    images.forEach((value, index) => {
      index === position ? 
      images.splice(index, 1) : ''
    })
    this.imageDataSubject.next(images)
  }

  clearImageData() {
    this.imageDataSubject.next([]);
  }
}