import React, { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Icon, IconButton, Typography } from '@material-ui/core'
import { icons } from '../../helpers/icons'


const VideoPlayback = ({
  videoData,
  currentTime,
  frameRate,
  seekTo,
  setCurrentTime,
}) => {
  const [durationTime, setDurationTime] = useState(0);
  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  // const canvasRef = useRef({});

  const [toolsStyles, setToolsStyles] = useState({
    opacity: 0,
    pointerEvents: 'none',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    border: '0.5px solid #fff',
    transition: 'opacity 350ms'
  });

  const videoWindowRef = useRef();
  const videoRef = useRef();


  const showTools = () => {
    setToolsStyles({
      ...toolsStyles,
      opacity: 1,
      pointerEvents: 'all'
    })
  };

  const hideTools = () => {
    setToolsStyles({
      ...toolsStyles,
      opacity: 0,
      pointerEvents: 'none'
    })
  };

  const initSubscriptions = () => {
    videoWindowRef.current.addEventListener('mouseenter', showTools);
    videoWindowRef.current.addEventListener('mouseleave', hideTools);
    videoRef.current.addEventListener('timeupdate', () => {
      // setCurrentTime(Math.trunc(videoRef.current.currentTime));
    });
    setDurationTime(Math.floor(videoRef.current.duration));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    videoRef.current.addEventListener('loadeddata', initSubscriptions);
  }, []);

  useEffect(() => {
    videoRef.current.currentTime = seekTo;
  }, [seekTo]);


  useEffect(() => {
    videoRef.current.currentTime = currentTime;
  }, [currentTime]);


  useEffect(() => {
    if (play) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [play]);

  // useEffect(() => {
  //   if (videoData) {
  //     let time = currentTime / frameRate;
  //     const video = document.createElement('video');
  //     video.src = videoData.blobData;
  //     video.type = videoData.file.type;
  //     video.currentTime = time;
  //     canvasRef.current.getContext('2d').drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
  //     canvasRef.current.fillStyle = "rgba(0,0,0," + .7 + ")";
  //   }
  // }, [videoData, currentTime, frameRate]);



  return (
    <Box ref={videoWindowRef}>
      {loading && <CircularProgress />}

      <video
        width="100%"
        height="100%"
        controls={false}
        ref={videoRef}
      >
        <source src={videoData.blobData} type={videoData.file.type} />
        Your browser does not support HTML5 video.
      </video>

      <Box
        position="absolute"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        left="0"
        bottom="0"
        width="calc(100% - 1px)"
        padding="0 5px"
        height="15%"
        style={toolsStyles}
      >
        <Typography variant="caption" color="secondary">{currentTime}</Typography>

        <IconButton size="medium" onClick={() => setPlay(!play)}>
          <Icon component={play ? icons.pauseButton : icons.playButton} color="secondary" />
        </IconButton>

        <Typography variant="caption" color="secondary">{durationTime}</Typography>
      </Box>
    </Box>
  )
};


const VideoPlayer = ({
  fileData,
  seekTo,
  setCurrentTime,
  currentTime,
  frameRate
}) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (fileData) {
      setVideoData(null);
      setLoading(true);
      let reader = new FileReader(0);

      reader.onload = (e) => {
        let newSelectedAttachment = {};
        newSelectedAttachment.file = fileData.data;
        newSelectedAttachment.blobData = e.target.result;

        if (fileData.data.type.includes('video')) {
          setVideoData(newSelectedAttachment);
          setLoading(false);
        };
      };

      reader.readAsDataURL(fileData.data);
    }
  }, [fileData]);


  return (
    <>
      <Box
        position="relative"
        display="flex"
        alignContent="center"
        justifyContent="center"
        width="100%"
        height="350px"
        borderRadius="5px 5px 0 0"
        overflow="hidden"
      >
        {loading && (
          <Box width="100%" height="100%">
            <CircularProgress />
          </Box>
        )}

        {videoData && (
          <VideoPlayback
            frameRate={frameRate}
            videoData={videoData}
            currentTime={currentTime}
            seekTo={seekTo}
            setCurrentTime={setCurrentTime}
          />
        )}
      </Box>
    </>
  )
};

export default VideoPlayer
