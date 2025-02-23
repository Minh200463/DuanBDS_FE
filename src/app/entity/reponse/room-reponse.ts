import { BuildingReponse } from '../../entity/reponse/building-reponse'
export class RoomReponse {
    constructor(
        public id : number,
        public roomNumber: string,
        public length: number,
        public width: number,
        public maxPeople: number,
        public pricePerMonth: number,
        public pricePerDay: number,
        public description: string,
        public isRented: boolean,
        public building: BuildingReponse, // Thêm thuộc tính building
        public images: any[]
    ){
    }

}
