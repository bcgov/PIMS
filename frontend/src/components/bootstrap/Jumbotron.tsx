import React from 'react';

export const Jumbotron: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="p-5 mb-4 bg-light border rounded-3">
      {props.children}
      {/* <h1>Learn to Create Websites</h1>
      <p class="lead">
        In today's world internet is the most popular way of connecting with the people. At{' '}
        <a href="https://www.tutorialrepublic.com" target="_blank" rel="noreferrer">
          tutorialrepublic.com
        </a>{' '}
        you will learn the essential of web development technologies along with real life practice
        example, so that you can create your own website to connect with the people around the
        world.
      </p>
      <p>
        <a
          href="https://www.tutorialrepublic.com"
          target="_blank"
          class="btn btn-primary btn-lg"
          rel="noreferrer"
        >
          Start learning today
        </a>
      </p> */}
    </div>
  );
};
