/**
 * Configuration file for Convertiverse supported conversions
 * 
 * This file defines all supported conversion types organized by category.
 * Each conversion specifies:
 * - from: Source format
 * - to: Target format
 * - tool: The conversion tool to use (sharp for images, ffmpeg for video/audio)
 * - mime: MIME type mapping for file validation
 */

module.exports = {
  image: [
    { 
      from: 'JPEG', 
      to: 'PNG', 
      tool: 'sharp',
      mime: { 
        from: ['image/jpeg', 'image/jpg'],
        to: 'image/png'
      }
    },
    { 
      from: 'PNG', 
      to: 'JPEG', 
      tool: 'sharp',
      mime: { 
        from: ['image/png'],
        to: 'image/jpeg'
      }
    },
    { 
      from: 'WEBP', 
      to: 'PNG', 
      tool: 'sharp',
      mime: { 
        from: ['image/webp'],
        to: 'image/png'
      }
    },
    { 
      from: 'PNG', 
      to: 'WEBP', 
      tool: 'sharp',
      mime: { 
        from: ['image/png'],
        to: 'image/webp'
      }
    },
    { 
      from: 'JPEG', 
      to: 'WEBP', 
      tool: 'sharp',
      mime: { 
        from: ['image/jpeg', 'image/jpg'],
        to: 'image/webp'
      }
    },
    { 
      from: 'WEBP', 
      to: 'JPEG', 
      tool: 'sharp',
      mime: { 
        from: ['image/webp'],
        to: 'image/jpeg'
      }
    },
    { 
      from: 'BMP', 
      to: 'PNG', 
      tool: 'sharp',
      mime: { 
        from: ['image/bmp'],
        to: 'image/png'
      }
    },
    { 
      from: 'PNG', 
      to: 'BMP', 
      tool: 'sharp',
      mime: { 
        from: ['image/png'],
        to: 'image/bmp'
      }
    },
    { 
      from: 'TIFF', 
      to: 'PNG', 
      tool: 'sharp',
      mime: { 
        from: ['image/tiff'],
        to: 'image/png'
      }
    },
    { 
      from: 'PNG', 
      to: 'TIFF', 
      tool: 'sharp',
      mime: { 
        from: ['image/png'],
        to: 'image/tiff'
      }
    },
    { 
      from: 'GIF', 
      to: 'PNG', 
      tool: 'sharp',
      mime: { 
        from: ['image/gif'],
        to: 'image/png'
      }
    }
  ],
  video: [
    { 
      from: 'MP4', 
      to: 'AVI', 
      tool: 'ffmpeg',
      mime: { 
        from: ['video/mp4'],
        to: 'video/x-msvideo'
      }
    },
    { 
      from: 'AVI', 
      to: 'MP4', 
      tool: 'ffmpeg',
      mime: { 
        from: ['video/x-msvideo'],
        to: 'video/mp4'
      }
    },
    { 
      from: 'MOV', 
      to: 'MP4', 
      tool: 'ffmpeg',
      mime: { 
        from: ['video/quicktime'],
        to: 'video/mp4'
      }
    },
    { 
      from: 'MP4', 
      to: 'WEBM', 
      tool: 'ffmpeg',
      mime: { 
        from: ['video/mp4'],
        to: 'video/webm'
      }
    },
    { 
      from: 'WEBM', 
      to: 'MP4', 
      tool: 'ffmpeg',
      mime: { 
        from: ['video/webm'],
        to: 'video/mp4'
      }
    }
  ],
  audio: [
    { 
      from: 'MP3', 
      to: 'WAV', 
      tool: 'ffmpeg',
      mime: { 
        from: ['audio/mpeg'],
        to: 'audio/wav'
      }
    },
    { 
      from: 'WAV', 
      to: 'MP3', 
      tool: 'ffmpeg',
      mime: { 
        from: ['audio/wav', 'audio/x-wav'],
        to: 'audio/mpeg'
      }
    },
    { 
      from: 'OGG', 
      to: 'MP3', 
      tool: 'ffmpeg',
      mime: { 
        from: ['audio/ogg'],
        to: 'audio/mpeg'
      }
    },
    { 
      from: 'MP3', 
      to: 'OGG', 
      tool: 'ffmpeg',
      mime: { 
        from: ['audio/mpeg'],
        to: 'audio/ogg'
      }
    },
    { 
      from: 'AAC', 
      to: 'MP3', 
      tool: 'ffmpeg',
      mime: { 
        from: ['audio/aac'],
        to: 'audio/mpeg'
      }
    }
  ]
};
