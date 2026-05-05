import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { AppToaster } from './components/common/AppToaster.jsx'
import { store } from './store'
import { system } from './theme/system'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider value={system}>
        <AppToaster />
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>,
)
