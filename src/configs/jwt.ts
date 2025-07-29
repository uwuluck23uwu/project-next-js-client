"use client";

import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  role: string;
  unique_name?: string;
  branch_id?: string;
  image_url?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

const decodeAccessToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error("Decode token failed:", err);
    return null;
  }
};

export default decodeAccessToken;
