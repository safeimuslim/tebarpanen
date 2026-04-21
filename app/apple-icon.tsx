import { ImageResponse } from "next/og"

import { BrandIcon } from "@/app/lib/brand-icon"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          borderRadius: "40px",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <BrandIcon size={132} />
      </div>
    ),
    size
  )
}
