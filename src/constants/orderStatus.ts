const orderStatusOptions = [
  { label: "กำลังดำเนินการ", value: "InProgress" },
  { label: "รอการยืนยัน", value: "PendingConfirmation" },
  { label: "ยืนยันแล้ว", value: "Confirmed" },
  { label: "กำลังจัดส่ง", value: "Delivering" },
  { label: "สำเร็จ", value: "Completed" },
  { label: "ยกเลิก", value: "Cancelled" },
];

const statusMapping: Record<string, string> = {
  InProgress: "กำลังดำเนินการ",
  PendingConfirmation: "รอการยืนยัน",
  Confirmed: "ยืนยันแล้ว",
  Delivering: "กำลังจัดส่ง",
  Completed: "สำเร็จ",
  Cancelled: "ยกเลิก",
};

export { orderStatusOptions, statusMapping };