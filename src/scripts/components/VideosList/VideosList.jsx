import React, { useState, useEffect } from 'react';
import { useQueries } from 'react-query';
import { VideoItem } from '@components';

import { useGeneralStore } from '@data/generalStore';

import Styles from './VideosList.module.scss';

const VideosList = ({ content }) => {
  // Stores
  const { setLoadingData } = useGeneralStore();

  //States
  const [dataWithVideoFiles, setDataWithVideoFiles] = useState(content.data || []);

  const queryResults = useQueries(
    // Get video files
    content.data.map(item => {
      return {
        queryKey: ['contentItem', item.resource_key],
        queryFn: async () =>
          await fetch(`https://proxy.oddcommon.dev/vimeo/${item.uri.replace('/videos/', '')}`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
          }).then(function (response) {
            return response.json();
          }),
      };
    })
  );

  const allFinished = queryResults.every(query => query.isSuccess); // Check if all queries are finished and successful

  useEffect(() => {
    setLoadingData(!allFinished); // This is used to show/hide the loader that lives in Layout.jsx
  }, [allFinished]);

  useEffect(() => {
    setDataWithVideoFiles(prevData => {
      // Update data with video files
      let newValues = prevData;
      prevData.forEach((item, index) => {
        newValues[index].files = {
          // Most of this is just to match the data structure of the API response
          status: queryResults[index].status,
          isLoading: queryResults[index].isLoading,
          isSuccess: queryResults[index].isSuccess,
          data: queryResults[index].data?.request.files || null,
        };
      });
      return newValues;
    });
  }, [queryResults]);

  return (
    <ul className={Styles.list}>
      {dataWithVideoFiles.map(item => {
        return (
          <VideoItem
            key={item.resource_key}
            content={item}
            previousVideo={dataWithVideoFiles[dataWithVideoFiles.indexOf(item) - 1]?.resource_key} // Pass previous video resource key
            nextVideo={dataWithVideoFiles[dataWithVideoFiles.indexOf(item) + 1]?.resource_key} // Pass next video resource key
          />
        );
      })}
    </ul>
  );
};

export default VideosList;
