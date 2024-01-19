import { Component, Output, EventEmitter} from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
 })
export  class  RequirementsComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  isRequirements: boolean = true;
  posts = [
    {title: 'Requirements-1', description: '---------------------', postedOn: 'xx/xx/xxxx', postedBy: 'XXXXXX'}
  ]
}
