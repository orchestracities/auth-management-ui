import React from 'react';
import { Navigate } from 'react-router-dom';

/*
***EXAMPLE***
<AuthorizedElement tokenDecoded={props} tenantNeeded={"Tenant1"} roleNeeded={"tenant-admin"} groupNeeded={"admins"} iSuperAdmin={"false"}></AuthorizedElement>
*/

export class AuthorizedElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var roles = [];
    var groups = [];
    // token was not ready yet or not provided
    if (typeof this.props.tokenDecoded === 'undefined' || this.props.tokenDecoded.length === 0) {
      return false;
    }

    // compute groups and roles
    if (this.props.tokenDecoded && this.props.thisTenant && this.props.tenantValues) {
      const tenantFiltered = this.props.tenantValues.filter((e) => e.id === this.props.thisTenant);
      const tenantName = tenantFiltered[0].props.name;
      roles = this.props.tokenDecoded.tenants[tenantName].roles;
      groups = this.props.tokenDecoded.tenants[tenantName].groups;
    }

    // applies policies based on content of the token
    if (this.props.tokenDecoded && this.props.tokenDecoded.is_super_admin === this.props.iSuperAdmin) {
      return this.props.children;
    } else if (this.props.roleNeeded && roles.includes(this.props.roleNeeded)) {
      return this.props.children;
    } else if (this.props.groupNeeded && groups.includes(this.props.groupNeeded)) {
      return this.props.children;
    } else if (
      typeof this.props.groupNeeded === 'undefined' &&
      typeof this.props.roleNeeded === 'undefined' &&
      typeof this.props.iSuperAdmin === 'undefined'
    ) {
      return this.props.children;
    } else if (this.props.redirect) {
      return <Navigate to="/403" />;
    } else {
      return false;
    }
  }
}
