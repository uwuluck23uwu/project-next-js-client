import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required("กรุณากรอกข้อมูล"),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
});

export default LoginSchema;
