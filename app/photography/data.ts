export type PhotographyImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  placement: "full" | "left" | "right";
};

export type PhotographyStory = {
  slug: string;
  index: string;
  title: string;
  titleCn: string;
  eyebrow: string;
  summary: string;
  note: string;
  place: string;
  period: string;
  depth: string;
  accent: string;
  layout: "wide" | "portrait" | "offset" | "quiet";
  opening: string;
  fieldNote: string;
  closing: string;
  images: PhotographyImage[];
};

export const photographyStories: PhotographyStory[] = [
  {
    slug: "after-low-tide",
    index: "01",
    title: "After low tide",
    titleCn: "退潮之后",
    eyebrow: "Salt, wind and an unfinished horizon",
    summary: "海水退回边界以后，沙、泡沫与最后一束光暂时接管了海岸。",
    note: "这组视觉原型用海岸的呼吸测试一段缓慢、连续的观看节奏。真实作品接入后，文字与顺序都可以独立替换。",
    place: "Edge of the Pacific",
    period: "Late summer",
    depth: "00—08 M",
    accent: "#ef8c6f",
    layout: "wide",
    opening: "The coast is most honest after the water leaves.",
    fieldNote: "我沿着退潮线往回走，等泡沫、沙粒和最后一束暖光自己完成构图。",
    closing: "Nothing ends at the shoreline; it only changes direction.",
    images: [
      {
        src: "/photography/after-low-tide-01.jpg",
        width: 1800,
        height: 1197,
        alt: "日落时的海滩与靠岸浪花",
        caption: "The horizon keeps the last warm light.",
        placement: "full",
      },
      {
        src: "/photography/after-low-tide-02.jpg",
        width: 1600,
        height: 1065,
        alt: "海岸边缓慢移动的潮水",
        caption: "What leaves is also what reveals.",
        placement: "left",
      },
      {
        src: "/photography/after-low-tide-03.jpg",
        width: 1600,
        height: 1067,
        alt: "海面与远处天空形成的安静边界",
        caption: "A small pause between two tides.",
        placement: "right",
      },
    ],
  },
  {
    slug: "city-holds-its-breath",
    index: "02",
    title: "The city holds its breath",
    titleCn: "城市屏住呼吸",
    eyebrow: "Order appears for only a second",
    summary: "人群离开画面的一瞬间，玻璃、道路和阴影开始显露自己的秩序。",
    note: "不是一组建筑分类，而是关于城市短暂安静下来的证据。观看顺序从尺度开始，最后回到一处微小的光。",
    place: "Streets without a map",
    period: "Weekdays / 17:40",
    depth: "08—18 M",
    accent: "#efb44f",
    layout: "portrait",
    opening: "For one crossing, the city becomes symmetrical.",
    fieldNote: "人群短暂离开以后，玻璃、道路和影子开始暴露城市原本的呼吸节奏。",
    closing: "The lights return, but the pause remains in the frame.",
    images: [
      {
        src: "/photography/city-breath-01.jpg",
        width: 1800,
        height: 1200,
        alt: "高楼之间延伸的城市街道",
        caption: "For one crossing, the city becomes symmetrical.",
        placement: "full",
      },
      {
        src: "/photography/city-breath-02.jpg",
        width: 1600,
        height: 1067,
        alt: "安静的现代建筑外立面",
        caption: "Glass remembers every passing sky.",
        placement: "right",
      },
      {
        src: "/photography/city-breath-03.jpg",
        width: 1600,
        height: 1067,
        alt: "城市建筑与傍晚阴影",
        caption: "A window stays awake after everyone leaves.",
        placement: "left",
      },
    ],
  },
  {
    slug: "eastbound",
    index: "03",
    title: "Eastbound",
    titleCn: "向东移动",
    eyebrow: "Distance measured by changing light",
    summary: "离开熟悉坐标以后，山、雾与陌生道路把时间重新切成更长的单位。",
    note: "这一组不是旅行目的地清单，而是一段移动中的心理距离。照片从远景逐渐靠近，让观看本身成为行进。",
    place: "Coordinates in transit",
    period: "Between departures",
    depth: "18—32 M",
    accent: "#80c8bd",
    layout: "offset",
    opening: "Distance changes when light reaches it.",
    fieldNote: "这段路没有明确终点，只有不断变化的雾、山脊和车窗里的方向感。",
    closing: "Arrival is only another edge of the map.",
    images: [
      {
        src: "/photography/eastbound-01.jpg",
        width: 1800,
        height: 1196,
        alt: "晨光中的群山与岩石",
        caption: "Distance changes when light reaches it.",
        placement: "full",
      },
      {
        src: "/photography/eastbound-02.jpg",
        width: 1600,
        height: 2400,
        alt: "纵向构图中的远方自然景观",
        caption: "The road narrows into a single decision.",
        placement: "left",
      },
      {
        src: "/photography/eastbound-03.jpg",
        width: 1600,
        height: 1067,
        alt: "湖泊、树林与远处的山",
        caption: "Arrival is only another edge of the map.",
        placement: "right",
      },
    ],
  },
  {
    slug: "what-light-kept",
    index: "04",
    title: "What light kept",
    titleCn: "被光留下的日常",
    eyebrow: "Small evidence from ordinary days",
    summary: "没有宏大事件，只有窗户、房间、衣角和偶然落在生活表面的颜色。",
    note: "日常片段被放在同一个故事里，不是因为题材相同，而是因为它们共享一种被忽略的安静。",
    place: "Near home",
    period: "Collected slowly",
    depth: "32—45 M",
    accent: "#b8ce81",
    layout: "quiet",
    opening: "A room becomes visible before the night does.",
    fieldNote: "没有事件发生，光只是短暂落在窗户、衣角和房间表面，留下可以被重新观看的证据。",
    closing: "Nothing happened, and that was the point.",
    images: [
      {
        src: "/photography/kept-light-01.jpg",
        width: 1800,
        height: 1201,
        alt: "暮色中被灯光照亮的住宅",
        caption: "A room becomes visible before the night does.",
        placement: "full",
      },
      {
        src: "/photography/kept-light-02.jpg",
        width: 1600,
        height: 2400,
        alt: "日常空间中的竖幅光影",
        caption: "Ordinary light, held for a little longer.",
        placement: "right",
      },
      {
        src: "/photography/kept-light-03.jpg",
        width: 1600,
        height: 2215,
        alt: "生活片段中的人物与自然光",
        caption: "Nothing happened, and that was the point.",
        placement: "left",
      },
    ],
  },
];

export function getPhotographyStory(slug: string) {
  return photographyStories.find((story) => story.slug === slug);
}

export function getNextPhotographyStory(slug: string) {
  const index = photographyStories.findIndex((story) => story.slug === slug);
  if (index < 0) return photographyStories[0];
  return photographyStories[(index + 1) % photographyStories.length];
}
