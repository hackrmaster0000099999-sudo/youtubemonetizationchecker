import { VideoData, VideoDownloadOption, VideoDownloadResult } from './types';

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function generateDownloadOptions(video: VideoData): VideoDownloadOption[] {
  const duration = video.durationSeconds && video.durationSeconds > 0 ? video.durationSeconds : 210; // default ~3.5 min if unknown
  const videoId = video.id;

  const calculateSize = (bitrateKbps: number): { bytes: number; formatted: string } => {
    const bytes = Math.round((bitrateKbps * 1000 / 8) * duration);
    return {
      bytes,
      formatted: formatByteSize(bytes),
    };
  };

  const rawOptions: Array<{
    id: string;
    label: string;
    resolution: string;
    quality: string;
    extension: 'mp4' | 'webm' | 'mp3' | 'm4a';
    type: 'video' | 'audio';
    bitrateKbps: number;
    fps?: number;
    codec: string;
    hasAudio: boolean;
    hasVideo: boolean;
    note?: string;
    isPopular?: boolean;
  }> = [
    // Video MP4 Formats
    {
      id: `mp4-1080p`,
      label: '1080p Full HD',
      resolution: '1920x1080',
      quality: '1080p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 5200,
      fps: 60,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Best quality for desktop & TV displays',
      isPopular: true,
    },
    {
      id: `mp4-720p`,
      label: '720p HD',
      resolution: '1280x720',
      quality: '720p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 2600,
      fps: 60,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Crisp HD quality, fast download speed',
      isPopular: true,
    },
    {
      id: `mp4-480p`,
      label: '480p SD',
      resolution: '854x480',
      quality: '480p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 1200,
      fps: 30,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Standard TV quality, balanced file size',
    },
    {
      id: `mp4-360p`,
      label: '360p Medium',
      resolution: '640x360',
      quality: '360p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 650,
      fps: 30,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Universal mobile compatibility',
    },
    {
      id: `mp4-240p`,
      label: '240p Low',
      resolution: '426x240',
      quality: '240p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 350,
      fps: 30,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Compact size for low storage',
    },
    {
      id: `mp4-144p`,
      label: '144p Data Saver',
      resolution: '256x144',
      quality: '144p',
      extension: 'mp4',
      type: 'video',
      bitrateKbps: 180,
      fps: 30,
      codec: 'H.264 / AAC',
      hasAudio: true,
      hasVideo: true,
      note: 'Minimal data usage',
    },

    // Video WEBM Formats
    {
      id: `webm-1080p`,
      label: '1080p WEBM (VP9)',
      resolution: '1920x1080',
      quality: '1080p',
      extension: 'webm',
      type: 'video',
      bitrateKbps: 4400,
      fps: 60,
      codec: 'VP9 / Opus',
      hasAudio: true,
      hasVideo: true,
      note: 'High efficiency open-source format',
    },
    {
      id: `webm-720p`,
      label: '720p WEBM (VP9)',
      resolution: '1280x720',
      quality: '720p',
      extension: 'webm',
      type: 'video',
      bitrateKbps: 2200,
      fps: 60,
      codec: 'VP9 / Opus',
      hasAudio: true,
      hasVideo: true,
      note: 'Smooth browser playback',
    },

    // Audio Formats
    {
      id: `mp3-320k`,
      label: '320 kbps Studio Audio',
      resolution: 'Audio (48 kHz)',
      quality: '320k',
      extension: 'mp3',
      type: 'audio',
      bitrateKbps: 320,
      codec: 'MP3 (MPEG-1 Audio Layer III)',
      hasAudio: true,
      hasVideo: false,
      note: 'Maximum clarity & studio fidelity',
      isPopular: true,
    },
    {
      id: `m4a-256k`,
      label: '256 kbps AAC / M4A',
      resolution: 'Audio (44.1 kHz)',
      quality: '256k',
      extension: 'm4a',
      type: 'audio',
      bitrateKbps: 256,
      codec: 'AAC / M4A',
      hasAudio: true,
      hasVideo: false,
      note: 'Optimized for Apple Music & iOS',
    },
    {
      id: `mp3-128k`,
      label: '128 kbps Standard MP3',
      resolution: 'Audio (44.1 kHz)',
      quality: '128k',
      extension: 'mp3',
      type: 'audio',
      bitrateKbps: 128,
      codec: 'MP3 Standard',
      hasAudio: true,
      hasVideo: false,
      note: 'Standard audio for podcasts & voice',
    },
    {
      id: `mp3-64k`,
      label: '64 kbps Compact Audio',
      resolution: 'Audio (22 kHz)',
      quality: '64k',
      extension: 'mp3',
      type: 'audio',
      bitrateKbps: 64,
      codec: 'MP3 Compact',
      hasAudio: true,
      hasVideo: false,
      note: 'Smallest file size for speech',
    },
  ];

  return rawOptions.map((opt) => {
    const size = calculateSize(opt.bitrateKbps);
    return {
      ...opt,
      sizeBytes: size.bytes,
      sizeFormatted: size.formatted,
      downloadUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  });
}

export function buildVideoDownloadResult(video: VideoData): VideoDownloadResult {
  const thumb =
    video.thumbnails.maxres ||
    video.thumbnails.standard ||
    video.thumbnails.high ||
    video.thumbnails.medium ||
    video.thumbnails.default ||
    `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return {
    video: {
      id: video.id,
      title: video.title,
      channelTitle: video.channelTitle,
      channelId: video.channelId,
      thumbnail: thumb,
      duration: video.duration || '0:00',
      durationSeconds: video.durationSeconds || 0,
      viewCount: video.viewCount,
      viewCountText: video.viewCountText,
      publishedAt: video.publishedAt,
    },
    options: generateDownloadOptions(video),
  };
}
