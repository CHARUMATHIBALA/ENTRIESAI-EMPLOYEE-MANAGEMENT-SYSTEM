
import { useEffect, useState } from 'react'
import axios from 'axios'

const API = '/api/employee'
const AUTH = '/api/auth'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [view, setView] = useState('login')

  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    dept: '',
    salary: '',
    joiningDate: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axios.defaults.headers.common['Authorization']
  }, [token])

  const fetchEmployees = async (q = '') => {
    try {
      const res = await axios.get(`${API}${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      setEmployees(res.data)
    } catch (err) {
      console.error('Error fetching employees:', err)
    }
  }

  useEffect(() => {
    if (token) fetchEmployees()
  }, [token])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (payload.salary === '') delete payload.salary
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload)
        setEditingId(null)
      } else {
        await axios.post(API, payload)
      }
      setForm({ name: '', email: '', dept: '', salary: '', joiningDate: '' })
      fetchEmployees(search)
    } catch (err) {
      console.error('Error saving employee:', err)
    }
  }

  const handleEdit = (emp) => {
    setEditingId(emp._id)
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      dept: emp.dept || '',
      salary: emp.salary || '',
      joiningDate: emp.joiningDate ? emp.joiningDate.slice(0, 10) : ''
    })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      fetchEmployees(search)
    } catch (err) {
      console.error('Error deleting employee:', err)
    }
  }

  const doSearch = (e) => {
    e.preventDefault()
    fetchEmployees(search)
  }

  const signup = async (email, password) => {
    await axios.post(`${AUTH}/signup`, { email, password })
    alert('Signup successful — please login')
    setView('login')
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${AUTH}/login`, { email, password })
      setToken(res.data.token)
      localStorage.setItem('token', res.data.token)
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  if (!token) {
    return (
      <div className="auth">
        <h2>{view === 'login' ? 'Login' : 'Sign Up'}</h2>
        <AuthForm
          mode={view}
          onSwitch={() => setView(view === 'login' ? 'signup' : 'login')}
          onLogin={login}
          onSignup={signup}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Employee CRUD</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <form onSubmit={doSearch}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or dept" />
          <button type="submit">Search</button>
        </form>
        <button onClick={() => { setForm({ name: '', email: '', dept: '', salary: '', joiningDate: '' }); setEditingId(null) }}>New</button>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="dept" placeholder="Department" value={form.dept} onChange={handleChange} />
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <input name="joiningDate" type="date" placeholder="Joining Date" value={form.joiningDate} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {employees.map((emp) => (
          <div key={emp._id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <strong>{emp.name}</strong>
            <div>{emp.email} — {emp.dept} — {emp.salary}</div>
            <div>Joined: {emp.joiningDate ? emp.joiningDate.slice(0, 10) : '—'}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleEdit(emp)}>Edit</button>
              <button onClick={() => handleDelete(emp._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuthForm({ mode, onSwitch, onLogin, onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'login') onLogin(email, password)
    else onSignup(email, password)
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        <button type="button" onClick={onSwitch}>{mode === 'login' ? 'Go to Sign up' : 'Go to Login'}</button>
      </div>
    </form>
  )
}
