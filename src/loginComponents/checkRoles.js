import React from 'react';

/*
***EXAMPLE***
<AuthorizedElement tokenDecoded={props} tenantNeeded={"Tenant1"} roleNeeded={"tenant-admin"} groupNeeded={"admins"} iSuperAdmin={"false"}></AuthorizedElement>
*/

export class AuthorizedElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.tokenDecoded.is_super_admin === this.props.iSuperAdmin) {
      return this.props.children;
    } else {
      return false;
    }
  }
}
