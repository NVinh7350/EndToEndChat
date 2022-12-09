const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

export  const getTimeAgo = ( previous) => {
  if(!previous) {
    return ''
  }
  var current = Date.now();
  var elapsed = current - previous;
  
  if (elapsed < msPerMinute) {
    return Math.round(elapsed/1000) + ' giây trước';   
  }
  
  else if (elapsed < msPerHour) {
    return Math.round(elapsed/msPerMinute) + ' phút trước';   
  }
  
  else if (elapsed < msPerDay ) {
   return Math.round(elapsed/msPerHour ) + ' giờ trước';   
}

else if (elapsed < msPerMonth) {
return Math.round(elapsed/msPerDay) + ' ngày trước';   
}

else if (elapsed < msPerYear) {
return Math.round(elapsed/msPerMonth) + ' tháng trước';   
}

else {
return Math.round(elapsed/msPerYear ) + ' năm trước';   
}
}


export const getTime = (timeStamp) => {
var elapsed = Date.now() - timeStamp;
var date = new Date(timeStamp);
var hours = date.getHours().toString().padStart(2,'0');
var minutes = date.getMinutes().toString().padStart(2,'0');
var month = (date.getMonth() + 1).toString();
var day = date.getDate().toString().padStart(2,'0');

if(! timeStamp) 
return ''
if (elapsed < msPerDay) {
return `${hours}:${minutes}`
}
else if (elapsed < msPerDay * 7) {
var days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
var dayName = days[date.getDay()];
return `${dayName}, ${hours}:${minutes}` 
}
else if (elapsed < msPerYear) {
return `${day} th${month}, ${hours}:${minutes}`   
}
else {
return `${day} th${month} ${date.getFullYear()}, ${hours}:${minutes}`     
}
}
