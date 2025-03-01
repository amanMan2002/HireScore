import { useState } from 'react'
import Frontend from './Frontend'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <Frontend />
    </>
  )
}

export default App
