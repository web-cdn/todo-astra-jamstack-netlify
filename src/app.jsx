import React from 'react';
import {renderRoutes} from 'react-router-config';
import TodoFooter from './footer';
import utils from './utils';
import fetch from 'cross-fetch';
import {Logo} from '../assets';
import {
  ASTRA_DB_USERNAME,
  ASTRA_DB_PASSWORD,
  ASTRA_DB_KEYSPACE,
  API_ENDPOINT,
  TABLE_NAME,
  ENTER_KEY
} from './config';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: [],
      loading: 1,
      authToken: '',
    };
  }

  componentDidMount() {
    // Reset initial loading

    const params = new URLSearchParams(window.location.search);
    let sid = params.get('session-id') || utils.store('session-id');

    if (!sid) {
      sid = utils.uuid()
      utils.store('session-id', sid)
    }
    this.setState(
      {
        loading: 0, sessionId: sid
      },
      function () {
        this.authAndLoadTodo()
      },
    )
  }

  loading(inc) {
    this.setState({loading: this.state.loading + inc})
  }

  async authAndLoadTodo() {
    this.loading(1);
    const response = await fetch(`${API_ENDPOINT}/auth`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: ASTRA_DB_USERNAME,
        password: ASTRA_DB_PASSWORD,
      }),
    }).then(res => res.json())
    this.setState(response);
    this.loading(-1);
    await this.loadTodo()
  }

  async deleteTodo(todo) {
    const {authToken} = this.state;
    this.loading(1);
    await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${todo.list_id};${todo.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-cassandra-token': authToken,
      }
    })
    this.loading(-1)
  }

  async addTodo(todo) {
    if (!todo.id) {
      todo.id = utils.uuid();
    }
    todo['list_id'] = this.state.sessionId;
    this.loading(1);
    const columns = {
      columns: Object.keys(todo).map(i => {
        return {
          name: i,
          value: todo[i]
        }
      })
    };
    await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cassandra-token': this.state.authToken,
      },
      body: JSON.stringify(columns)
    })
    this.loading(-1)
  }

  updateTodo(todo) {
    return this.addTodo(todo);
  }

  async loadTodo() {
    this.loading(1);
    const response = await fetch(`${API_ENDPOINT}/keyspaces/${ASTRA_DB_KEYSPACE}/tables/${TABLE_NAME}/rows/${this.state.sessionId}`, {
      headers: {
        'x-cassandra-token': this.state.authToken,
      }
    }).then(res => res.json())
    this.setState({todos: !response.rows ? [] : response.rows})
    this.loading(-1)
  }

  handleChange(event) {
    this.setState({newTodo: event.target.value});
  }

  async handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      await this.addTodo({
        id: utils.uuid(),
        title: val,
        completed: false
      })
      await this.loadTodo()
      await this.setState({newTodo: ''})
    }
  }

  async toggleAll(event) {
    const {checked} = event.target;
    await Promise.all(this.state.todos.map(async todo =>
      await this.updateTodo(Object.assign({}, todo, {completed: checked}))))
    await this.loadTodo()
  }

  async toggle(todo) {
    await this.updateTodo(Object.assign({}, todo, {completed: !todo.completed}))
    await this.loadTodo()
  }

  async destroy(todo) {
    await this.deleteTodo(todo)
    await this.loadTodo()
  }

  edit(todo) {
    this.setState({editing: todo.id});
  }

  async save(todo, text) {
    await this.updateTodo(Object.assign({}, todo, {title: text}))
    await this.loadTodo()
    await this.setState({editing: null})
  }

  cancel() {
    this.setState({editing: null});
  }

  async clearCompleted() {
    const todel = this.state.todos.filter(todo => todo.completed);
    const del = todel.map(todo => this.deleteTodo(todo));
    await Promise.all(del)
    await this.loadTodo()
  }

  render() {
    let footer, main;
    const {todos, loading, sessionId, editing, newTodo} = this.state;
    const activeTodoCount = todos.reduce((accum, todo) => (todo.completed ? accum : accum + 1), 0);
    const completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        (<TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.props.location.pathname}
          sessionId={sessionId}
          onClearCompleted={() => this.clearCompleted()}
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
                onToggle: todo => this.toggle(todo),
                onDestroy: todo => this.destroy(todo),
                onEdit: todo => this.edit(todo),
                editing: todo => editing === todo.id,
                onSave: (todo, text) => this.save(todo, text),
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
            <img alt={'Logo'} src={Logo}/>
            Astra todos
            {loading > 0 ? <div className="spinner"/> : <span/>}
          </h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onKeyDown={(event) => this.handleNewTodoKeyDown(event)}
            onChange={(event) => this.handleChange(event)}
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
