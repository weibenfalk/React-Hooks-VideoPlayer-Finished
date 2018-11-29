import React from "react";
import StyledVideo from "./styles/StyledVideo";
import StyledVideoWrapper from "./styles/StyledVideoWrapper";
import ReactPlayer from "react-player";

const Video = ({ active, autoplay, endCallback, progressCallback }) => (
  <StyledVideo>
    <StyledVideoWrapper>
      <ReactPlayer
        width="100%"
        height="100%"
        style={{ position: "absolute", top: "0" }}
        playing={autoplay}
        controls={true}
        url={active.video}
        onEnded={endCallback}
        onProgress={progressCallback}
      />
    </StyledVideoWrapper>
  </StyledVideo>
);

export default Video;
