import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalItem = () => {
  const list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(list)

  }
  else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalItem())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      showAlert(true, 'please enter value', 'danger')
    }
    else if (name && isEditing) {
      showAlert(true, 'value changed succesfully', 'success')

      setList(list.map((item) => {
        if (item.id == editID) {
          return { ...item, title: name }
        }
        return item
      }))
      setName('')
      setEditID(null)
      setIsEditing(false)

    }
    else {
      showAlert(true, 'new item added', 'success')
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')

    }

  }
  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, msg, type })
  }

  const clearList = () => {
    showAlert(true, 'list is empty', 'danger')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'item removed', 'danger')
    setList(list.filter((item) => item.id != id))
  }

  const editItem = (id) => {
    const newItem = list.find((item) => item.id == id)
    setIsEditing(true)
    setEditID(id)
    setName(newItem.title)
  }



  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return <section className='section-center'>
    <form onSubmit={handleSubmit} className="grocery-form">
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>grocery bud</h3>
      <div className="form-control">
        <input type="text" name="name" id="" className='grocery' placeholder='e.g. Eggs' value={name} onChange={(e) => setName(e.target.value)} />
        <button className="submit-btn" type='submit'>{isEditing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 &&

      <div className="grocery-container">
        <List item={list} remove={removeItem} editItem={editItem} />
        <button className="clear-btn" onClick={clearList}>clear items</button>
      </div>
    }
  </section>
}

export default App
