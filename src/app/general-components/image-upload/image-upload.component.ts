import { Component, EventEmitter, HostListener, Output} from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ImageUploadService } from './image-upload.services';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  imageUrls: string[] = [];
  showOverlay: boolean[] = Array(this.imageUrls.length).fill(false);

  constructor(private imageUploadService: ImageUploadService, private _snackBar?: MatSnackBar) {
  }
  
  @HostListener('dragover', ['$event'])
  dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();


    const files = event.dataTransfer?.files;
    if (files) {
      this.onSelect(Array.from(files)[0])
      console.log(Array.from(files)); // Do something with the dropped files
    }
  }

  onSelect(event: any | File){
    if(this.imageUrls.length < 5){ 
      const reader = new FileReader();
      reader.onload = (e) =>{
        if(e.target){
          this.imageUrls.push(e.target.result as string);
          this.imageUploadService.setImageData(this.imageUrls)
        }
      }
      if(event.target && this.isValidImageFile(event.target.files[0])){
        reader.readAsDataURL(event.target.files[0])
      }
      else if(this.isValidImageFile(event)){
        reader.readAsDataURL(event);
      }
      else{
        this._snackBar?.open('Select file consisting in appropriate file format.', 'OK',
        {
          verticalPosition:'bottom',
          horizontalPosition: 'left',
          duration: 3000
        })
        
      }
      console.log(this.imageUrls)
    }
    else{
      this._snackBar?.open('Sorry, only 5 images could be uploaded.', 'OK',
      {
        verticalPosition:'bottom',
        horizontalPosition: 'left',
        duration: 3000
      })
    }
  }

  isValidImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  removeImage(index: number){
    this.imageUrls.splice(index, 1);
    this.showOverlay.splice(index, 1);
  }
 
}
