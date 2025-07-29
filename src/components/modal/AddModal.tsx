"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Formik, Form, FieldArray } from "formik";
import { ThemeConfig } from "@/configs";
import { Button, Input } from "@/components";

interface AddModalProps {
  title: string;
  fields: { name: string; type: string; placeholder: string }[];
  validationSchema: any;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const AddModal = ({
  title,
  fields,
  validationSchema,
  initialValues,
  onSubmit,
  onClose,
}: AddModalProps) => {

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
        className="w-[80%] max-w-4xl rounded-lg overflow-hidden shadow-lg bg-white p-8"
        style={{ backgroundColor: ThemeConfig.colors.backgroundAlt }}
        variants={modalVariant}
      >
        <h2
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: ThemeConfig.colors.textPrimary }}
        >
          กรอกข้อมูล
        </h2>

        <Formik
          initialValues={{ items: [initialValues] }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(values.items);
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting, resetForm }) => (
            <Form>
              <FieldArray name="items">
                {({ push, remove }) => (
                  <>
                    <div className="overflow-y-auto max-h-[60vh]">
                      {values.items.map((_, index) => (
                        <div
                          key={index}
                          className="p-4 mb-4 relative rounded-lg border border-gray-300"
                        >
                          <div className="grid grid-cols-1 gap-2 w-full">
                            {fields.map((field) => (
                              <Input
                                key={`${field.name}-${index}`}
                                type={field.type}
                                name={`items.${index}.${field.name}`}
                                placeholder={field.placeholder}
                                errors={errors}
                                touched={touched}
                              />
                            ))}
                          </div>

                          {index > 0 && (
                            <Button
                              type="button"
                              icon={<X className="w-4 h-4" />}
                              className="absolute -top-5 right-0 rounded-full bg-red-100 hover:bg-red-200"
                              onClick={() => remove(index)}
                              hoverScale={1.1}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      label="เพิ่มข้อมูลใหม่"
                      className="w-full mb-4"
                      onClick={() => push({ ...initialValues })}
                    />
                  </>
                )}
              </FieldArray>

              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  label="ล้างข้อมูล"
                  onClick={() => resetForm()}
                  className="w-[48%]"
                  style={{
                    backgroundColor: ThemeConfig.colors.accentGreen,
                    color: ThemeConfig.colors.white,
                  }}
                  hoverScale={1.05}
                />

                <Button
                  type="submit"
                  label="บันทึกข้อมูล"
                  loading={isSubmitting}
                  loadingText="กำลังบันทึก..."
                  className="w-[48%]"
                  style={{
                    backgroundColor: isSubmitting
                      ? ThemeConfig.colors.secondary
                      : ThemeConfig.colors.primary,
                    color: ThemeConfig.colors.white,
                  }}
                  hoverScale={1.05}
                />
              </div>
            </Form>
          )}
        </Formik>

        <Button
          onClick={onClose}
          label="ยกเลิก"
          className="mt-4 w-full text-sm"
          style={{
            color: ThemeConfig.colors.textSecondary,
            backgroundColor: ThemeConfig.colors.platinum,
          }}
          hoverScale={1.05}
        />
      </motion.div>
    </motion.div>
  );
};

export default AddModal;
