export const formattedDate = (date?: Date): string => {
  if (date) {
    return new Date(date?.toString()).toLocaleDateString("sv", {
      timeZone: "America/Tegucigalpa",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).toString();
  } else {
    return new Date().toLocaleDateString("sv", {
      timeZone: "America/Tegucigalpa",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).toString();
  }
}
