console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);

const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
};

func();

import '.';
