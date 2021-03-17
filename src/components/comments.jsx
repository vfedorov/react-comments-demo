import React, { Component } from "react"
import SimpleReactValidator from 'simple-react-validator';
import '../styles/scroll.css'
import user from "../assets/user.png"
import {commentsService} from "../services/comments-service"

class Comments extends Component {
  constructor() {
    super()
    this.state = {
      comments: [],
      loading: false,
      page: 0,
      prevY: 0,
      new_comment: {
        email: '',
        name: '',
        comment: ''
      },
      error: null,
    }

    this.validator = new SimpleReactValidator({
      //default component for validation errors
      element: message => <div className="text-danger">{message}</div>
    });

    this.handleChange = this.handleChange.bind(this)
    this.addComment = this.addComment.bind(this)
    this.getComments = this.getComments.bind(this)    
  }

  addComment(e) {
    //validate form
    if (this.validator.allValid()) {
      //send new comment data to api
      commentsService.addComment(this.state.new_comment).catch(e => {
        this.setState({error: e.message})
      });
    } else {
      //show validation error messages
      this.validator.showMessages();
      this.forceUpdate();
    }
    e.preventDefault()
  }

  getComments() {
    //increment page
    const page = this.state.page + 1
    this.setState({ page: page })

    //switch state to "loading"
    this.setState({ loading: true })

    //request new comments
    commentsService.loadComments({page: page, limit: 20})
      .then(res => {
        this.setState({ comments: [...this.state.comments, ...res.data] })
        this.setState({ loading: false })
      })
  }

  componentDidMount() {
    //initial comments loading
    this.getComments()

    var options = {
      root: null,
      rootMargin: "10px",
      threshold: 1.0
    }

    //initiate observer
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    )
    this.observer.observe(this.loadingRef)
  }

  handleChange(e) {
    //uodate state with new_comment values
    const new_comment = Object.assign({}, this.state.new_comment, {[e.target.name]: e.target.value})
    this.setState({new_comment})
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y
    //check scroll position
    if (this.state.prevY > y) {
      this.getComments()
    }
    this.setState({ prevY: y })
  }
  render() {
    return (
      <div className="container">
        <div className="create">
          <h2>Add new comment</h2>
          <form onSubmit={this.addComment}>
            <label className="label">Email:</label>
            <span className="input">
              <input type="text" name="email" value={this.state.new_comment.email}
                     onChange={this.handleChange}
              />
              {this.validator.message('email', this.state.new_comment.email, 'required|email')}
            </span>

            <label className="label">Name:</label>
            <span className="input">
              <input type="text" name="name" value={this.state.new_comment.name}
                     onChange={this.handleChange}
              />
              {this.validator.message('name', this.state.new_comment.name, 'required|alpha_num_dash_space')}
            </span>

            <div className="label">Comment:</div><br/>
            <span className="input">
              <textarea name="comment" value={this.state.new_comment.comment}
                        onChange={this.handleChange}
              />
              {this.validator.message('comment', this.state.new_comment.comment, 'required')}
            </span>
            <input type="submit" value="Send"/>
            {this.state.error && <div className="text-danger">
              {this.state.error}
            </div>}
          </form>

        </div>
        <div className="comments">
          {this.state.comments.map(comment => (
            <div key={comment.id} className="comment">
              <span className="id">{comment.id}</span>
              <img className="user" alt="user" src={user} width="100" height="100"/>
              <form>
                <label className="label">Email:</label>
                <span className="input">
                  <input type="text" name="email" value={comment.email} readOnly/>
                </span>
                <label className="label">Name:</label>
                <span className="input">
                  <input type="text" name="name" value={comment.name} readOnly/>
                </span>
                <hr/>
                <div className="label">Comment:</div><br/>
                <div>{comment.body}</div>
              </form>
            </div>
          ))}
          <div ref={loadingRef => (this.loadingRef = loadingRef)} className="loading">
            {this.state.loading && (
              <span>Loading...</span>
            )}
            {!this.state.loading && (
              <button onClick={this.getComments}>Load more...</button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Comments