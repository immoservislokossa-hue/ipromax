// app/500/page.tsx
export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Erreur 500</h1>
        <p className="mb-4">Une erreur technique inattendue s'est produite.</p>
        <p className="text-sm text-gray-600">Notre équipe a été alertée automatiquement.</p>
      </div>
    </div>
  )
}