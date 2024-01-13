/* eslint-disable max-lines */
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/file';
import { useInView } from 'react-intersection-observer';

// import PauseBigIcon from '~/assets/svg/pause-big.svg'
// import PlayBigIcon from '~/assets/svg/play-big.svg'

import Scrubbing from './subcomponents/VideoPlayer.Scrubbing';
import Placeholder from './subcomponents/VideoPlayer.Placeholder';

import { isLowPowerMode } from '@helpers';

import { adjustThumbnailSize } from './helpers';
import CSS from './VideoPlayer.module.scss';

const VideoPlayerInner = ({
  asset,
  height,
  width,
  title,
  fit,
  defaultControls,
  scrubbing,
  scrubbingAlwaysOn,
  pausable,
  time,
  loop,
  muted: mutedProp,
  autoPlay,
  source,
  setReady,
  onNext: handleNext,
  onPrevious: handlePrevious,
  active,
}) => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const playerRef = useRef(null);
  const [lowPower, setLowPower] = useState();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(autoPlay || mutedProp || false);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState();
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [scrubbingVisibility, setScrubbingVisibility] = useState(scrubbing);
  const [placeholderVisibility, setplaceholderVisibility] = useState(true);
  const [fileUrl, setFileUrl] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState();
  const [aspectRatio, setAspectRatio] = useState({
    width: 16,
    height: 9,
    float: 9 / 16,
  });
  const [config] = useState({
    file: {
      forceHLS: !isSafari,
      hlsOptions: {
        testBandwidth: false,
        startLevel: 3,
        capLevelToPlayerSize: false,
      },
    },
  });

  const { ref, inView } = useInView({
    threshold: 0.95,
  });

  const handlePlayPause = () => {
    if (started === false && source === 'file' && asset.thumbTime > 0) {
      setPlayed(0);
      playerRef.current.seekTo(0);
    }
    setPlaying(!playing);
  };

  const handleToggleMuted = () => {
    setMuted(!muted);
  };

  const handleDuration = videoDuration => {
    setDuration(videoDuration);
  };

  const handlePlay = () => {
    setplaceholderVisibility(false);
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleEnded = () => {
    if (loop) {
      setPlaying(loop);
    } else {
      playerRef.current.seekTo(0);
    }
  };

  const handleSeekMouseDown = e => {
    if (!started) {
      setStarted(true);
      setPlayed(0);
    }
    setSeeking(true);
  };

  const handleSeekChange = e => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = e => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handleProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  };

  const handleMouseEnter = () => {
    if (scrubbingAlwaysOn) return;
    setScrubbingVisibility(true);
  };

  const handleMouseLeave = () => {
    if (scrubbingAlwaysOn) return;
    setScrubbingVisibility(false);
  };

  const handleFocus = () => {
    if (scrubbingAlwaysOn) return;
    setScrubbingVisibility(true);
  };

  const handleBlur = () => {
    if (scrubbingAlwaysOn) return;
    setScrubbingVisibility(false);
  };

  const handleClick = () => {
    handlePlayPause();
  };

  const handleKeyPress = e => {
    const { charCode } = e;

    switch (charCode) {
      case 32: // Space
        handlePlayPause();
        break;

      default:
        break;
    }
  };

  const handleSeek = seekTime => {
    // if the file video has a thumbnail time we need to reset the scrubber back to zero
    if (!started && source === 'vimeo' && asset.thumbTime === seekTime) {
      setPlayed(0);
    }
  };

  const handleReady = () => {
    // modify the video seek time but not via state
    if (!started && source === 'vimeo' && asset.thumbTime > 0) {
      playerRef.current.seekTo(parseFloat(asset.thumbTime));
    }
    setReady(true);
  };

  useEffect(() => {
    const detectLowPowerMode = async () => {
      const isLowPower = await isLowPowerMode();
      setLowPower(isLowPower);
    };
    detectLowPowerMode();
  }, []);

  useEffect(() => {
    switch (source) {
      case 'vimeo':
        setFileUrl(asset.url);
        if (width && height) {
          setAspectRatio({
            width,
            height,
            float: height / width,
          });
        }

        if (asset.thumbnails.active) {
          setThumbnailUrl(adjustThumbnailSize(asset.thumbnails.base_link, width, height));
        }
        break;
      default:
        setFileUrl(asset.url);
        break;
    }
  }, [source, width, height, asset]);

  useEffect(() => {
    if (playing) setStarted(true);
  }, [playing]);

  useEffect(() => {
    setScrubbingVisibility(scrubbingAlwaysOn);
  }, [scrubbingAlwaysOn]);

  useEffect(() => {
    // Unmute video based on Active state
    if (autoPlay && !mutedProp) {
      setMuted(!active);
    }
  }, [active]);

  useEffect(() => {
    if (!lowPower) {
      if (autoPlay) {
        // If autoPlay is true, auto-play video when in viewport
        setPlaying(inView);
      } else {
        if (!inView) {
          // Pause video when out of viewport and autoPlay is false
          setPlaying(false);
        }
      }
    }
  }, [inView]);

  if (!asset.url && !asset?.playbackId) {
    return null;
  }

  const aspectRatioPercentage = aspectRatio.float * 100;
  return (
    <section ref={ref} className={CSS.wrapper} aria-label={title}>
      <div
        className={`${CSS.aspectRatioWrapper} ${CSS[fit]}`}
        style={{ paddingTop: `${aspectRatioPercentage}%` }}
      >
        <figure
          className={CSS.player}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <figcaption className={CSS.player__caption}>{title}</figcaption>
          {placeholderVisibility && <Placeholder aspectRatio={aspectRatio} url={thumbnailUrl} />}
          {pausable && !defaultControls && (
            <button
              onClick={handleClick}
              onKeyPress={handleKeyPress}
              className={`${CSS.player__button}`}
              data-action={playing ? 'Pause video' : 'Play video'}
            >
              {playing ? (
                <span
                  className={`
										${CSS.player__button__icon}
										${scrubbingVisibility ? CSS.isVisible : CSS.isHidden}
									`}
                >
                  Pause
                </span>
              ) : (
                <span className={CSS.player__button__icon}>Play</span>
              )}
            </button>
          )}
          {!lowPower && (
            <>
              <ReactPlayer
                ref={playerRef}
                className={`react-player ${CSS.reactPlayer}`}
                width="100%"
                height="100%"
                url={fileUrl}
                config={config}
                playing={playing}
                controls={defaultControls}
                loop={loop}
                muted={muted}
                onPlay={handlePlay}
                onSeek={handleSeek}
                onPause={handlePause}
                onEnded={handleEnded}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onReady={handleReady}
                style={{ pointerEvents: 'none' }}
                playsinline
              />
              {scrubbing && !defaultControls && (
                <Scrubbing
                  title={title}
                  started={started}
                  played={played}
                  duration={duration}
                  playing={playing}
                  loaded={loaded}
                  time={time}
                  isVisible={scrubbingVisibility}
                  onSeekMouseDown={handleSeekMouseDown}
                  onSeekChange={handleSeekChange}
                  onSeekMouseUp={handleSeekMouseUp}
                  onPlayPause={handlePlayPause}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              )}
            </>
          )}
        </figure>
      </div>
    </section>
  );
};

const VideoPlayer = props => {
  const { className, ...delegated } = props;
  return (
    <div className={className}>
      <VideoPlayerInner {...delegated} />
    </div>
  );
};

export default VideoPlayer;
