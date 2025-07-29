import * as Yup from "yup";

const AddShirtStyleSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "ชื่อสไตล์ต้องไม่เกิน 100 ตัวอักษร")
    .required("กรุณากรอกชื่อสไตล์"),
  description: Yup.string().max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร"),
  price: Yup.number()
    .typeError("ราคาต้องเป็นตัวเลข")
    .required("กรุณากรอกราคา")
    .min(0, "ราคาต้องไม่ต่ำกว่า 0"),
});

const UpdateShirtStyleSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "ชื่อสไตล์ต้องไม่เกิน 100 ตัวอักษร")
    .required("กรุณากรอกชื่อสไตล์"),
  description: Yup.string().max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร"),
  price: Yup.number()
    .typeError("ราคาต้องเป็นตัวเลข")
    .required("กรุณากรอกราคา")
    .min(0, "ราคาต้องไม่ต่ำกว่า 0"),
});

export { AddShirtStyleSchema, UpdateShirtStyleSchema };
