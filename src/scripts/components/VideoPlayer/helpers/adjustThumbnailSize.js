const adjustThumbnailSize = (url, videoWidth, videoHeight) => {
  const front = url.split('_')[0];
  const back = url.split('?')[1] || '';
  return `${front}_${videoWidth}x${videoHeight}?${back}`;
};

export default adjustThumbnailSize;
