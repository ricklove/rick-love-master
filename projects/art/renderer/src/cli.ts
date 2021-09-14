import { exec } from 'child_process';
import { createScreenshots } from './create-screenshot';

export const run = async () => {
  const destDir = `./screenshots/test/${Date.now()}`;
  const framesPerSecond = 10;

  console.log(`# Capture frames`, { destDir });
  await createScreenshots({
    url: `http://localhost:3042/art/circles?tokenId=42`,
    destDir,
    framesPerSecond,
    frames: 5 * 60,
    size: {
      width: 600,
      height: 600,
    },
  });

  // Create movie with ffmpeg
  console.log(`# Create movie`);
  // const command = `ffmpeg -framerate ${framesPerSecond} -i %06d.png -pix_fmt yuv420p -vb 20M _output.mp4`;
  const command = `ffmpeg -framerate ${framesPerSecond} -i %06d.png -pix_fmt yuv420p -c:v libx264 -preset slow -crf 22 -movflags +faststart _output.mp4`;
  // const command = `ffmpeg -framerate 10 -i %06d.png -pix_fmt yuv420p -c:v libx264 -preset slow -crf 22 -movflags +faststart _output.mp4`;
  await exec(command, {
    cwd: destDir,
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
