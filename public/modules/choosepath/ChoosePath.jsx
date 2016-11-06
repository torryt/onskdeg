var React = require('react');

import { Link } from 'react-router';
import Container from '../../common/container/Container';
import { withRouter } from 'react-router';
var user = require('../../common/User');

require('./choosepath.css')

var ChoosePath = React.createClass( {

  componentDidMount() {
    if(user.getUserUid() == undefined) {
      this.props.router.push('/')
    }
  },

  render: function() {

    //<Link className="ChoosePath__anchor-link button" to="/">Bytt bruker</Link>

    return (
      <Container>
        <h1>Velg</h1>
        <div className="ChoosePath__list">
          <Link className="ChoosePath__anchor-link button" to="/yours">Din ønskeliste</Link>
          <Link className="ChoosePath__anchor-link button" to="/others">Andres ønskelister</Link>
        </div>
      </Container>
    );
  }
})

module.exports = ChoosePath;
