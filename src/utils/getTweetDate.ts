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
