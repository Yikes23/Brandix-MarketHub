import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['../../home-page/home-page.component.css']
})
export class DisclaimerComponent {
  
  time = 30;
  
  @Input() conditions: boolean = true;
  checkbox = false;
  constructor(private auth: AuthService){}
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.conditions)
    this.timer_on();
    if(this.conditions){
      document.body.style.overflow = 'hidden';
    }
    else{
      document.body.style.overflow = 'visible';
    }
  }

  async timer_on(){
  
    new Promise<number>((resolve) => {
      const interval = setInterval(() => {
        if (this.time === 0 || this.conditions === false) {
          this.time = 0;
          clearInterval(interval);
          resolve(this.time);
        } else {
          this.time--;
          resolve(this.time); // Resolve with the current value
        }
      }, 1000);
    });

  }

  updateCheckbox(){
    console.log(!this.conditions)
    this.time = this.time - this.time;
  }

  async updateCondition(){
    this.conditions = false;
    document.body.style.overflow = 'visible';
    this.auth.setDisclaimer();
  }

}
