"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button, Chip, Dialog } from "@mui/material";
import { useContext } from "@/contexts";
import { ThemeConfig } from "@/configs";
import { useGetShirtStyleByIdQuery } from "@/stores/api/shirtstyle.api";
import { Loader, SizeRecommendationTable } from "@/components";

const BASE_URL = process.env.BASE_URL;

const sizePriceMap: Record<string, number> = {
  S: 0,
  M: 50,
  L: 100,
  XL: 150,
};

const ShirtStyleDetailPage = () => {
  const router = useRouter();
  const { id, setId } = useContext();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetShirtStyleByIdQuery(id ?? "", { skip: !id });

  useEffect(() => {
    if (!id) {
      router.replace("/home");
    }
  }, [id, router]);

  const shirtData = response?.data;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const calculatePriceBySize = (
    basePrice: number,
    size: string | null
  ): number => {
    if (!size) return basePrice;
    return basePrice + (sizePriceMap[size] || 0);
  };

  if (isLoading) return <Loader />;
  if (isError || !shirtData) return <div>ไม่พบข้อมูล</div>;

  return (
    <div
      className="min-h-screen py-10 px-6 md:px-16"
      style={{ backgroundColor: ThemeConfig.colors.backgroundMain }}
    >
      <motion.div
        className="w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div
            className="lg:col-span-8 bg-cover bg-center p-4 md:p-6 lg:p-10"
            style={{ backgroundColor: ThemeConfig.colors.backgroundAlt }}
          >
            {shirtData.shirtStyleImages?.[0]?.imageUrl && (
              <motion.img
                src={`${BASE_URL}${shirtData.shirtStyleImages[0].imageUrl}`}
                alt={shirtData.name}
                onClick={() =>
                  setOpenImage(
                    `${BASE_URL}${shirtData.shirtStyleImages[0].imageUrl}`
                  )
                }
                className="w-full h-[1000px] object-cover object-top rounded-xl cursor-zoom-in"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <div className="flex gap-8 mt-10 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {shirtData.shirtStyleImages
                ?.slice(1)
                .map((img: any, index: any) => (
                  <motion.img
                    key={index}
                    src={`${BASE_URL}${img.imageUrl}`}
                    alt={`style-${index}`}
                    onClick={() => setOpenImage(`${BASE_URL}${img.imageUrl}`)}
                    className="h-80 w-51 object-cover rounded-2xl shadow-2xl cursor-zoom-in snap-start"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
            </div>
          </div>

          <div className="lg:col-span-4 p-6 lg:p-10">
            <h1
              className="text-4xl font-extrabold mb-6 leading-snug"
              style={{ color: ThemeConfig.colors.textPrimary }}
            >
              {shirtData.name}
            </h1>

            <h5
              className="text-2xl font-extrabold mb-2 leading-snug"
              style={{ color: ThemeConfig.colors.textPrimary }}
            >
              คำอธิบาย:
            </h5>
            <p
              className="text-lg leading-relaxed whitespace-pre-line"
              style={{ color: ThemeConfig.colors.textSecondary }}
            >
              {shirtData.description.replace(/,\s*/g, "\n") || "-"}
            </p>

            <SizeRecommendationTable />

            <div className="flex flex-wrap gap-2 my-4">
              {shirtData.sizes?.map((size: any) => {
                const isSelected = selectedSize === size.name;

                return (
                  <Chip
                    key={size.sizeId}
                    label={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    style={{
                      backgroundColor: isSelected
                        ? ThemeConfig.colors.primary
                        : ThemeConfig.colors.accentGold,
                      color: ThemeConfig.colors.white,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    sx={{
                      fontSize: "1rem",
                      height: "44px",
                      paddingX: 3,
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-6 mb-4">
              <span
                className="text-3xl font-extrabold"
                style={{ color: ThemeConfig.colors.accentGold }}
              >
                ราคา{" "}
                {calculatePriceBySize(
                  shirtData.price,
                  selectedSize
                ).toLocaleString()}{" "}
                บาท
              </span>
            </div>

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart size={24} />}
              className="mt-6"
              sx={{
                backgroundColor: ThemeConfig.colors.primary,
                "&:hover": {
                  backgroundColor: ThemeConfig.colors.secondary,
                },
                fontWeight: "bold",
                fontSize: "1rem",
                px: 5,
                py: 1.5,
              }}
              onClick={() => {
                setId(shirtData.shirtStyleId);
                router.push("/order");
              }}
            >
              สั่งตัดชุด
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth="xl"
      >
        {openImage?.trim() && (
          <img
            src={openImage}
            alt="preview"
            className="w-full h-full object-contain"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ShirtStyleDetailPage;
