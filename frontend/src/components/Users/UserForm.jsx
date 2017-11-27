import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

// import { retrieveUsers } from '../../store-redux/actions'

class UserForm extends Component{
  constructor(props) {
    super(props)

    console.log(props)
    const { firstname = '', lastname = '', username = '', password = '', phoneNumber = '', personid = '', _id = '', type = 'NONE' } = props.user

    this.state = {
      firstname,
      lastname,
      password,
      username,
      _id,
      personid,
      type,
      // phoneNumber : this.formatNumber(phoneNumber),
      phoneNumber,
    }

    this.onChange = this.onChange.bind(this)
  }

  formatNumber(number) {
    // console.log(`Number => ${ number }`)
    if(!number) return ''

    const num = '' + number
    const regx = num.replace(/\D/g,'').match(/(\d{3})(\d{3})(\d{4})/)

    // console.log(`Regex => ${ regx ? regx : '' }`)

    return regx
            ? ''
            : `(${ regx[ 1 ] }) ${ regx[ 2 ] }-${ regx[ 3 ] }`
  }

  onChange(e, name) {
    let val = e.target.value

    // if(name === 'phoneNumber') val = this.formatNumber(val)

    this.setState({
      ...this.state,
      [ name ] : val
    })
  }

  onSubmit(type) {
    console.log(`About to ${ type }`)
    // if(type === 'cancel') window.location.href =
  }

  render() {
    const { 
      firstname, 
      lastname, 
      username, 
      password, 
      phoneNumber, 
      _id, 
      type, 
      personid 
    } = this.state

    return (
      <div className="users__add">
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
          pattern="(\d{3}) (\d{3})-(\d[4])"
          type="tel"
          onChange={ e => this.onChange(e, 'phoneNumber') }
        />
        <select onChange={ e => this.onChange(e, 'type') } value={ type }>
          {
            ['ADMIN', 'CHAUFFER', 'NONE'].map((itm, indx) => (
              <option key={indx} value={itm}>{ itm }</option>
            ))
          }
        </select>
        {/*<input value={name} name="username" type="text" onChange={ e => this.onChange(e, 'username') }/>*/}
        <div className="submit-buttons">
          <input
            className="submit-button cancel"
            type="submit"
            value="Cancel"
            onClick={ () => this.onSubmit('cancel') }
          />
          <input
            className="submit-button save"
            type="submit"
            value="Save"
            onClick={ () => this.onSubmit('submit') }
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { passingProps } = state.router

  return { user : passingProps }
}

// const mapDispatchToProps = dispatch => ({
//   //
//   getUsers : (limit = 10, skip = 0, type = 'ADMIN') => dispatch(retrieveUsers({ limit, skip, type }))
// })

export default connect(mapStateToProps/*, mapDispatchToProps*/)(UserForm)
// export default UserForm
