"use client";

import AddModal from "./AddModal";
import ImageModal from "./ImageModal";
import UpdateModal from "./UpdateModal";

interface GenericModalProps {
  show: boolean;
  title: string;
  fields: { name: string; type: string; placeholder: string }[];
  validationSchema: any;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const GenericModal = ({
  show,
  title,
  fields,
  validationSchema,
  initialValues,
  onSubmit,
  onClose,
}: GenericModalProps) => {
  const isAddMode = title.includes("เพิ่ม");
  const isImageMode = initialValues?.shirtStyleImages !== undefined;

  if (!show) return null;

  return (
    <div>
      {isImageMode ? (
        <ImageModal
          title={title}
          fields={fields}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      ) : isAddMode ? (
        <AddModal
          title={title}
          fields={fields}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      ) : (
        <UpdateModal
          title={title}
          fields={fields}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default GenericModal;
