import axios from 'axios';
import React from 'react';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_note: null,
      new_notes: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
    // username
    e.preventDefault();
    let data = {
      order_number: this.props.order_number,
      writer_name: this.props.username,
      message: this.state.new_note,
      created_date: new Date(),
    }
    axios.post('/messages', data)
      .then((res) => {
        console.log('res at message modal: ', res)
        let old_notes = this.state.new_notes;
        old_notes.push(data);
        this.setState({
            new_notes: old_notes,
        })
      })
      .catch((err) => {
        console.log('axios err: ', err);
      })
  }

  formatDate(dateString) {
    var d = new Date(dateString),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        time = d.toTimeString().slice(0, 8);

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-') + ', ' + time;
  }

  render() {
    let notes = this.props.messages;
    console.log('this.state.new_notes', this.state.new_notes);
    return (
      <div>
        <div className="notes-modal">
            {notes.map((note) => {
                return (
                <div className="one-message">
                    <span className="note-username">{note.writer_name}</span>
                    <span className="note-created-date">{this.formatDate(note.created_date)}</span>
                    <br />
                    <span className="note-message">{note.message}</span>
                    <br />
                    <br />
                </div>
                )
            })}
            {this.state.new_notes.length !== 0 && this.state.new_notes.map((note) => {
                return (
                <div className="one-message">
                    <span className="note-username">{note.writer_name}</span>
                    <span className="note-created-date">{this.formatDate(note.created_date)}</span>
                    <br />
                    <span className="note-message">{note.message}</span>
                    <br />
                    <br />
                </div>
                )
            })}
        </div>
        <br />
        <div>
          <form className="note-submit-form">
            <textarea
              type="text"
              value={this.state.new_note}
              onChange={this.handleChange}
              name="new_note"
              placeholder="enter a new note here"
            ></textarea>
          </form>
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }
}

export default Note;