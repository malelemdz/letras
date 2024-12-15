import { createClient } from '@supabase/supabase-js'

// Configura la URL de tu proyecto y la clave pública
const supabaseUrl = 'https://mabkntnahhortylxehie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hYmtudG5haGhvcnR5bHhlaGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMjc0OTMsImV4cCI6MjA0OTgwMzQ5M30.eFIb8r3tw2Ho9jYT9ie0m9UNarwgzWXJ5ayvBK5dy98' // Reemplaza con tu Supabase Key real
const supabase = createClient(supabaseUrl, supabaseKey)

const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    // Captura los valores de los campos del formulario
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    // Verifica que se ingresaron los datos
    if (!username || !password) {
        alert('Por favor, ingresa un nombre de usuario y contraseña.')
        return
    }

    // Realiza la consulta para verificar el usuario y la contraseña
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)  // Compara por nombre de usuario
        .eq('password', password)  // Compara por contraseña en texto claro (deberías usar hash para mayor seguridad)
        .single()

    if (error) {
        console.error('Error:', error)
        alert('Error al iniciar sesión. Intenta de nuevo.')
        return
    }

    // Verifica si el usuario fue encontrado y redirige según su rol
    if (data) {
        console.log('Usuario encontrado:', data)

        // Redirige según el rol del usuario
        if (data.role === 'user') {
            window.location.href = 'user.html'
        } else if (data.role === 'editor') {
            window.location.href = 'editor.html'
        } else if (data.role === 'admin') {
            window.location.href = 'admin.html'
        }
    } else {
        alert('Usuario o contraseña incorrectos.')
    }
})
