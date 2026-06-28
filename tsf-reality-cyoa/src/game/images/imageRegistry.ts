/**
 * 游戏图像注册表 — 映射ID到本地图像路径
 * 所有图像存储在 g:\新建文件夹 (18)\assets\ 目录
 * 部署时图像需复制到 public/assets/ 目录
 */

// 开发环境图像路径前缀
const ASSETS_BASE = '/assets/'

// 图像映射表
const imageMap: Record<string, string> = {
  // ===== 角色立绘 (portrait) =====
  char_lamia: 'char_lamia.png',
  char_vampire: 'char_vampire.png',
  char_werewolf: 'char_werewolf.png',
  char_arachne: 'char_arachne.png',
  char_alraune: 'char_alraune.png',
  char_harpy: 'char_harpy.png',
  char_mermaid: 'char_mermaid.png',
  char_slime: 'char_slime.png',
  char_succubus: 'char_succubus.png',
  char_kitsune: 'char_kitsune.png',

  // ===== 场景背景 (landscape) =====
  bg_town: 'bg_town.png',
  bg_school: 'bg_school.png',
  bg_alley_night: 'bg_alley_night.png',
  bg_hospital: 'bg_hospital.png',
  bg_shrine: 'bg_shrine.png',

  // ===== 道具图标 (landscape) =====
  item_phone: 'item_phone.png',
  item_camera: 'item_camera.png',
  item_flashlight: 'item_flashlight.png',
  item_mirror: 'item_mirror.png',
  item_key: 'item_key.png',

  // ===== UI元素 (square) =====
  ui_compass: 'ui_compass.png',
  ui_map_overview: 'ui_map_overview.png',
}

/**
 * 根据图像ID获取完整图像路径
 */
export function getImagePath(imageId: string): string | null {
  const filename = imageMap[imageId]
  if (!filename) return null
  return `${ASSETS_BASE}${filename}`
}

/**
 * 获取角色立绘路径
 */
export function getCharacterPortrait(characterId: string): string | null {
  // Map NPC IDs to image IDs
  const charMap: Record<string, string> = {
    slime_clerk: 'char_slime',
    vampire_doctor: 'char_vampire',
    werewolf_guard: 'char_werewolf',
    succubus_bartender: 'char_succubus',
    kitsune_miko: 'char_kitsune',
    alraune_florist: 'char_alraune',
    lamia_fortune: 'char_lamia',
    arachne_tailor: 'char_arachne',
    harpy_mail: 'char_harpy',
    mermaid_coach: 'char_mermaid',
    // 默认回退
  }
  const imageId = charMap[characterId]
  if (!imageId) return null
  return getImagePath(imageId)
}

/**
 * 获取场景背景路径
 */
export function getSceneBackground(sceneId: string): string | null {
  const bgMap: Record<string, string> = {
    subway_station: 'bg_town',
    convenience_store: 'bg_town',
    old_bookstore: 'bg_town',
    residential_area: 'bg_town',
    park: 'bg_town',
    school: 'bg_school',
    hospital: 'bg_hospital',
    shopping_street: 'bg_alley_night',
    bar: 'bg_alley_night',
    library: 'bg_school',
    tailor_shop: 'bg_alley_night',
    cafe: 'bg_town',
    swimming_pool: 'bg_town',
    flower_shop: 'bg_town',
    shrine: 'bg_shrine',
    city_hall: 'bg_shrine',
    church: 'bg_shrine',
    abyss_corridor: 'bg_alley_night',
  }
  const imageId = bgMap[sceneId]
  if (!imageId) return null
  return getImagePath(imageId)
}

/**
 * 获取道具图像路径
 */
export function getItemImage(itemId: string): string | null {
  const itemMap: Record<string, string> = {
    phone: 'item_phone',
    camera: 'item_camera',
    flashlight: 'item_flashlight',
    mirror_hand: 'item_mirror',
    strange_compass: 'ui_compass',
    old_key: 'item_key',
    whistle: 'item_mirror',
    silk_thread: 'item_key',
    scale_pendant: 'item_mirror',
  }
  const imageId = itemMap[itemId]
  if (!imageId) return null
  return getImagePath(imageId)
}

/**
 * 检查图像是否存在
 */
export function hasImage(imageId: string): boolean {
  return imageId in imageMap
}

/**
 * 获取所有可用图像ID列表
 */
export function getAllImageIds(): string[] {
  return Object.keys(imageMap)
}

/**
 * 获取图像分类列表
 */
export function getImagesByCategory(): Record<string, string[]> {
  return {
    characters: Object.keys(imageMap).filter(k => k.startsWith('char_')),
    backgrounds: Object.keys(imageMap).filter(k => k.startsWith('bg_')),
    items: Object.keys(imageMap).filter(k => k.startsWith('item_')),
    ui: Object.keys(imageMap).filter(k => k.startsWith('ui_')),
  }
}
