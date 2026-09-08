import type { Metadata } from "next";
import { FaqClient, type FaqItem } from "@/components/storefront/faq/FaqClient";
import { SITE_URL, siteConfig, generateFaqJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "الأسئلة المتكررة لدار ليفارو (LÉVARO): تفاصيل الطلب، الشحن والتوصيل في مصر، المقاسات، أقمشة الدينم والصوف، وطرق العناية بالأزياء الفاخرة.",
  keywords: [
    "الأسئلة الشائعة ليفارو",
    "خدمة عملاء ليفارو",
    "توصيل ليفارو",
    "شحن ليفارو مصر",
    "مقاسات ليفارو",
    "خامات ليفارو",
    "Levaro FAQ",
    "Levaro questions",
    "Levaro customer care",
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "الأسئلة الشائعة وخدمة العملاء | LÉVARO CLIENT ARCHIVE",
    description:
      "إجابات وتفاصيل حول طلبات ليفارو، المقاسات، الأقمشة الفاخرة، والعناية بالملابس.",
    url: `${SITE_URL}/faq`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "الأسئلة الشائعة — LÉVARO",
      },
    ],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "exhibition-model",
    number: "01",
    question: "IS LÉVARO AN ONLINE STORE OR A DIGITAL ATELIER EXHIBITION?",
    answer:
      "LÉVARO functions primarily as a digital fashion house, architectural design archive, and permanent showcase of limited editions. We do not operate generic automated checkout carts. Every piece is cataloged as an artistic edition with exhaustive fabric compositions, silhouette proportions, and design manifests.",
  },
  {
    id: "production-runs",
    number: "02",
    question: "HOW ARE LÉVARO EDITIONS CONSTRUCTED & SOURCED?",
    answer:
      "Every edition is constructed in strictly numbered batches utilizing bespoke textiles: 14.5oz shuttle-loom raw selvedge denim woven in Okayama (Japan), 480gsm sculpted virgin wool loomed in Tuscany (Italy), and custom heavyweight mercerized cottons. We reject mass production in favor of meticulous sartorial longevity.",
  },
  {
    id: "sizing-fit",
    number: "03",
    question: "HOW DO I CHOOSE THE CORRECT SILHOUETTE & PROPORTION?",
    answer:
      "Our cuts are engineered around kinetics and volume—predominantly featuring relaxed, boxy architectural fits with dropped shoulders and columnar drape. We recommend selecting your standard size for the intended runway silhouette, or consulting our detailed measurements dossier provided on each edition's showcase page.",
  },
  {
    id: "garment-care",
    number: "04",
    question: "WHAT ARE THE PRESERVATION & CARE PROTOCOLS FOR RAW TEXTILES?",
    answer:
      "Because our garments feature untreated raw selvedge denim and pure virgin wools, standard washing machine cycles will compromise the fiber structure. We strongly advise specialist luxury dry cleaning only, or spot-cleaning with cold water and natural air-drying away from direct sunlight.",
  },
  {
    id: "private-viewing",
    number: "05",
    question: "CAN SPECIAL PIECES BE VIEWED IN PERSON?",
    answer:
      "Private salon viewings and physical consultations are hosted periodically by private invitation at our Cairo design studio. Curators, stylists, and collectors may submit inquiries through our official correspondence channels.",
  },
];

export default function FaqPage() {
  const faqSchema = generateFaqJsonLd(FAQ_ITEMS);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "الرئيسية", url: "/" },
    { name: "الأسئلة الشائعة", url: "/faq" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <FaqClient faqItems={FAQ_ITEMS} />
    </>
  );
}
