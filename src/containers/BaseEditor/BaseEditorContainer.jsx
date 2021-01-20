import React, { useEffect, useState } from 'react'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import { Box, Container, Fade, Icon, IconButton } from '@material-ui/core'

import Scrubber from '../../components/VideoPlayer/components'
import { icons } from '../../helpers/icons'
import UploadedFiles from '../../components/UploadedFiles/UploadedFiles'


const FRAME_RATE = 300;
let totalVideoDuration = 0;

const BaseEditorContainer = () => {
  const [state, setState] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [seekTo, setSeekTo] = useState(0);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    if (playVideo) {
      if (currentTime < totalTime) {
        setTimeout(() => {
          setCurrentTime((prevState) => prevState + 1);
        }, FRAME_RATE);
      } else {
        setPlayVideo(false);
      }
    }
  }, [playVideo, currentTime, totalTime])

  const onSeekHandle = (time) => {
    // setSeekTo(time);
    setCurrentTime(time);
  };

  const handleFileUpload = (file) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const idOfNewVideo = Math.random() * 1000;
    let array = [];
    let prevFrameNumber = 0;

    setFileData(() => null);
    setFileData(() => ({
      id: idOfNewVideo,
      data: file
    }));

    function initCanvasAndTimeLines(e) {
      let duration = Math.floor(this.duration);
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      totalVideoDuration += this.duration;
      setTotalTime((prevState) => prevState + duration);
    }

    function drawFrame(e) {
      let flooredCurrentTime = Math.floor(this.currentTime);

      if (prevFrameNumber !== flooredCurrentTime) {
        this.pause();
        ctx.drawImage(this, 0, 0);
        prevFrameNumber = flooredCurrentTime;
        canvas.toBlob(saveFrame, 'image/jpeg');
      } else {
        this.play();
      }

      setProgress(((this.currentTime / this.duration) * 100).toFixed(2));
    }

    function saveFrame(blob) {
      let img;
      img = new Image();
      img.src = URL.createObjectURL(blob);
      array.push(img);
    }

    function onend(e) {
      setState([
        ...state,
        {
          id: idOfNewVideo,
          fileData: file,
          frames: [...array],
          timeStart: totalVideoDuration - this.duration,
          timeEnd: totalVideoDuration
        }
      ]);
      // we don't need the video's objectURL anymore
      URL.revokeObjectURL(this.src);
      video.removeEventListener('loadedmetadata', initCanvasAndTimeLines);
      video.removeEventListener('timeupdate', drawFrame);
      video.removeEventListener('ended', onend);
      setProgress(0);
    }

    video.muted = true;

    video.addEventListener('loadedmetadata', initCanvasAndTimeLines, false);
    video.addEventListener('timeupdate', drawFrame, false);
    video.addEventListener('ended', onend, false);

    video.src = URL.createObjectURL(file);
    video.play();
  };

  useEffect(() => {
    state.forEach((fd) => {
      if (fd.id !== fileData.id) {
        if (fd.timeStart < currentTime && fd.timeEnd > currentTime) {
          setFileData({
            id: fd.id,
            data: fd.fileData
          });
        }
      }
    })
  }, [currentTime]);

  return (
    <Container>
      <Fade in={progress !== 0}>
        <Box
          position="fixed"
          zIndex="99"
          top="10px"
          right="10px"
          width="150px"
          height="60px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="5px"
          style={{
            backgroundColor: "#00b0ff",
            color: '#fff'
          }}
        >
          {progress + ' %'}
        </Box>
      </Fade>

      <Box
        display="flex"
        flexWrap="wrap"
      >
        <Box display="flex" justifyContent="space-between">
          <Box flex="2">
            <UploadedFiles fileList={state} />
          </Box>

          <Box marginLeft="50px" flex="3">
            <Box>
              {fileData && (
                <VideoPlayer
                  frameRate={FRAME_RATE}
                  setCurrentTime={(time) => setCurrentTime(time)}
                  fileData={fileData}
                  currentTime={currentTime}
                  seekTo={seekTo}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          marginTop="20px"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Box marginBottom="25px">
            <IconButton size="medium" onClick={() => setPlayVideo(!playVideo)}>
              <Icon
                component={playVideo ? icons.pauseButton : icons.playButton}
                color="secondary"
              />
            </IconButton>
          </Box>

          <Scrubber
            videoData={state}
            currentTime={currentTime}
            totalTime={totalTime}
            onSeekHandle={onSeekHandle}
            handleFileUpload={handleFileUpload}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default BaseEditorContainer
