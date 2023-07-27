import {Switch, Route, Redirect} from 'react-router-dom'

import {Component} from 'react'

import Context from './Context/Context'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import VideoItemDetails from './components/VideoItemDetails'
import SavedVideos from './components/SavedVideos'
import NotFound from './components/NotFound'

import './App.css'

class App extends Component {
  state = {
    darkTheme: true,
    sidebarId: '',
    savedVideos: [],
    likedVideos: [],
    dislikedVideos: [],
  }

  toggleTheme = () => {
    this.setState(prevState => ({darkTheme: !prevState.darkTheme}))
  }

  changeSidebarId = id => {
    this.setState({sidebarId: id})
  }

  addLikeVideos = video => {
    const {likedVideos, dislikedVideos} = this.state
    const videoPresent = likedVideos.find(each => each.id === video.id)

    if (!videoPresent) {
      this.setState(prevState => ({
        likedVideos: [...prevState.likedVideos, video],
      }))
    } else {
      const updatedVideos = likedVideos.filter(each => each.id !== video.id)
      this.setState({likedVideos: updatedVideos})
    }
    const updatedDislikeVideos = dislikedVideos.filter(
      each => each.id !== video.id,
    )
    this.setState({dislikedVideos: updatedDislikeVideos})
  }

  addDislikeVideos = video => {
    const {dislikedVideos, likedVideos} = this.state
    const videoPresent = dislikedVideos.find(each => each.id === video.id)

    if (!videoPresent) {
      this.setState(prevState => ({
        dislikedVideos: [...prevState.dislikedVideos, video],
      }))
    } else {
      const updatedVideos = dislikedVideos.filter(each => each.id !== video.id)
      this.setState({dislikedVideos: updatedVideos})
    }
    const updatedLikeVideos = likedVideos.filter(each => each.id !== video.id)
    this.setState({likedVideos: updatedLikeVideos})
  }

  addVideos = video => {
    const {savedVideos} = this.state
    const videoPresent = savedVideos.find(each => each.id === video.id)

    if (!videoPresent) {
      this.setState(prevState => ({
        savedVideos: [...prevState.savedVideos, video],
      }))
    } else {
      const updatedVideos = savedVideos.filter(each => each.id !== video.id)
      this.setState({savedVideos: updatedVideos})
    }
  }

  deleteVideos = video => {
    const {savedVideos} = this.state

    const updatedVideos = savedVideos.filter(each => each.id !== video.id)

    this.setState({savedVideos: updatedVideos})
  }

  render() {
    const {
      darkTheme,
      sidebarId,
      likedVideos,
      dislikedVideos,
      savedVideos,
    } = this.state
    console.log(savedVideos)

    return (
      <Context.Provider
        value={{
          darkTheme,
          sidebarId,
          savedVideos,
          likedVideos,
          dislikedVideos,
          toggleTheme: this.toggleTheme,
          changeSidebarId: this.changeSidebarId,
          addVideos: this.addVideos,
          deleteVideos: this.deleteVideos,
          addLikeVideos: this.addLikeVideos,
          addDislikeVideos: this.addDislikeVideos,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetails}
          />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </Context.Provider>
    )
  }
}

export default App
