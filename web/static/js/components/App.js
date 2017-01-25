import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon, Menu, Label, Sidebar, Segment, Container, Confirm, Button } from 'semantic-ui-react'

import { signedIn, source } from '../global.js'
import {
  home, publicTimeline, timeline, newPost, userPage, loginPage, noticesPage
} from '../pages.js'
import PublicTimeline from './PublicTimeline.js'
import Timeline from './Timeline.js'
import NewPost from './NewPost.js'
import UserPage from './UserPage.js'
import LoginPage from './LoginPage.js'
import ErrorPage from './ErrorPage.js'
import NoticesPage from './NoticesPage.js'
import {
  pageSelector, userSelector,
  favNoticesCountSelctor, followNoticesCountSelctor, addressNoticesCountSelctor
} from '../selectors.js'

const mapStateToProps = state => {
  return {
    page: pageSelector(state),
    user: userSelector(state),
    favCount: favNoticesCountSelctor(state),
    followCount: followNoticesCountSelctor(state),
    addressCount: addressNoticesCountSelctor(state),
  }
}

const actionCreators = {
  homeAction: home.action,
  publicTimelineAction: publicTimeline.action,
  timelineAction: timeline.action,
  newPostAction: newPost.action,
  loginPageAction: loginPage.action,
  noticesPageAction: noticesPage.action
}

class App extends Component {
  constructor(props) {
    super(props)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.openLogoutDialog = this.openLogoutDialog.bind(this)
    this.closeLogoutDialog = this.closeLogoutDialog.bind(this)
    this.state = {
      sidebar: false,
      logout: false,
    }
  }

  toggleSidebar() {
    this.setState({sidebar: !this.state.sidebar})
  }

  openLogoutDialog() {
    this.setState({logout: true})
  }

  closeLogoutDialog() {
    this.setState({logout: false})
  }

  handleLogout() {
    window.location.href = '/logout'
  }

  renderPage() {
    const { page } = this.props
    switch (page.name) {
      case publicTimeline.name:
        return <PublicTimeline />
      case timeline.name:
        return <Timeline />
      case newPost.name:
        return <NewPost />
      case userPage.name:
        return <UserPage params={page.params} />
      case noticesPage.name:
        return <NoticesPage />
      case loginPage.name:
        return <LoginPage />
      default:
        return <ErrorPage />
    }
  }

  render() {
    const {
      user,
      homeAction,
      publicTimelineAction,
      timelineAction,
      newPostAction,
      loginPageAction,
      noticesPageAction,
      addressCount, followCount, favCount
    } = this.props
    const { sidebar, logout } = this.state
    const noticesCount = addressCount + followCount + favCount
    return (
      <div>
        <Menu>
          <Container>
            <Menu.Item onClick={this.toggleSidebar}>
              <Icon name='bars' size='large' />
            </Menu.Item>
            <Menu.Item onClick={signedIn ? timelineAction : publicTimelineAction}>
              <Icon name='home' size='large' />
            </Menu.Item>
            <Menu.Item onClick={newPostAction}>
              <Icon name='write' size='large' />
            </Menu.Item>
            <Menu.Item onClick={noticesPageAction}>
              <Icon name='alarm' size='large' />
              { noticesCount >= 1 ? <Label color='red'>{noticesCount}</Label> : null }
            </Menu.Item>
            <Menu.Menu position='right'>
              {
                !signedIn
                  ? <Button primary onClick={loginPageAction}>Sign in</Button>
                  : null
              }
            </Menu.Menu>
          </Container>
        </Menu>
        <Container>
          <Sidebar.Pushable as={React.div} style={{minHeight: '100%'}}>
            <Sidebar onClick={this.toggleSidebar}
              as={Menu} animation='overlay' width='thin' direction='top' visible={sidebar} vertical>
              <Menu.Item onClick={publicTimelineAction}>
                Public Timeline
              </Menu.Item>
              <Menu.Item link href={source.url} target="_blank">
                Source Code
              </Menu.Item>
              {
                signedIn
                  ? <Menu.Item name='Sign out' onClick={this.openLogoutDialog}>
                    Sign out
                  </Menu.Item>
                  : null
              }
              <Confirm
                open={logout}
                content='Are you sure you want to sign out?'
                onCancel={this.closeLogoutDialog}
                onConfirm={this.handleLogout}
              />
            </Sidebar>
            <Sidebar.Pusher style={{minHeight: '100%'}}>
              <Segment basic>
                {this.renderPage()}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Container>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(App)
