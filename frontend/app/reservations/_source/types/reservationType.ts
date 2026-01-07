export type SeatGrade = "VIP" | "R" | "S" | "A" | "GENERAL";

export interface Seat {
  id: string;
  row: string;
  number: number;
  grade: SeatGrade;
  price: number;
  section: string;
  floor: string;
  isOccupied: boolean;
  x: number;
  y: number;
}

export interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  grade: SeatGrade;
  price: number;
  section: string;
  floor: string;
}
