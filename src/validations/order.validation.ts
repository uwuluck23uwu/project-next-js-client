import * as Yup from "yup";

export const OrderSchema = Yup.object().shape({
  title: Yup.string().max(20, "คำนำหน้าไม่ควรเกิน 20 ตัวอักษร"),
  firstName: Yup.string()
    .required("กรุณากรอกชื่อ")
    .max(50, "ชื่อไม่ควรเกิน 50 ตัวอักษร"),
  lastName: Yup.string()
    .required("กรุณากรอกนามสกุล")
    .max(50, "นามสกุลไม่ควรเกิน 50 ตัวอักษร"),
  size: Yup.string().required("กรุณาระบุขนาด"),
  chest: Yup.number()
    .typeError("กรุณากรอกตัวเลข")
    .min(0, "ต้องมากกว่า 0")
    .required("กรุณากรอกรอบอก"),
  waist: Yup.number()
    .typeError("กรุณากรอกตัวเลข")
    .min(0, "ต้องมากกว่า 0")
    .required("กรุณากรอกรอบเอว"),
  length: Yup.number()
    .typeError("กรุณากรอกตัวเลข")
    .min(0, "ต้องมากกว่า 0")
    .required("กรุณากรอกความยาวลำตัว"),
  detail: Yup.string().max(500, "รายละเอียดไม่ควรเกิน 500 ตัวอักษร"),
});

export default OrderSchema;
