import Clarifai from 'clarifai';
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
}

const app = new Clarifai.App({apiKey: 'c29b4a250a104d45a662baef26db2d06'});

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = data => {
    const { id, name, email, entries, joined } = data
    this.setState({
      user: {
        id,
        name,
        email,
        entries,
        joined
      }
    })
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.querySelector('#inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    
  }

  displayFaceBox = box => {
    this.setState({ box })
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:2002/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              // this.setState(Object.assign(this.state.user, { entries: count.entries }))
              this.setState({user: count})
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(console.log)
  }

  onRouteChange = route => {
    if(route === 'signin' || route === 'register') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route })
  }

  render () {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
        <Particles
            className='particles'
            params={particlesOptions} 
          />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
          { route === 'home'
            ? <React.Fragment>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onSubmit}
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
              </React.Fragment>
            : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
              )
        }
      </div>
    );
  }
}

export default App;
