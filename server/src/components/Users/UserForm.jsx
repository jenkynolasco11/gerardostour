import React, { PureComponent as Component } from 'react'
// import { connect } from 'react-redux'

// import { retrieveUsers } from '../../store-redux/actions'

class UserForm extends Component{
  constructor(props) {
    super(props)

    const { firstname = '', lastname = '', username = '', password = '', phoneNumber = '' } = props

    this.state = {
      firstname,
      lastname,
      password,
      username,
      phoneNumber,
    }
  }

  render() {
    const { firstname, lastname, username, password, phoneNumber } = this.state
    return (
      <div className="users__add">
        <label>
          <input
            placeholder="First Name"
            value={ firstname }
            required
            name="firstname"
            type="text"
            onChange={ e => this.onChange(e, 'firstname') }
          />
          <input
            placeholder="Last Name"
            value={ lastname }
            required
            name="lastname"
            type="text"
            onChange={ e => this.onChange(e, 'lastname') }
          />
          <input
            placeholder="Username"
            value={ username }
            required
            name="username"
            type="text"
            onChange={ e => this.onChange(e, 'username') }
          />
          <input
            placeholder="Password"
            value={ password }
            required
            name="password"
            type="password"
            onChange={ e => this.onChange(e, 'password') }
          />
          <input
            placeholder="Phone Number"
            value={ phoneNumber }
            required
            name="phoneNumber"
            type="tel"
            onChange={ e => this.onChange(e, 'phoneNumber') }
          />
          {/*<input value={name} name="username" type="text" onChange={ e => this.onChange(e, 'username') }/>*/}
          <div className="submit-buttons">
            <input
              className="submit-button cancel"
              type="submit"
              value="Cancel"
              onClick={ () => this.submit('cancel') }
            />
            <input
              className="submit-button save"
              type="submit"
              value="Save"
              onClick={ () => this.submit('submit') }
            />
          </div>
        </label>
      </div>
    )
  }
}

// const mapStateToProps = state => {
//   const { users } = state.users

//   return { users }
// }

// const mapDispatchToProps = dispatch => ({
//   //
//   getUsers : (limit = 10, skip = 0, type = 'ADMIN') => dispatch(retrieveUsers({ limit, skip, type }))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(UserList)
export default UserForm
