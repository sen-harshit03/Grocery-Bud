import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'



const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'));
  }else{
    return [];
  }
}
function App() {
  const [userInput, setUserInput] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);   //to toggle between editing state and submiting or adding state.
  const [alert, setAlert] = useState({show: false, msg:'', type:''})
  const [editID, setEditID] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!userInput){
      // display warning alert
      showAlert(true, "danger", "Please enter a valid input")
    }else if(userInput && isEditing){
      //we have to deal with editing task
      setList(list.map((item)=>{
      if(item.id === editID){
        return {...item, title: userInput}
      }
      return item;
      }))
      setUserInput('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Item edited successfully")
    }else{
      //show alert
      showAlert(true, "success" ,"item added successfully :)")
      const newItem = {id: new Date().getTime().toString(), title: userInput}
      setList([...list, newItem]); // list is an array of objects
      setUserInput('');
    }
  }

  const showAlert = (show=false, type='', msg='') => {
    setAlert({show:show, type:type, msg:msg })
  }
  
  const clearList = () => {
    showAlert(true, "success", "List is cleared")
    setList([]);
  }

  const removeItem = (id) => {
   showAlert(true, "danger", "Item Removed :( ");
  //  let newList = list.filter((item) => item.id !== id)
   setList(list.filter((item)=> item.id!==id));
  }

  const editItem = (id) => {
   const specificItem = list.find((item)=> item.id == id);
   setIsEditing(true);
   setEditID(id);
   setUserInput(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list',JSON.stringify(list));
  },[list])

  return (
    <section className="section-center">
       <form className="grocery-form" onSubmit={handleSubmit}>
         {alert.show && <Alert {...alert} showAlert={showAlert} list={list}/>}
         <h3>Grocery List</h3>
         <div className="form-control">
           <input type="text" className='grocery' placeholder='eg. eggs' value={userInput} onChange={(e)=>setUserInput(e.target.value)}/>
           <button className="submit-btn">{isEditing ? 'save' : 'ADD'}</button>
         </div>
       </form>
       {list.length > 0 && (
        <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className="clear-btn" onClick={clearList}>Clear All</button>
      </div>
       ) }
      
    </section>
  )
}

export default App
