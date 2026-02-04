export const formatServerTime = (timestamp: number | null) => {
  if (timestamp == null) return { hours: "00", minutes: "00", seconds: "00" };
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return { hours, minutes, seconds };
};
