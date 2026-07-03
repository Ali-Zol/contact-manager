import { useState, useEffect } from 'react'
import { api, getToken, removeToken } from './api.js'
import Login from './login.jsx'
import CategoryManager from './CategoryManager'

function App()
{
  const [contacts, setContacts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '', email: '', category_id: null })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  // Load contacts only
  const loadContacts = async () => {
    try
    {
      const data = await api.getContacts()
      setContacts(data)
    }
    catch (err)
    {
      console.error(err)

      if (err.message.includes('No token') || err.message.includes('401'))
        logout()
    }
  }

  // Load categories only
  const loadCategories = async () => {
    try
    {
      const data = await api.getCategories()
      setCategories(data)
    }
    catch (err)
    {
      console.error(err)
    }
  }

  // Load both contacts and categories
  const loadData = async () => {
    setLoading(true)
    await Promise.all([loadContacts(), loadCategories()])
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated)
      loadData()
  }, [isAuthenticated])

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
    setContacts([])
    setCategories([])
  }

  // Called after category create/delete to refresh data
  const handleCategoryChange = async () => {
    await loadCategories()
    await loadContacts()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const saveContact = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim())
    {
      alert('Please fill in name, phone and email')
      return
    }
    try
    {
      if (editingId !== null)
      {
        // Update existing contact
        const updated = await api.updateContact(editingId, {
          name: form.name,
          phone: form.phone,
          email: form.email,
          category_id: form.category_id || null
        })

        setContacts(contacts.map(c => c.id === editingId ? updated : c))
        setEditingId(null)
      }
      else
      {
        // Create new contact
        const newContact = await api.createContact({
          name: form.name,
          phone: form.phone,
          email: form.email,
          category_id: form.category_id || null
        })
        
        setContacts([...contacts, newContact])
      }
      setForm({ name: '', phone: '', email: '', category_id: null })
    }
    catch (err)
    {
      alert('Error saving contact: ' + err.message)
    }
  }

  const startEdit = (contact) => {
    setEditingId(contact.id)
    setForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      category_id: contact.category_id || null
    })
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact?'))
      return

    try
    {
      await api.deleteContact(id)
      setContacts(contacts.filter(c => c.id !== id))

      if (editingId === id)
      {
        setEditingId(null)
        setForm({ name: '', phone: '', email: '', category_id: null })
      }
    }
    catch (err)
    {
      alert('Error deleting contact: ' + err.message)
    }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : '-'
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.includes(searchTerm) ||
      contact.phone.includes(searchTerm) ||
      contact.email.includes(searchTerm)
    const matchesCategory = filterCategoryId === '' || contact.category_id === parseInt(filterCategoryId)
    return matchesSearch && matchesCategory
  })

  if (!isAuthenticated)
    return <Login onLogin={() => setIsAuthenticated(true)} />

  if (loading)
    return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📇 Contact Manager</h1>
        <div>
          <button onClick={() => setShowCategoryManager(!showCategoryManager)} style={{ marginRight: 10 }}>
            {showCategoryManager ? 'Hide Categories' : 'Manage Categories'}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Category Manager Panel */}
      {showCategoryManager && (
        <CategoryManager categories={categories} onCategoryChange={handleCategoryChange} />
      )}

      {/* Add/Edit Form */}
      <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3>{editingId !== null ? 'Edit Contact' : 'Add New Contact'}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            style={{ padding: 8, flex: 1 }}
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (e.g. 09123456789)"
            style={{ padding: 8, flex: 1 }}
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ padding: 8, flex: 1 }}
          />
          <select
            name="category_id"
            value={form.category_id ?? ''}
            onChange={handleChange}
            style={{ padding: 8 }}
          >
            <option value="">None</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={saveContact} style={{ padding: '8px 16px' }}>
            {editingId !== null ? 'Update' : 'Add'}
          </button>
          {editingId !== null && (
            <button
              onClick={() => {
                setEditingId(null)
                setForm({ name: '', phone: '', email: '', category_id: null })
              }}
              style={{ padding: '8px 16px', background: '#ccc' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, padding: 8 }}
        />
        <select
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #ddd', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #ddd', padding: 8 }}>Phone</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #ddd', padding: 8 }}>Email</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #ddd', padding: 8 }}>Category</th>
              <th style={{ textAlign: 'center', borderBottom: '2px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{contact.name}</td>
                <td style={{ padding: 8 }}>{contact.phone}</td>
                <td style={{ padding: 8 }}>{contact.email}</td>
                <td style={{ padding: 8 }}>{getCategoryName(contact.category_id)}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <button onClick={() => startEdit(contact)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => deleteContact(contact.id)} style={{ background: '#f44336', color: '#fff' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Statistics */}
      <div style={{ marginTop: 20, color: '#666', textAlign: 'center' }}>
        <p>Total contacts (after filter): {filteredContacts.length}</p>
      </div>
    </div>
  )
}

export default App