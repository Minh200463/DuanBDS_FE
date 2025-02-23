import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';
import { Router } from '@angular/router';
import { BuildingService } from '../../service/buildingService/building.service'
import { BuildingReponse } from '../../entity/reponse/building-reponse'
import { CommonModule } from '@angular/common';
import { HouseType} from '../../enums/HouseType'
@Component({
  selector: 'app-quanlynhathue',
  standalone:true,
  imports: [CommonModule], 
  templateUrl: './quanlynhathue.component.html',
  styleUrl: './quanlynhathue.component.scss'
})
export class QuanlynhathueComponent implements OnInit {
  constructor( private router: Router, private buildingService : BuildingService){}
  listHouses : BuildingReponse[] = []
  itemHosue! : BuildingReponse 
  houseTypes = Object.values(HouseType); // Lấy tất cả giá trị từ enum
  selectedType: HouseType = HouseType.PRIVATE_HOUSE
  ngOnInit(): void {
    this.getAllByType(HouseType.PRIVATE_HOUSE)
  }

  getAllByType(type: HouseType){
    this.selectedType = type;
    const formattedType = type.replace(/\s+/g, '_').toUpperCase(); 
    this.buildingService.getAllBuildingByType(formattedType).subscribe((data) => {
      this.listHouses = data
      console.log(data)
    })
  }
  selectClick(id : number){
    this.router.navigate([`managerHouse/listrooms/${id}`]);
    
  }
}
