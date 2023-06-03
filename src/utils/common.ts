export const dataURItoFile = (dataURI: string) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return new File([blob], "uploadImage", { type: mimeString });
};

export const getTweetDate = (createdAt: number) => {
  const dt = new Date(createdAt);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  const hours = dt.getHours() - 12;
  const ampm = dt.getHours() > 12 ? "오후" : "오전";
  const minutes = ("0" + dt.getMinutes()).slice(-2);
  return { year, month, date, hours, ampm, minutes };
};
