import { Seat } from "../types/reservationType";

export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  let seatId = 0;

  const centerX = 400; // Stage center
  const sectionGap = 30; // Gap between sections

  // 1F - VIP Section (center, front)
  const vipRows = ["A", "B", "C", "D", "E"];
  vipRows.forEach((row, rowIndex) => {
    const seatsInRow = 16;
    const sectionWidth = seatsInRow * 16;
    const startX = centerX - sectionWidth / 2;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `vip-${seatId++}`,
        row,
        number: i + 1,
        grade: "VIP",
        price: 154000,
        section: "VIP",
        floor: "1F",
        isOccupied: Math.random() > 0.7,
        x: startX + i * 16,
        y: 180 + rowIndex * 16,
      });
    }
  });

  // 1F - R Section Left
  const rLeftRows = ["A", "B", "C", "D", "E", "F"];
  rLeftRows.forEach((row, rowIndex) => {
    const seatsInRow = 10;
    const sectionWidth = seatsInRow * 14;
    const vipLeftEdge = centerX - (16 * 16) / 2;
    const startX = vipLeftEdge - sectionGap - sectionWidth;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `r-left-${seatId++}`,
        row,
        number: i + 1,
        grade: "R",
        price: 143000,
        section: "R-Left",
        floor: "1F",
        isOccupied: Math.random() > 0.6,
        x: startX + i * 14,
        y: 180 + rowIndex * 16,
      });
    }
  });

  // 1F - R Section Right
  const rRightRows = ["A", "B", "C", "D", "E", "F"];
  rRightRows.forEach((row, rowIndex) => {
    const seatsInRow = 10;
    const vipRightEdge = centerX + (16 * 16) / 2;
    const startX = vipRightEdge + sectionGap;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `r-right-${seatId++}`,
        row,
        number: i + 1,
        grade: "R",
        price: 143000,
        section: "R-Right",
        floor: "1F",
        isOccupied: Math.random() > 0.6,
        x: startX + i * 14,
        y: 180 + rowIndex * 16,
      });
    }
  });

  // 2F - S Section Left
  const sLeftRows = ["A", "B", "C", "D", "E", "F", "G"];
  sLeftRows.forEach((row, rowIndex) => {
    const seatsInRow = 12;
    const sectionWidth = seatsInRow * 14;
    const aCenterLeftEdge = centerX - (18 * 14) / 2;
    const startX = aCenterLeftEdge - sectionGap - sectionWidth;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `s-left-${seatId++}`,
        row,
        number: i + 1,
        grade: "S",
        price: 132000,
        section: "S-Left",
        floor: "2F",
        isOccupied: Math.random() > 0.5,
        x: startX + i * 14,
        y: 340 + rowIndex * 14,
      });
    }
  });

  // 2F - A Section Center
  const aRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  aRows.forEach((row, rowIndex) => {
    const seatsInRow = 18;
    const sectionWidth = seatsInRow * 14;
    const startX = centerX - sectionWidth / 2;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `a-${seatId++}`,
        row,
        number: i + 1,
        grade: "A",
        price: 110000,
        section: "A-Center",
        floor: "2F",
        isOccupied: Math.random() > 0.4,
        x: startX + i * 14,
        y: 340 + rowIndex * 14,
      });
    }
  });

  // 2F - S Section Right
  const sRightRows = ["A", "B", "C", "D", "E", "F", "G"];
  sRightRows.forEach((row, rowIndex) => {
    const seatsInRow = 12;
    const aCenterRightEdge = centerX + (18 * 14) / 2;
    const startX = aCenterRightEdge + sectionGap;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `s-right-${seatId++}`,
        row,
        number: i + 1,
        grade: "S",
        price: 132000,
        section: "S-Right",
        floor: "2F",
        isOccupied: Math.random() > 0.5,
        x: startX + i * 14,
        y: 340 + rowIndex * 14,
      });
    }
  });

  // General Section (back, centered)
  const genRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  genRows.forEach((row, rowIndex) => {
    const seatsInRow = 24;
    const sectionWidth = seatsInRow * 14;
    const startX = centerX - sectionWidth / 2;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: `gen-${seatId++}`,
        row,
        number: i + 1,
        grade: "GENERAL",
        price: 99000,
        section: "General",
        floor: "2F",
        isOccupied: Math.random() > 0.3,
        x: startX + i * 14,
        y: 480 + rowIndex * 12,
      });
    }
  });

  return seats;
};

export const gradeInfo = {
  VIP: {
    name: "VIP석",
    price: 154000,
    fillColor: "#9333ea",
    textColor: "text-purple-600",
  },
  R: {
    name: "R석",
    price: 143000,
    fillColor: "#ec4899",
    textColor: "text-pink-600",
  },
  S: {
    name: "S석",
    price: 132000,
    fillColor: "#3b82f6",
    textColor: "text-blue-600",
  },
  A: {
    name: "A석",
    price: 110000,
    fillColor: "#22c55e",
    textColor: "text-green-600",
  },
  GENERAL: {
    name: "일반석",
    price: 99000,
    fillColor: "#6b7280",
    textColor: "text-gray-600",
  },
};
