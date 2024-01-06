import React, { useState, useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
  useQueries,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import Styles from './Layout.module.scss';

const queryClient = new QueryClient();

const Layout = ({ content }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Videos content={content} />
      </main>
    </QueryClientProvider>
  );
};

const Videos = ({ content }) => {
  const [dataWithVideoFiles, setDataWithVideoFiles] = useState(content.data || []);
  const queryResults = useQueries(
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

  useEffect(() => {
    setDataWithVideoFiles(prevData => {
      let newValues = prevData;
      prevData.forEach((item, index) => {
        newValues[index].files = {
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
    <ul>
      {dataWithVideoFiles.map(item => {
        return (
          <li key={item.resource_key}>
            <h2>{item.name}</h2>
            {item?.files?.isSuccess && (
              <small>{item.files.data.hls.cdns[item.files.data.hls.default_cdn].url}</small>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Layout;
