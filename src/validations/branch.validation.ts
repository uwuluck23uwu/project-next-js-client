import * as Yup from "yup";

const AddBranchSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("กรุณากรอกชื่อสาขา"),
      address: Yup.string().required("กรุณากรอกที่อยู่"),
      contactInfo: Yup.string().required("กรุณากรอกข้อมูลการติดต่อ"),
    })
  ),
});

const UpdateBranchSchema = Yup.object().shape({
  name: Yup.string().required("กรุณากรอกชื่อสาขา"),
  address: Yup.string().required("กรุณากรอกที่อยู่"),
  contactInfo: Yup.string().required("กรุณากรอกข้อมูลการติดต่อ"),
});

export { AddBranchSchema, UpdateBranchSchema };
