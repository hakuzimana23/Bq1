import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [hardhat],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)