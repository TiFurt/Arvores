import { SafeResourceUrl } from "@angular/platform-browser";

export interface TreeAlgorithm {
  name: string;
  description: string;
  code: string;
  video: string;
  videoSafeUrl?: SafeResourceUrl;
  route: string;
}
