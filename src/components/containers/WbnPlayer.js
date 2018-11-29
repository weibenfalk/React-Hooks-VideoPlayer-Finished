import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Video from "../Video";
import Playlist from "../containers/Playlist";
import StyledWbnPlayer from "../styles/StyledWbnPlayer";

const WbnPlayer = props => {

   const theme = {
    bgcolor: "#353535",
    bgcolorItem: "#414141",
    bgcolorItemActive: "#405c63",
    bgcolorPlayed: "#526d4e",
    border: "none",
    borderPlayed: "none",
    color: "#fff"
  };

  const themeLight = {
    bgcolor: "#fff",
    bgcolorItem: "#fff",
    bgcolorItemActive: "#80a7b1",
    bgcolorPlayed: "#7d9979",
    border: "1px solid #353535",
    borderPlayed: "none",
    color: "#353535"
  };

  const videos = JSON.parse(document.querySelector('[name="videos"]').value);
  const persistedState = JSON.parse(
    localStorage.getItem(`${videos.playlistId}`)
  );

  const [state, setState] = useState({
    videos: persistedState ? persistedState.videos : videos.playlist,
    activeVideo: persistedState ? persistedState.activeVideo : videos.playlist[0],
    nightMode: persistedState ? persistedState.nightMode : false,
    playlistId: persistedState ? persistedState.playlistId : videos.playlistId,
    autoplay: false,
  });

  // This will only fire when the state updates
  useEffect(
    () => {
      localStorage.setItem(`${state.playlistId}`, JSON.stringify({ ...state }));
    },
    [state]
  );

  useEffect(
    () => {
      if (props.match.params.activeVideo !== undefined) {
        const newActiveVideo = findVideoIndex(props.match.params.activeVideo);
        setState({
          ...state,
          activeVideo: state.videos[newActiveVideo],
          autoplay: props.location.autoplay,
        });
      } else {
        // Navigate to the active video URL when going to root "/"
        props.history.push({ pathname: `/${state.activeVideo.id}`, autoplay: false });
      }
    },
    [props.match.params.activeVideo] // Don't forget this. Will go into infinity loop otherwise
  );

  const nightModeCallback = () => {
    setState({ ...state, nightMode: !state.nightMode });
  };

  const endCallback = () => {
    // First grab the index for the current video
    const currentVideoIndex = findVideoIndex(props.match.params.activeVideo);
    // Then check for next video in the list. If there's no more videos go to beginning
    const nextVideo =
      currentVideoIndex === state.videos.length - 1 ? 0 : currentVideoIndex + 1;
    // Then goto next video by pushing a new URL to the Router. Also pass the autoplay to determine
    // if the video should not autoplay since it't the next in the list
    props.history.push({
      pathname: `/${state.videos[nextVideo].id}`,
      autoplay: false
    });
  };

  const progressCallback = e => {
    // Set the status to "played" after 10 seconds
    if (e.playedSeconds > 10 && e.playedSeconds < 11) {
      setState({
        ...state,
        videos: state.videos.map(element => {
          return element.id === state.activeVideo.id
            ? { ...element, played: true }
            : element;
        })
      });
    }
  };

  const findVideoIndex = videoId => {
    for (let video of state.videos) {
      if (video.id === videoId) return state.videos.indexOf(video);
    }
  };

  return (
    <ThemeProvider theme={state.nightMode ? theme : themeLight}>
      {state.videos !== null ? (
        <StyledWbnPlayer>
          <Video
            active={state.activeVideo}
            autoplay={state.autoplay}
            endCallback={endCallback}
            progressCallback={progressCallback}
          />
          <Playlist
            videos={state.videos}
            active={state.activeVideo}
            nightModeCallback={nightModeCallback}
            nightMode={state.nightMode}
          />
        </StyledWbnPlayer>
      ) : null}
    </ThemeProvider>
  );
};

export default WbnPlayer;