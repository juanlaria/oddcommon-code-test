import React from 'react';

import Duration from './VideoPlayer.Duration';
import Progress from './VideoPlayer.Progress';

import PlayIcon from '@images/play.svg?react';
import PauseIcon from '@images/pause.svg?react';
import ForwardIcon from '@images/forward.svg?react';

import Styles from './Scrubbing.module.scss';

const Controls = ({
  title,
  started,
  time,
  played,
  duration,
  playing,
  loaded,
  isVisible,
  onSeekMouseDown: handleSeekMouseDown,
  onSeekChange: handleSeekChange,
  onSeekMouseUp: handleSeekMouseUp,
  onPlayPause: handlePlayPause,
  onNext: handleNext,
  onPrevious: handlePrevious,
}) => {
  return (
    <section className={`${Styles.controls} ${isVisible ? Styles.isVisible : Styles.isHidden}`}>
      <div className={Styles.controls__progressWrapper}>
        {time && (
          <div className={Styles.controls__time}>
            <Duration seconds={duration * played} /> / <Duration seconds={duration} />
          </div>
        )}
        <Progress
          duration={duration}
          played={started === false ? 0 : played}
          loaded={loaded}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekChange={handleSeekChange}
          onSeekMouseUp={handleSeekMouseUp}
        />
      </div>
      <div className={Styles.controls__infoWrapper}>
        {title && <h2 className={Styles.controls__title}>{title}</h2>}
        <div className={Styles.controls__buttonsWrapper}>
          <button
            onClick={handlePrevious}
            className={`${Styles.controls__button} ${Styles.controls__button__back}`}
            aria-label="Back"
            disabled={!handlePrevious}
          >
            <ForwardIcon
              aria-label="Back"
              className={`${Styles.controls__button__icon} ${Styles.backIcon}`}
            />
          </button>
          <button
            onClick={handlePlayPause}
            className={`${Styles.controls__button}`}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <PauseIcon aria-label="Pause" className={Styles.controls__button__icon} />
            ) : (
              <PlayIcon aria-label="Play" className={Styles.controls__button__icon} />
            )}
          </button>
          <button
            onClick={handleNext}
            className={`${Styles.controls__button} ${Styles.controls__button__forward}`}
            aria-label="Forward"
            disabled={!handleNext}
          >
            <ForwardIcon aria-label="Forward" className={Styles.controls__button__icon} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Controls;
