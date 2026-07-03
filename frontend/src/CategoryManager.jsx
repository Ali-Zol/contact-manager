import { useState } from 'react'
import { api } from './api.js'

export default function CategoryManager({ categories, onCategoryChange })
{
  const [newCategoryName, setNewCategoryName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!newCategoryName.trim())
    {
      setError('Category name cannot be empty')
      return
    }
    
    try
    {
      await api.createCategory(newCategoryName.trim())
      setNewCategoryName('')
      setError('')
      onCategoryChange()   // Refresh categories and contacts
    }
    catch (err)
    {
      setError(err.message)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Contacts in this category will lose their category.`))
      return

    try
    {
      await api.deleteCategory(id)
      onCategoryChange()
    }
    catch (err)
    {
      alert('Error deleting category: ' + err.message)
    }
  }

  return (
    <div style={{ marginTop: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Manage Categories</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <button onClick={handleCreate}>Add Category</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
            <span>{cat.name}</span>
            <button onClick={() => handleDelete(cat.id, cat.name)} style={{ background: '#f44336', color: '#fff' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}