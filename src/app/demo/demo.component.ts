import { Component, OnInit } from '@angular/core';
import { GetDateService } from '../shared/get-date.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'


declare const google

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent implements OnInit {
  componentName = 'demo';
  clickStatus = true;
  date: string;
  ssname: string;

  toggleStatus(){
    this.clickStatus = !this.clickStatus;
    this.componentName = 'demo ' + this.clickStatus;
  }
  checkStatus(){
    return this.clickStatus;
  }

  getDate(){
    this.date = this.getDateService.getDate();
  }

  getssname(){
    let self = this;
    google.script.run.withSuccessHandler(function(name){
      self.ssname = name;
      self.cd.detectChanges();
    }).getSSName();

  }

  // showName(name){
  //   this.ssname = name;
  // }


  constructor(private getDateService: GetDateService, private cd: ChangeDetectorRef) { }



  ngOnInit() {
    let self = this;
    google.script.run
      .withSuccessHandler(function(name) {
        self.ssname = name;
        self.cd.detectChanges();
      })
      .getSSName();
  }

}
