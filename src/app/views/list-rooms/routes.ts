import { Routes } from '@angular/router';
import { ListRoomsComponent } from './list-rooms.component';



export const routes: Routes = [
  {
    path: '',
    component: ListRoomsComponent, 
    data: {
      title: 'House Rental Manager'
    },
  }
];
