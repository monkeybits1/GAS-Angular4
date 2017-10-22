import { Injectable } from '@angular/core';

@Injectable()
export class GetDateService {

  constructor() { }

    getDate (){
      return new Date().toString();
    }
}
