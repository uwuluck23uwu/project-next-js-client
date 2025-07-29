"use client";

import React, { useEffect, useState } from "react";
import { Upload as ImageUpload, X } from "lucide-react";

interface ImageUploadProps {
  name: string;
  label?: string;
  errors?: any;
  touched?: any;
  initialPreview?: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

const Upload = ({
  name,
  onChange,
  errors,
  touched,
  initialPreview,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file, previewUrl);
    } else {
      setPreview(null);
      onChange(null, null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null, null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 
        ${errors && touched ? "border-red-500" : "border-gray-300"} 
        hover:border-blue-400 hover:bg-gray-50`}
      >
        <label htmlFor={name} className="flex flex-col items-center gap-2">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 p-1 bg-gray-100 rounded-full hover:bg-red-100 transition-all"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageUpload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-500">คลิกหรือวางไฟล์ที่นี่</span>
            </div>
          )}
        </label>
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {errors && touched && (
        <span className="text-red-500 text-sm">{errors[name]}</span>
      )}
    </div>
  );
};

export default Upload;
