import React, { Component } from "react";
import { VscUnmute, VscMute } from "react-icons/vsc";

// Import your audio file
import song from "./autoplay.wav";

class Music extends Component {
  // Create state
  state = {
    // Get audio file in a variable
    audio: new Audio(song),

    // Set initial state of song
    isPlaying: false,
  };
  // Main function to handle both play and pause operations
  playPause = () => {

    // Get state of song
    let isPlaying = this.state.isPlaying;

    if (isPlaying) {
      // Pause the song if it is playing
      this.state.audio.pause();
    } else {

      // Play the song if it is paused
      this.state.audio.play();
    }
    // Change the state of song
    this.setState({ isPlaying: !isPlaying });
  };

  render() {
    return (
      <div id="music">
        <button onClick={this.playPause}>
        {this.state.isPlaying ? 
            <VscUnmute /> : 
            <VscMute />}
        </button>
      </div>
    );
  }
}

export default Music;