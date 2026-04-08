"use client"

import { useId, useState } from "react"

type PondShapeValue = "RECTANGLE" | "CIRCLE" | "IRREGULAR"

type PondShapeDimensionFieldsProps = {
  defaultDepthM?: string
  defaultDiameterM?: string
  defaultLengthM?: string
  defaultShape?: PondShapeValue
  defaultWidthM?: string
  shapeOptions: Record<PondShapeValue, string>
}

export function PondShapeDimensionFields({
  defaultDepthM,
  defaultDiameterM,
  defaultLengthM,
  defaultShape = "RECTANGLE",
  defaultWidthM,
  shapeOptions,
}: PondShapeDimensionFieldsProps) {
  const [shape, setShape] = useState<PondShapeValue>(defaultShape)
  const shapeId = useId()

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={`${shapeId}-shape`}>
          Bentuk Kolam
        </label>
        <select
          className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={defaultShape}
          id={`${shapeId}-shape`}
          name="shape"
          onChange={(event) => setShape(event.target.value as PondShapeValue)}
        >
          {Object.entries(shapeOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {shape === "RECTANGLE" ? (
        <>
          <DimensionInput
            defaultValue={defaultLengthM}
            id={`${shapeId}-length`}
            label="Panjang (m)"
            name="lengthM"
          />
          <DimensionInput
            defaultValue={defaultWidthM}
            id={`${shapeId}-width`}
            label="Lebar (m)"
            name="widthM"
          />
        </>
      ) : null}

      {shape === "CIRCLE" ? (
        <DimensionInput
          defaultValue={defaultDiameterM}
          id={`${shapeId}-diameter`}
          label="Diameter (m)"
          name="diameterM"
        />
      ) : null}

      {shape === "IRREGULAR" ? (
        <p className="border-border bg-muted/50 text-muted-foreground rounded-md border px-3 py-2 text-sm md:col-span-2">
          Untuk kolam tidak beraturan, isi detail ukuran pada catatan.
        </p>
      ) : null}

      <DimensionInput
        defaultValue={defaultDepthM}
        id={`${shapeId}-depth`}
        label="Kedalaman (m)"
        name="depthM"
      />
    </>
  )
}

function DimensionInput({
  defaultValue,
  id,
  label,
  name,
}: {
  defaultValue?: string
  id: string
  label: string
  name: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={id}
        name={name}
        step="0.01"
        type="number"
      />
    </div>
  )
}
