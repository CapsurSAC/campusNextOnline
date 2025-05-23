export function parseLRC(lrcText: string) {
  return lrcText
    .split('\n')
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{2})?)\](.*)/);
      if (!match) return null;
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      return { time, text: match[3].trim() };
    })
    .filter(Boolean) as { time: number; text: string }[];
}