import axios from "axios";

const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

interface CloudflareConfig {
  apiToken: string;
  accountId: string;
}

const createCloudflareClient = (config: CloudflareConfig) => {
  return axios.create({
    baseURL: `${CLOUDFLARE_API_BASE}/accounts/${config.accountId}`,
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    timeout: 60000, // Video uploads can take a while
  });
};

export interface CloudflareVideo {
  uid: string;
  thumbnail: string;
  thumbnailTimestamp: string;
  playback: {
    hls: string;
    dash: string;
  };
  created: string;
  modified: string;
  size: number;
  status: {
    state: "uploading" | "transcoding" | "ready" | "error";
    pct: number;
    errorMsgCode: string | null;
    errorMsgText: string | null;
  };
  meta: {
    name: string;
  };
}

export interface CloudflareVideoList {
  result: CloudflareVideo[];
  result_info: {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface CloudflareDirectUpload {
  uploadURL: string;
  uid: string;
}

export interface CloudflareStreamOptions {
  apiToken: string;
  accountId: string;
}

class CloudflareStream {
  private client: ReturnType<typeof createCloudflareClient>;

  constructor(config: CloudflareConfig) {
    this.client = createCloudflareClient(config);
  }

  /**
   * Get a direct upload URL for uploading videos
   * Use this for client-side uploads
   */
  async createDirectUpload(): Promise<CloudflareDirectUpload> {
    const response = await this.client.post("/stream/direct_upload", {
      maxDurationSeconds: 14400, // 4 hours max
      requireSignedUrls: false,
      allowedOrigins: [],
    });
    return response.data.result;
  }

  /**
   * Upload a video file (server-side)
   */
  async uploadVideo(filePath: string, fileName: string): Promise<CloudflareVideo> {
    const response = await this.client.post("/stream", {
      file: {
        path: filePath,
      },
      meta: {
        name: fileName,
      },
    });
    return response.data.result;
  }

  /**
   * Get video details
   */
  async getVideo(videoId: string): Promise<CloudflareVideo> {
    const response = await this.client.get(`/stream/${videoId}`);
    return response.data.result;
  }

  /**
   * List all videos
   */
  async listVideos(page = 1, perPage = 25): Promise<CloudflareVideoList> {
    const response = await this.client.get("/stream", {
      params: { page, per_page: perPage },
    });
    return response.data;
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: string): Promise<void> {
    await this.client.delete(`/stream/${videoId}`);
  }

  /**
   * Generate a signed URL for private videos
   */
  async generateSignedUrl(videoId: string, expiresIn = 3600): Promise<string> {
    // Note: This requires setting up signed URL keys in Cloudflare dashboard
    const response = await this.client.post(`/stream/${videoId}/signed-urls`, {
      expiry: expiresIn, // seconds from now
    });
    return response.data.result.signedUrl;
  }

  /**
   * Get HLS playback URL
   */
  getHlsUrl(videoId: string): string {
    return `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(videoId: string, options?: { width?: number; time?: number }): string {
    const base = `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/thumbnails`;
    const params = new URLSearchParams();
    
    if (options?.width) params.set("width", options.width.toString());
    if (options?.time) params.set("time", options.time.toString());
    
    return params.toString() ? `${base}.jpg?${params}` : `${base}.jpg`;
  }
}

// Factory function to create client with config
export const createCloudflareStream = (options: CloudflareStreamOptions) => {
  return new CloudflareStream({
    apiToken: options.apiToken,
    accountId: options.accountId,
  });
};

// Default export for use with environment variables
export const cloudflareStream = new CloudflareStream({
  apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
});

export default cloudflareStream;