"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Formik, Form, FieldArray } from "formik";
import { ThemeConfig } from "@/configs";
import { Button, Input, Upload, Select } from "@/components";

const BASE_URL = process.env.BASE_URL;

interface AddImageModalProps {
  title: string;
  fields: { name: string; type: string; placeholder: string }[];
  validationSchema: any;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const sizeOptions = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
  { label: "XXXL", value: "XXXL" },
];

const ImageModal = ({
  title,
  fields,
  validationSchema,
  initialValues,
  onSubmit,
  onClose,
}: AddImageModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
      }}
    >
      <motion.div
        className="w-[80%] overflow-y-auto max-h-[90vh] max-w-5xl rounded-lg overflow-hidden shadow-lg bg-white p-8"
        style={{
          backgroundColor: ThemeConfig.colors.backgroundAlt,
        }}
        variants={modalVariant}
      >
        <h2
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: ThemeConfig.colors.textPrimary }}
        >
          {title}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              {fields.map(({ name, type, placeholder }) => {
                if (name === "shirtStyleImages") {
                  return (
                    <FieldArray name={name} key={name}>
                      {({ remove, push }) => (
                        <div>
                          <label className="block font-semibold mb-2">
                            อัปโหลดรูปภาพ
                          </label>

                          <div className="grid grid-cols-3 gap-4">
                            {values.shirtStyleImages?.map(
                              (image: any, index: any) => (
                                <div key={index} className="relative group">
                                  <Upload
                                    name={`shirtStyleImages.${index}`}
                                    onChange={(file) =>
                                      setFieldValue(
                                        `shirtStyleImages.${index}`,
                                        file
                                      )
                                    }
                                    initialPreview={
                                      title.includes("เพิ่ม")
                                        ? typeof image === "string"
                                          ? image
                                          : null
                                        : image?.imageUrl
                                        ? `${BASE_URL}${image.imageUrl}`
                                        : null
                                    }
                                  />
                                  <Button
                                    type="button"
                                    icon={<X className="w-4 h-4" />}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={() => remove(index)}
                                    style={{
                                      color: ThemeConfig.colors.white,
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>

                          <Button
                            type="button"
                            label="เพิ่มรูปภาพ"
                            onClick={() => push(null)}
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: ThemeConfig.colors.accentGreen,
                              color: ThemeConfig.colors.white,
                            }}
                          />
                        </div>
                      )}
                    </FieldArray>
                  );
                } else if (name === "sizes") {
                  return (
                    <div key={name} className="mb-4">
                      <label className="block font-semibold mb-2">
                        เลือกขนาด:
                      </label>
                      <FieldArray name={name}>
                        {({ remove, push }) => (
                          <div>
                            {values.sizes?.map((_: any, index: any) => (
                              <div key={index} className="flex gap-2 mb-2">
                                <Select
                                  options={sizeOptions}
                                  onChange={(value) =>
                                    setFieldValue(`sizes.${index}`, {
                                      name: value,
                                    })
                                  }
                                  defaultValue={values.sizes[index]?.name}
                                />
                                <Button
                                  type="button"
                                  icon={<X className="w-4 h-4" />}
                                  onClick={() => remove(index)}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              label="เพิ่มขนาด"
                              onClick={() => push("")}
                              style={{
                                backgroundColor: ThemeConfig.colors.accentGreen,
                                color: ThemeConfig.colors.white,
                              }}
                            />
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  );
                } else if (name === "description") {
                  return (
                    <div key={name} className="mb-4">
                      <label
                        htmlFor={name}
                        className="block font-semibold mb-2"
                        style={{ color: ThemeConfig.colors.textPrimary }}
                      >
                        คำอธิบาย
                      </label>
                      <Input
                        key={name}
                        type="textarea"
                        name={name}
                        placeholder={placeholder}
                        errors={{}}
                        touched={{}}
                        rows={6}
                      />
                    </div>
                  );
                } else {
                  return (
                    <Input
                      key={name}
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      errors={{}}
                      touched={{}}
                    />
                  );
                }
              })}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  label="ยกเลิก"
                  onClick={onClose}
                  style={{
                    color: ThemeConfig.colors.textSecondary,
                    backgroundColor: ThemeConfig.colors.platinum,
                  }}
                />
                <Button
                  type="submit"
                  label="บันทึก"
                  style={{
                    backgroundColor: isSubmitting
                      ? ThemeConfig.colors.secondary
                      : ThemeConfig.colors.primary,
                    color: ThemeConfig.colors.white,
                  }}
                  loading={isSubmitting}
                  loadingText="กำลังบันทึก..."
                />
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
};

export default ImageModal;
