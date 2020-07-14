import React from 'react';

import { renderRoutes } from 'react-router-config';
import TodoFooter from './footer';
import utils from './utils';
import fetch from 'cross-fetch';
import swearjar from 'swearjar';
import { Logo } from '../assets';

const ENTER_KEY = 13;
//const API_URL = "https://2e210d2b-bb7b-4c4e-b2bb-98df1baff4a5-us-east1.apps.astra.datastax.com/api/rest/v1";
const API_URL = "/api/rest/v1";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: [],
      loading: 1,
      authToken: ''
    };
  }

  loading(inc) {
    this.setState({ loading: this.state.loading + inc })
  }

  authAndLoadTodo() {
    console.log("Auth");
    this.loading(1)
    return fetch(API_URL + "/auth" ,
      { 
          "headers": {
            "accept": "*/*",
            "content-type": "application/json",
          },
          "body": "{\"username\":\"datastax\",\"password\":\"datastax\"}",
          "method": "POST",
      }).
      then(res => res.json()).then(response => {
        console.log("Got auth response: ", response);
        this.setState( response );
        this.loading(-1)
        this.loadTodo()
      }).catch(err => { this.loading(-1); console.error("Failed uth", err) });

  }

  deleteTodo(todo) {
    console.log("Deleting", todo);
    this.loading(1)
    var columns = { "columns": Object.keys(todo).map(i => {return {"name": i, "value":todo[i] }}) };
    return fetch(API_URL + "/keyspaces/free/tables/todolist/rows/"+ this.state.sessionId + ";" + todo.id, { method: "DELETE",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "x-cassandra-request-id": "bla",
          "x-cassandra-token": this.state.authToken,
        }
      }).
      then(res => res.json()).then(response => {
        console.log("Got delete response: ", response);
        this.loading(-1)
      }).catch(err => { this.loading(-1); console.error("Failed deleting todo", err) })

  }

  addTodo(todo) {
    if (todo.id === undefined) {
      todo.id = utils.uuid();
    }
    todo["list_id"] =  this.state.sessionId;
    console.log("Adding", todo);
    this.loading(1)
    var columns = { "columns": Object.keys(todo).map(i => {return {"name": i, "value":todo[i] }}) };
    return fetch(API_URL + "/keyspaces/free/tables/todolist/rows" , { method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "x-cassandra-request-id": "bla",
          "x-cassandra-token": this.state.authToken,
        },
        body: JSON.stringify(columns)
      }).
      then(res => res.json()).then(response => {
        console.log("Got add response: ", response);
        this.loading(-1)
      }).catch(err => { this.loading(-1); console.error("Failed adding todo", err) })
  }

  updateTodo(todo) {
    return this.addTodo(todo);
  }

  loadTodo() {
    console.log("Fetching all todos");
    this.loading(1)
    return fetch(API_URL + "/keyspaces/free/tables/todolist/rows/" + this.state.sessionId , {
        "headers": {
          "x-cassandra-request-id": "bla",
          "x-cassandra-token": this.state.authToken,
        }
      }).then(res => res.json()).then(todos => {
      console.log("Got all todos", todos);
      if (JSON.stringify(todos).includes("no row found for primary key")){
        todos = [];
      }else{
        todos = todos.rows;
      }
      this.setState({ todos });
      this.loading(-1)
    }).catch(err => { this.loading(-1); console.error("Failed fetching todos", err) })
  }

  componentDidMount() {
    // Reset initial loading

    const params = new URLSearchParams(window.location.search);
    let sid = params.get('session-id') || utils.store("session-id")

    if (!sid) {
      sid = utils.uuid()
      utils.store("session-id", sid)
    }

    console.log("Got Session: " + sid)


    this.setState(
        {
          loading: 0, sessionId: sid
        },
        function () {
          this.authAndLoadTodo()
        },
    )
  }

  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.addTodo({
        id: utils.uuid(),
        title: swearjar.censor(val),
        completed: false
      }).then(() => {
        this.loadTodo().then(() => {
          this.setState({ newTodo: '' })
        })
      });
    }
  }

  toggleAll(event) {
    const { checked } = event.target;
    Promise.all(this.state.todos.map(todo =>
        this.updateTodo(Object.assign({}, todo, { completed: checked })))).then(() => {
      this.loadTodo();
    })
  }

  toggle(todo) {
    this.updateTodo(Object.assign({}, todo, { completed: !todo.completed })).then(() => {
      this.loadTodo();
    })
  }

  destroy(todo) {
    this.deleteTodo(todo).then(() => {
      this.loadTodo();
    })
  }

  edit(todo) {
    this.setState({ editing: todo.id });
  }

  save(todo, text) {
    this.updateTodo(Object.assign({}, todo, { title: swearjar.censor(text) })).then(() => {
      this.loadTodo().then(() => {
        this.setState({ editing: null })
      })
    })
  }

  cancel() {
    this.setState({ editing: null });
  }

  clearCompleted() {
    const todel = this.state.todos.filter(todo => todo.completed);
    const del = todel.map(todo => this.deleteTodo(todo))
    Promise.all(del).then(() => {
      this.loadTodo();
    })
  }

  render() {
    let footer;
    let main;
    const { todos } = this.state;

    const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);

    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
          (<TodoFooter
              count={activeTodoCount}
              completedCount={completedCount}
              nowShowing={this.props.location.pathname}
              sessionId={this.state.sessionId}
              onClearCompleted={() => { this.clearCompleted(); }}
          />);
    }

    if (todos.length) {
      main = (
          <section className="main">
            <input
                className="toggle-all"
                type="checkbox"
                onChange={this.toggleAll}
                checked={activeTodoCount === 0}
            />
            <ul className="todo-list">
              {
                renderRoutes(this.props.route.routes, {
                  todos,
                  onToggle: (todo) => { this.toggle(todo); },
                  onDestroy: (todo) => { this.destroy(todo); },
                  onEdit: (todo) => { this.edit(todo); },
                  editing: todo => this.state.editing === todo.id,
                  onSave: (todo, text) => { this.save(todo, text); },
                  onCancel: () => this.cancel(),
                })
              }
            </ul>
          </section>
      );
    }

    return (
        <div>
          <header className="header">
            <h1>
              <img src={Logo}/>
              Astra todos
              { this.state.loading > 0 ? <div className="spinner"></div> : <span/> }
            </h1>
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={this.state.newTodo}
                onKeyDown={(event) => { this.handleNewTodoKeyDown(event); }}
                onChange={(event) => { this.handleChange(event); }}
                autoFocus
            />
          </header>
          {main}
          {footer}
        </div>
    );
  }
}

export default TodoApp;
