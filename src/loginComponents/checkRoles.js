import React, { Component } from 'react'

/*
***EXAMPLE***
     <AuthorizedElement fatherState={props} roleNeeded={"admin"} groupNeeded={"admins"}></AuthorizedElement>
*/

export class AuthorizedElement extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    if (
      this.props.fatherState.keycloak.hasRealmRole(this.props.roleNeeded) &&
      this.props.fatherState.groups.indexOf(this.props.groupNeeded) > -1
    ) {
      return this.props.children
    } else {
      return false
    }
  }
}
