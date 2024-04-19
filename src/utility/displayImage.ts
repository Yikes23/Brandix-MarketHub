import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root',
})
export class ImageService{
    constructor(private domSanitizer: DomSanitizer){}
    displayImage(imageData: ArrayBuffer): SafeUrl {

        const uint8Array = new Uint8Array(imageData);
        const stringUint8Array = uint8Array.reduce((data, byte) => {
            return data + String.fromCharCode(byte)
        }, '');
        const base64String = btoa(stringUint8Array);
        const imageUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String)
        // Return the base64 string
        return imageUrl;
      }
}