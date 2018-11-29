import React from "react";
import PlaylistItem from "../PlaylistItem";
import withLink from "../hoc/withLink";
import StyledPlaylistitems from "../styles/StyledPlaylistitems";

const Playlistitems = ({ videos, active }) => {
  // HOC for adding link to videoitems. Not needed but want to show
  const PlaylistItemWithLink = withLink(PlaylistItem);

  const renderItems = () => {
    return videos.map(video => (
        <PlaylistItemWithLink
          key={video.id}
          video={video}
          active={video.id === active.id ? true : false}
          played={video.played}
        />
    ));
  };

  return <StyledPlaylistitems>{renderItems()}</StyledPlaylistitems>;
};

export default Playlistitems;