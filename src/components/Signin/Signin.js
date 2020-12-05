import React, { Component, Fragment } from 'react';

class Signin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            singInEmail: '',
            singInPassword: ''
        }
    }

    onEmailChange = e => {
        this.setState({ singInEmail: e.target.value })
    }
    
    onPasswordChange = e => {
        this.setState({ singInPassword: e.target.value })
    }

    onSubmitSignIn = () => {
        const fetchData = async () => {
            const resp = await fetch('http://localhost:3000/signin', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.singInEmail,
                    password: this.state.singInPassword
                })
            })
            const user = await resp.json()
            if (user.id) {
                this.props.loadUser(user)
                this.props.onRouteChange('home')
            } 
        }

        fetchData()
    }

    render() {
        const { onRouteChange } = this.props

        return (
            <Fragment>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" required/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" required/>
                        </div>
                        </fieldset>
                        <div className="">
                        <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" onClick={this.onSubmitSignIn} />
                        </div>
                        <div className="lh-copy mt3">
                            <a href="#0" className="f6 link dim black db" onClick={() => {
                                onRouteChange('register')
                            }} >Register</a>
                        </div>
                    </div>
                    </main>
                </article>
            </Fragment>
        );
    }
};

export default Signin;