import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static apiUrl =environment.apiUrl ;
  public static apiUrlimg ="" ;

}

