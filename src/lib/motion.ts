import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

export const SIGNATURE_BEZIER = "0.65, 0, 0.35, 1";
export const SIGNATURE_EASE = "signature";

export function registerSignatureEase() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get(SIGNATURE_EASE)) {
    CustomEase.create(SIGNATURE_EASE, SIGNATURE_BEZIER);
  }
}
