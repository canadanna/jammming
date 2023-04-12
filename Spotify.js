import SearchBar from "../Components/SearchBar/SearchBar";

const clientID = '6e839d47ae144866a177b4179016a9bf';
const redirectURI = 'http://localhost:3001/';


let accessToken;
const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } else {
            //check for access token match
            const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
            const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);

            if (tokenMatch && expiresMatch) {
                accessToken = tokenMatch[1];
                const expiresIn = Number(expiresMatch[1]);
                //this clears the parameters, allowing us to grab a new access token when it expires
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else {
                const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
                window.location = accessURL;
            }
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return (
            fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => {
                        return {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    })
                } else {
                    return [];
                }
            })
        )
    },

    savePlaylist(playlistName, trackURIs) {

        if (!playlistName || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const header = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch('https://api.spotify.com/v1/me', { headers: header })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                userID = jsonResponse.id
                return fetch(`/v1/users/${userID}/playlists`, {
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({ name: playlistName }),
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    const playlistID = jsonResponse.id;
                    return fetch(`/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                        headers: header,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackURIs}),
                    })
                })
            });



    }
};

export default Spotify;