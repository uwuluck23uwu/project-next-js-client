"use client";

import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { ThemeConfig } from "@/configs";
import { orderStatusOptions } from "@/constants";
import { Button, Input, Select } from "@/components"; // <-- Import Select มาด้วย

interface UpdateModalProps {
  title: string;
  fields: { name: string; type: string; placeholder: string }[];
  validationSchema: any;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const UpdateModal = ({
  title,
  fields,
  validationSchema,
  initialValues,
  onSubmit,
  onClose,
}: UpdateModalProps) => {
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
        className="w-[80%] max-w-3xl rounded-lg overflow-hidden shadow-lg bg-white p-8"
        style={{ backgroundColor: ThemeConfig.colors.backgroundAlt }}
        variants={modalVariant}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: ThemeConfig.colors.textPrimary }}
        >
          {title}
        </h2>

        <Formik
          initialValues={Object.keys(initialValues).reduce((acc, key) => {
            acc[key] = initialValues[key] ?? "";
            return acc;
          }, {} as Record<string, any>)}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              {fields.map((field) =>
                field.name === "orderStatus" ? (
                  <Select
                    key={field.name}
                    options={orderStatusOptions}
                    placeholder="เลือกสถานะการรับงาน"
                    defaultValue={values.orderStatus}
                    onChange={(value) => setFieldValue("orderStatus", value)}
                  />
                ) : (
                  <Input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    errors={errors}
                    touched={touched}
                  />
                )
              )}

              <Button
                type="submit"
                label="บันทึกข้อมูล"
                loading={isSubmitting}
                loadingText="กำลังบันทึก..."
                className="w-full mt-4"
                style={{
                  backgroundColor: isSubmitting
                    ? ThemeConfig.colors.secondary
                    : ThemeConfig.colors.primary,
                  color: ThemeConfig.colors.white,
                }}
                hoverScale={1.05}
              />
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

export default UpdateModal;
