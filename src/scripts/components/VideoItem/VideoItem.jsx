import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import VideoPlayer from '../VideoPlayer/VideoPlayer';
import LikeIcon from '@images/like.svg?react';
import CloseIcon from '@images/close.svg?react';

import { useVotesStore } from '@data/votesStore';
import { useGeneralStore } from '@data/generalStore';

import { adjustThumbnailSize } from '@components/VideoPlayer/helpers';

import Styles from './VideoItem.module.scss';

gsap.registerPlugin(ScrollToPlugin);

const VideoItem = ({ content, previousVideo, nextVideo }) => {
  // Stores
  const { activeVideo, setActiveVideo, animationLifecycle, setAnimationLifecycle } =
    useGeneralStore();
  const { votes, setVote } = useVotesStore();

  // States
  const [internalVote, setInternalVote] = useState(votes[content.resource_key] || 'NONE');
  const [isActive, setIsActive] = useState(activeVideo === content.resource_key);
  const [wasActive, setWasActive] = useState(false);

  // Refs
  const $item = useRef();
  const $background = useRef();
  const $closeButton = useRef();
  const $info = useRef();
  const $video = useRef();

  // Variables
  const videoURL = content?.files?.isSuccess
    ? content.files.data.hls.cdns[content.files.data.hls.default_cdn].url
    : null;

  // Functions
  const handleVote = vote => {
    setVote({ key: content.resource_key, vote });
    setInternalVote(vote);
  };

  const handleLike = () => {
    if (internalVote === 'LIKE') {
      handleVote('NONE');
    } else {
      handleVote('LIKE');
    }
  };
  const handleDislike = () => {
    if (internalVote === 'DISLIKE') {
      handleVote('NONE');
    } else {
      handleVote('DISLIKE');
    }
  };

  const toggleActiveVideo = value => {
    setActiveVideo(value);
  };

  const handleNext = () => {
    toggleActiveVideo(nextVideo);
  };

  const handlePrevious = () => {
    toggleActiveVideo(previousVideo);
  };

  const openingAnimation = () => {
    const velocity = 0.8; // Variable to control the speed of the animation
    const tl = gsap.timeline({
      onStart: () => {
        setAnimationLifecycle('OPENING');
        // Block Scroll
        gsap.set(document.body, {
          overflow: 'hidden',
          height: '100%',
        });
      },
      onComplete: () => {
        setAnimationLifecycle('OPEN');
      },
    });
    // Scroll to item
    tl.to(window, {
      duration: 1 * velocity,
      scrollTo: $item.current,
    });

    // Animate Item size
    tl.to(
      $item.current,
      {
        duration: 0.8 * velocity,
        height: '100dvh',
        width: '100dvw',
      },
      '>'
    );

    // Animate Video size
    tl.to(
      $video.current,
      {
        duration: 0.8 * velocity,
        aspectRatio: content.width / content.height,
      },
      '>'
    );

    // Animate Background
    tl.to(
      $background.current,
      {
        duration: 0.8 * velocity,
        autoAlpha: '1',
        filter: 'blur(10px) grayscale(1)',
      },
      '<0.4'
    );

    // tl.to($background.current, {
    //   duration: 2 * velocity,
    //   scale: 1.2,
    // });

    // Animate Close button
    tl.to(
      $closeButton.current,
      {
        duration: 0.8 * velocity,
        display: 'block',
        autoAlpha: '1',
        rotate: 180,
      },
      '<'
    );

    // Animate Info
    tl.to(
      $info.current,
      {
        duration: 0.8 * velocity,
        autoAlpha: '0',
      },
      0
    );
  };

  const closingAnimation = () => {
    const velocity = 0.5; // Variable to control the speed of the animation
    const tl = gsap.timeline({
      onStart: () => {
        setAnimationLifecycle('CLOSING');
      },
    });

    // Animate Video size
    tl.to(
      $video.current,
      {
        duration: 0.8 * velocity,
        aspectRatio: 0.666,
      },
      '>'
    );

    // Animate Item size
    tl.to(
      $item.current,
      {
        duration: 0.8 * velocity,
        height: 'auto',
        width: null,
        onComplete: () => {
          setAnimationLifecycle('CLOSED');
          // Unblock Scroll
          gsap.set(document.body, {
            overflow: 'auto',
            height: 'initial',
          });
        },
      },
      '>'
    );

    // Animate Close button
    tl.to(
      $closeButton.current,
      {
        duration: 0.8 * velocity,
        display: 'none',
        autoAlpha: '0',
        rotate: -180,
      },
      0
    );

    // Animate Info
    tl.to(
      $info.current,
      {
        duration: 0.8 * velocity,
        autoAlpha: '1',
      },
      '>'
    );

    // Animate Background
    tl.to($background.current, {
      duration: 0.8 * velocity,
      autoAlpha: '0',
      filter: 'blur(5px) grayscale(0.5)',
    });
    // tl.to($background.current, {
    //   duration: 2 * velocity,
    //   scale: 1,
    // });
  };

  // Effects

  useEffect(() => {
    const localIsActive = activeVideo === content.resource_key;
    setIsActive(localIsActive);
    if (localIsActive) {
      // Current item should be open
      if (animationLifecycle === 'CLOSED') {
        // If all videos are closed, open the active one
        openingAnimation();
        setWasActive(true); // Set the wasActive flag to true
      }
    } else {
      if (wasActive) {
        // If the current item needs to be closed
        closingAnimation();
        setWasActive(false);
      }
    }
  }, [activeVideo, animationLifecycle]);

  return (
    <li
      id={content.resource_key}
      ref={$item}
      className={`
        ${Styles.item}
        ${isActive ? Styles.fullScreen : Styles.initial}
      `}
    >
      <div
        ref={$background}
        className={`
          ${Styles.background}
          ${isActive ? Styles.fullScreen : Styles.initial}
        `}
        style={{
          '--background': `url(${adjustThumbnailSize(
            content.pictures.base_link,
            content.width,
            content.height
          )})`,
        }}
      />
      {!isActive && ( // Big transparent button to open the video detail
        <button
          className={Styles.openFullScreenButton}
          onClick={() => toggleActiveVideo(content.resource_key)}
        >
          Open video detail
        </button>
      )}
      <button
        ref={$closeButton}
        className={Styles.closeFullScreenButton}
        onClick={() => toggleActiveVideo(null)}
        aria-hidden={!isActive}
        aria-label="Close video detail"
      >
        <CloseIcon className={Styles.icon} />
      </button>
      <div ref={$info} className={Styles.info}>
        <h2 className={Styles.title}>{content.name}</h2>
        <div className={Styles.buttons}>
          <button
            onClick={handleLike}
            aria-label={internalVote === 'LIKE' ? 'Remove like' : 'Like'}
            className={`
              ${Styles.button}
              ${Styles.like}
              ${internalVote === 'LIKE' ? Styles.selected : Styles.notSelected}
            `}
          >
            <LikeIcon className={Styles.icon} />
          </button>
          <button
            onClick={handleDislike}
            aria-label={internalVote === 'DISLIKE' ? 'Remove dislike' : 'Disike'}
            className={`
              ${Styles.button}
              ${Styles.dislike}
              ${internalVote === 'DISLIKE' ? Styles.selected : Styles.notSelected}
            `}
          >
            <LikeIcon className={Styles.icon} />
          </button>
        </div>
      </div>
      {content?.files?.isSuccess && ( // This is redundant now, but it was here to avoid a flicker when the video is loaded
        <div ref={$video} className={Styles.videoWrapper}>
          <VideoPlayer
            className={Styles.video}
            asset={{
              url: videoURL,
              thumbnails: content.pictures,
            }}
            source="vimeo"
            height={content.height}
            width={content.width}
            autoPlay
            fit="cover"
            active={isActive}
            scrubbingAlwaysOn={isActive}
            scrubbing
            title={content.name}
            onNext={nextVideo ? handleNext : undefined}
            onPrevious={previousVideo ? handlePrevious : undefined}
          />
        </div>
      )}
    </li>
  );
};

export default VideoItem;
