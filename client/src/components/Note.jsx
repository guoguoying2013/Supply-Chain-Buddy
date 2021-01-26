/* eslint-disable prefer-template */
import axios from 'axios';
import React, { useState } from 'react';

const Note = ({ messages, orderNumber, username }) => {
  const [newNote, setNewNote] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setNewNote(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      order_number: orderNumber,
      writer_name: username,
      message: newNote,
      created_date: new Date(),
    };
    axios.post('/api/messages', data)
      .then(() => {
        console.log('posted');
      })
      .catch((err) => {
        console.log('axios err: ', err);
      });
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    const time = d.toTimeString().slice(0, 8);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-') + ', ' + time;
  };

  let notes = messages;
  if (notes === null) {
    notes = [];
  }
  return (
    <div>
      <div className="notes-modal">
        {notes.map((note) => (
          // eslint-disable-next-line no-underscore-dangle
          <div className="one-message" key={note._id}>
            <span className="note-username">{note.writer_name}</span>
            <span className="note-created-date">{formatDate(note.created_date)}</span>
            <br />
            <span className="note-message">{note.message}</span>
            <br />
            <br />
          </div>
        ))}
      </div>
      <br />
      <div>
        <form className="note-submit-form">
          <textarea
            type="text"
            value={newNote}
            onChange={handleChange}
            name="new_note"
            placeholder="enter a new note here"
          />
        </form>
        <button onClick={handleSubmit} type="submit">Submit</button>
      </div>
    </div>
  );
};

export default Note;
