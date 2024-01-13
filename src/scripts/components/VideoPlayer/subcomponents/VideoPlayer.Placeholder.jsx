import React from 'react';

// import { Loader } from '@components'

import Styles from './Placeholder.module.scss';

const Placeholder = ({ url, aspectRatio }) => {
  return (
    <div className={Styles.placeholder}>
      {url ? (
        <img src={url} alt="Loading video" className={Styles.placeholder__item} />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Placeholder;
