// ============================================================================
// cyoaData.ts — 完整CYOA分支叙事网络数据（约38个节点）
// 覆盖7天的叙事流程：D1卧室 → D2商店街 → D3神社 → D4医院
//                      → D5学校 → D6小巷 → D7真相 → 结局
// ============================================================================

import type { CYOANetwork } from '../engine/cyoaEngine';

// ─── D1: 卧室 (dayMin: 1, dayMax: 1) ─────────────────────────────────

const start = {
  id: 'start',
  scene: 'home_bedroom',
  dayMin: 1,
  dayMax: 1,
  title: '陌生的房间',
  narrative:
    '你从一张陌生的床上醒来。天花板上有細微的裂紋——不是普通的裂縫，而是像天空那樣的裂痕。室內的空氣帶著一股淡淡的甜味，像是花香混著消毒水。\n\n' +
    '床頭柜上放著一杯已經涼掉的茶。你完全不記得自己是怎麼來到這裡的——你的記憶一片空白，像被橡皮擦抹去了一樣。但奇怪的是，你並不感到恐慌。就好像……你的身體習慣了這種情況。\n\n' +
    '房間的窗簾半拉開，外面的光線透進來，是那種不自然的金黃色——像是永遠停留在黃昏時刻。你注意到桌上有一封未拆的信，和一面古樸的銅鏡。鏡面反射的光芒讓你感到一陣暈眩。',
  choices: [
    {
      id: 'start_check_room',
      text: '仔細檢查房間裡的物品',
      effects: {},
      resultText: '你走向書桌，每一步都讓木地板發出輕微的吱呀聲。房間裡的一切都帶著一種「有人住但不像家」的違和感。',
      nextNodeId: 'explore_room',
    },
    {
      id: 'start_leave_direct',
      text: '直接出門',
      effects: {},
      resultText: '你決定不浪費時間在房間裡。當你走向門口時，眼角掃過鏡子——你似乎看到鏡中的自己動作慢了半秒。你甩甩頭，把那當作錯覺。',
      nextNodeId: 'leave_home',
    },
  ],
};

const explore_room = {
  id: 'explore_room',
  scene: 'home_bedroom',
  dayMin: 1,
  dayMax: 1,
  title: '書桌上的線索',
  narrative:
    '書桌上整齊地擺放著物品——太整齊了，像是有人刻意佈置的場景。一封信靜靜地躺在桌面中央，信封上沒有郵票、沒有地址，只有你的名字，字跡是你自己的。\n\n' +
    '旁邊的銅鏡約有手掌大小，鏡框上雕刻著複雜的花紋——像是藤蔓，又像是不知名的符文。當你注視它時，鏡面似乎微微波動，就像水面被風吹皺了一樣。\n\n' +
    '抽屜半開著，裡面似乎還有些東西。牆上掛著一幅畫——一片寧靜的鄉村風景——但你總覺得畫中的樹木在微微搖動。',
  choices: [
    {
      id: 'explore_read_letter',
      text: '拆開桌上的信',
      effects: {},
      resultText:
        '你拆開信封。裡面是你自己的筆跡——但寫信的日期是三天後。信的內容只有一句話：「別相信這個世界。」你打了個寒顫，把信收了起來。',
      nextNodeId: 'read_letter',
    },
    {
      id: 'explore_look_mirror',
      text: '拿起銅鏡照自己',
      effects: {
        erosion: 3,
        awareness: 2,
      },
      resultText:
        '你拿起銅鏡。鏡中的你——一開始是正常的——但當你眨眼時，鏡中的你沒有眨眼。你感到一陣寒意從脊椎升起。鏡中的你嘴角微微上揚，露出一個不屬於你的微笑。你急忙把鏡子放下。',
      nextNodeId: 'mirror_vision',
    },
    {
      id: 'explore_take_mirror',
      text: '拿上古鏡並抽屜裡的東西',
      effects: {
        addItem: {
          id: 'ancient_mirror',
          name: 'Ancient Mirror',
          nameCN: '古銅鏡',
          type: 'key_item',
          quantity: 1,
          maxStack: 1,
          usable: false,
          description: '一面刻滿不明符文的古銅鏡。鏡面偶爾會在不該反射的角度映出其他景象。',
          icon: 'item_mirror',
          flags: ['tsf_item'],
        },
      },
      resultText:
        '你將銅鏡放入口袋——它的重量比看起來要沉得多，金屬觸感冰冷刺骨。抽屜裡有一張照片，是你和一個你不認識的人的合影。你們笑得很開心，但你毫無記憶。你把照片也收了起來。',
      nextNodeId: 'leave_home',
    },
  ],
};

const read_letter = {
  id: 'read_letter',
  scene: 'home_bedroom',
  dayMin: 1,
  dayMax: 1,
  title: '未來的來信',
  narrative:
    '信紙在你手中微微顫動——不是你的手在抖，是紙本身。上面的字跡確實是你的，但墨跡看起來是剛寫上去的——在光線下還有些濕潤。\n\n' +
    '「別相信這個世界。」短短六個字，承載著一種絕望的緊迫感。你聞了聞紙張——有一股淡淡的硝煙味，像是鞭炮燃燒後的殘留。下面還有一行小字，幾乎看不清楚：「如果他們告訴你這是正常的——記住，正常不是真的。」\n\n' +
    '你把信翻過來，背面是空白。但在某個角度的光線下，你隱約看到了一張地圖——標記著這座城市的幾個地點：商店街、神社、醫院、學校。每個標記旁邊都畫了一個小小的問號。',
  choices: [
    {
      id: 'read_letter_keep',
      text: '小心翼翼地把信收好',
      effects: {
        awareness: 3,
        addItem: {
          id: 'warning_letter',
          name: 'Warning Letter',
          nameCN: '警告信',
          type: 'key_item',
          quantity: 1,
          maxStack: 1,
          usable: false,
          description: '一封你自己寫給自己的警告信。日期顯示為三天後。信上寫著：「別相信這個世界。」',
          icon: 'item_key',
          flags: ['evidence'],
        },
        setFlag: { has_warning_letter: true },
      },
      resultText: '你小心地將信折好放進口袋。這是你和「未來的自己」之間的第一個聯繫。你會需要它的。',
      nextNodeId: 'leave_home',
    },
    {
      id: 'read_letter_burn',
      text: '用打火機把信燒掉',
      effects: {
        erosion: 5,
        setFlag: { burned_warning_letter: true },
      },
      resultText:
        '火焰吞噬了信紙。它燃燒時發出一種奇怪的嘶嘶聲——像是有什麼東西在紙張中掙扎。灰燼落在桌上，排列成一個無法解讀的符號。你突然感到一陣強烈的後悔，但已經太遲了。',
      nextNodeId: 'leave_home',
    },
  ],
};

const mirror_vision = {
  id: 'mirror_vision',
  scene: 'home_bedroom',
  dayMin: 1,
  dayMax: 1,
  title: '鏡中世界',
  narrative:
    '當你鼓起勇氣再次看向鏡子時，你看到的不是房間的倒影。鏡中呈現的是一個截然不同的地方——一條昏暗的走廊，牆壁上覆蓋著跳動的肉質紋理，像是某種巨大生物的内腔。走廊深處有光——紫色的、脈動的光。\n\n' +
    '你的手還握著鏡框，但你感覺鏡面不再是一個平面——它變成了通往某處的窗口。一股涼風從鏡中吹出，帶著一種無法形容的氣味——不是香的，也不是臭的，只是「不對勁」。\n\n' +
    '鏡中的走廊盡頭，似乎有什麼東西在移動。一個影子——人形的——但它的輪廓在不斷變化，像是由煙霧構成。它似乎察覺到了你在看它，停了下來，緩緩轉頭——',
  choices: [
    {
      id: 'mirror_touch',
      text: '伸手觸碰鏡面',
      effects: {
        erosion: 5,
        awareness: 4,
        setFlag: { touched_mirror: true },
      },
      resultText:
        '你的手指穿過了鏡面——像伸進水中一樣。指尖觸碰到了一片冰冷的空間，不屬於這個房間的空氣。你感到一股力量在拉扯你——不是身體上的，而是意識層面的——要將你拖入鏡中。你猛地抽回手，大口喘氣。你的指尖上殘留著一點銀色的粉末，閃爍著微光。',
      nextNodeId: 'leave_home',
    },
    {
      id: 'mirror_cover',
      text: '用布蓋住鏡子，不再看它',
      effects: {
        awareness: 1,
        setFlag: { covered_mirror: true },
      },
      resultText:
        '你用床單蓋住了鏡子。鏡子在布料下發出一聲低沉的回音——像是一聲嘆息。空氣中的寒意消散了些。你知道這只是暫時的逃避——但那扇門至少現在是關上了。',
      nextNodeId: 'leave_home',
    },
  ],
};

const leave_home = {
  id: 'leave_home',
  scene: 'home_bedroom',
  dayMin: 1,
  dayMax: 1,
  title: '公寓門口',
  narrative:
    '你站在公寓門口。門外的世界籠罩在永恆的黃昏色調中——天空是暗橙色的，雲層靜止不動，像是一幅被畫上去的背景。街道安靜得不太自然——沒有車聲，沒有人聲，只有風穿過行道樹時發出的沙沙聲。\n\n' +
    '你回頭看了一眼房間——房門上掛著一個小小的木牌，刻著一個你不認識的符號。當你凝視它時，它似乎在微微發光。你的直覺告訴你：這棟公寓不屬於你記憶中的任何地方。\n\n' +
    '街道在公寓前分成兩個方向。左轉通往一片密集的建築群——那裡有燈光，有商店的招牌，似乎是人們活動的地方。右轉則是一條向上的石階路，通往一座被樹木環繞的小山丘——你能看到山頂上有一座鳥居的輪廓。',
  choices: [
    {
      id: 'leave_left',
      text: '左轉——去商店街探索',
      effects: {
        awareness: 1,
        setFlag: { went_town_first: true },
      },
      resultText: '你向左轉，走向那些溫暖的燈光。背後傳來關門的聲音——你回頭，看到公寓的窗戶亮起了燈。但你記得你剛才出門時沒有開燈。',
      nextNodeId: 'town_arrival',
    },
    {
      id: 'leave_right',
      text: '右轉——沿石階前往神社',
      effects: {
        setFlag: { went_shrine_first: true },
      },
      resultText: '你踏上石階。腳下的石頭佈滿了青苔，似乎很久沒有人走過了。空氣變得越來越安靜——連風聲都消失了。你聽到自己的心跳在耳邊迴盪。',
      nextNodeId: 'shrine_arrival',
    },
  ],
};

// ─── D2: 商店街 (dayMin: 2, dayMax: 2) ───────────────────────────────

const town_arrival = {
  id: 'town_arrival',
  scene: 'town_square',
  dayMin: 2,
  dayMax: 2,
  title: '商店街廣場',
  narrative:
    '商店街出乎意料地熱鬧。人們來來往往——但他們的臉上都帶著一種你無法描述的表情。不是快樂也不是悲傷——而是一種空白的、禮貌的微笑，像每個人都在扮演著「正常」的角色。\n\n' +
    '廣場中央有一個噴泉——水流的方向有些奇怪，像是在違反重力。你眨眨眼，水流恢復了正常。你又眨了眨眼——這次你確定看到了水逆流而上。\n\n' +
    '廣場周圍有幾家店鋪：一間便利商店、一家花店、一個書報攤。公告欄上貼滿了各種通知和傳單。角落裡有一張長椅，坐著一個正在看報紙的人——報紙拿反了，但他似乎沒有注意到。',
  choices: [
    {
      id: 'town_observe',
      text: '觀察路人的一舉一動',
      effects: {},
      resultText: '你站在人群中觀察。每個人都在做著重複的動作——一模一樣的步伐頻率、一模一樣的表情切換。就像一場精心排練的舞台劇，而你是唯一的觀眾。',
      nextNodeId: 'observe_people',
    },
    {
      id: 'town_bulletin',
      text: '查看公告欄上的內容',
      effects: {},
      resultText: '公告欄上貼滿了色彩鮮豔的傳單——大多是本地商家廣告和社區活動通知。但當你仔細看時，日期欄有一處不對勁。',
      nextNodeId: 'bulletin_board',
    },
    {
      id: 'town_shop',
      text: '走進便利商店',
      effects: {},
      resultText: '便利店的玻璃門自動打開，一陣清脆的門鈴聲響起。櫃檯後站著一個扎著馬尾辮的女孩——她看到你時，笑容燦爛得有些不自然。',
      nextNodeId: 'shop_enter',
    },
  ],
};

const observe_people = {
  id: 'observe_people',
  scene: 'town_square',
  dayMin: 2,
  dayMax: 2,
  title: '模糊的人群',
  narrative:
    '你開始仔細觀察廣場上的人們。剛開始一切似乎都正常——但當你專注於某一個人時，他的臉變得模糊起來。不是你看不清楚——而是他的五官在細微地變化，像是電腦生成的臉孔在加載過程中出現了錯誤。\n\n' +
    '你轉頭看另一個人——同樣的情況。這些人的臉在你直接注視時是清晰的，但在你的餘光中，他們變成了沒有特徵的空白。\n\n' +
    '一個穿著風衣的男人從你身邊走過——他的腳步聲在你的耳朵裡產生了回音，就像踩在一個大教堂的地板上，而不是室外廣場。他走過之後，空氣中留下了一種臭氧的味道——像暴風雨前的氣息。',
  choices: [
    {
      id: 'observe_continue',
      text: '繼續觀察——記錄下這些現象',
      effects: {
        awareness: 3,
        erosion: 1,
        setFlag: { observed_anomaly: true },
      },
      resultText:
        '你掏出手機想拍照——但取景框中的人群完全是正常的，沒有任何模糊。你放下手機，直接用眼睛看——模糊回來了。這個世界拒絕被記錄。那些模糊的臉似乎在無聲地警告你：有些東西不該被看見。',
      nextNodeId: 'town_arrival',
    },
    {
      id: 'observe_shrine',
      text: '不再觀察，直接前往神社',
      effects: {
        awareness: 2,
      },
      resultText: '你移開視線，決定不再深究。但那些模糊的臉已經烙印在你的記憶中——你知道自己無法假裝沒看見。你轉身朝石階方向走去。',
      nextNodeId: 'shrine_arrival',
    },
  ],
};

const bulletin_board = {
  id: 'bulletin_board',
  scene: 'town_square',
  dayMin: 2,
  dayMax: 2,
  title: '公告欄的日期',
  narrative:
    '公告欄上層層疊疊地貼著各種通知。最上面是一張社區報——頭條是「市長龍映女士宣布城市綠化計劃圓滿成功」。日期是——你揉了揉眼睛——1999年3月15日。但你手機上顯示的是2026年6月28日。\n\n' +
    '二十七年。差了二十七年。你查看其他傳單——便利店的促銷海報日期是1999年，房屋出租廣告也是1999年。但這些紙張看起來嶄新如初，沒有泛黃，沒有破損。\n\n' +
    '其中一張較小的海報吸引了你的注意——那是一張尋人啟事。照片中的人模糊不清，但你認出了那個輪廓——和你在公寓抽屜裡看到的那張合影中的陌生人一模一樣。文字寫著：「如果你看到這個人，請告訴他：回家的路還在。」',
  choices: [
    {
      id: 'bulletin_tear',
      text: '撕下一張公告留作證據',
      effects: {
        awareness: 5,
        erosion: 2,
        setFlag: { has_bulletin_evidence: true },
      },
      resultText:
        '你撕下尋人啟事。紙張的觸感很奇怪——它比普通的紙更光滑，像是一種你從未接觸過的材料。當你把它折好放進口袋時，公告欄上原本被遮蔽的部分露出了另一張海報——一張市政府公告，上面寫著：「注意：時間感知異常者請前往市立醫院三樓接受免費檢查。」你感到一陣寒意。',
      nextNodeId: 'town_arrival',
    },
    {
      id: 'bulletin_photo',
      text: '用手機拍照留存',
      effects: {
        awareness: 3,
        setFlag: { photographed_bulletin: true },
      },
      resultText:
        '你拍下了公告欄的照片。但當你檢查相冊時——照片裡只有一塊空白的木板，上面什麼也沒有。公告欄和所有的紙張都在你的鏡頭下消失了。你抬頭——它們又好好地貼在那裡。你的手機無法捕捉這個世界的異常。',
      nextNodeId: 'town_arrival',
    },
  ],
};

const shop_enter = {
  id: 'shop_enter',
  scene: 'convenience_store',
  dayMin: 2,
  dayMax: 2,
  title: '便利店',
  narrative:
    '走進便利店，一股混合著關東煮和清潔劑的味道撲面而來。店鋪不大，但燈光明亮，商品排列整齊——整齊得像樣品，每一件商品都完美地朝向顧客。\n\n' +
    '櫃檯後的女孩看起來二十出頭，繫著一條粉色圍裙，名牌上寫著「小翠」。她看到你時眼睛一亮——那種光芒不是普通店員的職業微笑，而是看到老朋友時的驚喜。\n\n' +
    '「你來啦！」她自然地打招呼，好像你們認識很久了一樣。「今天有新到的……」她停頓了一下，歪著頭看向你，「你的臉色不太好喔。又被噩夢困住了？」她語氣中帶著一種熟悉的關心——但你確信你從來沒有見過她。',
  choices: [
    {
      id: 'shop_talk',
      text: '跟小翠搭話——問她是不是認識你',
      effects: {
        affinity: { npcId: 'cui_slime', amount: 5 },
        setFlag: { met_xiaocui: true },
      },
      resultText: '你問小翠是不是認識你。她愣了一下，然後笑得更開了——但笑聲中帶著一絲苦澀。「你每次都這麼問呢。沒關係，你遲早會想起來的。」她輕輕拍了拍你的手。她的皮膚觸感柔軟得不正常——像是一層極薄的膜包覆著液體。',
      nextNodeId: 'talk_to_xiaocui',
    },
    {
      id: 'shop_buy',
      text: '隨便買點東西——順便觀察店內',
      effects: {
        setFlag: { bought_from_shop: true },
      },
      resultText: '你隨手拿了一瓶水和一個飯糰。結帳時你注意到收銀台旁邊有一個小小的神龕——裡面供奉的不是神像，而是一塊綠色的、像果凍一樣的石頭。小翠見你在看，笑著說：「那是我們家的守護石。」她眨了眨眼，「很漂亮吧？」',
      nextNodeId: 'talk_to_xiaocui',
    },
    {
      id: 'shop_leave',
      text: '匆匆離開——這個地方讓你不安',
      effects: {
        erosion: 2,
      },
      resultText: '你藉口有事匆匆離開。身後傳來小翠的聲音：「路上小心喔！下次再來！」那聲音太溫暖了——溫暖到讓你的後背發涼。',
      nextNodeId: 'shrine_arrival',
    },
  ],
};

const talk_to_xiaocui = {
  id: 'talk_to_xiaocui',
  scene: 'convenience_store',
  dayMin: 2,
  dayMax: 2,
  title: '小翠的秘密',
  narrative:
    '小翠環顧了一下四周——確認沒有其他客人後，她稍微壓低了聲音。「你在調查那些『不對勁』的事情，對吧？」她的眼神變得認真起來——那種認真不太適合她那張娃娃臉。「我可以告訴你一件事——但你別害怕。」\n\n' +
    '她深吸一口氣。「我不是人類。至少……不完全是。」她伸出手——你看著她的手指逐漸變得透明，變成了半透明的膠狀物質，像是透明的果凍。她迅速恢復了原狀，微笑著看你。「我是史萊姆。或者說——這座城市裡有很多像我一樣的存在。」\n\n' +
    '你愣在原地。她繼續說：「這座城市——它是一個……怎麼說呢——」她想了想，「它是人類世界和我們的世界的重疊區域。大部分居民不知道真相。只有像你這樣『能看到』的人才會慢慢發現。」她看著你的眼睛，「而你——你似乎不是第一次來這裡了。」',
  choices: [
    {
      id: 'talk_believe',
      text: '相信她——並追問更多真相',
      effects: {
        awareness: 5,
        erosion: 2,
        affinity: { npcId: 'cui_slime', amount: 5 },
        setFlag: { believed_xiaocui: true },
      },
      resultText: '你選擇相信她。小翠的眼中閃過一絲欣慰——更多的是心疼。「謝謝你相信我。我知道這很難接受。」她從櫃檯下拿出一張摺疊的地圖遞給你。「這個給你——是我以前從一個和你很像的人那裡得到的。上面標記了一些……重要的地方。」',
      nextNodeId: 'shrine_arrival',
    },
    {
      id: 'talk_doubt',
      text: '懷疑她在開玩笑——禮貌性地離開',
      effects: {
        erosion: 3,
        affinity: { npcId: 'cui_slime', amount: -2 },
        setFlag: { doubted_xiaocui: true },
      },
      resultText: '你尷尬地笑了笑，說這一定是某種魔術。小翠的笑容有些勉強：「嗯……你說是就是吧。」她的眼神中有些失望——或者說，是習慣了的無奈。「那……下次再來喔。」你離開時，聽到她輕聲嘆了口氣。',
      nextNodeId: 'shrine_arrival',
    },
  ],
};

// ─── D3: 神社 (dayMin: 3, dayMax: 3) ─────────────────────────────────

const shrine_arrival = {
  id: 'shrine_arrival',
  scene: 'shrine_grounds',
  dayMin: 3,
  dayMax: 3,
  title: '古老神社',
  narrative:
    '石階的盡頭是一座古老的神社。鳥居的朱漆已經斑駁，但依然莊嚴地矗立著。當你穿過鳥居時——你感受到了一種明顯的變化。空氣變得清冷，帶著線香和古老木頭的氣味。城市的噪音消失了，被風鈴聲取代。\n\n' +
    '參道兩旁種滿了高大的杉樹，樹影婆娑。但在那些陰影中，你感覺到有視線在注視著你——不是惡意的，而是好奇的、審視的。你停下腳步，側耳傾聽——風鈴聲中似乎夾雜著低語，你聽不清內容，但它們在你的心中引起了共鳴。\n\n' +
    '神社的正殿前有一個賽錢箱和一個巨大的鈴鐺。旁邊的繪馬架上掛滿了許願牌——有些上面的字跡在你看來時會扭曲變形。角落裡有一扇通往神社後院的門，門簾隨風輕輕飄動。',
  choices: [
    {
      id: 'shrine_pray_choice',
      text: '向神明參拜——投幣搖鈴',
      effects: {},
      resultText: '你投下一枚硬幣，拉動鈴鐺的繩子。鈴聲清澈而響亮——但迴音持續了很久，久到不正常。你在鈴聲中閉上眼睛祈禱——當你睜開眼時，天空的顏色似乎變得更深了一些。',
      nextNodeId: 'shrine_pray',
    },
    {
      id: 'shrine_find_miko',
      text: '尋找神社的巫女',
      effects: {},
      resultText: '你繞過正殿，走向後院。在走廊的轉角處，你差點撞上一個人——一個穿著巫女服的少女，白色的上衣紅色的袴裙。她有金色的眼睛——不是人類的金色，而是真正的、狐狸一般的金色瞳孔。她看著你，微微一笑：「我知道你會來的。」',
      nextNodeId: 'meet_kitsune',
    },
  ],
};

const shrine_pray = {
  id: 'shrine_pray',
  scene: 'shrine_grounds',
  dayMin: 3,
  dayMax: 3,
  title: '祈禱的回應',
  narrative:
    '你站在正殿前，雙手合十。正殿內部昏暗不明，但你隱約看到了一個巨大的鏡子——和你在公寓裡見到的那面古鏡很像，但更大，鑲嵌在神龕中。\n\n' +
    '當你閉上眼睛祈禱時——你聽到了聲音。不是通過耳朵聽到的，而是直接在腦海中響起的。一個女性的聲音，莊嚴而平靜：「你終於開始提問了。很好。但問題比答案更危險——你準備好了嗎？」\n\n' +
    '你猛地睜開眼睛。風鈴在無風的狀態下劇烈搖晃。你感到有什麼東西——一隻看不見的手——輕輕拍了拍你的肩膀。你轉身——空無一人。但在你轉身的瞬間，你看到了賽錢箱旁的地面上有一撮金色的毛髮，在陽光下閃閃發光。',
  choices: [
    {
      id: 'pray_accept',
      text: '在心中回答「我準備好了」',
      effects: {
        awareness: 4,
        erosion: 2,
        setFlag: { accepted_shrine_truth: true },
      },
      resultText: '你的意念剛落，一陣溫柔的風包圍了你。你感覺到一股暖流從腳底升起——像是某種祝福，也像是某種標記。金色的毛髮飄了起來，在空中化為一個微弱的光點，然後消散。你明白自己被「注意」到了。',
      nextNodeId: 'meet_kitsune',
    },
    {
      id: 'pray_retreat',
      text: '後退——離開正殿',
      effects: {
        erosion: 1,
        setFlag: { retreated_from_shrine: true },
      },
      resultText: '你後退了幾步。那個聲音在你的腦海中留下了一句話：「逃避也是選擇。但這個世界——不會等你準備好。」風鈴恢復了平靜。你抹了抹額頭上的冷汗。',
      nextNodeId: 'meet_kitsune',
    },
  ],
};

const meet_kitsune = {
  id: 'meet_kitsune',
  scene: 'shrine_grounds',
  dayMin: 3,
  dayMax: 3,
  title: '狐鈴的登場',
  narrative:
    '巫女站在你面前，微微歪著頭。她的金色眼睛中有著不屬於人類的智慧——和一種無法言說的古老的悲傷。\n\n' +
    '「我是狐鈴——這座神社的守護者。」她的聲音不緊不慢，每一個字都像是在測量你的反應。「你身上有一股……特別的氣味。你接觸過那面鏡子了吧？」她湊近了一些——你聞到了她身上淡淡的桂花香和線香的味道。「那是『界鏡』——通往境界線另一側的入口。你還沒有通過它——但你碰過了。這就足夠讓它們注意到你了。」\n\n' +
    '她後退一步，表情變得嚴肅。「這座城市——正在被改寫。不是用暴力和強制——而是用『常識』。每一條新的常識被植入，這個世界的真實就會被覆蓋一層。神社是少數還能維持境界穩定的地方之一。」她看著你的眼睛，「我一個人守不住太久。」',
  choices: [
    {
      id: 'kitsune_truth',
      text: '問她這座城市到底發生了什麼',
      effects: {
        awareness: 5,
        setFlag: { learned_city_truth: true },
      },
      resultText: '狐鈴沉默了一會兒，然後開口：「這個城市——是一個人類世界和妖怪世界的重疊區域。理事會——由龍映市長領導——正在執行一個名為『常識覆蓋』的計劃。他們在逐步用人類的常識替換掉妖怪存在的真相。」她的聲音低沉下來，「每個人的記憶都在被改寫。你的——也在內。」',
      nextNodeId: 'shrine_secret',
    },
    {
      id: 'kitsune_identity',
      text: '問她到底是什麼——以及為什麼幫我',
      effects: {
        affinity: { npcId: 'kitsune_miko', amount: 5 },
        setFlag: { asked_kitsune_identity: true },
      },
      resultText: '狐鈴的嘴角揚起——但那不是得意的笑，而是一種苦澀的微笑。「我是九尾狐的末裔。活了很久——久到我看著這座城市從村莊變成城鎮，再變成現在的樣子。」她低頭看著自己的手，「我幫你——是因為你是少數能在不被改寫的情況下看到真相的人。我需要你這樣的『錨點』。」',
      nextNodeId: 'shrine_secret',
    },
    {
      id: 'kitsune_friendly',
      text: '表示友好——說自己不會成為敵人',
      effects: {
        affinity: { npcId: 'kitsune_miko', amount: 3 },
        setFlag: { friendly_with_kitsune: true },
      },
      resultText: '狐鈴的表情放鬆了一些——雖然她眼中的警覺沒有完全消失。「那就好。這個世界已經有太多敵人了。」她從袖中取出一張摺好的符咒遞給你。「拿著。如果你遇到無法處理的危險——撕掉它。它能幫你爭取一些時間。」',
      nextNodeId: 'shrine_secret',
    },
  ],
};

const shrine_secret = {
  id: 'shrine_secret',
  scene: 'shrine_grounds',
  dayMin: 3,
  dayMax: 3,
  title: '神社的秘密',
  narrative:
    '狐鈴帶你來到神社後院的一間小屋。屋內收藏著大量的古籍和卷軸——有些書頁上的文字在游動，像是活著的生物。她點亮了一盞油燈，從書架上取下一本厚重的書。\n\n' +
    '「這本《妖世錄》記載了這座城市和妖怪世界的歷史。」她翻開書頁——上面不是文字，而是動態的圖畫，像是一部縮影電影。你看到了這座城市的演變——從荒野到村莊，從村莊到城鎮——然後在某個時刻，畫面中出現了裂縫，像玻璃破碎一樣。兩個世界的邊界——在那個時刻——被打開了。\n\n' +
    '「三百年前，一次儀式出了差錯。境界的帷幕被撕裂了。從那以後，人類世界和妖怪世界就一直在緩慢地融合。理事會的『常識覆蓋』——就是為了管理這個融合過程而建立的。」她合上書，「但他們的管理方式——是讓所有人都忘記妖怪的存在。他們在消除世界的真實面貌。」',
  choices: [
    {
      id: 'secret_help',
      text: '主動提出幫助她守護神社結界',
      effects: {
        affinity: { npcId: 'kitsune_miko', amount: 5 },
        awareness: 3,
        setFlag: { offered_shrine_help: true },
      },
      resultText: '狐鈴看著你，眼中閃過一絲驚訝——然後是溫暖。「你知道嗎——你是第一個主動提出幫助的人類。」她低頭輕笑了一聲，「好吧。那我把神社的後門鑰匙給你。如果你需要庇護或線索——隨時可以來。」她遞給你一把古銅色的鑰匙。',
      nextNodeId: 'hospital_arrival',
    },
    {
      id: 'secret_more_info',
      text: '追問理事會和龍映的更多信息',
      effects: {
        awareness: 4,
        setFlag: { inquired_about_council: true },
      },
      resultText: '狐鈴的表情變得凝重。「龍映——她是理事會的現任領導者。一條東方的黑龍。她已經活了……很久很久了。她的目標——按照她的說法——是創造一個沒有衝突的世界。」狐鈴的聲音帶著諷刺，「但消除差異不等於創造和平。她只是在讓所有人變得一樣。」',
      nextNodeId: 'hospital_arrival',
    },
  ],
};

// ─── D4: 醫院 (dayMin: 4, dayMax: 4) ─────────────────────────────────

const hospital_arrival = {
  id: 'hospital_arrival',
  scene: 'city_hospital',
  dayMin: 4,
  dayMax: 4,
  title: '市立醫院',
  narrative:
    '市立醫院是一棟灰白色的建築，看起來很普通——但太普通了，普通到像是一個模板。窗戶的大小和位置完全對稱，像是由同一個模子刻出來的。大門的自動門在你靠近時打開——但你注意到門上沒有感應器。\n\n' +
    '走進大廳，消毒水的味道撲面而來——但甜膩得有些過分，像是在掩蓋另一種氣味。候診區的椅子上坐著幾個病人——他們都低著頭，一動不動，像蠟像一樣。護士站的護士在低頭寫東西——她的筆沒有碰到紙張，但字跡依然出現在紙上。\n\n' +
    '大廳裡有一塊電子公告牌，循環播放著醫院的信息。你看到一條公告：「三樓——認知調整科——免費為市民提供記憶校正服務。」你的目光停留在「記憶校正」這四個字上，心中的不安開始加劇。',
  choices: [
    {
      id: 'hospital_front',
      text: '去前台護士站詢問情況',
      effects: {},
      resultText: '你走向護士站。護士抬起頭——她的笑容完美無瑕，像是訓練出來的一樣。「您好，請問有什麼可以幫您的？」但當她看向你的時候——你看到她的瞳孔在瞬間變成了垂直的縫，像爬行動物的眼睛。她眨了眨眼，又恢復了正常。',
      nextNodeId: 'front_desk',
    },
    {
      id: 'hospital_basement',
      text: '趁沒人注意，尋找通往地下室的樓梯',
      effects: {
        awareness: 2,
        setFlag: { sneaked_to_basement: true },
      },
      resultText: '你沿著走廊盡頭的樓梯向下。每一層的門都鎖著——直到B3。地下室的氣溫明顯更低，空氣中瀰漫著一種鐵鏽和潮濕的氣味。牆壁上的管子在有規律地脈動，像是血管。遠處傳來低沉的機械運轉聲。',
      nextNodeId: 'basement',
    },
    {
      id: 'hospital_records',
      text: '尋找病歷檔案室',
      effects: {},
      resultText: '你看到走廊左側有一個標著「檔案室」的房間。門虛掩著。你推門進入——房間裡排列著一排排的檔案櫃，從地板到天花板。抽屜上標註著年份——但你看到的不是普通的日期，而是「改寫批次」的編號。',
      nextNodeId: 'records_room',
    },
  ],
};

const front_desk = {
  id: 'front_desk',
  scene: 'city_hospital',
  dayMin: 4,
  dayMax: 4,
  title: '護士站',
  narrative:
    '你站在護士站前。護士的胸牌上寫著「小林」。她的笑容始終保持著同樣的弧度——你注意到她在說話時完全沒有眨眼。\n\n' +
    '「認知調整科在三樓，如果您需要的話。」她指了指電梯的方向。「不需要預約哦，隨時都可以。很多市民都來過了。」她的語氣輕柔而愉悅——但那種愉悅感讓人毛骨悚然，就像推銷員在推銷一個你不需要的產品。\n\n' +
    '你身後的牆上貼著一張海報：「好記憶，好生活。讓專業人士幫您整理那些『不必要的』記憶。」海報上是一個微笑的家庭——每個人的笑容和護士的一模一樣。',
  choices: [
    {
      id: 'front_ask_doctor',
      text: '問她血月醫生在哪裡',
      effects: {
        setFlag: { asked_about_vampire: true },
      },
      resultText: '護士的笑容僵了一下——只是不到零點一秒的停頓，但你捕捉到了。「血月醫生……在五樓的特別診療室。」她回答的聲音稍微低了一些，「您認識他嗎？」她的眼神中閃過一絲警戒。',
      nextNodeId: 'doctor_vampire',
    },
    {
      id: 'front_leave_station',
      text: '敷衍過去，自己探索樓層',
      effects: {
        awareness: 1,
      },
      resultText: '你藉口說走錯了，轉身離開。你感到護士的目光一直盯著你的後背——直到你拐過走廊的轉角。那目光像一根冰刺，讓你脊背發涼。',
      nextNodeId: 'records_room',
    },
  ],
};

const doctor_vampire = {
  id: 'doctor_vampire',
  scene: 'city_hospital',
  dayMin: 4,
  dayMax: 4,
  title: '血月醫生',
  narrative:
    '五樓的特別診療室和醫院的其它樓層截然不同。這裡的裝潢更像是高級酒店的套房——暗紅色的牆紙，復古的吊燈，地上鋪著深色的地毯。空氣中飄著淡淡的紅酒香——或者可能是血液的氣味。\n\n' +
    '「請進。」門內傳來一個低沉的男聲——他的語調優雅而從容，帶著一種長者特有的沉穩。你推門而入。房間裡的辦公桌後坐著一個穿著白大褂的男人——英俊，臉色蒼白得不正常，但有著一雙深邃的、近乎紅色的眼睛。\n\n' +
    '「我是血月——這個醫院的……特別顧問。」他微笑時露出了略顯尖銳的犬齒。他沒有站起來迎接你，只是放下手中的書——書名是《人類血液的奧秘》。「你能來到這個樓層——說明你已經看到了某些不該看到的東西。或者說——你終於看到了該看到的東西。」',
  choices: [
    {
      id: 'vampire_ask',
      text: '直接問他關於記憶校正和理事會的事',
      effects: {
        awareness: 3,
        affinity: { npcId: 'vampire_doctor', amount: 3 },
        setFlag: { confronted_vampire: true },
      },
      resultText: '血月靠回椅背，雙手交疊。「你很直接——我喜歡。」他的紅眼睛在陰影中微微發光。「記憶校正是理事會的主要工具之一。我負責開發這個項目——」他停頓了一下，「——但我不是它的支持者。」他站起身，走向窗邊，「我是一個被困在這裡的旁觀者。和你的處境很像。」',
      nextNodeId: 'records_room',
    },
    {
      id: 'vampire_flee',
      text: '後退——這個人太危險了',
      effects: {
        erosion: 3,
        setFlag: { fled_from_vampire: true },
      },
      resultText: '你後退了一步。血月沒有追上來，只是輕輕嘆了口氣。「不信任是對的。在這座城市裡——信任是一種奢侈品。」他重新坐下，「但如果你改變主意——我的門永遠為『能看到真相的人』敞開。」你退出房間，關上門。門關上的瞬間，你聽到他低聲說了一句：「小心地下室。」',
      nextNodeId: 'basement',
    },
  ],
};

const basement = {
  id: 'basement',
  scene: 'city_hospital',
  dayMin: 4,
  dayMax: 4,
  title: '地下三層',
  narrative:
    '地下三層的空氣潮濕而寒冷。頭頂的日光燈管發出微弱的嗡鳴聲——幾盞已經熄滅，讓走廊的部分區域陷入半明半暗的狀態。牆壁上覆蓋著一層薄薄的冷凝水，在燈光下閃爍著詭異的反光。\n\n' +
    '走廊的盡頭有一扇厚重的鐵門——看起來像是銀行的金庫門，上面有一個旋轉的密碼鎖。門旁的標牌寫著：「B3-07 特殊處理區 —— 僅限授權人員。」\n\n' +
    '鐵門的縫隙中透出了一種幽藍色的光——夾雜著極低頻的震動，你能通過腳底感受到。那種頻率讓你感到噁心——但同時又有種奇怪的吸引力，像是一種你在潛意識中熟悉的「召喚」。門上貼著一張略微泛黃的警告：「注意：記憶回溯可能導致不可逆的人格解體。」',
  choices: [
    {
      id: 'basement_investigate',
      text: '嘗試打開鐵門——看看裡面有什麼',
      effects: {
        awareness: 5,
        erosion: 4,
        setFlag: { entered_basement_vault: true },
      },
      resultText: '密碼鎖上沒有常見的數字鍵盤——只有一個掌紋掃描器。你猶豫了一下，把手放了上去。掃描器亮起紅光——掃過你的手掌——然後發出一聲清脆的「咔噠」聲。門開了。你震驚地看著自己的手——這意味著你的掌紋被登錄在這個系統中。但你完全不記得自己什麼時候來過這裡。',
      nextNodeId: 'records_room',
    },
    {
      id: 'basement_retreat',
      text: '離開地下室——這裡的氣氛太壓抑',
      effects: {
        erosion: 2,
        setFlag: { avoided_basement: true },
      },
      resultText: '你轉身離開。在你爬上樓梯的時候——你聽到了身後鐵門內部傳來了敲擊聲。不規律的——三聲——停頓——三聲——像是在傳遞某種信號。你加快了腳步。',
      nextNodeId: 'hospital_arrival',
    },
  ],
};

const records_room = {
  id: 'records_room',
  scene: 'city_hospital',
  dayMin: 4,
  dayMax: 4,
  title: '檔案室的秘密',
  narrative:
    '檔案室比你想像中大得多——它似乎延伸到了建築物不該有的深度。一排排檔案櫃整齊地排列著，像一座紙張構成的墓地。你打開一個標注著「2023-改寫批次A7」的抽屜——裡面裝滿了文件夾，每個文件夾上都有一個人的照片和名字。\n\n' +
    '你翻開其中一份——這是一個叫「田中花子」的女性的檔案。上面記錄了她的一年級到大學的所有記憶——每一條都有「修改」的標記。她的真實記憶被一條條列出來，旁邊是「替換內容」——一個完全不同的人生。她現在相信自己是個單身女白領，住在市中心的公寓，養了一隻貓。\n\n' +
    '但你翻到最後一頁時——她的手寫備註還在。在頁角，她用顫抖的字跡寫著：「我覺得我不叫花子。但是每次我說出來——大家都說我叫花子。我到底是誰？」你感到一股寒意從腳底升起。這些檔案裡——記錄著每一個市民被改寫的記憶。',
  choices: [
    {
      id: 'records_search_self',
      text: '尋找自己的檔案',
      effects: {
        awareness: 6,
        erosion: 4,
        setFlag: { found_own_file: true },
      },
      resultText: '你在檔案櫃中搜索——找到了標著自己名字的文件夾。你顫抖著翻開——裡面記錄著你過去一年的記憶。但上面的內容和你的記憶完全不同。根據檔案——你並不是外來的調查者。你原本是這座城市的居民——你的記憶被人為地替換成了「外來者」的視角。你一直屬於這裡。這份發現讓你天旋地轉。',
      nextNodeId: 'school_arrival',
    },
    {
      id: 'records_take_evidence',
      text: '帶走幾份關鍵檔案作為證據',
      effects: {
        awareness: 4,
        setFlag: { took_evidence_files: true },
        addItem: {
          id: 'hospital_records',
          name: 'Hospital Records',
          nameCN: '醫院檔案',
          type: 'key_item',
          quantity: 1,
          maxStack: 1,
          usable: false,
          description: '從醫院檔案室取得的市民記憶改寫記錄。是理事會進行「常識覆蓋」的直接證據。',
          icon: 'item_key',
          flags: ['evidence'],
        },
      },
      resultText: '你拿走了三份檔案——花子的、一個叫做「鈴木一郎」的男人的，以及你自己的。當你走出檔案室時——你聽到廣播響了起來：「請注意，有不明人員進入了管制區域。全樓進入封鎖狀態。」你必須趕快離開。',
      nextNodeId: 'school_arrival',
    },
  ],
};

// ─── D5: 學校 (dayMin: 5, dayMax: 5) ─────────────────────────────────

const school_arrival = {
  id: 'school_arrival',
  scene: 'old_school',
  dayMin: 5,
  dayMax: 5,
  title: '廢棄校園',
  narrative:
    '學校位於城市的東部，一棟老舊的建築。大門上鎖著鏽跡斑斑的鐵鏈——但鐵鏈看起來只是裝飾，輕輕一拉就脫落了。你走進校園——操場上雜草叢生，籃球架的框已經生鏽斷裂。\n\n' +
    '但奇怪的是——教學樓的窗戶是乾淨的。沒有一絲灰塵。就像是每天都有人打掃一樣。學校的門牌上寫著「市立第七中學」——但你在這座城市的地圖上從來沒有見過這所學校的記錄。\n\n' +
    '一樓的走廊盡頭有一個時鐘——時針指向三點，分針指向六點。但秒針——它在倒著走。你看了看手機，又看了看時鐘——手機上的時間也在倒退。你揉了揉眼睛，手機恢復了正常。但在那一瞬間——你確信這棟建築不在正常的時間流中。',
  choices: [
    {
      id: 'school_library',
      text: '前往圖書館——找尋舊書中的線索',
      effects: {},
      resultText: '圖書館在二樓。推開厚重的木門——你被一股舊紙張和灰塵的氣味包圍。書架從地板延伸到天花板，光線透過彩色玻璃窗在地板上投下斑駁的光影。角落裡有一張書桌——桌上攤開著一本書，像是有人剛剛還在閱讀。',
      nextNodeId: 'library',
    },
    {
      id: 'school_roof',
      text: '爬上屋頂——視野好，可能有所發現',
      effects: {},
      resultText: '通往屋頂的門虛掩著。你推開門——風立刻迎面撲來。屋頂的視野很好——你可以看到整座城市。但城市的輪廓在你的視野中扭曲了——建築物在邊緣處變得模糊，像是電腦渲染沒有加載完成的貼圖。',
      nextNodeId: 'roof',
    },
    {
      id: 'school_gym',
      text: '探索體育館——那裡的空間最大',
      effects: {},
      resultText: '體育館的雙扇門被推開時發出尖銳的吱呀聲。館內空曠——但地板上有奇怪的劃痕，像是巨大的爪子留下的。體育館盡頭的牆上掛著一幅巨大的標語：「強健體魄——適應新世界」。',
      nextNodeId: 'gymnasium',
    },
  ],
};

const library = {
  id: 'library',
  scene: 'old_school',
  dayMin: 5,
  dayMax: 5,
  title: '圖書館深處',
  narrative:
    '圖書館內的藏書範圍極為廣泛——從天文學到烹飪食譜，從哲學到漫畫，種類雜亂無章。但所有書的出版日期都停在了1999年。沒有一本書是2000年以後出版的。\n\n' +
    '在圖書館最深處——一個需要繞過三個書架才能到達的隱蔽角落——你發現了一本沒有標題的書。它被鎖在一個玻璃展示櫃中。櫃子的鎖已經被撬開了——你是來晚了一步，還是來得正是時候？\n\n' +
    '書的封面是黑色的，沒有一個字。但當你觸碰到它時——你能感受到一種脈動，像是心跳。書脊上有一個銀色的符號——和你在公寓門上看到的那個一模一樣。這是一本關於這個城市真實歷史的書——《境界編年史》。',
  choices: [
    {
      id: 'library_read',
      text: '翻開《境界編年史》閱讀',
      effects: {
        awareness: 6,
        erosion: 3,
        setFlag: { read_boundary_chronicle: true },
      },
      resultText: '你翻開了書。書頁上沒有文字——只有圖像。你看到了一個世界裂開的瞬間——兩個宇宙像蛋殼一樣破碎，然後互相滲透。你看到了人類和妖怪的最初接觸——不是和平的。你看到了理事會的成立——以及它的真實目的：不是管理融合，而是消滅妖怪的存在，讓人類世界完全覆蓋掉妖怪世界。合上書時，你的眼角滲出了一滴血。',
      nextNodeId: 'school_arrival',
    },
    {
      id: 'library_steal',
      text: '把書帶走——不能讓它留在這裡',
      effects: {
        awareness: 3,
        setFlag: { stole_boundary_chronicle: true },
        addItem: {
          id: 'boundary_chronicle',
          name: 'Boundary Chronicle',
          nameCN: '境界編年史',
          type: 'key_item',
          quantity: 1,
          maxStack: 1,
          usable: false,
          description: '記載了人類世界與妖怪世界境界崩壞全過程的秘典。封面上的銀色符文與公寓門上的標記相同。',
          icon: 'item_key',
          flags: ['evidence', 'forbidden'],
        },
      },
      resultText: '你把書藏進外套內。當你離開圖書館時——你聽到身後傳來了書頁翻動的聲音。但你沒有回頭。你不敢回頭。',
      nextNodeId: 'school_arrival',
    },
  ],
};

const roof = {
  id: 'roof',
  scene: 'old_school',
  dayMin: 5,
  dayMax: 5,
  title: '屋頂的身影',
  narrative:
    '屋頂上站著一個人。準確地說——是一個長著翅膀的人。\n\n' +
    '她背對著你，面對著城市的天際線。一對巨大的灰色翅膀從她的背部伸展出來——羽毛在風中微微顫動，像是活著的斗篷。她聽到你的腳步聲，轉過頭來——她的臉很漂亮，但有著一雙鳥類的黃色眼瞳，瞳孔是橫向的橢圓形。\n\n' +
    '「你是新來的。」她的聲音很輕，像是風中飄落的羽毛。「我觀察你好幾天了。你在尋找答案——對吧？」她轉過身來，完整地面對著你。她的腳——不是人類的腳，而是巨大的鳥爪，緊緊抓握著屋頂邊緣的欄杆。「我叫羽音——這所學校……曾經是我的學校。」她微微低頭，「在我還是一個『普通女孩』的時候。」',
  choices: [
    {
      id: 'roof_talk',
      text: '和她交談——詢問她的經歷',
      effects: {
        awareness: 3,
        affinity: { npcId: 'harpy_student', amount: 5 },
        setFlag: { talked_to_harpy: true },
      },
      resultText: '羽音的故事很簡單：她曾是這裡的學生。在一次「事故」之後——她的身體開始改變。羽毛從皮膚下長出來，骨骼重新排列，眼睛變成了鳥類的形狀。學校把她藏了起來——但紙包不住火。當理事會發現她時，他們給了她一個選擇：接受記憶校正，忘記自己的變化，或者——消失。她選擇了逃離。',
      nextNodeId: 'school_arrival',
    },
    {
      id: 'roof_help',
      text: '主動提出幫助她',
      effects: {
        affinity: { npcId: 'harpy_student', amount: 5 },
        setFlag: { offered_harpy_help: true },
      },
      resultText: '羽音用那雙金色的鳥眼注視著你。一陣沉默後——她輕輕落在了你面前的欄杆上。她的爪子抓緊金屬欄杆發出刺耳的聲音。「你知道嗎——你是第一個說要幫我的人。」她的聲音有些顫抖，「連我的父母都接受了記憶校正……他們現在不記得有過一個女兒。」她低下頭，「如果你真的想幫我——那就去市政廳。去阻止理事會。在我和像我一樣的其他人——完全消失之前。」',
      nextNodeId: 'alley_arrival',
    },
  ],
};

const gymnasium = {
  id: 'gymnasium',
  scene: 'old_school',
  dayMin: 5,
  dayMax: 5,
  title: '體育館的印記',
  narrative:
    '體育館的地板上有著大片大片的爪痕——不只是地上的刮傷，而是深深嵌入水泥地面的刻痕。從間距和深度來看——留下這些痕跡的生物至少有三米高，體重以噸計。\n\n' +
    '體育館的鏡子牆面沒有被打破——這很奇怪，因為如果這裡曾經發生過什麼激烈的衝突，鏡子應該是最先碎掉的。但所有的鏡子都完好無損——而且反射的影像有些古怪。當你站在某個角度時——鏡中的體育館空無一人。換一個角度——鏡中塞滿了人影，黑壓壓的一片。\n\n' +
    '其中一面鏡子上用口紅寫著一行字：「我們曾經是人。」字跡已經有些模糊，但依然清晰可讀。下方的角落裡還有一行小字：「B3-07不是盡頭。」這讓你想起了醫院的地下三層——那扇用你的掌紋打開的門。',
  choices: [
    {
      id: 'gym_inspect',
      text: '仔細檢查爪痕和鏡子文字',
      effects: {
        awareness: 4,
        setFlag: { inspected_gym_clues: true },
      },
      resultText: '你蹲下來仔細檢查爪痕。從深度和形狀來看——這不是一次性留下的，而是在很長一段時間內反覆出現的。鏡子上的口紅字跡——你用手機拍了下來，這次照片沒有消失。這是你第一次成功記錄下這個世界的異常。這是個重要的突破。',
      nextNodeId: 'school_arrival',
    },
    {
      id: 'gym_leave_quick',
      text: '迅速離開——這裡讓你感到壓迫',
      effects: {
        erosion: 2,
      },
      resultText: '你逃也似的離開了體育館。但在你關上門的那一刻——你從門縫中看到，體育館內的所有鏡子同時映出了同一個畫面：站立的人群。黑壓壓的一片——全都面向著門口的方向——面向著你。門咔嗒一聲鎖上了。',
      nextNodeId: 'roof',
    },
  ],
};

// ─── D6: 小巷 (dayMin: 6, dayMax: 6) ─────────────────────────────────

const alley_arrival = {
  id: 'alley_arrival',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '昏暗小巷',
  narrative:
    '小巷位於城市最古老的街區。白天這裡也幾乎照不到陽光——兩側的建築高聳而傾斜，讓天空變成了一條狹窄的亮線。牆壁上覆蓋著年代久遠的污漬和塗鴉——但有一部分塗鴉看起來是新的，而且它們在黑暗中微微發光。\n\n' +
    '巷子深處有一個酒吧——招牌上沒有名字，只有一個霓虹燈構成的乾杯符號。酒吧門口的階梯上坐著一個女人——她穿著深紅色的連衣裙，皮膚白皙得近乎發光。她沒有看你——但你知道她在注意你。她的腳邊有一隻黑貓——但貓的尾巴有兩條。\n\n' +
    '街道的空氣中混合著酒精、香水、和某種難以定義的甜美氣味。不遠處有一個垃圾箱——但從箱子下面露出一截光滑的、像是觸手一樣的東西，正在緩緩地蠕動。',
  choices: [
    {
      id: 'alley_graffiti',
      text: '檢查那些發光的塗鴉',
      effects: {},
      resultText: '發光的塗鴉呈現出一種詭異的美感——線條流暢而精確，像是某種古代文字和現代街頭藝術的混合物。當你靠近時——塗鴉的亮度和節奏發生了變化，像是在回應你的接近。',
      nextNodeId: 'graffiti',
    },
    {
      id: 'alley_bar',
      text: '走進那家無名酒吧',
      effects: {},
      resultText: '你推開酒吧的門。一股溫暖的空氣夾雜著爵士樂和香煙的味道撲面而來。酒吧內的燈光昏暗而曖昧，吧檯後站著一個穿著黑色禮服的女人——她的角——是的，她的頭上有兩隻彎曲的山羊角——在昏黃的燈光下閃閃發亮。她看到你，露出了一個危險而迷人的微笑。',
      nextNodeId: 'bar_enter',
    },
  ],
};

const graffiti = {
  id: 'graffiti',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '發光的塗鴉',
  narrative:
    '你走近牆壁。塗鴉的顏料中混合了某種螢光物質——但當你仔細觀察時，你發現那並不是螢光顏料。那些發光的線條是由微小的、活著的生物構成的——像螢火蟲一樣的微生物，但它們在牆壁上組成了精確的圖案。\n\n' +
    '塗鴉的內容是連貫的——左邊描繪了一扇門，中間是一條蜿蜒的小徑，右邊則是一片開闊的空間，其中有著和這個世界截然不同的風景——高聳的塔樓、飛翔的龐大生物、流動的彩色河流。\n\n' +
    '在塗鴉的最下方，有一行不是發光微生物構成的手寫標語，用的是黑色的馬克筆：「境界線的對面——才是真實歸宿。S7站台——午夜列車。」S7——這是你在城市地鐵圖上沒有見過的站編號。',
  choices: [
    {
      id: 'graffiti_photo',
      text: '拍下塗鴉照片——仔細記錄',
      effects: {
        awareness: 4,
        setFlag: { photographed_graffiti: true },
      },
      resultText: '你成功地拍下了塗鴉——照片沒有消失。發光的塗鴉在你的鏡頭中比肉眼看起來更加明亮。你注意到照片的角落裡有一個穿著斗篷的人影——但當你回頭看時，巷子裡空無一人。照片中的那個人影似乎比了一個「跟我來」的手勢。',
      nextNodeId: 'alley_arrival',
    },
    {
      id: 'graffiti_touch',
      text: '伸手觸碰那些發光的微生物',
      effects: {
        awareness: 5,
        erosion: 5,
        setFlag: { touched_graffiti_organisms: true },
      },
      resultText: '你的手指觸碰到發光微生物的那一刻——它們沿著你的手指爬上了你的手臂。沒有痛感——只有一種麻癢的感覺，像是有無數細小的觸鬚在探索你的皮膚。你的手臂開始發出微弱的螢光。那些微生物在你的皮膚上排列成了和牆上一樣的圖案——然後沉入了你的皮膚之下。你看到了片刻的幻象——宇宙裂開的瞬間——然後一切恢復了正常。但你的手臂上留下了一個淡淡的發光印記。',
      nextNodeId: 'secret_passage',
    },
  ],
};

const bar_enter = {
  id: 'bar_enter',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '魅魔酒吧',
  narrative:
    '酒吧內部比外部看起來大得多——空間向內延伸，像一個小型音樂廳。角落裡坐著形形色色的客人——有些看起來完全是人類，有些則明顯「不完全是人類」：一個頭上有角的女士在獨自喝酒，一個手臂覆蓋著鱗片的男人在和酒保交談。\n\n' +
    '吧檯後的女人——她的胸牌上寫著「夜魅」——用一種慵懶而熟練的動作擦拭著酒杯。她的目光掃過你，然後停住了。\n\n' +
    '「新面孔。」她的聲音低沉而沙啞，但充滿磁性。「很少見到『完全的人類』走進來。你迷路了——還是故意找來的？」她微微傾身，頭上的彎角在燈光下閃過一道光澤。「不管怎樣——既然來了，就是客人。想喝點什麼？」她身後的酒架上，一瓶暗紅色的液體在沒有觸碰的情況下自己晃動了一下。',
  choices: [
    {
      id: 'bar_accept_drink',
      text: '接受她的邀請——點一杯酒',
      effects: {
        erosion: 3,
        awareness: 2,
        affinity: { npcId: 'succubus_bartender', amount: 3 },
        setFlag: { drank_at_succubus_bar: true },
      },
      resultText: '你接過了夜魅遞來的酒杯。酒液是深紫色的，在杯中泛著微弱的磷光。第一口——味覺被一種從未體驗過的複雜味道沖擊——甜、辣、苦、還有一種你無法形容的「第五味」。酒液滑入喉嚨後，一陣溫暖從胃部擴散到全身。你頭腦中的迷霧似乎消散了一些——這個世界的運作方式在你眼中變得清晰了那麼一瞬間。只是一瞬間。',
      nextNodeId: 'bar_secret',
    },
    {
      id: 'bar_decline',
      text: '婉拒——保持警惕',
      effects: {
        erosion: 1,
        setFlag: { declined_succubus_drink: true },
      },
      resultText: '你禮貌地拒絕了。夜聳了聳肩——但她的嘴角帶著一絲笑意。「明智的選擇。在這座城市裡——接受陌生人的饋贈往往需要付出代價。」她轉向另一個客人，但她的聲音在你耳邊響起——雖然她沒有開口，「如果你改變主意——我這裡有一些……信息，可以分享。對正在尋找真相的人很有用。」',
      nextNodeId: 'bar_secret',
    },
  ],
};

const secret_passage = {
  id: 'secret_passage',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '秘密通道',
  narrative:
    '在塗鴉最右側的牆壁上——你發現了一條幾乎看不見的縫隙。當你推開它時——整面牆像一扇隱藏的門一樣旋轉打開了。門後是一條向下延伸的石階，兩側的牆壁上嵌著發出柔和藍光的晶體。\n\n' +
    '石階很陡，轉了好幾個彎。你計算了一下——大約向下走了三層樓的深度。空氣在變化——變得溫暖而潮濕，帶著一種礦物質的氣味，像是地下溫泉。你能聽到深處傳來的流水聲——以及一種低頻的共鳴，像是在你胸腔內震動。\n\n' +
    '階梯的盡頭是一扇普通的木門。門上沒有任何標誌——但門縫中透出的光線是一種不自然的銀白色。而且——門在沒有風的情況下輕輕地在內外搖動，像是在呼吸。',
  choices: [
    {
      id: 'passage_open',
      text: '推開木門——看看門後有什麼',
      effects: {
        awareness: 6,
        erosion: 4,
        setFlag: { entered_mirror_dimension: true },
      },
      resultText: '你推開了門。門後的空間讓你屏住了呼吸——這不是一個房間。這是一片無限延伸的鏡面空間——上下左右全都是鏡子，反射著你自己和無數個你。但每一個「你」的動作都不一樣——有的在向你招手，有的在後退，有的在哭泣，有的在微笑。而在地面的中心——浮著一面和你公寓裡一模一樣的古鏡，它靜靜地旋轉著，等待著被觸碰。',
      nextNodeId: 'mirror_dimension',
    },
    {
      id: 'passage_return',
      text: '後退——不貿然進入未知空間',
      effects: {
        erosion: 2,
        setFlag: { avoided_mirror_dimension: true },
      },
      resultText: '你後退了一步。門在你面前緩緩關上——但在完全關閉之前，你聽到了從門縫中傳出的聲音。是你的聲音——但扭曲了——說著：「你也知道還不是時候。下次吧。」你猛地後退了兩步，後背撞上了石壁。是你的幻覺嗎？還是……真的是你自己的聲音？',
      nextNodeId: 'alley_arrival',
    },
  ],
};

const mirror_dimension = {
  id: 'mirror_dimension',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '鏡中世界',
  narrative:
    '你走進了這個由鏡子構成的空間。地面是鏡子——天花闆是鏡子——四面八方都是鏡子。無窮無盡的反射讓你的感官完全失去了方向感。上下變得模糊——你甚至不確定自己是在站立還是在漂浮。\n\n' +
    '懸浮在空間中心的古鏡——和你在公寓裡找到的那面一模一樣——正在緩慢自轉。鏡面沒有反射任何東西——它顯示的是一片星空，無數的星星在其中流動，像是一扇通往宇宙的窗戶。\n\n' +
    '當你靠近時——鏡中的星空旋轉得越來越快，最後形成了一個漩渦。從漩渦的中心——傳出了一個聲音。不是任何你能識別的語言——但你能理解它的意思：「你走在正確的路上。但最終的選擇——將決定這兩個世界的命運。」鏡面上浮現出一行字：S7站台——午夜——帶上你找到的所有證據。',
  choices: [
    {
      id: 'mirror_respond',
      text: '大聲問「你是誰？這是什麼地方？」',
      effects: {
        awareness: 4,
        setFlag: { spoke_to_mirror: true },
      },
      resultText: '你的聲音在鏡面空間中無盡地反射，形成了越來越多的疊加——最後變成了一個宏大的和聲。那個聲音沉默了一會兒——然後回答：「我是境界的守護者——也是被囚禁者。鏡中世界是境界線的物理表現——是兩個世界之間的緩衝區。我在這裡等待——等待一個能夠『同時看到兩邊』的人。」',
      nextNodeId: 'town_hall',
    },
    {
      id: 'mirror_take',
      text: '靠近並觸碰懸浮的古鏡',
      effects: {
        awareness: 6,
        erosion: 6,
        setFlag: { touched_dimensional_mirror: true },
      },
      resultText: '你伸出手——指尖觸碰到鏡面的那一刻——時間停止了。你的意識被拉入了鏡中——穿越了星空、雲層、海洋、城市——你看到了這座城市從未改變的樣子：兩個世界重疊的壯觀景象。人類的建築和妖怪的堡壘在同一空間中並存。你看到了這個世界的真相——而你再也無法忘記。當你回過神來——你發現自己已經不在鏡中世界了。你站在市政廳的大門前。',
      nextNodeId: 'town_hall',
    },
  ],
};

const bar_secret = {
  id: 'bar_secret',
  scene: 'back_alley',
  dayMin: 6,
  dayMax: 6,
  title: '酒吧秘聞',
  narrative:
    '你找了一個角落的位置坐下。夜魅不知何時已經站在你桌邊——手裡拿著一個小筆記本。她把筆記本放在桌上——封面是空白的，但書頁邊緣已經磨損，說明被翻閱過無數次。\n\n' +
    '「這個筆記本——是一個和你一樣的『調查者』留下的。」夜魅點燃了一支細長的香煙，煙霧在昏黃的燈光中扭曲成奇怪的形狀。「他和你一樣——看到了不該看到的東西。他調查理事會——記錄了他們的運作方式——然後有一天，他消失了。」\n\n' +
    '她吐出一口煙圈。「筆記本的最後一頁寫著：『他們不會用暴力阻止你。他們會讓你懷疑自己。當你開始懷疑自己的記憶時——你就已經輸了。』」她看著你，紅色的眼睛在煙霧中閃爍，「我覺得你應該看看這個。」',
  choices: [
    {
      id: 'bar_read_notes',
      text: '翻閱筆記本——看看那些調查記錄',
      effects: {
        awareness: 5,
        erosion: 3,
        setFlag: { read_investigator_notes: true },
      },
      resultText: '筆記本中詳細記錄了理事會的運作方式。常識覆蓋——通過三個步驟：第一，植入微小的記憶偏差（「你昨天好像不是這樣的」）。第二，擴大偏差（「大家都這麼覺得」）。第三，全面覆蓋（「你記錯了，一直以來都是這樣的」）。最後一頁——筆跡變得潦草而瘋狂：「他們來了。他們知道我看到了。如果你看到這個——快逃。或者——去市政廳。在他們完全改寫你之前。」',
      nextNodeId: 'town_hall',
    },
    {
      id: 'bar_ask_help',
      text: '問夜魅是否願意幫助對抗理事會',
      effects: {
        awareness: 3,
        affinity: { npcId: 'succubus_bartender', amount: 5 },
        setFlag: { asked_succubus_for_help: true },
      },
      resultText: '夜魅沉默了很久。香煙燃到了盡頭，她把它按熄在菸灰缸中。「我——和我這樣的存在——我們是理事會計劃的受害者。他們想把我們從人類的認知中抹去。讓妖怪變成『不存在』的東西。」她苦笑了一聲，「所以我當然願意幫忙。但我能做的有限——我不能離開這條街。這是我和龍映的……協議。」',
      nextNodeId: 'town_hall',
    },
  ],
};

// ─── D7: 真相 (dayMin: 7, dayMax: 7) ─────────────────────────────────

const town_hall = {
  id: 'town_hall',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: '市政廳',
  narrative:
    '市政廳比你想像中更加宏偉——它不像是普通的政府建築，更像是宮殿。白色的大理石柱廊上雕刻著精美的浮雕——但你仔細看時，那些浮雕的內容在變化：前一秒是歷史戰役，下一秒變成了神話傳說，再下一秒變成了抽象的幾何圖案。\n\n' +
    '大廳內部寬敞明亮，但光線的來源不明——沒有窗戶，沒有吊燈，但每一個角落都被柔和的光線均勻地照亮。地面是大理石拼花——圖案是一個巨大的、旋轉的圓形符文。\n\n' +
    '大廳的盡頭是一個高台上放著一把椅子——不是普通的辦公椅，而是一把由黑色金屬和深紫色織物構成的華麗坐席。椅子上坐著一個人——一個穿著黑色套裝的女性，長髮如墨，皮膚白皙得近乎透明。當她抬起頭時——你看到了她的眼睛：暗金色的豎瞳。\n\n' +
    '「歡迎光臨。我正在等你。」她的聲音低沉而平靜，帶著一種超越時間的從容。「我是龍映——這座城市的市長，以及——理事會的現任主席。」',
  choices: [
    {
      id: 'hall_demand_truth',
      text: '直接要求她解釋常識覆蓋的真相',
      effects: {
        awareness: 4,
        setFlag: { demanded_truth_from_mayor: true },
      },
      resultText: '龍映沒有生氣——她甚至微微笑了。「你很直接。我喜歡。」她站起來，高跟靴在大理石地面上發出清脆的聲響，每一步都在符文圖案上激起一圈微弱的漣漪。「常識覆蓋——從你們人類的角度來看，確實是一項……不人道的計劃。但從我的角度——它是在保護你們。」她的豎瞳縮了一下，「你們人類的大腦無法同時處理兩個世界的資訊。沒有我們的過濾——你們會發瘋。」',
      nextNodeId: 'face_dragon',
    },
    {
      id: 'hall_show_evidence',
      text: '拿出收集到的證據——當面質問她',
      effects: {
        awareness: 5,
        erosion: 3,
        setFlag: { showed_evidence_to_mayor: true },
      },
      resultText: '你把檔案、筆記本和照片一一擺在兩人之間的地面上。龍映低頭看著那些證據——然後發出了一聲輕柔的笑聲。「你用這些來對抗我？」她揮了揮手——那些證據漂浮起來，在她身邊旋轉。「你拿到的這些——都是我允許你拿到的。包括醫院的檔案、公告欄的日期、那本境界編年史。」她的笑容帶著悲傷，「你以為你在發現真相——但你在每一步都被引導著。被我。」',
      nextNodeId: 'face_dragon',
    },
    {
      id: 'hall_remain_silent',
      text: '保持沉默——等她先開口',
      effects: {
        awareness: 2,
        setFlag: { silent_before_mayor: true },
      },
      resultText: '龍映等待著你的回應——當你沒有說話時，她眼中的讚賞增加了幾分。「聰明。知道什麼時候該說話，什麼時候該聆聽。」她重新坐下，雙手交疊放在膝上。「我來告訴你一個故事吧——一個關於兩個世界的故事，以及為什麼我必須這麼做。」',
      nextNodeId: 'face_dragon',
    },
  ],
};

const face_dragon = {
  id: 'face_dragon',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: '龍映的真相',
  narrative:
    '龍映從她的座位上站起來——她沿著台階走下，每一步都讓空氣變得更沉重。當她站在你面前時——你感受到了一種壓迫感，像是深海的水壓。你面前的這個「人」——是一條龍。一條活了上千年的東方黑龍。\n\n' +
    '「三百年前——那場儀式的失敗撕裂了境界之幕。我們的世界開始向你們的世界滲透。一開始只是一些小問題——人們看到不該看到的東西，有些地方的時間不規律。但隨著時間推移——情況惡化了。」\n\n' +
    '她抬手——空氣中浮現了一幅全息圖像：兩個重疊的球體，一個在緩慢地吞噬另一個。「人類世界的現實強度——是妖怪世界的十倍。如果不加控制——你們的世界會完全吞噬我們的世界。所有的妖怪——都會消失。不是死亡——是『被不存在』。就像我們從來沒有存在過一樣。」\n\n' +
    '她直視你的眼睛。「常識覆蓋——不是為了控制人類。是為了保護妖怪。通過逐步調整人類的認知——我們減緩了吞噬的速度，爭取時間尋找解決方案。我不是你的敵人。」她的聲音中第一次出現了一絲裂痕——一絲疲憊，「但如果你要阻止我——如果你要揭露真相——你會毀掉兩個世界。」',
  choices: [
    {
      id: 'dragon_ally',
      text: '選擇相信她——主動提出合作',
      effects: {
        awareness: 5,
        erosion: -5,
        affinity: { npcId: 'mayor_dragon', amount: 10 },
        setFlag: { allied_with_dragon: true },
      },
      resultText: '龍映的表情第一次出現了真正的變化——她的眼中閃過了一絲驚訝，然後是一種深刻的、歷經千年的疲憊和欣慰。「謝謝你。」她輕聲說——這兩個字比之前所有的話都更有份量。「願意理解而不是對抗——這是一條更難的路。」她伸出手，「那麼——讓我們一起想辦法拯救兩個世界吧。」',
      nextNodeId: 'final_choice',
    },
    {
      id: 'dragon_rebel',
      text: '拒絕接受——揭露真相才是正確的',
      effects: {
        awareness: 6,
        erosion: 8,
        setFlag: { rebelled_against_dragon: true },
      },
      resultText: '你後退了一步。你的拳頭握緊了。「如果有第三條路呢？讓人類知道真相——讓妖怪不再躲藏——讓兩個世界在平等中共存？」龍映看著你，她的表情既不是憤怒也不是失望——而是一種悲傷的憐憫。「年輕的人類……那就是我們當初嘗試過的路。結果呢？三百年的戰爭。無數的死亡。」她低下頭，「但——也許你是對的。也許這條路——值得再試一次。」',
      nextNodeId: 'final_choice',
    },
    {
      id: 'dragon_question',
      text: '追問她關於自己的真相——自己是誰',
      effects: {
        awareness: 6,
        erosion: 4,
        setFlag: { asked_personal_truth: true },
      },
      resultText: '龍映沉默了。全息影像消散在空中。她轉頭看向窗外——窗外的城市在黃昏的光芒中閃爍。「你就是那個——」她停頓了很長時間，「你就是那個應該完成這一切的人。你的記憶被重置了很多次——但你的靈魂始終在尋找出路。你不是第一次來到這個城市——你只是在每一次重置後重新開始。」她回頭看著你——她的眼中第一次出現了濕潤的光澤。「所以——這一次——讓我們做對吧。」',
      nextNodeId: 'final_choice',
    },
  ],
};

const final_choice = {
  id: 'final_choice',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: '最終抉擇',
  narrative:
    '你站在市政廳的大廳中央。頭頂的符文天花板在緩緩旋轉——現實的經緯在你面前交織。你知道這個選擇將不僅決定你的命運——它將決定兩個世界的命運。\n\n' +
    '你的腦海中閃過這幾天所經歷的一切：模糊的人群、變形的現實、醫院的檔案、神社的狐鈴、小巷的塗鴉、鏡中的世界……還有那些被你觸動的生命——小翠的信任、狐鈴的期望、羽音的孤獨、血月的無奈、夜魅的警告。\n\n' +
    '龍映站在你身邊——她的龍角在光線下泛著暗紫色的光澤。「選擇吧。不管你選擇什麼——我都會尊重。這是我能給你的——最後的禮物。」\n\n' +
    '你閉上眼睛。當你再次睜開時——你知道該怎麼做了。',
  choices: [
    {
      id: 'end_true',
      text: '【True End】揭露真相——在兩個世界之間建立真正的平衡（高認知+低侵蝕）',
      effects: {
        awareness: 10,
        erosion: -10,
        setFlag: { route_true_end: true },
      },
      resultText: '你選擇了最難的路——不是隱瞞，不是征服，而是共存在真正的理解之上。',
      nextNodeId: 'true_ending',
      conditions: { minAwareness: 70, maxErosion: 30 },
    },
    {
      id: 'end_normal',
      text: '【Normal End】維持現狀——繼續以調整者的身份守護平衡',
      effects: {
        awareness: 5,
        erosion: 5,
        setFlag: { route_normal_end: true },
      },
      resultText: '你選擇了一條中間道路——沒有完美的答案，但有可以接受的平衡。',
      nextNodeId: 'normal_ending',
      conditions: { minAwareness: 50, maxErosion: 50 },
    },
    {
      id: 'end_bad',
      text: '【Bad End】放棄抵抗——讓常識覆蓋完成（高侵蝕）',
      effects: {
        awareness: -10,
        erosion: 15,
        setFlag: { route_bad_end: true },
      },
      resultText: '你選擇了放棄——也許是因為疲憊，也許是因為絕望，或者——因為你已經無法分辨什麼是真實了。',
      nextNodeId: 'bad_ending',
      conditions: { maxAwareness: 49 },
    },
    {
      id: 'end_hidden',
      text: '【???】觸碰腰間的古鏡——選擇另一條路',
      effects: {
        awareness: 10,
        erosion: 10,
        setFlag: { route_hidden_end: true },
      },
      resultText: '你的手觸碰到口袋中的古鏡。鏡面在你的指尖下發熱——然後你被吸入了一個全新的可能性……',
      nextNodeId: 'hidden_ending',
      conditions: { hasItem: 'ancient_mirror', hasFlag: 'touched_dimensional_mirror' },
    },
  ],
};

// ─── 結局節點 ────────────────────────────────────────────────────────

const true_ending = {
  id: 'true_ending',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: 'TRUE END — 境界的橋樑',
  narrative:
    '你站在市政廳的頂樓，面向整座城市。龍映站在你的左側——她的黑色龍翼在城市的上空投下溫柔的陰影。狐鈴站在你的右側——她的金色狐火在暮色中燃燒，溫暖而明亮。\n\n' +
    '「準備好了嗎？」龍映問。你點點頭。\n\n' +
    '你伸出手——左手指向天空，右手指向大地。從你的掌心——兩道光芒射向天際和地心。天空中的裂痕——那個人造常識的破綻——在光芒中開始擴大。但不是破碎——而是在重整。\n\n' +
    '城市中的人們停下了腳步。他們抬頭看向天空——有些人看到了兩輪月亮，有些人看到了飛翔的影子，有些人看到了真實。但沒有人恐懼——因為你的選擇在他們的腦海中植入了新的理解：接受未知，擁抱差異。\n\n' +
    '妖怪不再需要隱藏。人類不再需要被蒙蔽。兩個世界在這一刻——在三百年的分離之後——以一種全新的方式重新連接了。不是吞噬，而是並存。\n\n' +
    '你成為了境界的橋樑——不是統治者，不是守護者，而是連接者。而這——才是真正的和平。',
  choices: [],
};

const normal_ending = {
  id: 'normal_ending',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: 'NORMAL END — 調整者',
  narrative:
    '你選擇了維持現狀。不是因為你膽怯——而是因為你明白，真相有時候比謊言更殘酷。\n\n' +
    '你和龍映達成了協議：常識覆蓋繼續進行——但不再有強制的記憶改寫。妖怪可以在願意的人類面前展現真實面貌。人類——在潛意識中——將逐漸接受非人類的存在。\n\n' +
    '你成為了理事會的特別顧問——不是為了他們，而是為了那些像你一樣「能看到的人」。你幫助那些在常識的裂縫中覺醒的人們——引導他們理解這個世界的不完美。\n\n' +
    '這不是最理想的結局。但它是可行的。你回到公寓——那個陌生的房間——但這一次，你不再感到害怕。因為你知道——這個世界的真相從來不是非黑即白的。而你在灰色地帶中——找到了自己的位置。',
  choices: [],
};

const bad_ending = {
  id: 'bad_ending',
  scene: 'town_hall',
  dayMin: 7,
  dayMax: 7,
  title: 'BAD END — 常識的終點',
  narrative:
    '你放棄了抵抗。龍映尊重了你的選擇——但她眼中的光芒黯淡了。\n\n' +
    '常識覆蓋完成了最後的階段。城市中的每一個人都接受了新的記憶——一個沒有妖怪、沒有異常、沒有裂縫的完美的世界。商店街的人們繼續微笑著走路，公告欄上的日期變成了2026年，醫院的檔案被新的文件取代。\n\n' +
    '你也接受了記憶校正。你坐在醫院三樓的治療室中——護士小林微笑著為你戴上頭盔式的裝置。當電流流過你的大腦時——你感到那些不該存在的記憶像沙子一樣流走了。\n\n' +
    '你走出醫院。天空是正常的藍色。街道是正常的熱鬧。你感到……輕鬆了。那些困擾你的噩夢——那些模糊的臉、那些發光的塗鴉、那些金色的眼睛——都消失了。\n\n' +
    '你回到公寓。這一次——它看起來完全正常了。一間普通的公寓。你普通的家。你躺在床上，閉上眼睛。入睡之前——你的眼角滑落了一滴眼淚。你不知道為什麼。但你很快就不在意了。\n\n' +
    '畢竟——一切都正常了。',
  choices: [],
};

const hidden_ending = {
  id: 'hidden_ending',
  scene: 'mirror_dimension',
  dayMin: 7,
  dayMax: 7,
  title: 'HIDDEN END — 鏡中旅行者',
  narrative:
    '古鏡的光芒吞沒了你。當你睜開眼睛時——你漂浮在宇宙之中。不是比喻——你真的在星辰之間。在你的腳下，兩個世界像並排的寶石一樣旋轉：一個是你熟悉的人類世界，一個是充滿奇蹟的妖怪世界。\n\n' +
    '「你選擇了不選擇。」那個聲音——境界的守護者——在你周圍迴盪。「你選擇了——看見一切。」\n\n' +
    '你的身體開始變化——不是變成妖怪，也不是保持人類。你變成了某種第三種存在：一個能夠在兩個世界之間自由穿梭的旅行者。你的眼中映出了星辰的運轉。你的指尖觸碰到了時間的流動。\n\n' +
    '從此以後——你行走在兩個世界之間。當人類世界的人們需要知道真相時——你出現。當妖怪世界需要被理解時——你出現。你是橋樑上的行者，是兩個世界的女兒/兒子。\n\n' +
    '在你出發之前——你回到了便利店。小翠看到你時——她瞪大了眼睛。「你……變了。」你微笑。「沒有變。只是——看到了更多。」\n\n' +
    '你轉身走入夕陽中。兩個世界的門在你面前敞開。而你——終於——自由了。',
  choices: [],
};

// ─── TSF专属分支：年龄变化（player_age = 'child' 时解锁）─────────────

const kindergarten = {
  id: 'kindergarten',
  scene: 'school',
  dayMin: 2, dayMax: 7,
  title: '幼儿园',
  narrative: '你变小了。世界在你眼中变得巨大而陌生。一个穿着围裙的年轻老师蹲下来，用过分甜腻的声音对你说：「小朋友，你怎么一个人在这里呀？来，跟老师进教室吧。」她伸出手。你注意到她的指甲——涂着和你昨晚在梦里见到的一模一样的颜色。',
  stateConditions: { playerAge: 'child' },
  choices: [
    { id: 'kg_follow', text: '乖乖跟着老师进教室', effects: { awareness: 3, setFlag: { kindergarten_entered: true } }, resultText: '教室里坐着一排和你差不多"大"的孩子。不——你很快发现，他们中的几个眼神不对。那不是孩子的眼神。那是被困在幼小身体里的成年人的眼神。', nextNodeId: 'kindergarten_class' },
    { id: 'kg_resist', text: '假装摔倒然后逃跑', effects: { erosion: 3, awareness: 5, setFlag: { kindergarten_escaped: true } }, resultText: '你蹲下假装系鞋带，趁老师转身的瞬间——冲向大门。背后传来老师的声音，仍然是那副甜腻的语调：「跑吧——反正你还会回来的。」', nextNodeId: 'town_arrival' },
  ]
};

const kindergarten_class = {
  id: 'kindergarten_class',
  scene: 'school',
  dayMin: 2, dayMax: 7,
  title: '幼儿园教室',
  narrative: '教室里的玩具散落一地。老师让你坐到角落的垫子上。坐在你旁边的女孩——看起来大概四五岁——偷偷拉了拉你的袖子。她压低声音说：「你也是被变小的吗？我是昨天的。不——我是上个月的。不——我已经记不清了。」她的眼里有泪水，但嘴角却在微笑。',
  stateConditions: { playerAge: 'child' },
  choices: [
    { id: 'kg_whisper', text: '低声问她「你知道怎么恢复吗？」', effects: { awareness: 5, setFlag: { met_shrunk_girl: true } }, resultText: '她摇头，然后悄悄塞给你一张纸条。上面用歪歪扭扭的字写着：「园长室。蓝色档案柜。第三层。别让老师看到。」', nextNodeId: 'start' },
    { id: 'kg_play', text: '装作普通孩子开始玩玩具', effects: { erosion: 5, setFlag: { played_as_child: true } }, resultText: '你拿起一个积木。指尖触碰到积木的瞬间——一段记忆涌了上来。这不是你的记忆。是一个真正的孩子在这个教室里玩的记忆。她叫桃子。她消失了。', nextNodeId: 'start' },
  ]
};

const elementary_school = {
  id: 'elementary_school',
  scene: 'school',
  dayMin: 3, dayMax: 7,
  title: '小学',
  narrative: '你穿着小学校服——不知道什么时候换上的。书包里装着二年级的课本。走廊尽头，校长室的门虚掩着。你听到里面传来一个成年男人的声音和新学生的对话。\n\n「你叫什么名字？」\n「……我叫……我原来叫……」\n「不对。你的名字是——」\n「……是的……我叫……」\n\n那个学生的声音越来越小——越来越像一个真正的孩子。',
  stateConditions: { playerAge: 'child' },
  choices: [
    { id: 'el_peek', text: '悄悄靠近校长室偷看', effects: { awareness: 6, erosion: 3, setFlag: { peeked_principal: true } }, resultText: '你从门缝看到了。校长坐在办公桌后——他的脸没有五官。是一张完全光滑的面具。他用那张没有嘴的脸对着那个学生说话。而学生——正在用橡皮擦掉自己原本的名字。', nextNodeId: 'start' },
    { id: 'el_run', text: '逃出学校', effects: { awareness: 3, setFlag: { fled_elementary: true } }, resultText: '你跑出校门。外面的世界变了。街道变宽了——或者说你变小了。你意识到——作为一个孩子，你失去了很多选择。但也获得了一些只有孩子才能看到的东西。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：附身觉醒 ──────────────────────────────────────────

const possession_awakening = {
  id: 'possession_awakening',
  scene: 'home_bedroom',
  dayMin: 1, dayMax: 3,
  title: '意识附身',
  narrative: '你的意识变得模糊。你感觉到自己的意识在上升——像从水底浮出水面。你低头看向自己的身体——它还在原地，但眼神空洞。你变成了……别的东西。一个幽灵般的观察者。周围的世界变得透明——你看到了墙壁另一侧的空间。你可以「进入」任何人的身体。',
  stateConditions: { requiredFlags: { unlocked_possession: true } },
  choices: [
    { id: 'pos_kitsune', text: '附身到狐铃身上', effects: { erosion: 8, setFlag: { possessed_kitsune: true, player_species: 'kitsune' } }, resultText: '你进入了狐铃的身体。她的记忆像洪水一样涌入——神社的真正用途、怪异与人类之间的协议、以及她对你的真实感情。你睁开她的眼睛——世界看起来完全不同了。', nextNodeId: 'possessed_kitsune_route' },
    { id: 'pos_slime', text: '附身到小翠身上', effects: { erosion: 6, setFlag: { possessed_slime: true, player_species: 'slime' } }, resultText: '小翠的身体比你想象的要……柔软得多。她的记忆是混乱的——便利店的地下室里有一个你不该看到的东西。', nextNodeId: 'possessed_slime_route' },
    { id: 'pos_vampire', text: '附身到血月医生身上', effects: { erosion: 10, awareness: 8, setFlag: { possessed_vampire: true, player_species: 'vampire' } }, resultText: '血月的记忆像冰一样冷。她对血液的渴望、对永生者的孤独、以及——医院太平间里的秘密。', nextNodeId: 'possessed_vampire_route' },
    { id: 'pos_resist', text: '抵抗这种力量', effects: { awareness: 10, erosion: -5, setFlag: { resisted_possession: true } }, resultText: '你猛地把自己的意识拉回身体。头痛欲裂。但你知道——这座城市里还有其他人拥有这种力量。他们正在用它做什么？', nextNodeId: 'start' },
  ]
};

const possessed_kitsune_route = {
  id: 'possessed_kitsune_route',
  scene: 'shrine',
  dayMin: 1, dayMax: 7,
  title: '狐铃的记忆',
  narrative: '作为狐铃，你看到了世界的另一面。神社后方隐藏着一座地下神社——供奉的不是神，而是「境界的裂缝」。狐铃的职责不是守护神社，而是守护这个裂缝不被人类发现。\n\n她每天早上在神社前做虚假的祈祷，每天晚上则在裂缝前进行真正的仪式。她的狐狸耳朵能听到裂缝中传出的低语——那是另一个世界的居民试图沟通的声音。\n\n而她对你的感情——不是偶然的。她认出你是「境界敏感者」。她一直在保护你，不让你被裂缝吞噬。',
  conditions: { hasFlag: 'possessed_kitsune' },
  choices: [
    { id: 'pk_explore_cave', text: '探索地下神社的深处', effects: { awareness: 8, erosion: 5, setFlag: { explored_under_shrine: true } }, resultText: '地下神社的深处有一面巨大的青铜镜——比你房间里的那面大得多。镜面上刻着和你铜镜上一样的符文。当你靠近时——镜中浮现出一张脸。是你自己——但穿着古代的衣服。', nextNodeId: 'kitsune_discovery' },
    { id: 'pk_perform_ritual', text: '代替狐铃进行裂缝封印仪式', effects: { awareness: 3, erosion: 8, setFlag: { performed_ritual: true } }, resultText: '你按照狐铃的记忆开始仪式。当你的手触碰裂缝边缘时——你感到一股巨大的力量涌入体内。裂缝震动起来——它正在扩大。你赶紧收手。仪式失败了——或者说，仪式被干扰了。裂缝比之前更大了一点。', nextNodeId: 'kitsune_consequence' },
    { id: 'pk_leave_body', text: '离开狐铃的身体', effects: { awareness: 5, setFlag: { left_kitsune_body: true } }, resultText: '你将自己的意识抽离狐铃的身体。在离开的瞬间——你看到了她真正的想法：她一直在等你发现真相。她需要你的帮助。', nextNodeId: 'start' },
  ]
};

const kitsune_discovery = {
  id: 'kitsune_discovery',
  scene: 'shrine',
  dayMin: 1, dayMax: 7,
  title: '青铜镜的秘密',
  narrative: '你站在巨大的铜镜前。镜中的古代你开口说话了——声音是重叠的，像多个人同时说话：\n\n「你终于来了。我是你——三百年前的你。这座城市的常識覆蓋——是我种下的。当时我以为自己在保护人类。现在我知道——我错了。」\n\n镜中的画面变化了。你看到三百年前——一个和你长得一模一样的人——站在同样的位置——做出了不同的选择。他不是建立常識覆蓋，而是试图完全隔绝两个世界。结果导致了灾难性的反噬。',
  stateConditions: { requiredFlags: { explored_under_shrine: true } },
  choices: [
    { id: 'kd_ask_fix', text: '询问如何修复常識覆蓋的伤害', effects: { awareness: 5, setFlag: { asked_about_fix: true } }, resultText: '镜中的你摇了摇头：「修复？不。你要做的是——把它整个打破。然后重新建立。用你的规则——而不是我的。」', nextNodeId: 'start' },
    { id: 'kd_touch_mirror', text: '伸手触碰镜中自己的手', effects: { erosion: 10, awareness: 10, setFlag: { touched_ancient_self: true } }, resultText: '当你的指尖碰到镜面时——三百年的记忆涌入了你的脑海。你看到了常識覆蓋被建立的整个过程——那不是出于恶意，而是出于恐惧。但你看到的不仅仅是记忆——你还看到了如何逆转它。代价是——你再也不能回到「正常」了。', nextNodeId: 'start' },
    { id: 'kd_destroy', text: '尝试打碎铜镜', effects: { erosion: 3, setFlag: { tried_break_mirror: true } }, resultText: '你举起一块石头砸向镜面——但镜子纹丝不动。反而是你的手被震得发麻。镜中的你露出一丝苦笑：「我就是你。你打不碎自己的。」', nextNodeId: 'start' },
  ]
};

const kitsune_consequence = {
  id: 'kitsune_consequence',
  scene: 'shrine',
  dayMin: 1, dayMax: 7,
  title: '裂缝的涟漪',
  narrative: '你失败的仪式在城市中引发了一连串的连锁反应。第二天——小镇上的人开始看到不该看到的东西。一个主妇在超市里看到了透明的狐狸穿过货架。一个小学生看到同学的脸变成了鸟类的喙。\n\n常識覆蓋出现了裂缝——因为你在错误的时间、以错误的方式触碰了它。狐鈴回到自己的身体后，虚弱地靠在墙上：「你……你知道你做了什么吗？」她的声音中没有愤怒——只有恐惧。\n\n「现在——他们会在三天内开始怀疑。而怀疑——是常識覆蓋最大的敵人。」',
  stateConditions: { requiredFlags: { performed_ritual: true } },
  choices: [
    { id: 'kc_warn_people', text: '尝试警告镇上的人', effects: { awareness: 5, setFlag: { warned_town: true } }, resultText: '你试图告诉人们真相。但他们看你的眼神——就像看一个疯子。直到一个老人拉住你。他低声说：「我知道你说的是真的。我一直在等——等一个能看到的人出现。」', nextNodeId: 'start' },
    { id: 'kc_hide', text: '躲起来观察事态发展', effects: { erosion: 5, setFlag: { hid_after_ritual: true } }, resultText: '你躲在公寓里。透过窗户——你看到街道上的行人偶尔会停下脚步，茫然地看着天空。就像他们感觉到了什么——但不明白那是什么。', nextNodeId: 'start' },
    { id: 'kc_double_down', text: '再次尝试仪式——这次强行完成', effects: { erosion: 15, awareness: 8, setFlag: { forced_ritual: true } }, resultText: '你强行完成了仪式。裂缝没有关闭——它张开了。从裂缝中——一股金色的光芒涌出。不是阳光——是另一种光。境界的光。整个神社开始震动。你听到了——从裂缝中传出了成千上万的声音。', nextNodeId: 'start' },
  ]
};

const possessed_slime_route = {
  id: 'possessed_slime_route',
  scene: 'town_center',
  dayMin: 1, dayMax: 7,
  title: '小翠的日常',
  narrative: '小翠的身体感觉……黏糊糊的。你低头看自己的手——它正在微微变形，指尖拉长成半透明的触须又缩回去。你赶紧集中精力维持人形。\n\n便利店里的灯光在你眼中变得刺眼。你能听到收银台的电流声——不，不仅是听到——你能感觉到电流在电线中流动，像是某种悦耳的音乐。\n\n小翠的记忆碎片浮现：她在这家店工作了三年。三年来——她每天晚上都会在打烊后打开地下室的门。那里有她不让你知道的东西。',
  conditions: { hasFlag: 'possessed_slime' },
  choices: [
    { id: 'ps_check_basement', text: '趁没有客人去地下室看看', effects: { awareness: 8, erosion: 5, setFlag: { checked_slime_basement: true } }, resultText: '地下室的楼梯很长。灯光忽明忽暗。当你走到最下面时——你看到了一面墙。墙上覆盖着某种半透明的膜——它在缓慢地脉动，像是活着的。膜的另一侧——你能看到模糊的人形轮廓。他们在敲打膜——无声地。', nextNodeId: 'slime_basement_secret' },
    { id: 'ps_serve_customer', text: '先好好工作——观察来往的客人', effects: { awareness: 3, setFlag: { observed_customers: true } }, resultText: '你站在收银台后面。一个又一个客人走进店里。他们看起来都是普通人——但当你集中注意力时——你发现他们的影子不对劲。有些人没有影子。有些人的影子在动——而人本身没动。', nextNodeId: 'slime_customer_insight' },
    { id: 'ps_leave_body', text: '离开小翠的身体', effects: { awareness: 3, setFlag: { left_slime_body: true } }, resultText: '你抽离意识时——小翠的身体像融化的果冻一样瘫软了一瞬，然后她重新控制了自己。她满脸通红：「你……你看到了？」', nextNodeId: 'start' },
  ]
};

const slime_basement_secret = {
  id: 'slime_basement_secret',
  scene: 'town_center',
  dayMin: 1, dayMax: 7,
  title: '地下室的墙壁',
  narrative: '你走近那面脉动的墙。它像一层巨大的细胞膜——半透明，表面有血管状的纹路。当你伸手触碰它时——膜的表面泛起涟漪，然后——一张脸从膜的另一侧浮现。\n\n那是一个年轻男人的脸。他张大嘴——似乎在喊什么——但没有声音传来。接着更多的脸浮现。有男有女，有老有少。十几张脸挤在膜的内侧——全都无声地呐喊。\n\n你猛然意识到——这些人不是死了。他们是「消失的人」。那些被常識覆蓋抹去存在的人。他们没有被杀死——他们被转移到了这里。而这面膜——是城市的「潜意识」。',
  stateConditions: { requiredFlags: { checked_slime_basement: true } },
  choices: [
    { id: 'sb_break_membrane', text: '尝试撕开膜', effects: { erosion: 10, awareness: 10, setFlag: { tore_membrane: true } }, resultText: '你的手——带着小翠的黏液——竟然融入了膜中。当你的手指穿过膜时——你听到了那些消失者的声音。不是尖叫——是感谢。但在你把他们拉出来之前——便利店的门铃响了。有客人来了。你必须选择是继续还是先上去。', nextNodeId: 'start' },
    { id: 'sb_memorize', text: '记住每一个面孔', effects: { awareness: 8, setFlag: { memorized_faces: true } }, resultText: '你强迫自己记住每一张脸。一共十七个人。当你的目光扫过最后一张脸时——那是一张你认识的脸。是你在房间照片里看到的那个人——和你合影的那个你不认识的人。', nextNodeId: 'start' },
    { id: 'sb_retreat', text: '后退——太危险了', effects: { erosion: 3, setFlag: { retreated_from_membrane: true } }, resultText: '你后退了一步。两步。三步。然后你转身跑上楼梯。但你忘不掉那些脸。尤其是最后一张——你的照片里的那个人的脸。', nextNodeId: 'start' },
  ]
};

const slime_customer_insight = {
  id: 'slime_customer_insight',
  scene: 'town_center',
  dayMin: 1, dayMax: 7,
  title: '影子观察',
  narrative: '你仔细观察每一位顾客。一个穿西装的男人走进来——他的影子是一个蹲着的、有尾巴的生物。一个老太太——她的影子是空的——什么都没有。一个背着书包的女孩——她的影子比实物大了一倍，而且它在笑。\n\n你意识到了：在这个城市里——「影子」才是真实的样子。人类的外表——是常識覆蓋投下的倒影。',
  stateConditions: { requiredFlags: { observed_customers: true } },
  choices: [
    { id: 'si_ask_xiaocui', text: '向小翠的意识提问——这些顾客她认识吗？', effects: { awareness: 5, setFlag: { asked_xiaocui_about_customers: true } }, resultText: '小翠的意识在你的脑海中回应。她的声音带着困惑：「我……我每天看到他们。但我记不住他们的脸。他们每天来——但我总是想不起他们长什么样。」你明白了——常識覆蓋不仅影响了你的记忆。它也在侵蚀小翠这个妖怪的意识。', nextNodeId: 'start' },
    { id: 'si_follow', text: '跟蹤影子里有尾巴的那个男人', effects: { erosion: 5, awareness: 3, setFlag: { followed_tailed_man: true } }, resultText: '你让身体自动工作——同时分出一缕意识附在男人身上。他离开便利店后走进了一条小巷。在小巷里——他的「影子」膨胀了——包裹了他的身体——然后他变成了一只巨大的犬形妖怪。他甩了甩毛发——消失在夜色中。', nextNodeId: 'start' },
  ]
};

const possessed_vampire_route = {
  id: 'possessed_vampire_route',
  scene: 'hospital',
  dayMin: 1, dayMax: 7,
  title: '血月的记忆',
  narrative: '血月的身体寒冷而轻盈。你低头看自己——穿着白大褂，胸牌上写着「夜間担当：血月」。你闻到空气中血液的味道——A型、B型、O型——你能分辨出每一种。\n\n记忆涌入：血月不是普通的吸血鬼。她是医院的夜班医生——真正的工作不是治疗病人。而是在夜间「处理」那些常識覆蓋出现了漏洞的患者。那些突然看到妖怪的患者。那些记忆出现错乱的患者。\n\n三楼的太平间——不是存放尸体的地方。那是常識覆蓋的「补丁中心」。',
  conditions: { hasFlag: 'possessed_vampire' },
  choices: [
    { id: 'pv_go_morgue', text: '前往太平间查看', effects: { awareness: 8, erosion: 6, setFlag: { visited_morgue_as_vampire: true } }, resultText: '太平间的自动门滑开。里面不是冰冷的停尸柜——而是一排排发光的容器。每个容器里漂浮着一个人形——他们闭着眼——但指尖在微微颤动。每个容器的标签上都写着「记忆校正中」和预计完成日期。最早的日期是——三百年前。', nextNodeId: 'vampire_morgue_secret' },
    { id: 'pv_check_patient', text: '查看今晚的「特殊病人」名单', effects: { awareness: 5, setFlag: { checked_special_patients: true } }, resultText: '你在血月的办公桌上找到了名单。今晚有三个「病人」——都是白天在城市中看到了不该看的东西的人。他们的治疗方案不是药物——而是「记忆替换」。而执行人——是你（血月）。', nextNodeId: 'vampire_treatment_choice' },
    { id: 'pv_confront', text: '在血月的记忆中寻找她对这一切的真实想法', effects: { awareness: 6, setFlag: { learned_vampire_feelings: true } }, resultText: '你深入血月的记忆深处。在那里——你找到了一个被封印的记忆：三百年前——血月是人类。她自愿变成了吸血鬼——不是为了永生——而是为了有能力反抗常識覆蓋。但她失败了。她被收编了。变成了系统的一部分。她恨自己——每天都在恨。', nextNodeId: 'start' },
    { id: 'pv_leave_body', text: '离开血月的身体', effects: { awareness: 4, setFlag: { left_vampire_body: true } }, resultText: '你从血月的身体中退出。她虚弱地靠在椅子上，闭上眼：「你看到了。你都看到了。现在——你知道这座城市的真相了。」', nextNodeId: 'start' },
  ]
};

const vampire_morgue_secret = {
  id: 'vampire_morgue_secret',
  scene: 'hospital',
  dayMin: 1, dayMax: 7,
  title: '记忆容器',
  narrative: '你走在容器之间。每个容器里的人都在做梦——被设计的梦。他们的记忆被改写、重編、再植入。\n\n你注意到其中一个容器——编号「0」——位于最深处的角落。里面漂浮着一个小女孩——看起来不到十岁。她的标签上写着：「原始样本——记忆模板来源」。\n\n容器旁边的监控屏幕上滚动着数据：「常識覆蓋穩定度：87.3%——模板適應性：優——預計使用期限：永久。」\n\n这个小女孩——是常識覆蓋的「原型」。她的记忆被复制了无数次——覆盖到了整座城市居民的脑海中。她就是为什么每个人都觉得「正常」。',
  stateConditions: { requiredFlags: { visited_morgue_as_vampire: true } },
  choices: [
    { id: 'vm_release', text: '尝试释放小女孩', effects: { awareness: 10, erosion: 12, setFlag: { tried_release_prototype: true } }, resultText: '你把手放在容器的开关上。但一个声音在你身后响起——是龙映的声音（从血月的记忆中她知道这是谁的声音）。「你确定吗？释放她——整座城市的记忆都会崩塌。他们会记得一切——三百年来的每一次改写。你觉得他们承受得了吗？」', nextNodeId: 'start' },
    { id: 'vm_read_data', text: '下载所有数据到手机', effects: { awareness: 8, setFlag: { downloaded_morgue_data: true } }, resultText: '你将容器群的管理数据全部拷贝到血月的手机里。几百年来每一次记忆改写的记录——都在你的手中。这是足以摧毁常識覆蓋的证据。', nextNodeId: 'start' },
    { id: 'vm_leave_quietly', text: '装作什么都没看到——悄悄离开', effects: { erosion: 5, setFlag: { left_morgue_silently: true } }, resultText: '你默默退出太平间。但在关门的一瞬间——你看到编号0的容器里——小女孩睁开了眼睛。她在看你。她在笑。', nextNodeId: 'start' },
  ]
};

const vampire_treatment_choice = {
  id: 'vampire_treatment_choice',
  scene: 'hospital',
  dayMin: 1, dayMax: 7,
  title: '特殊病人',
  narrative: '血月的手机震动了。护士长发来消息：「今晚的三位特殊病人已经在等待室了。请尽快处理。2号房的病人出现了严重的现实认知撕裂——他一直在重复同一句话：『我老婆不是人类。』」\n\n你走到2号房门口——透过玻璃看到里面坐着一个中年男人。他看起来很普通。但他的眼神——那是看到了不该看到的东西的人的眼神。\n\n你的手里握着血月的「治疗仪」——一个银色的、针管状的装置。它能注入记忆校正液。被注射的人会忘记自己看到的一切异常。',
  stateConditions: { requiredFlags: { checked_special_patients: true } },
  choices: [
    { id: 'vt_inject', text: '执行记忆校正——为他好', effects: { erosion: 8, setFlag: { performed_memory_injection: true } }, resultText: '你走进房间。男人看到你手中的针管——眼神从困惑变成了恐惧。「不——求求你——我不想忘记她——即使她是怪物——她是我的妻子——」你的手在颤抖。但你完成了注射。三秒后——男人眼神中的恐惧消失了。他茫然地看着你：「医生……我怎么在这里？」你告诉他他晕倒了。他信了。', nextNodeId: 'start' },
    { id: 'vt_refuse', text: '拒绝治疗——告诉他真相', effects: { awareness: 10, erosion: 5, setFlag: { told_patient_truth: true } }, resultText: '你放下针管。你坐在男人对面——告诉他他看到的是真的。他的妻子——是的——她不是人类。但她是爱他的。男人崩溃了——不是恐惧——是释怀。「我……我就知道。我告诉自己我没有疯。」你给了他一个建议：带妻子离开这座城市。因为在这里——真相会被抹去。', nextNodeId: 'start' },
    { id: 'vt_callback', text: '打电话给龙映——質問她', effects: { awareness: 5, erosion: 10, setFlag: { called_dragon_to_confront: true } }, resultText: '你拨通了龙映的电话。她沉默了几秒——然后用那种平靜得可怕的语气说：「血月。你从来不敢打这个电话的。看来——今天接电话的不是血月吧。」她知道了。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：催眠 ──────────────────────────────────────────────

const hypnosis_route = {
  id: 'hypnosis_route',
  scene: 'alley_night',
  dayMin: 3, dayMax: 7,
  title: '梦魇的低语',
  narrative: '小巷深处——魅魔酒吧的地下室里——藏着一间特殊的房间。房间里点着紫色的蜡烛。墙壁上挂满了古老的催眠图案——旋转的螺旋、复杂的曼陀罗、不断变化的光学幻象。\n\n房间中央有一把椅子。椅子上坐着一个女人——不——不是人。她的眼睛是复眼——像蝴蝶一样——每一面晶體都反射着不同的影像。\n\n她微笑着对你开口：「你终于找到我了。我是城市梦境的管理者。你睡着的时候——我在改写你的梦。但现在——你醒着来到了这里。有意思。」',
  stateConditions: { requiredFlags: { bar_entered: true } },
  choices: [
    { id: 'hr_accept', text: '让她对你进行深度催眠——探索被封印的记忆', effects: { awareness: 12, erosion: 8, setFlag: { accepted_hypnosis: true } }, resultText: '你躺下。她的声音像丝绒一样包裹了你的意识。你感到自己在下沉——穿过一层又一层的记忆。在记忆的最深处——你看到了出生之前的东西。你看到了这座城市没有被覆蓋之前的样子。那是一片充满光芒的土地。光芒的中央——站着一个和你一模一样的人。她/他转过来看着你：「你终于来了。我一直在这个世界等你。」', nextNodeId: 'hypnosis_memory_reveal' },
    { id: 'hr_resist', text: '抵抗催眠——反过来质问她的目的', effects: { awareness: 5, setFlag: { resisted_hypnosis: true } }, resultText: '你集中精神抵抗她的声音。她有些惊讶——然后露出了欣赏的表情。「不错。你是第一个能抵抗我的人。但你知道吗——抵抗本身也是一种答案。你想知道什么？我可以回答你——用清醒的方式。」', nextNodeId: 'hypnosis_qa' },
  ]
};

const hypnosis_memory_reveal = {
  id: 'hypnosis_memory_reveal',
  scene: 'alley_night',
  dayMin: 3, dayMax: 7,
  title: '最初的记忆',
  narrative: '你漂浮在记忆的海洋中。你看到了这座城市被建立的过程——不是用砖石和水泥——而是用「共识」。一群古老的妖怪和人类法师共同编织了一个巨大的幻术结界。他们的目的不是欺骗——而是保护。\n\n因为在那之前——人类和妖怪之间的战争几乎毁灭了一切。常識覆蓋是最后的解决方案：让人类相信这个世界上没有妖怪。让妖怪隐藏自己的真实面貌。界限被划定了。和平降临了。\n\n但代价是——所有人都活在谎言里。\n\n你看到了你自己的真正身份。你不是误入这座城市的旅人。你是——当年那个提出常識覆蓋方案的人类的转世。你每一世都会回到这座城市。每一世——你都会发现真相。每一世——你都要做出同样的选择：维持还是打破？',
  stateConditions: { requiredFlags: { accepted_hypnosis: true } },
  choices: [
    { id: 'hm_maintain', text: '原来如此——那么这一世我选择维持', effects: { erosion: 10, setFlag: { chose_maintain_legacy: true } }, resultText: '你从催眠中醒来。梦境管理者看你的眼神变得不同了。「你做出了和你前几世一样的选择。你知道吗——你是历代转世中唯一每次都选择维持的人。也许你的灵魂——本身就渴望秩序。」', nextNodeId: 'start' },
    { id: 'hm_break', text: '不——这一世我要打破循环', effects: { awareness: 15, setFlag: { chose_break_cycle: true } }, resultText: '梦境管理者听到你的回答——沉默了很久。然后她露出一个真正的微笑——不是魅魔的职业微笑——而是发自内心的。「我等你这句话——等了十二世。」', nextNodeId: 'start' },
  ]
};

const hypnosis_qa = {
  id: 'hypnosis_qa',
  scene: 'alley_night',
  dayMin: 3, dayMax: 7,
  title: '清醒的对话',
  narrative: '梦境管理者为你倒了一杯茶。茶的颜色是深紫色的——冒着淡金色的蒸汽。\n\n「问吧。但记住——有些答案一旦知道，你就无法回到不知道的状态了。」\n\n她靠在椅背上。她的复眼缓慢地旋转——每一面都注视着你。房间里的紫色烛光在墙壁上投下舞动的阴影。',
  stateConditions: { requiredFlags: { resisted_hypnosis: true } },
  choices: [
    { id: 'hq_identity', text: '「我到底是谁？」', effects: { awareness: 8, setFlag: { asked_identity_hypnosis: true } }, resultText: '她偏了偏头。「你是这座城市的锚点。常識覆蓋需要一個中心——一個自愿成为核心的人类。每一代都有一个人担任这个角色。你是现任。你不知道——是因为如果你知道——你会产生抗拒。而抗拒会削弱覆蓋。」', nextNodeId: 'start' },
    { id: 'hq_escape', text: '「我能离开这座城市吗？」', effects: { awareness: 5, setFlag: { asked_escape_hypnosis: true } }, resultText: '她笑了。那不是嘲笑——是一种带着悲伤的笑。「物理上——门是开着的。但常識覆蓋的範圍不只限于这座城市。它覆盖了整个认知区域。你走到哪里——它跟到哪里。除非你打破它——不然你永远在它的阴影下。」', nextNodeId: 'start' },
    { id: 'hq_allies', text: '「还有谁是清醒的？」', effects: { awareness: 6, setFlag: { asked_allies_hypnosis: true } }, resultText: '她竖起三根手指：「我。你的铜镜里的那个你。以及——你自己不知道但一直在等待的某个人。你会在第七天见到他/她。如果你活到那一天的话。」', nextNodeId: 'start' },
  ]
};

// ─── CYOA網絡導出 ───────────────────────────────────────────────────

const cyoaNetwork: CYOANetwork = {
  startNodeId: 'start',
  nodes: {
    // D1
    start,
    explore_room,
    read_letter,
    mirror_vision,
    leave_home,
    // D2
    town_arrival,
    observe_people,
    bulletin_board,
    shop_enter,
    talk_to_xiaocui,
    // D3
    shrine_arrival,
    shrine_pray,
    meet_kitsune,
    shrine_secret,
    // D4
    hospital_arrival,
    front_desk,
    doctor_vampire,
    basement,
    records_room,
    // D5
    school_arrival,
    library,
    roof,
    gymnasium,
    // D6
    alley_arrival,
    graffiti,
    bar_enter,
    secret_passage,
    mirror_dimension,
    bar_secret,
    // D7
    town_hall,
    face_dragon,
    final_choice,
    // Endings
    true_ending,
    normal_ending,
    bad_ending,
    hidden_ending,
    // TSF专属分支：年龄变化
    kindergarten,
    kindergarten_class,
    elementary_school,
    // TSF专属分支：附身
    possession_awakening,
    possessed_kitsune_route,
    kitsune_discovery,
    kitsune_consequence,
    possessed_slime_route,
    slime_basement_secret,
    slime_customer_insight,
    possessed_vampire_route,
    vampire_morgue_secret,
    vampire_treatment_choice,
    // TSF专属分支：催眠
    hypnosis_route,
    hypnosis_memory_reveal,
    hypnosis_qa,
  },
};

export default cyoaNetwork;