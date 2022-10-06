import React from 'react';

/*
***EXAMPLE***
     <AuthorizedElement isSuperAdmin={props} roleNeeded={"admin"} groupNeeded={"admins"}></AuthorizedElement>
*/

export class AuthorizedElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.iSuperAdmin) {
      return this.props.children;
    } else {
      return false;
    }
  }
}
