export const formatDateWithDuration = (dateString: Date): string => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  
    const currentDate = new Date();
    const durationInMs = currentDate.getTime() - date.getTime();
  
    const years = Math.floor(durationInMs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (durationInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );
    const days = Math.floor(
      (durationInMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
  
    const durationString = `${years}y - ${months}m - ${days}d`;
  
    return `${formattedDate} (${durationString})`;
  };