import axios from 'axios'
import { useState } from 'react'

export function RegisterAndLogin () {
  const [nombres, setNombres] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [documento, setDocumento] = useState('')

  const registerUser = async (ev) => {
    ev.preventDefault()
    await axios.post('/registro', { nombres, contrasena, documento })
  }

  return (
    <section className='bg-blue-200 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={registerUser}>
        <input
          type='text' placeholder='Nombres Completos' value={nombres}
          className='block w-full rounded-md p-2 mb-2 border'
          onChange={ev => setNombres(ev.target.value)}
        />
        <input
          type='text' placeholder='N° Documento' value={documento}
          className='block w-full rounded-md p-2 mb-2 border'
          onChange={ev => setDocumento(ev.target.value)}
        />
        <input
          type='password' placeholder='Crea Una Contraseña' value={contrasena}
          className='block w-full rounded-md p-2 mb-2 border'
          onChange={ev => setContrasena(ev.target.value)}
        />
        <button className='bg-blue-500 text-white block w-full p-2 rounded-md'>
          Registrarse
        </button>
      </form>
    </section>
  )
}