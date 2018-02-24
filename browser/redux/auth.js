import axios from 'axios';

//action types
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

const setCurrentUser = user => {
  const action = {
    type: SET_CURRENT_USER,
    user
  }
  return action;
}

export const removeCurrentUser = () => {
  const action = {
    type: REMOVE_CURRENT_USER
  }
  return action;
}

export default function reducer (currentUser = {}, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.user;
    case REMOVE_CURRENT_USER:
      return {};
    default:
      return currentUser;
  }
}

export const login = (credentials, history) => dispatch => {
  console.log('credentials', credentials, history)
  axios.put('/api/sessions', credentials)
    .then(res => setUserAndRedirect(res.data, history, dispatch))
    .catch(err => console.error(`Logging in with ${credentials.email} and ${credentials.password} was unsuccesful`, err));
};

export const signUp = (user, history) => dispatch => {
  console.log('user', user, 'history', history)
  axios.post('/api/sessions', user)
  .then(res => setUserAndRedirect(res.data, history, dispatch))
  .catch(err => console.error(`Creating user: ${user} unsuccesful`, err));
};

function setUserAndRedirect (user, history, dispatch) {
  dispatch(setCurrentUser(user));
  history.push(`/users/${user.id}`)
}

export const fetchCurrentUser = () => dispatch => {
  console.log('fetching current user')
  axios.get('/api/sessions')
    .then(res => {
      console.log(res.data, 'data from axios')
    dispatch(setCurrentUser(res.data));
    })
}
