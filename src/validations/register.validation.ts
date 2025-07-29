import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("กรุณากรอก ชื่อ - นามสกุล"),
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก")
    .required("กรุณากรอกเบอร์โทรศัพท์"),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
});

export default RegisterSchema;
