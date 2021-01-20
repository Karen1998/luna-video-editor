import { Box, CircularProgress, fade, makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import '../../../styles/vendor/inputTypeRange.css';


const useStyles = makeStyles((theme) => ({
  trackPadWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '720px',
    height: '124px',
    marginTop: '10px',
    overflowX: 'auto',
    overflowY: 'hidden',
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: '2px',
  },

  trackPadInner: {
    position: 'relative',
    minWidth: '100%',
    height: '100%',
    padding: '10px 0',

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },

  rail: {
    width: '100%',
    height: 'inherit',
    backgroundColor: theme.palette.primary.main,
  },

  track: {
    position: 'absolute',
    height: 'inherit',
    backgroundColor: fade(theme.palette.primary.dark, .4),
    transition: 'width 150ms'
  },

  thumb: {
    position: 'absolute',
    zIndex: 99,
    top: '-5px',
    left: '-5px',//Scrubber width is 10px
    width: '100%',
    height: 'calc(100% + 20px)',
    backgroundColor: 'red',
    transition: 'left 150ms'
  }
}));


const Scrubber = ({
  videoData,
  currentTime,
  totalTime,
  onSeekHandle,
  handleFileUpload,
}) => {
  const [loading, setLoading] = useState(false)
  const [maxScrubberValue, setMaxScrubberValue] = useState(0);
  const videosRef = useRef();
  const stickRef = useRef();


  const updateThumbPosition = ({ target }) => {
    onSeekHandle(parseInt(target.value));
  };

  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    setMaxScrubberValue(Math.floor(videosRef.current.offsetWidth / 100));
  }, [videoData])

  const s = useStyles();


  return (
    <Box
      position="relative"
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
      className={s.trackPadWrapper}

    >
      {loading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          zIndex="9"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      )}

      <Box className={s.trackPadInner}>
        <input
          type="range"
          min={0}
          max={maxScrubberValue}
          onChange={updateThumbPosition}
          value={currentTime}
          ref={stickRef}
          className={s.thumb}
          style={{
            width: (maxScrubberValue * 100) + 'px'
          }}
        />

        <Box className={s.track} width={`${currentTime * 100}px`} />

        <Box display="inline-flex" height="100%" ref={videosRef}>
          {videoData.map((data) => {
            return (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                key={data.id}
              >
                {data.frames.map((frame, index) => (
                  <Box
                    width="100px"
                    height="100%"
                    component="span"
                    key={index}
                  >
                    <img src={frame.currentSrc} alt="" />
                  </Box>
                ))}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default Scrubber
