import React from 'react';

function Commands(inputs) {
  const commands = [];
  inputs.inputs.forEach((input, index) => {
    if (input !== 'init') {
      commands.push(<span key={index}>{input}</span>);
    }
  });

  return (
    <div className='modal-bg'>
      <div className="nes-container with-title is-centered modal">
        <p className="title">Commands</p>
        {commands}
        <p>(inputs allowed are +/- or digits)</p>
      </div>
    </div>
  );
}

export default Commands;
