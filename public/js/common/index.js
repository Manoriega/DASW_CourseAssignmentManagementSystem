function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  let hours = date.getHours();
  let amPm = hours < 12 ? "AM" : "PM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return `${day} de ${month} del ${year} a las ${hours}:${minutes} ${amPm}`;
}

async function handleResponse(func, response, successStatus) {
  if (response.status == successStatus) {
    func();
  } else if (response.status == 400) {
    let data = await response.json();
    alert([data.errors]);
  } else if (response.status == 500) {
    window.location.replace("/");
  } else {
    alert("Ha ocurrido un error");
  }
}
