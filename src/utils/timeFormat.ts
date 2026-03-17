export const formatTimecode = (time: number, includeFrames: boolean = true) => {
  const hours = Math.floor(time / 3600);
  const min = Math.floor((time % 3600) / 60);
  const sec = Math.floor(time % 60);
  const base = `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  
  if (includeFrames) {
    const frames = Math.floor((time - Math.floor(time)) * 24); // Assuming 24fps
    return `${base}:${frames.toString().padStart(2, '0')}`;
  }
  return base;
};
