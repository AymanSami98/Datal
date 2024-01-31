import { useState, useEffect } from "react";
import largeData from "../../assets/oct.json";
import humanizeDuration from "humanize-duration";
import {CustomTable} from "../../middleware";


const MostPlayedOnDemand = () => {
  
    const [mostPlayedVideos, setMostPlayedVideos] = useState([]);
    const [mostPlayedVideosByDuration, setMostPlayedVideosByDuration] = useState([]);
    useEffect(() => {



    // Track VideoID plays and duration
    const videoIDPlays = {};
    const videoIDDuration = {};

    // Track VideoID with "pm" in ContentTitle
    const pmVideoIDs = [];
    
    const shortVideoIDs = [];

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
        if (contentTitle && contentTitle.toLowerCase().includes("short")) {
            shortVideoIDs.push(videoID);
        }
    });

    // Find the most played VideoIDs (top 10) based on play count
    const sortedMostPlayedVideos = Object.keys(videoIDPlays)
      .sort((a, b) => videoIDPlays[b] - videoIDPlays[a])
      .slice(0, 10)
      .map((videoID) => ({
        videoID,
        count: videoIDPlays[videoID],
        duration: videoIDDuration[videoID] || 0,
        title: largeData.find((data) => String(data.VideoID) === String(videoID))?.ContentTitle,
      }));

    // Find the most played VideoIDs (top 10) based on duration sum
    const sortedMostPlayedVideosByDuration = Object.keys(videoIDDuration)
      .sort((a, b) => videoIDDuration[b] - videoIDDuration[a])
      .slice(0, 10)
      .map((videoID) => ({
        videoID,
        count: videoIDPlays[videoID] || 0,
        duration: videoIDDuration[videoID],
        title: largeData.find((data) => String(data.VideoID) === String(videoID))?.ContentTitle,
      }));



    

  
    setMostPlayedVideos(sortedMostPlayedVideos);
    setMostPlayedVideosByDuration(sortedMostPlayedVideosByDuration);
 
  }, []);
  const humanizeDurationInSeconds = (seconds) => {
    return humanizeDuration(seconds * 1000, { round: true });
  };
    return (    
        <>
        <CustomTable
        title={"Top 10 Most Played Videos (based on Play Count):"}
          data={mostPlayedVideos}
          columns={[
            { label: "Video ID", field: "videoID" },
            { label: "Title", field: "title" },
            { label: "Play Count", field: "count" },
            { label: "Duration", field: "duration", render: (row) => humanizeDurationInSeconds(row.duration) },
          ]}
        />
  
        <CustomTable
        title={"Top 10 Most Played Videos (based on Duration Sum):"}
          data={mostPlayedVideosByDuration}
          columns={[
            { label: "Video ID", field: "videoID" },
            { label: "Title", field: "title" },
            { label: "Play Count", field: "count" },
            { label: "Duration", field: "duration", render: (row) => humanizeDurationInSeconds(row.duration) },
          ]}
        />
      </>
    );
  };
  
  export default MostPlayedOnDemand;
  
