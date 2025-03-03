import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl mt-16">
          <Input 
            type="text" 
            placeholder="Type a new word..." 
            className="w-full h-12 text-lg px-4 rounded-md"
          />
        </div>

        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-lg font-semibold mb-4">Vocabulary List:</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="bg-purple-500 text-white hover:bg-purple-600">
              + Add
            </Button>
            <Button variant="outline">Word1</Button>
            <Button variant="outline">Word2</Button>
          </div>
        </div>

        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-lg font-semibold mb-4">Generate A Story:</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et ex sit amet turpis placerat blandit sed vel eros. 
              Nulla feugiat nibh et eros tristique vulputate in sed lacus. Maecenas et aliquam lorem.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

