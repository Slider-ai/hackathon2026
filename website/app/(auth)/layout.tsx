export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col pt-24">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-16">
        {children}
      </main>
    </div>
  )
}
