"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Loader } from "@/components";
import { useContext } from "@/contexts";

const BASE_URL = process.env.BASE_URL;

interface FromItemProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
};

const FromItem = ({ data, isLoading, isError }: FromItemProps) => {
  const router = useRouter();
  const { setId } = useContext();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center text-red-500 mt-10">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <main className="text-center py-12 px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {data.data.map((item: any) => (
            <motion.div
              key={item.shirtStyleId}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-full h-100 mb-4 overflow-hidden rounded">
                <Image
                  src={`${BASE_URL}${item.shirtStyleImages?.[0]?.imageUrl}`}
                  alt={item.name}
                  fill
                  className="object-cover object-top rounded"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {item.description?.substring(0, 100)}...
              </p>
              <p className="text-blue-700 font-bold text-base mb-4">
                {item.price} บาท
              </p>
              <Button
                label="เลือกแบบและสั่งตัด"
                onClick={() => {
                  setId(item.shirtStyleId);
                  router.push("/shirtstyle/shirtstyledetail");
                }}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FromItem;
