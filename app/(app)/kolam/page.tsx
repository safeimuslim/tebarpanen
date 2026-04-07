export default function KolamPage() {
  return <PlaceholderPage title="Kolam" />
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <p className="text-muted-foreground text-sm">{title}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
    </>
  )
}
