import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { InputDemoComponent } from './demo/input-demo/input-demo.component';

import { GetDateService } from './shared/get-date.service'

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    InputDemoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GetDateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
