// --- Imports ---
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider } from '@heroui/react'
import { RouterProvider } from 'react-router'
import router from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- Initialisation du client React Query ---
const client = new QueryClient()

// --- Rendu racine de l'application ---
createRoot(document.getElementById('root')!).render(
  // Fournit le client React Query à toute l'application
  <QueryClientProvider client={client}>
    {/* Fournit le thème HeroUI */}
    <HeroUIProvider>
      {/* Fournit le router à l'application */}
      <RouterProvider router={router} />
    </HeroUIProvider>
  </QueryClientProvider>
)
