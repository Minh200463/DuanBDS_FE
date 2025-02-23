import { Injectable } from '@angular/core';
import { ApiService } from '../ApiService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomReponse } from '../../entity/reponse/room-reponse';
import { RoomRequest } from '../../entity/request/room-request';
import { ErrorServiceService } from '../errorService/error-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

   url = ApiService.apiUrl
   constructor(private http: HttpClient, private errorService: ErrorServiceService) {}
   getFilterRooms(
    roomNumber?: string,
    maxPeople?: number,
    minPrice?: number,
    maxPrice?: number,
    isRented?: boolean,
    buildingId?: number,
    sortBy: string = 'id',
    sortDirection: string = 'asc',
    page: number = 0,
    size: number = 6
  ): Observable<any> { 
    
    let params = new HttpParams();

    if (roomNumber) params = params.set('roomNumber', roomNumber)
    if (maxPeople) params = params.set('maxPeople', maxPeople.toString());
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    if (isRented !== undefined) params = params.set('isRented', isRented.toString());
    if (buildingId) params = params.set('buildingId', buildingId.toString());

    params = params.set('sortBy', sortBy);
    params = params.set('sortDirection', sortDirection);
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    console.log(`🔹 Fetching rooms from: ${this.url}/api/room/filter`, { params });

    return this.http.get<any>(`${this.url}/api/room/filter`, { params });
  }


  getRoom(id: number){
    return this.http.get<RoomReponse>(`${this.url}/api/room/${id}`);
  }


  createNewRoom(request: RoomRequest): Observable<RoomReponse> {
    const formData = new FormData();
    let hasError = false
  
    // Kiểm tra roomNumber
    if (request.roomNumber) {
      formData.append('roomNumber', request.roomNumber);
    } else {
      this.errorService.setError('roomNumber', 'Number room is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra length
    if (request.length >= 0) {
      formData.append('length', request.length.toString());
    } else {
      this.errorService.setError('length', 'Length is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra width
    if (request.width >= 0) {
      formData.append('width', request.width.toString());
    } else {
      this.errorService.setError('width', 'Width is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra maxPeople
    if (request.maxPeople > 0) {
      formData.append('maxPeople', request.maxPeople.toString());
    } else {
      this.errorService.setError('maxPeople', 'Maximum number of people is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra pricePerMonth
    if (request.pricePerMonth > 0) {
      formData.append('pricePerMonth', request.pricePerMonth.toString());
    } else {
      this.errorService.setError('pricePerMonth', 'Price per month is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra pricePerDay
    if (request.pricePerDay > 0) {
      formData.append('pricePerDay', request.pricePerDay.toString());
    } else {
      this.errorService.setError('pricePerDay', 'Price per day is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra description
    if (request.description) {
      formData.append('description', request.description);
    }
  
    // Kiểm tra rented
    if (request.rented !== undefined) {
      formData.append('isRented', request.rented.toString());
    }
  
    // Kiểm tra buildingId
    if (request.buildingId) {
      formData.append('buildingId', request.buildingId.toString());
    }
  
    // Thêm danh sách ảnh vào formData
    if (request.images && request.images.length > 0) {
      request.images.forEach((file) => {
        formData.append('images', file);
      });
    }
  
    // Nếu có lỗi, không thực hiện HTTP request
    if (hasError) {
      return new Observable<RoomReponse>(observer => {
        observer.error("Form contains errors");
      });
    }
  
    return this.http.post<RoomReponse>(`${this.url}/api/room/save`, formData);
  }
  
  

  updateRoom(roomId: number, request: RoomRequest): Observable<RoomReponse> {
    const formData = new FormData();
    let hasError = false

    if (request.roomNumber) {
      formData.append('roomNumber', request.roomNumber);
    } else {
      this.errorService.setError('roomNumber', 'Number room is not in correct format!');
      hasError = true;
    }
    // Kiểm tra length
    if (request.length >= 0) {
      formData.append('length', request.length.toString());
    } else {
      this.errorService.setError('length', 'Length is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra width
    if (request.width >= 0) {
      formData.append('width', request.width.toString());
    } else {
      this.errorService.setError('width', 'Width is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra maxPeople
    if (request.maxPeople > 0) {
      formData.append('maxPeople', request.maxPeople.toString());
    } else {
      this.errorService.setError('maxPeople', 'Maximum number of people is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra pricePerMonth
    if (request.pricePerMonth > 0) {
      formData.append('pricePerMonth', request.pricePerMonth.toString());
    } else {
      this.errorService.setError('pricePerMonth', 'Price per month is not in correct format!');
      hasError = true;
    }
  
    // Kiểm tra pricePerDay
    if (request.pricePerDay > 0) {
      formData.append('pricePerDay', request.pricePerDay.toString());
    } else {
      this.errorService.setError('pricePerDay', 'Price per day is not in correct format!');
      hasError = true;
    }
    if (request.description) formData.append('description', request.description);
    if (request.rented !== undefined) formData.append('isRented', request.rented.toString());
    if (request.buildingId) formData.append('buildingId', request.buildingId.toString());
  
    // Thêm ảnh mới vào formData
  if (request.images && request.images.length > 0) {
    request.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  // Gửi danh sách ảnh bị xóa lên backend
  if (request.deletedImages && request.deletedImages.length > 0) {
    request.deletedImages.forEach((url) => {
      formData.append('deletedImages', url);
    });
  }

  if (hasError) {
    return new Observable<RoomReponse>(observer => {
      observer.error("Form contains errors");
    });
  }
    return this.http.put<RoomReponse>(`${this.url}/api/room/${roomId}`, formData);
  }

  deleteRoom(roomId: number): Observable<string>{
    return this.http.delete<string>(`${this.url}/api/room/${roomId}`);
  }
  
}
