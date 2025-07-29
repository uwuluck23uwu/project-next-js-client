"use client";

import React from "react";
import get from "lodash/get";
import { Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  errors: any;
  touched: any;
  rows?: number;
}

const Input = ({
  type,
  name,
  placeholder,
  errors,
  touched,
  rows = 4,
}: FormInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const hasError = get(errors, name) && get(touched, name);

  return (
    <div className="mb-4">
      <div className="relative">
        <Field name={name}>
          {({ field }: any) =>
            React.createElement(isTextarea ? "textarea" : "input", {
              ...field,
              type: isTextarea
                ? undefined
                : isPassword && showPassword
                ? "text"
                : type,
              placeholder,
              rows: isTextarea ? rows : undefined,
              className: `
          w-full p-3 ${isTextarea ? "" : "pr-10"} border rounded
          ${hasError ? "border-red-500" : "border-gray-300"}
          focus:outline-none
          ${isTextarea ? "resize-none h-32" : ""}
        `,
              value: field.value ?? "", // <-- สำคัญ
            })
          }
        </Field>

        {isPassword && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 mt-1 text-sm"
      />
    </div>
  );
};

export default Input;
