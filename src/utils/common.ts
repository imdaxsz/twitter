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
  const hours = Math.abs(12 - dt.getHours());
  const ampm = dt.getHours() > 12 ? "오후" : "오전";
  const minutes = ("0" + dt.getMinutes()).slice(-2);
  return { year, month, date, hours, ampm, minutes };
};

type UpdateProgressBarFun = (percentage: number, setPercentage: React.Dispatch<React.SetStateAction<number>>) => NodeJS.Timer;

export const updateProgressBar: UpdateProgressBarFun = (percentage, setPercentage) => {
  let interval = setInterval(() => {
    setPercentage((prev) => {
      if (percentage < 90) {
        return prev + Math.floor(Math.random() * 20);
      } else if (percentage >= 90 && percentage < 100) {
        return prev + 1;
      } else return 100;
    });
  }, 10);
  if (percentage >= 100) {
    clearInterval(interval);
  }
  return interval;
};
