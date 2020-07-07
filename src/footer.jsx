import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import utils from './utils';
import enums from './enums';

const PUBLIC_PATH = process.env.PUBLIC_PATH || (typeof window !== 'undefined' ? window.location.pathname : '/')

export default function Footer(props) {
  const activeTodoWord = utils.pluralize(props.count, 'item');
  const { nowShowing, sessionId } = props;
  return (
    <footer className="footer">
      
      <span className="todo-count">
        <strong>{props.count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link
            to={PUBLIC_PATH + "all"}
            className={
              classNames({
                selected: !nowShowing.endsWith(enums.ACTIVE_TODOS) && !nowShowing.endsWith(enums.COMPLETED_TODOS),
              })
            }
          >
            All
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to={PUBLIC_PATH + "active"}
            className={classNames({ selected: nowShowing.endsWith(enums.ACTIVE_TODOS) })}
          >
            Active
          </Link>
        </li>
        {' '}
        <li>
          <Link
            to={PUBLIC_PATH + "completed"}
            className={classNames({ selected: nowShowing.endsWith(enums.COMPLETED_TODOS) })}
          >
              Completed
          </Link>
        </li>
      </ul>
      {
        props.completedCount ?
          <button className="clear-completed" onClick={props.onClearCompleted}>
            Clear completed
          </button>
          :
          null
      }
      <div className="session">
        <a href={PUBLIC_PATH + "?session-id=" + sessionId} target="_blank">Share session</a>
      </div>
    </footer>
  );
}
