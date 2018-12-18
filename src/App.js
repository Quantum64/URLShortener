import React, { Component } from 'react';
import './App.css';
import compression from './compression'

import TextField from '@material-ui/core/TextField';
import 'typeface-roboto';

class App extends Component {
  constructor(props) {
    super(props);
    const url = "http://example.com";
    this.state = {
      url: url,
      compressed: compression.shorten(url)
    }
  }

  update(url) {
    this.setState({
      url: url,
      compressed: compression.shorten(url)
    })
  }

  render() {
    let short = window.location + this.state.compressed;
    let component = (
      <a href={short}>{short}</a>
    );
    if (!compression.validate(this.state.url)) {
      component = (
        <span>Please type a valid URL!</span>
      );
    }

    return (
      <div className="App">
        <TextField
          id="outlined-uncontrolled"
          label="URL"
          margin="normal"
          variant="outlined"
          value={this.state.url}
          onChange={(value) => this.update(value.target.value)}
        />
        <div>
          {component}
        </div>
        <div>
          {compression.expand(this.state.compressed)}
        </div>
      </div>
    );
  }
}

export default App;