
import { render } from '@testing-library/react';
import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    }
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  addTrack(track){
    
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.state.playlistTracks.push(track)};
      this.setState(
        {playlistTracks: this.state.playlistTracks}
        )
  }

  removeTrack(track){
    this.state.playlistTracks=this.state.playlistTracks.filter(selectedTrack=> selectedTrack.id !== track.id);
    this.setState({
      playlistTracks: this.state.playlistTracks
    });
  }
  
  updatePlaylistName(name){
    this.setState({
      playlistName:name
    })
  }

  savePlaylist(){
    const trackURIs=this.state.playlistTracks.map(track=> track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>{
      this.setState({
        playlistName: "New Playlist",
        playlistTracks:[]
      })
    })
  }
    

  search(term) {
    Spotify.search(term).then(results=> {
      this.setState({
        searchResults: results
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                          onAdd={this.addTrack}
                          />
            <Playlist playlistTracks={this.state.playlistTracks} 
                      playlistName={this.state.playlistName}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;