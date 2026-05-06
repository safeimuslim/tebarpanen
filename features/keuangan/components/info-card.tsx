export function InfoCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-border bg-background rounded-md border px-3 py-3">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  )
}
