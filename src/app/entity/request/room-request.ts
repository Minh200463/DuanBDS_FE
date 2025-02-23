export class RoomRequest {
    constructor(
        public roomNumber: string,
        public length: number,
        public width: number,  
        public maxPeople: number,
        public pricePerMonth: number,
        public pricePerDay: number,
        public description: string,
        public rented: boolean,
        public buildingId?: number,
        public images?: string[],   
        public deletedImages?: string[]
    ) {}
}   