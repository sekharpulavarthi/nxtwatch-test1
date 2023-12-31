import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player/youtube'
import {formatDistanceToNow} from 'date-fns'
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineAppstoreAdd,
} from 'react-icons/ai'

import {
  LoaderView,
  FullView,
  MainView,
  VideosView,
  VideoPlayer,
  VideoTitle,
  VideoInfoBox,
  VideoText,
  LikeDislikeSaveBox,
  HorizontalLine,
  VideoDescBox,
  Thumbnail,
  DescBox,
  ChannelInfo,
  ChannelName,
  ChannelSubs,
  Description,
  LikeDislikeSaveButton,
  Player,
  SideView,
} from './styledComponents'

import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import Context from '../../Context/Context'
import Failure from '../Failure'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videoDetails: {},
  }

  componentDidMount() {
    this.getVideosDetails()
    console.log(new Date())
  }

  getVideosDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jsToken = Cookie.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const option = {
      headers: {
        Authorization: `Bearer ${jsToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, option)

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        id: data.video_details.id,
        title: data.video_details.title,
        videoUrl: data.video_details.video_url,
        thumbnailUrl: data.video_details.thumbnail_url,
        channel: data.video_details.channel,
        viewCount: data.video_details.view_count,
        publishedAt: data.video_details.published_at,
        description: data.video_details.description,
      }
      this.setState({
        videoDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  render() {
    const {videoDetails, apiStatus} = this.state

    return (
      <Context.Consumer>
        {value => {
          const {
            darkTheme,
            addVideos,
            savedVideos,
            likedVideos,
            dislikedVideos,
            changeSidebarId,
            addLikeVideos,
            addDislikeVideos,
          } = value

          const isSaved = savedVideos.find(each => each.id === videoDetails.id)
          const isLiked = likedVideos.find(each => each.id === videoDetails.id)
          const isDisliked = dislikedVideos.find(
            each => each.id === videoDetails.id,
          )

          const onClickSave = () => {
            addVideos(videoDetails)
          }

          const onClickLiked = () => {
            addLikeVideos(videoDetails)
          }

          const onClickDisliked = () => {
            addDislikeVideos(videoDetails)
          }

          const onRetry = () => {
            this.getVideosDetails()
          }

          const renderFailureView = () => (
            <Failure onRetry={onRetry} darkTheme={darkTheme} />
          )

          const renderLoaderView = () => (
            <LoaderView data-testid="loader">
              <Loader
                type="ThreeDots"
                color={darkTheme ? '#f9f9f9' : '#181818'}
                height="50"
                width="50"
              />
            </LoaderView>
          )

          const renderVideosView = () => (
            <VideoPlayer>
              <Player>
                <ReactPlayer
                  height="100%"
                  width="100%"
                  url={videoDetails.videoUrl}
                  controls
                />
              </Player>
              <VideoTitle color={darkTheme ? '#f9f9f9' : '#181818'}>
                {videoDetails.title}
              </VideoTitle>
              <VideoInfoBox>
                <VideoText color={darkTheme ? '#64748b' : '#606060'}>
                  {videoDetails.viewCount} views |{' '}
                  {formatDistanceToNow(new Date(videoDetails.publishedAt))}
                </VideoText>
                <LikeDislikeSaveBox>
                  <LikeDislikeSaveButton
                    color={isLiked ? '#2563eb' : '#64748b'}
                    type="button"
                    onClick={onClickLiked}
                  >
                    <AiOutlineLike size="26" />
                    Like
                  </LikeDislikeSaveButton>
                  <LikeDislikeSaveButton
                    color={isDisliked ? '#2563eb' : '#64748b'}
                    type="button"
                    onClick={onClickDisliked}
                  >
                    <AiOutlineDislike size="26" />
                    Dislike
                  </LikeDislikeSaveButton>
                  <LikeDislikeSaveButton
                    color={isSaved ? '#2563eb' : '#64748b'}
                    type="button"
                    onClick={onClickSave}
                  >
                    <AiOutlineAppstoreAdd size="26" />
                    {isSaved ? 'Saved' : 'Save'}
                  </LikeDislikeSaveButton>
                </LikeDislikeSaveBox>
              </VideoInfoBox>
              <HorizontalLine color={darkTheme ? '#64748b' : '#606060'} />
              <VideoDescBox>
                <Thumbnail
                  src={videoDetails.channel.profile_image_url}
                  alt="channel logo"
                />
                <DescBox>
                  <ChannelInfo>
                    <ChannelName color={darkTheme ? '#f9f9f9' : '#181818'}>
                      {videoDetails.channel.name}
                    </ChannelName>
                    <ChannelSubs color={darkTheme ? '#64748b' : '#606060'}>
                      {videoDetails.channel.subscriber_count}
                    </ChannelSubs>
                  </ChannelInfo>
                  <Description color={darkTheme ? '#ebebeb' : '#212121'}>
                    {videoDetails.description}
                  </Description>
                </DescBox>
              </VideoDescBox>
            </VideoPlayer>
          )

          const renderAllViews = () => {
            switch (apiStatus) {
              case apiStatusConstants.success:
                return renderVideosView()
              case apiStatusConstants.inProgress:
                return renderLoaderView()
              case apiStatusConstants.failure:
                return renderFailureView()
              default:
                return null
            }
          }

          return (
            <FullView
              data-testid="videoItemDetails"
              onLoad={() => {
                changeSidebarId('')
              }}
            >
              <Navbar />
              <MainView>
                <SideView>
                  <Sidebar />
                </SideView>
                <VideosView
                  data-testid="videoItemDetails"
                  backgroundColor={darkTheme ? '#0f0f0f' : '#f9f9f9'}
                >
                  {renderAllViews()}
                </VideosView>
              </MainView>
            </FullView>
          )
        }}
      </Context.Consumer>
    )
  }
}

export default VideoItemDetails
