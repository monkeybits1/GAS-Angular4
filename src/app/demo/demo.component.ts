import { Component, OnInit } from '@angular/core';
import { GetDateService } from '../shared/get-date.service';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  componentName = 'demo';
  clickStatus = true;
  date: string;
  toggleStatus(){
    this.clickStatus = !this.clickStatus;
    this.componentName = 'demo ' + this.clickStatus;
  }
  checkStatus(){
    return this.clickStatus;
  }


  constructor(private getDateService: GetDateService) { }

  getDate(){
    this.date = this.getDateService.getDate();
  }

  ngOnInit() {

  }

}
