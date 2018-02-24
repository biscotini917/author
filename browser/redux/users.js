import axios from 'axios';

/* -----------------    ACTION TYPES    ------------------ */

const INITIALIZE = 'INITIALIZE_USERS';
const CREATE     = 'CREATE_USER';
export const REMOVE = 'REMOVE_USER';
const UPDATE     = 'UPDATE_USER';

/* ------------     ACTION CREATORS      ------------------ */

const init  = users => ({ type: INITIALIZE, users });
const create = user  => ({ type: CREATE, user });
const remove = id    => ({ type: REMOVE, id });
const update = user  => ({ type: UPDATE, user });

/* ------------          REDUCER         ------------------ */

export default function reducer (users = [], action) {
  switch (action.type) {

    case INITIALIZE:
      return action.users;

    case CREATE:
      return [action.user, ...users];

    case REMOVE:
      return users.filter(user => user.id !== action.id);

    case UPDATE:
      return users.map(user => (
        action.user.id === user.id ? action.user : user
      ));

    default:
      return users;
  }
}

/* ------------       THUNK CREATORS     ------------------ */

export const fetchUsers = () => dispatch => {
  console.log('fetching userssss');
  axios.get('/api/users')
       .then(res => dispatch(init(res.data)));
};

export const removeUser = id => dispatch => {
  console.log('fetching removed users')
  axios.delete(`/api/users/${id}`)
       .then(() => dispatch(remove(id)))
       .catch(err => console.error(`Removing user: ${id} unsuccesful`, err));
};

export const updateUser = (id, user) => dispatch => {
  console.log('fetching? updated')
  axios.put(`/api/users/${id}`, user)
       .then(res => dispatch(update(res.data)))
       .catch(err => console.error(`Updating user: ${user} unsuccesful`, err));
};
