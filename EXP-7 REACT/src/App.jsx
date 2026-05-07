import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Student from './components/Student'

function App() {
  return (
       <div className="container">
      <h1>Student Information</h1>
      <Student name="YASHIKA NAYAK" course="Computer Science" marks="95" />
      <Student name="RITA SINGH" course="Data Science" marks="82" />
      <Student name="GEETA SHARMA" course="Electronics" marks="78" />
    </div>
  )
}

export default App