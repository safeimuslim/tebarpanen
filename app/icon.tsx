import { ImageResponse } from "next/og"

import { BrandIcon } from "@/app/lib/brand-icon"

export const size = {
  width: 64,
  height: 64,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "transparent",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <BrandIcon size={64} />
      </div>
    ),
    size
  )
}
