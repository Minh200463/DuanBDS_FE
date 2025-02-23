import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorServiceService {

  constructor() { }

    private errorSubject = new BehaviorSubject<any>({});
    errors$ = this.errorSubject.asObservable()


    setError(field: string, message: string) {
      const currentErrors = this.errorSubject.value;
      currentErrors[field] = message;
      this.errorSubject.next(currentErrors);
    }
  
    // Phương thức để xóa lỗi
    clearError(field: string) {
      const currentErrors = this.errorSubject.value;
      delete currentErrors[field];
      this.errorSubject.next(currentErrors);
    }
  
    // Phương thức để xóa tất cả lỗi
    clearAllErrors() {
      this.errorSubject.next({});
    }
  
}
