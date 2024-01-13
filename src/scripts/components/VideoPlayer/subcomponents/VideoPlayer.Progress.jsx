import React from 'react';

import Styles from './Progress.module.scss';

const Progress = ({
  played,
  loaded,
  onSeekMouseDown: handleSeekMouseDown,
  onSeekChange: handleSeekChange,
  onSeekMouseUp: handleSeekMouseUp,
}) => {
  return (
    <div className={Styles.progress}>
      <input
        type="range"
        min={0}
        max={0.999999}
        step="any"
        value={played}
        onMouseDown={handleSeekMouseDown}
        onChange={handleSeekChange}
        onMouseUp={handleSeekMouseUp}
        className={Styles.progress__input}
      />
      <progress max={1} value={played} className={Styles.progress__played}>
        {Math.round(played * 100)}% played
      </progress>
      <progress max={1} value={loaded} className={Styles.progress__loaded} aria-hidden="true" />
    </div>
  );
};

export default Progress;
