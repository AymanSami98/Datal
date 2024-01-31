import { useState, useEffect } from "react";
import largeData from "../../assets/oct.json";
import humanizeDuration from "humanize-duration";
import {CustomTable} from "../../middleware";

import { Input } from "@mui/material";

function MostPlayedShort() {
  const [mostCommonShortVideosByCount, setMostCommonShortVideosByCount] = useState(
    []
  );
  const [mostCommonShortVideosByDuration, setMostCommonShortVideosByDuration] =
    useState([]);
    const [input , setInput] = useState('');

    const handleChange = (e) => {
      setInput(e.target.value);
    }

  useEffect(() => {
    // Track VideoID plays and duration
    const videoIDPlays = {};
    const videoIDDuration = {};

    // Track VideoID with "Short" in ContentTitle
    const ShortVideoIDs = [];

    largeData.forEach((data) => {
      const duration = data.Duration || 0;

      const videoID = data.VideoID;
      if (videoID) {
        videoIDPlays[videoID] = (videoIDPlays[videoID] || 0) + 1;
        videoIDDuration[videoID] = (videoIDDuration[videoID] || 0) + duration;
      }

      const contentTitle = data.ContentTitle;
      if (contentTitle && contentTitle.toLowerCase().includes(input)) {
        ShortVideoIDs.push(videoID);
      }
    });
console.log(input);
    const mostCommonShortVideoIDCounts = ShortVideoIDs.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

const sortedMostCommonShortVideosByCount = Object.keys(mostCommonShortVideoIDCounts)
  .filter(videoID => videoID !== '0' && mostCommonShortVideoIDCounts[videoID] !== 0)
  .sort((a, b) => mostCommonShortVideoIDCounts[b] - mostCommonShortVideoIDCounts[a])
  .slice(0, 10)
  .map((videoID) => ({
    videoID,
    count: mostCommonShortVideoIDCounts[videoID],
    duration: videoIDDuration[videoID] || 0,
    title: largeData.find((data) => String(data.VideoID) === String(videoID))?.ContentTitle,
  }));

    const sortedMostCommonShortVideosByDuration = Object.keys(
      mostCommonShortVideoIDCounts
    )
      .filter((videoID) => videoIDDuration[videoID] !== undefined)
      .sort((a, b) => videoIDDuration[b] - videoIDDuration[a])
      .slice(0, 10)
      .map((videoID) => ({
        videoID,
        count: mostCommonShortVideoIDCounts[videoID], 
        duration: videoIDDuration[videoID],
        title: largeData.find(
          (data) => String(data.VideoID) === String(videoID)
        )?.ContentTitle,
      }));

    setMostCommonShortVideosByCount(sortedMostCommonShortVideosByCount);
    setMostCommonShortVideosByDuration(sortedMostCommonShortVideosByDuration);
  }, [input]);

  // Function to humanize duration
  const humanizeDurationInSeconds = (seconds) => {
    return humanizeDuration(seconds * 1000, { round: true });
  };

  return (
    <>
    <Input placeholder="Search" onChange={handleChange} value={input} />
    <br />
      <CustomTable
        title={
          "Top 10 Most Common VideoIDs with Short in ContentTitle (based on count):"
        }
        data={mostCommonShortVideosByCount}
        columns={[
          { label: "Video ID", field: "videoID" },
          { label: "Title", field: "title" },
          { label: "Play Count", field: "count" },
          {
            label: "Duration",
            field: "duration",
            render: (row) => humanizeDurationInSeconds(row.duration),
          },
        ]}
      />
      <CustomTable
        title={
          "Top 10 Most Common VideoIDs with Short in ContentTitle (based on duration sum):"
        }
        data={mostCommonShortVideosByDuration}
        columns={[
          { label: "Video ID", field: "videoID" },
          { label: "Title", field: "title" },
          { label: "Play Count", field: "count" },
          {
            label: "Duration",
            field: "duration",
            render: (row) => humanizeDurationInSeconds(row.duration),
          },
        ]}
      />
    </>
  );
}

export default MostPlayedShort;
