import React from 'react'
import Container from '../../common/container/Container';
import { Link } from 'react-router';
var debug = require('debug')('OthersWishList');
var config = require('../../Config');
var database = require('../../common/gun/gun')

export default React.createClass({

  getInitialState() {
    return {
      wishes: [],
      hideSelected: false
    }
  },

  componentDidMount() {
    this.updateWishState();

  },

  updateWishState() {

    debug("Wish state update");

    var that = this;

    var ref = database.ref('wishes/'+this.props.params.name.toLowerCase());
    ref.on('value', function(snapshot) {
      if(snapshot.val() != null ) {
        var list = snapshot.val().wishes;
        debug("data :", list);

        that.setState({
          wishes: list
        });
      }
    });
  },

  check(event) {
    debug("Check!", event.target.value);
    var newWishList = this.state.wishes.map(function(e) {
        if(event.target.value === e.id) {
          return {
            name: e.name,
            checked: !e.checked,
            id: e.id
          }
        }
        else {
          return e;
        }
    });
    database.ref('wishes/'+this.props.params.name.toLowerCase()).set({wishes: newWishList});
    this.setState({
      wishes: newWishList,
      newWish: ""
    })
  },

  toggleShowSelected() {
    this.setState({
      hideSelected: !this.state.hideSelected
    })
  },

  render() {
    var wishes = this.state.wishes.filter(function(el) {
      debug("EL: ", el);
      return !el.checked || !this.state.hideSelected;
    },this).map(function(el) {
      var item = el.checked ? (<del>{el.name}</del>) : el.name;
      return (<li>{item}<input onChange={this.check} checked={el.checked} value={el.id} type="checkbox"></input></li>);
    },this);

    return <Container>Ønskelisten til {this.props.params.name}
    <ul>
      {wishes}
    </ul>

    <button onClick={this.toggleShowSelected}>{this.state.hideSelected ? 'Vis utkrysset': 'Skjul utkrysset'}</button>


    <li><Link to="/">Tilbake</Link></li>
    </Container>
  }
})
