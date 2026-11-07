export const mission = "用作品、照片和笔记，留下一个可以自己说话的人。";

export const positioning = "做 AI 应用，也用摄影看日常。";

export const workPieces = [
  {
    name: "LinkPhoto",
    title: "AI 摄影预约",
    summary: "把一次拍摄需求说清楚，并留出让人修改的位置。",
  },
  {
    name: "Club Copilot",
    title: "社团里的重复劳动",
    summary: "把识别、整理和提醒收成可以核对的步骤。",
  },
  {
    name: "Drift OS",
    title: "多角色协作实验",
    summary: "让过程看得见：谁在做、做到哪、哪里该由人接手。",
  },
] as const;

export const photoSlots = [
  { id: "01", label: "街口" },
  { id: "02", label: "室内的光" },
  { id: "03", label: "人" },
  { id: "04", label: "器物" },
  { id: "05", label: "夜里的窗" },
  { id: "06", label: "一条路" },
] as const;

export const journalNotes = [
  {
    date: "2026-11-06",
    title: "先把桌子摆好",
    body: "作品、照片和笔记放在同一处。页面先保持安静。",
  },
  {
    date: "2026-09-18",
    title: "判断要看得见",
    body: "工具如果替人做了决定，人得能看懂，并且改得了。",
  },
  {
    date: "2026-06-02",
    title: "照片也是短记",
    body: "选哪一张、放在哪一张后面，本身就是在写一句话。",
  },
] as const;

export const contacts = [
  { label: "邮箱", href: "mailto:hello@example.com", value: "hello@example.com" },
  { label: "GitHub", href: "https://github.com/888Ocean", value: "888Ocean" },
] as const;
