import React from 'react'

const Context = React.createContext({
  darkTheme: false,
  sidebarId: '',
  savedVideos: [],
  likedVideos: [],
  dislikedVideos: [],
  addLikeVideos: () => {},
  addDislikeVideos: () => {},
  toggleTheme: () => {},
  addVideos: () => {},
  changeSidebarId: () => {},
})

export default Context
