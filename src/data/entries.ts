export type IllustrationKind =
  | 'sunshine'
  | 'first-smile'
  | 'tiny-hands'
  | 'garden'
  | 'first-steps'
  | 'starry'
  | 'birthday'
  | 'snow'
  | 'custom'

export type MemoryEntry = {
  id: string
  year: number
  dateLabel: string
  weekday: string
  title: string
  body: string
  illustration: IllustrationKind
  /** Custom uploaded image as data URL (when illustration === 'custom') */
  imageDataUrl?: string
  favorite?: boolean
}

export type BookMeta = {
  title: string
  subtitle: string
  coverEyebrow: string
  backLine: string
}

export const DEFAULT_YEARS = [2026, 2027, 2028] as const

export const DEFAULT_META: BookMeta = {
  title: '成长手册',
  subtitle: '送给亲爱的安宝',
  coverEyebrow: 'Memory Book',
  backLine: '愿每一页，都有光。',
}

export const DEFAULT_ENTRIES: MemoryEntry[] = [
  {
    id: '2026-01-10',
    year: 2026,
    dateLabel: '1月10日',
    weekday: '星期六',
    title: '第一次晒太阳',
    body: '安宝第一次躺在阳光里。风很轻，毯子暖暖的，小小的片刻，被我们悄悄收进心里。',
    illustration: 'sunshine',
    favorite: true,
  },
  {
    id: '2026-03-22',
    year: 2026,
    dateLabel: '3月22日',
    weekday: '星期日',
    title: '第一声微笑',
    body: '清晨醒来，安宝对着窗外的光弯起嘴角。那一刻房间忽然变得很亮，像整座春天都挤进来了。',
    illustration: 'first-smile',
  },
  {
    id: '2026-06-08',
    year: 2026,
    dateLabel: '6月8日',
    weekday: '星期一',
    title: '小手握紧',
    body: '安宝的手指细细的，却能紧紧握住大人的一根手指。力量不大，却把人牢牢留在原地。',
    illustration: 'tiny-hands',
    favorite: true,
  },
  {
    id: '2026-09-15',
    year: 2026,
    dateLabel: '9月15日',
    weekday: '星期二',
    title: '花园里的午后',
    body: '树荫下，安宝盯着一片晃动的叶子很久。世界对他来说，每一寸都是新的。',
    illustration: 'garden',
  },
  {
    id: '2027-02-14',
    year: 2027,
    dateLabel: '2月14日',
    weekday: '星期日',
    title: '会走路了',
    body: '摇摇晃晃，却一步不肯停。客厅变成跑道，笑声一路追着脚印跑。',
    illustration: 'first-steps',
    favorite: true,
  },
  {
    id: '2027-07-03',
    year: 2027,
    dateLabel: '7月3日',
    weekday: '星期六',
    title: '仰望星星',
    body: '夏夜的阳台，安宝指着天上最亮的那一颗。我们说，那是你的小星星在打招呼。',
    illustration: 'starry',
  },
  {
    id: '2027-11-20',
    year: 2027,
    dateLabel: '11月20日',
    weekday: '星期六',
    title: '两岁生日',
    body: '蛋糕上的蜡烛轻轻摇曳。安宝吹气的样子认真又可爱，愿望大概是再吃一口奶油。',
    illustration: 'birthday',
    favorite: true,
  },
  {
    id: '2028-01-05',
    year: 2028,
    dateLabel: '1月5日',
    weekday: '星期三',
    title: '第一场雪',
    body: '雪花落在帽子上，安宝伸手去接，又哈哈笑着抖落。冬天忽然变得温柔起来。',
    illustration: 'snow',
  },
  {
    id: '2028-05-18',
    year: 2028,
    dateLabel: '5月18日',
    weekday: '星期四',
    title: '幼儿园的早晨',
    body: '背上小书包，回头挥手。门口的阳光很长，安宝的影子也跟着长大了一点。',
    illustration: 'garden',
    favorite: true,
  },
  {
    id: '2028-08-30',
    year: 2028,
    dateLabel: '8月30日',
    weekday: '星期三',
    title: '晚风与故事',
    body: '睡前故事讲到一半，安宝已经靠在肩上睡着了。窗外虫鸣细细的，像书页还在轻轻翻。',
    illustration: 'starry',
  },
]

/** @deprecated use DEFAULT_ENTRIES via HandbookProvider */
export const entries = DEFAULT_ENTRIES
export const BOOK_TITLE = DEFAULT_META.title
export const BOOK_SUBTITLE = DEFAULT_META.subtitle
export const YEARS = DEFAULT_YEARS
export const WORD_COUNT = 488

export function yearToPageIndex(
  year: number,
  list: MemoryEntry[] = DEFAULT_ENTRIES,
): number {
  const idx = list.findIndex((e) => e.year === year)
  return idx >= 0 ? idx + 1 : 1
}

export function computeWordCount(list: MemoryEntry[], meta: BookMeta): number {
  const text = [meta.title, meta.subtitle, meta.backLine, ...list.map((e) => e.title + e.body)].join('')
  return [...text].length
}

export function createBlankEntry(year = new Date().getFullYear()): MemoryEntry {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return {
    id: `entry-${Date.now()}`,
    year,
    dateLabel: `${now.getMonth() + 1}月${now.getDate()}日`,
    weekday: weekdays[now.getDay()] ?? '星期一',
    title: '新的一页',
    body: '在这里写下新的记忆……',
    illustration: 'sunshine',
  }
}
