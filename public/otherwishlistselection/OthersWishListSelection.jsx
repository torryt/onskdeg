// @flow

import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Link } from 'react-router';

import AddedUserLink from './addeduserlink/AddedUserLink';
import DeleteUserDropTarget from './DeleteUserDropTarget';
import store from '../store';
import userlistFirebase from '../users/userlistFirebase';
import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import user from '../common/User';
import AddableUsers from './addableusers/AddableUsers';

const debug = require('debug')('OthersWishListSelection');
const DragDropContext = require('react-dnd').DragDropContext;

require('./otherswishlistselection.css');

class OthersWishListSelection extends React.Component {

  static componentDidUnmount() {
    debug('componentDidUnmount');

    userlistFirebase.unsubscribe();
  }

  getInitialState() {
    debug('getInitialState');
    return {
      users: [],
      newUser: '',
      feedback: '',
    };
  }

  componentDidMount() {
    debug('componentDidMount');

    debug('this.state.users', this.state.users);
    this.getUsers();
    userlistFirebase.subscribe();
  }

  getUsers() {
    debug('getUsers');

    const ref = firebase.database().ref(`users/${user.getUserUid()}`);
    ref.on('value', (snapshot) => {
      if (snapshot.val() != null) {
        const list = snapshot.val().users;
        debug('data :', list);

        this.setState({ users: list });
      }
    });
  }

  updateUserState(e) {
    debug('updateUserState');

    this.setState({ newUser: e.target.value });
  }

  addUserLinkClick(uid) {
    debug('addUserLinkClick', uid);

    const userfromdb = store.getState().allUserReducer.filter(userdb =>
        userdb.uid === uid)[0];
    this.addUser(userfromdb.email);
  }

  addUserClickEvent(e) {
    debug('addUserClickEvent', e);

    e.preventDefault();
    this.addUser(this.state.newUser);
  }

  addUser(newUserMail) {
    debug('addUserClickEvent', newUserMail);

    const users = store.getState().allUserReducer;

    const userfromdb = users.filter((userdb) => {
      if (userdb.email === newUserMail) {
        return true;
      }
      return false;
    })[0];

    debug('User from db : ', userfromdb);

    if (userfromdb) {
      if (this.state.users.filter(stateUser => stateUser.email === newUserMail).length === 1) {
        this.setState({ feedback: 'Brukeren er lagt til fra før' });
      } else if (newUserMail === user.getUserEmail()) {
        this.setState({ feedback: 'Du har ikke lov å legge til deg selv' });
      } else {
        const newList = this.state.users.concat([userfromdb]);

        debug('New list: ', newList);
        firebase.database().ref(`users/${user.getUserUid()}`).set({ users: newList });
        this.setState({ newUser: '' });
      }
    } else {
      this.setState({ feedback: 'Denne brukeren finnes ikke' });
    }
  }

  deleteUser(email) {
    debug('deleteUser', email);

    const userList = this.state.users.slice();
    const newUserList = userList.filter(stateUser => stateUser.email !== email);

    firebase.database().ref(`users/${user.getUserUid()}`).set({ users: newUserList });
    if (newUserList.length === 0) {
      this.setState({
        users: [],
      });
    }
  }

  render() {
    const users = this.state.users.map(el => (<AddedUserLink el={el} />));

    /* This is removed until further notice
    <form onSubmit={this.addUserClickEvent}>
        <p>Legg til</p>
        <input value={this.state.newUser} onChange={this.updateUserState}></input>
        <input type="submit"/>
    </form>*/

    return (<Container>

      <div className="flex-row space-between">
        <h1>Andres ønskeliste</h1>
        <Link className="shrink button-navigation smallspace" to="/choosepath">Tilbake</Link>
      </div>
      <hr />

      <h2>Se ønskeliste til</h2>
      <div className="wishlist-selection__added-users-container">
        {users}
      </div>

      <DeleteUserDropTarget delete={this.deleteUser} />
      <AddableUsers addUser={this.addUserLinkClick} />

      <p>{this.state.feedback}</p>

    </Container>);
  }
}

module.exports = DragDropContext(HTML5Backend)(OthersWishListSelection);
