import { Injectable } from '@angular/core';
import {ApiService} from '../ApiService'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuildingReponse } from '../../entity/reponse/building-reponse';


@Injectable({
  providedIn: 'root'
})
export class BuildingService  {
  url = ApiService.apiUrl
  constructor(private http: HttpClient) {}

  getAllBuildingByType(type : string):Observable<BuildingReponse[]>{
    return this.http.get<BuildingReponse[]>(`${this.url}/api/building/${type}`)
  }
  getAll():Observable<BuildingReponse[]>{
    return this.http.get<BuildingReponse[]>(`${this.url}/api/building`)
  }
} 
