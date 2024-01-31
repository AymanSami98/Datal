import { useState, useEffect } from "react";
import largeData from "../../assets/oct.json";
import humanizeDuration from "humanize-duration";
import {CustomTable} from "../../middleware";


function MostPlayedLive() {
  useEffect(() => {
    // Track VideoID plays and duration
    const videoIDPlays = {};
    const videoIDDuration = {};

    // Track VideoID with "pm" in ContentTitle
    const pmVideoIDs = [];

    largeData.forEach((data) => {
      const duration = data.Duration || 0;

      const videoID = data.VideoID;
      if (videoID) {
        videoIDPlays[videoID] = (videoIDPlays[videoID] || 0) + 1;
        videoIDDuration[videoID] = (videoIDDuration[videoID] || 0) + duration;
      }

      const contentTitle = data.ContentTitle;
      if (contentTitle && contentTitle.toLowerCase().includes("pm")) {
        pmVideoIDs.push(videoID);
      }
    });

    const mostCommonPmVideoIDCounts = pmVideoIDs.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

const sortedMostCommonPmVideosByCount = Object.keys(mostCommonPmVideoIDCounts)
  .filter(videoID => videoID !== '0' && mostCommonPmVideoIDCounts[videoID] !== 0)
  .sort((a, b) => mostCommonPmVideoIDCounts[b] - mostCommonPmVideoIDCounts[a])
  .slice(0, 10)
  .map((videoID) => ({
    videoID,
    count: mostCommonPmVideoIDCounts[videoID],
    duration: videoIDDuration[videoID] || 0,
    title: largeData.find((data) => String(data.VideoID) === String(videoID))?.ContentTitle,
  }));

    const sortedMostCommonPmVideosByDuration = Object.keys(
      mostCommonPmVideoIDCounts
    )
      .filter((videoID) => videoIDDuration[videoID] !== undefined)
      .sort((a, b) => videoIDDuration[b] - videoIDDuration[a])
      .slice(0, 10)
      .map((videoID) => ({
        videoID,
        count: mostCommonPmVideoIDCounts[videoID], 
        duration: videoIDDuration[videoID],
        title: largeData.find(
          (data) => String(data.VideoID) === String(videoID)
        )?.ContentTitle,
      }));

    setMostCommonPmVideosByCount(sortedMostCommonPmVideosByCount);
    setMostCommonPmVideosByDuration(sortedMostCommonPmVideosByDuration);
  }, []);

  // Function to humanize duration
  const humanizeDurationInSeconds = (seconds) => {
    return humanizeDuration(seconds * 1000, { round: true });
  };
  const [mostCommonPmVideosByCount, setMostCommonPmVideosByCount] = useState(
    []
  );
  const [mostCommonPmVideosByDuration, setMostCommonPmVideosByDuration] =
    useState([]);
  return (
    <>
      <CustomTable
        title={
          "Top 10 Most Common VideoIDs with pm in ContentTitle (based on count):"
        }
        data={mostCommonPmVideosByCount}
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
          "Top 10 Most Common VideoIDs with pm in ContentTitle (based on duration sum):"
        }
        data={mostCommonPmVideosByDuration}
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

export default MostPlayedLive;
