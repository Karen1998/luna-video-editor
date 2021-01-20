import React, { useEffect, useState } from 'react'
import { Box, Icon, Typography } from '@material-ui/core'
import { icons } from '../../helpers/icons';



const UploadedFiles = ({ fileList }) => {
  const [fileListProcessed, setFleListProcessed] = useState([]);

  useEffect(() => {
    if (fileList.length > 0) {
      fileList.forEach(({ fileData, ...fd }) => {
        let reader = new FileReader(0);

        reader.onload = (e) => {
          let newSelectedAttachment = {};
          newSelectedAttachment.file = fileData;
          newSelectedAttachment.blobData = e.target.result;

          if (fileData.type.includes('video')) {
            setFleListProcessed((prevState) => ([
              ...prevState,
              {
                id: fd.id,
                file: newSelectedAttachment
              }
            ]));
          };
        };

        reader.readAsDataURL(fileData);
      })
    }

    return (() => {
      setFleListProcessed([]);
    })
  }, [fileList])


  return (
    <Box>
      <Typography variant="body1">
        Uploaded files
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        {fileListProcessed.map((fd) => {
          return (
            <Box
              position="relative"
              width="170px"
              height="95px"
              marginBottom="10px"
              key={fd.id}
            >
              <Box
                position="absolute"
                bottom="0"
                right="0"
                left="0"
                width="100%"
                height="30px"
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, .5)'
                }}
              >
                <Icon component={icons.playButton} color="primary" />
              </Box>

              <video
                width="100%"
                height="100%"
                controls={false}
              >
                <source src={fd.file.blobData} type={fd.file.file.type} />
                Your browser does not support HTML5 video.
              </video>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default UploadedFiles
