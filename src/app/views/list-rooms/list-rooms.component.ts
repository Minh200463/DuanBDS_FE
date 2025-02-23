import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { RoomService } from '../../service/roomService/room.service'
import { RoomReponse } from '../../entity/reponse/room-reponse';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HouseType } from '../../enums/HouseType';
import { FormsModule } from '@angular/forms';
import { BuildingReponse } from '../../entity/reponse/building-reponse';
import { RoomRequest } from '../../entity/request/room-request';
import { BuildingService } from '../../service/buildingService/building.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as bootstrap from 'bootstrap';
import { ErrorServiceService } from '../../service/errorService/error-service.service';
@Component({
  selector: 'app-list-rooms',
  imports: [CommonModule, NgxDropzoneModule, FormsModule],
  templateUrl: './list-rooms.component.html',
  styleUrl: './list-rooms.component.scss'
})
export class ListRoomsComponent implements OnInit {

  @ViewChild('modalRoom') modalRoom!: ElementRef;

  listRooms: RoomReponse[] = []
  idUrl: number | null = null
  isEditing = false

  itemRoom?: RoomReponse
  keyRoom!: number;
  listHouse: BuildingReponse[] = []

    filterData = {
      minPrice: undefined,
      maxPrice: undefined,
      rented: undefined,
      roomNumber: undefined,
      sortBy: 'id', 
      sort: 'desc', 
      page: 0
    }

  roomRequest: RoomRequest = {
    roomNumber: '',
    length: 0,
    width: 0,
    maxPeople: 0,
    pricePerMonth: 0,
    pricePerDay: 0,
    description: '',
    rented: false,
    buildingId: 0,
    images: [],
    deletedImages: []
  }
  constructor(private roomService: RoomService, public errorService : ErrorServiceService, private route: ActivatedRoute, private buildingService: BuildingService,
    private matsnackBarr: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.getAllHosue()
    this.getIdFormURL()
  }

  getAllHosue() {
    this.buildingService.getAll().subscribe(hosue => {
      this.listHouse = hosue
      console.log('house: ', this.listHouse)
    })
  }

  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 6;
  pages: number[] = []

  getFilteredRooms(
    filterData: { 
      minPrice?: number, 
      maxPrice?: number, 
      rented?: boolean, 
      roomNumber?: string, 
      sortBy?: string, 
      sort?: string, 
      page?: number 
    } = {}
  ) {

    this.roomService.getFilterRooms(
      filterData.roomNumber, 
      undefined, 
      filterData.minPrice, 
      filterData.maxPrice, 
      filterData.rented, 
      this.idUrl!, 
      filterData.sortBy || 'id', 
      filterData.sort || 'desc',
      filterData.page || 0, 
      this.pageSize
    ).subscribe(
      (response) => {
        this.listRooms = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.updatePagination();
        console.log('Danh sách phòng:', response.content);
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách phòng:', error);
      }
    );
  }

  updatePagination() {
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + 2);

    this.pages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page
      this.getFilteredRooms({...this.filterData, page: this.currentPage});
    }
  }

  getIdFormURL() {
    this.route.params.subscribe(params => {
      this.idUrl = +params['id'];
      this.getFilteredRooms()
    });
  }

  onSelectChange(event: any) {
    this.roomRequest.buildingId = +event.target.value;
    console.log('idBUi: ', +event.target.value)
  }

  /** Mở modal để sửa phòng */
  openEditRoomModal(idRoom: number) {
    this.errorService.clearAllErrors();

    this.isEditing = true;
    this.roomService.getRoom(idRoom).subscribe(room => {
      this.itemRoom = room;
      this.keyRoom = idRoom;

      // Chuyển dữ liệu phòng vào biến roomRequest
      this.roomRequest = {
        roomNumber: room.roomNumber,
        length: room.length,
        width: room.width,
        maxPeople: room.maxPeople,
        pricePerMonth: room.pricePerMonth,
        pricePerDay: room.pricePerDay,
        description: room.description,
        rented: room.isRented,
        buildingId: room.building.id,
        images: [],
        deletedImages: []
      };

      // Hiển thị hình ảnh có sẵn
      this.imagePreviews = room.images?.map(img => img.url) || [];
      console.log(this.itemRoom);
    });
  }

  /** Mở modal để tạo phòng */
  openCreateRoomModal() {
    this.errorService.clearAllErrors();

    this.keyRoom = 0
    this.isEditing = false;
    this.itemRoom = undefined;
    this.roomRequest = {
      roomNumber: '',
      length: 0,
      width: 0,
      maxPeople: 0,
      pricePerMonth: 0,
      pricePerDay: 0,
      description: '',
      rented: false,
      buildingId: this.idUrl ?? 0,
      images: [],
      deletedImages: []
    };
    this.imagePreviews = [];
    this.selectedFiles = [];
  }


  saveRoom() {
    this.errorService.clearAllErrors();
    if (this.isEditing) {
      // chỉnh sửa phòng
      this.roomService.updateRoom(this.keyRoom, this.roomRequest).subscribe(
        () => {
          this.getFilteredRooms()
          this.openSnackBar('✅ Updated room successfully!')
          this.closeModal();
         
        },
        (error) =>
          {
            console.error("Lỗi khi cập nhật phòng:", error)
            this.openSnackBar('❌ Updated room fail!');
          } 
      );
    } else {
      // tạo mới phòng
      this.roomService.createNewRoom(this.roomRequest).subscribe(
        () => {
          this.getFilteredRooms();
          this.openSnackBar('✅ Created room successfully!');
          this.closeModal();
        },
        (error) => {
          console.error("Lỗi khi tạo phòng:", error);
          this.openSnackBar('❌ Created room fail!');
        }
      );
    }
 
  }

  deleteRoom(idRoom: number) {
    this.roomService.deleteRoom(idRoom).subscribe(
      () => {
        this.getFilteredRooms()
        this.openSnackBar('✅ Deleted room successfully!')
        this.closeModal();
      },
      error => console.error("", error)

    );
  }

  closeModal() {
    const modalElement = document.getElementById('modalRoom');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 30); 
    this.isOpenConfirmModal = false;

  }
  


  isOpenConfirmModal: boolean = false;

  openConfirmModal() {
    this.isOpenConfirmModal = true;
  }

  closeConfirmModal() {
    this.isOpenConfirmModal = false;
  }



  ///////////////////////////////////////////

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  onFileSelected(event: any) {
    if (event.target.files) {
      for (let file of event.target.files) {
        this.selectedFiles.push(file);
        this.roomRequest.images?.push(file)
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    console.log("Selected files:", this.selectedFiles)
    console.log("Selected files:", this.imagePreviews)
  }

  deletedImages: string[] = []; // Lưu ảnh đã xóa để gửi lên backend

  removeImage(index: number) {
    const deletedImageUrl = this.imagePreviews[index]; // Lấy URL ảnh bị xóa

    if (this.itemRoom && this.itemRoom.images) {
      const isExistingImage = this.itemRoom.images.some(img => img.url === deletedImageUrl);

      if (isExistingImage) {
        //Nếu ảnh đã có trong database, thêm vào danh sách xóa
        this.roomRequest.deletedImages = this.roomRequest.deletedImages || [];
        this.roomRequest.deletedImages.push(deletedImageUrl);
      }
    }

    // Xóa ảnh khỏi danh sách hiển thị
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.roomRequest.images?.splice(index, 1);
  }




  openSnackBar(status: string) {
    this.matsnackBarr.open
      (status, "Đóng", {
        duration: 4000,
        horizontalPosition: 'end', 
        verticalPosition: 'bottom',
      })
  }



  showFilterForm = false;


  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
  }

  applyFilters(page: number = 0) {
    const minPrice = this.filterData.minPrice ? Number(this.filterData.minPrice) : undefined;
    const maxPrice = this.filterData.maxPrice ? Number(this.filterData.maxPrice) : undefined;
    const isRented = this.filterData.rented === '1' ? true : (this.filterData.rented === '0' ? false : undefined);
    const roomNumber = this.filterData.roomNumber || undefined;
    const sortBy = 'id'; 
    const sort = 'desc'; 
    this.getFilteredRooms({minPrice,maxPrice,rented: isRented,roomNumber,sortBy,sort,page})
    this.showFilterForm = !this.showFilterForm;

  }

  searchRoomNumber() {
    const roomNumber = this.filterData.roomNumber!
    this.roomService.getFilterRooms(roomNumber, undefined, undefined, undefined, undefined, this.idUrl!, 'pricePerDay', 'desc')
      .subscribe(
        (response) => {
          this.listRooms = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          console.log('Danh sách phòng:', response.content);
        },
        (error) => {
          console.error('Lỗi khi lấy danh sách phòng:', error);
        }
      )
  }

  resetDataFilter() {
    this.filterData = {
      minPrice: undefined, 
      maxPrice: undefined,
      rented: undefined,
      roomNumber: undefined,
      sortBy: 'id', 
      sort: 'desc', 
      page: 0
    }
  }

  selectedSort: string = ''
  sortByPrice(sort: string, sortBy : string) {
    this.selectedSort = sort
    this.filterData.sort = sort; 
    this.filterData.sortBy = sortBy; 
    this.getFilteredRooms({
      ...this.filterData,
      page: this.currentPage
      
    });
    
  }


  goBack(){
    window.history.back();
  }
}



