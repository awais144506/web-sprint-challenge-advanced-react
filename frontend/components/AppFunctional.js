import React, { useState } from 'react'
import axios from 'axios'
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const URL = "http://localhost:9000/api/result"

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [index, setIndex] = useState(initialIndex)
  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }
  function stepsCount() {
    setSteps(steps + 1)
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setSteps(initialSteps)
    setEmail(initialEmail)
    setMessage(initialMessage)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === 'left' && index % 3 !== 0) {
      return index - 1;
    }
    else if (direction === "right" && index % 3 !== 2) {
      return index + 1
    }
    else if (direction === "up" && index > 2) {
      return index - 3
    }
    else if (direction === "down" && index < 6) {
      return index + 3
    }
    return index;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const nextIndex = getNextIndex(direction)
    if (nextIndex !== index) {
      setIndex(nextIndex)
      stepsCount()
      setMessage("")
    }
    else {
      setMessage(`You can't go ${direction}`)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target

    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const {x,y} = getXY()
    const payload = {x,y,steps,email}

    axios.post(URL,payload)
    .then(res=>{
      setMessage(res.data.message)
      setEmail(initialEmail)
    })
    .catch(err=>{
      setMessage(err.response.data.message)
    })

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
