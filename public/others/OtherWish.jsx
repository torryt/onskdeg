// @flow
import React from 'react';
import Linkify from 'react-linkify';
import store from '../store';

const debug = require('debug')('OtherWish');

class OtherWish extends React.Component {

  render() {
    const checkedBy = store.getState().allUserReducer.filter(user =>
      user.email === this.props.wishInfo.checkedby)[0];

    const suggestedBy = store.getState().allUserReducer.filter((user) => {
      if (!this.props.suggestedBy) {
        return false;
      }
      return user.email === this.props.suggestedBy;
    })[0];
    const suggestedByUser = suggestedBy
        ? (
          <div className="smallspace">Foreslått av {suggestedBy.name}</div>
        )
        : '';

    const item = this.props.wishInfo.checked
        ? (
          <del>{this.props.wishInfo.name}</del>
        )
        : this.props.wishInfo.name;
    const linkifyed = (
      <Linkify className="other-wish__linkify">{item}</Linkify>
    );
    const checkedByElem = this.props.wishInfo.checked
        ? (
          <div className="smallspace">Tatt av {checkedBy.name}</div>
        )
        : '';
    const checkedText = this.props.wishInfo.checked
        ? 'Selg'
        : 'Kjøp';

    return (
      <div className="flex-column border">
        <div className="smallspace">{linkifyed}</div>
        <div className="smallspace flex-row space-between">
          <input
            className="button"
            onClick={e => this.props.onClick(this.props.wishInfo.id)}
            value={checkedText}
          />
        </div>
        {suggestedByUser}
        {checkedByElem}
      </div>
    );
  }
}

OtherWish.propTypes = {
  wishInfo: React.PropTypes.object,
  suggestedBy: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default OtherWish;
