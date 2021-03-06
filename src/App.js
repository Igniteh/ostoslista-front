import './App.css';
import {useState, useEffect} from 'react';

const URL = "https://localhost/todo2/";

function App() {
  const [tasks,setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'index.php')
      .then(res => {
        status = parseInt(res.status);
        return res.json()
      })
      .then(
        (res) => {
          if (status === 200) {
            setTasks(res);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert('Järjestelmässä virhe yritä uudelleen myöhemmin!');
        }
      )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: task
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then (
      (res) => {
        if (status === 200) {
          setTasks(tasks => [...tasks,res]);
          setTask('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error)
      }
    )
  }

  function remove (id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then (
      (res) => {
        if (status === 200) {
          const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
          setTasks(newListWithoutRemoved);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  return (
    <div className="container">
      <h3>Todo list</h3>
      <div>
        <form onSubmit={save}>
          <label>New task</label>
          <input value={task} onChange={e => setTask(e.target.value)} />
          <button>Save</button>
        </form>
      </div>
        <ol>
          {tasks.map(task => (
            <li key={task.id}>{task.description}<a className="delete" onClick={() => remove(task.id)} href="#">Delete</a></li>
          ))}
        </ol>
      </div>
    )
  }
export default App;
