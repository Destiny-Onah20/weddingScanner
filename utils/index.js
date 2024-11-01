export function formatCurrentDate() {
    const currentDate = new Date();
  
    const currentDay = currentDate.getDate();
    const dayOfMonth = currentDate.getMonth();
  
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
  
    const months = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    const month = months[currentDate.getMonth()];
  
    const year = currentDate.getFullYear();
  
    return `${currentDay}, ${dayOfWeek} ${month} ${year}`;
  }