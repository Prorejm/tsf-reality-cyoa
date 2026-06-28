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

// ─── TSF专属分支：史莱姆化 ──────────────────────────────────────────

const slime_transformation = {
  id: 'slime_transformation',
  scene: 'home_bedroom', dayMin: 2, dayMax: 5,
  title: '史莱姆化',
  narrative: '你注射了史莱姆血清。身体开始变得柔软、半透明。你看着自己的手——手指正在融化、融合。你不再流血了——你的体液变成了黏稠的透明凝胶。\n\n镜子里的你——已经不太像人类了。但你感觉很好。你感觉……自由。你可以穿过任何缝隙、融入任何形状。',
  stateConditions: { playerSpecies: 'slime' },
  choices: [
    { id: 'slime_explore', text: '以史莱姆形态探索城市（穿过下水道进入各个场所）', effects: { erosion: 5, awareness: 3, setFlag: { slime_form_explored: true } }, resultText: '你把自己压扁，沿着下水道管网滑行。从这个角度——你看到了城市隐藏的一面。墙壁的裂缝里有发光的苔藓。下水道的岔路口——有一个被焊死的铁门。你穿过门缝进去了……', nextNodeId: 'slime_secret_base' },
    { id: 'slime_mimic', text: '练习模仿人类形态', effects: { erosion: 3, setFlag: { slime_mimic_learned: true } }, resultText: '你努力把身体塑造成原来的样子。但细节不对——眼睛的位置偏了2毫米。嘴角的微笑太完美了。你现在可以完美地扮演一个人——但你不是。', nextNodeId: 'slime_infiltration' },
    { id: 'slime_merge', text: '尝试融合一个物体（吸收它的特性）', effects: { erosion: 8, awareness: 4, setFlag: { slime_merged_object: true } }, resultText: '你选择了一块石头。你的身体包裹了它——然后它在你体内分解。你现在有了它的硬度。你的皮肤上浮现出石头的纹理。你可以吸收任何东西的特性。', nextNodeId: 'start' },
  ]
};

const slime_secret_base = {
  id: 'slime_secret_base',
  scene: 'subway_station', dayMin: 2, dayMax: 5,
  title: '史莱姆秘密基地',
  narrative: '铁门后面是一个巨大的地下空间。墙壁上覆盖着发光的苔藓——不是普通的苔藓。是史莱姆。这里是史莱姆们的聚集地。\n\n几十个史莱姆——各种大小和颜色——在空间中缓慢蠕动。它们看到你进来了——其中一个大的、紫色的史莱姆朝你移过来。它用身体振动发出声音：「新来的？你也是被「他们」创造的吗？」',
  stateConditions: { playerSpecies: 'slime' },
  choices: [
    { id: 'slime_talk', text: '和紫色史莱姆交流', effects: { awareness: 6, setFlag: { met_elder_slime: true } }, resultText: '它告诉你——城市里的所有史莱姆原本都是人类。理事会用血清把我们变成了这样。那些在便利店、医院、学校里看到的史莱姆——他们都是受害者。但你——你可以自由移动。你可以帮我们。', nextNodeId: 'start' },
    { id: 'slime_absorb', text: '吸收一个小史莱姆的力量', effects: { erosion: 7, awareness: 2, setFlag: { absorbed_fellow_slime: true } }, resultText: '你吸入了一个绿色的同伴。你感受到了它的记忆——它原本是一个大学生，三周前被注射了血清。它的最后一段记忆是哭泣。', nextNodeId: 'start' },
  ]
};

const slime_infiltration = {
  id: 'slime_infiltration',
  scene: 'town_center', dayMin: 3, dayMax: 6,
  title: '史莱姆渗透',
  narrative: '你以完美的拟态走在人群中。\n\n没有人怀疑你。你的外表和人类一模一样——但你的内心是黏液。你发现自己可以感知周围人的情绪——像触角一样伸出去探测。\n\n前面走来一个穿着西装的男人——你的感知告诉你：他不是人类。他也是某种东西伪装的。但他伪装得比你更高级。',
  stateConditions: { playerSpecies: 'slime' },
  choices: [
    { id: 'slime_follow', text: '跟踪那个非人类', effects: { awareness: 5, erosion: 2, setFlag: { followed_imposter: true } }, resultText: '你跟着他走进了一栋不起眼的大楼。电梯没有按钮——他用指纹识别。但你不需要按钮——你从电梯门的缝隙渗了进去。', nextNodeId: 'start' },
    { id: 'slime_public', text: '继续在人群中练习', effects: { awareness: 3, setFlag: { slime_public_practice: true } }, resultText: '你坐在广场的长椅上。一个孩子跑过来——盯着你看。她说：「你的眼睛在融化。」你僵硬地微笑。「没关系，」她说，「我不会告诉别人。」她比了一个拉拉链的动作。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：吸血鬼 ────────────────────────────────────────────

const vampire_awakening = {
  id: 'vampire_awakening',
  scene: 'hospital', dayMin: 2, dayMax: 5,
  title: '血族觉醒',
  narrative: '你喝下了深红灵药。\n\n效果是瞬间的——你的心跳停止了。世界变成了灰阶——除了红色。你能看到所有红色的事物——血液在人们的血管中流动，像发光的河流。\n\n饥饿感。强烈的、无法忽视的饥饿感。',
  stateConditions: { playerSpecies: 'vampire' },
  choices: [
    { id: 'vampire_hunt', text: '跟随本能去狩猎', effects: { erosion: 10, awareness: 2, setFlag: { vampire_hunted: true } }, resultText: '你找到了一个独行的人。你没有杀他——你只是咬了一口。但他的血——你感受到了他的记忆、他的感受、他的一切。这个味道——你再也忘不掉。', nextNodeId: 'vampire_guilt' },
    { id: 'vampire_resist', text: '抵抗饥饿感，服用血液替代品', effects: { erosion: 2, awareness: 5, setFlag: { vampire_resisted: true } }, resultText: '你从医院血库偷了一袋血。口感像冷掉的铁锈——但可以暂时缓解。你看着窗外——这个城市有这么多的人。他们的血管在黑暗中发光。', nextNodeId: 'start' },
    { id: 'vampire_doctor', text: '去找血月医生求助', effects: { awareness: 6, setFlag: { vampire_sought_help: true } }, resultText: '血月看到你——笑了。「我等你很久了。」她递给你一个装着深红色液体的杯子。「喝这个——我的收藏。来自一个自愿者。」', nextNodeId: 'start' },
  ]
};

const vampire_guilt = {
  id: 'vampire_guilt',
  scene: 'hospital', dayMin: 3, dayMax: 6,
  title: '血的代价',
  narrative: '你坐在医院的屋顶边缘。城市的灯光在你眼中变成了红色和黑色的斑块。\n\n你的双手在颤抖。不——你没有真的颤抖——那只是记忆中的颤抖。被你吸血的人的最后感觉。\n\n「第一次？」\n\n血月不知何时站在你身后。她没有走近——她知道你需要空间。「习惯了就好了。或者……你可以学着只从自愿者那里取血。」',
  stateConditions: { playerSpecies: 'vampire' },
  choices: [
    { id: 'vampire_accept', text: '接受血族的身份', effects: { erosion: 5, setFlag: { vampire_accepted: true } }, resultText: '你点了点头。血月在你旁边坐下——保持着距离。她开始讲述她的故事——三百年前她是如何被转化的。她曾经也是一个人类。现在她是永恒的囚徒。', nextNodeId: 'vampire_coven' },
    { id: 'vampire_reject', text: '拒绝这个身份，寻找恢复的方法', effects: { awareness: 8, erosion: -3, setFlag: { vampire_seeking_cure: true } }, resultText: '你站起来。血月叹了口气。「你找不到解药的。但你可以找替代方案——有一些炼金术配方可以让你恢复人类的饮食习惯。」', nextNodeId: 'start' },
  ]
};

const vampire_coven = {
  id: 'vampire_coven',
  scene: 'hospital', dayMin: 4, dayMax: 7,
  title: '血族议会',
  narrative: '血月带你进入了医院的地下更深处。\n\n不是太平间——是更深的地方。一个维多利亚时代风格的宴会厅，埋在地下三十米处。长桌上坐着六个吸血鬼——男男女女——他们的目光全部落在你身上。\n\n「新人。」坐在主位的一个白发女性开口。「你来得正好。我们正在讨论——理事会最近在策划的『清洗计划』。」',
  stateConditions: { playerSpecies: 'vampire' },
  choices: [
    { id: 'coven_join', text: '加入血族议会，协助对抗理事会', effects: { erosion: 5, awareness: 8, setFlag: { joined_vampire_coven: true } }, resultText: '白发女性微笑——你能看到她的尖牙。「明智的选择。我们需要你的能力——作为新生血族，你可以在日光下活动的时间比我们长。这是一个任务。」', nextNodeId: 'start' },
    { id: 'coven_alone', text: '拒绝结盟，独自行动', effects: { erosion: 2, awareness: 3, setFlag: { refused_coven: true } }, resultText: '宴会厅的空气凝固了。白发女性微微眯起眼睛。「有趣。那你最好祈祷——理事会不会先找到你。」她挥手示意你离开。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：猫又 ──────────────────────────────────────────────

const nekomata_awakening = {
  id: 'nekomata_awakening',
  scene: 'alley_night', dayMin: 3, dayMax: 6,
  title: '猫又觉醒',
  narrative: '你喝下了猫薄荷浓缩液。\n\n你的耳朵开始痒——非常痒。你伸手去摸——它们变了形状、移动到了头顶。与此同时——你的尾椎开始发热。一条毛茸茸的、末端分叉的尾巴从你的尾骨处长了出来。\n\n你看向小巷里的玻璃窗倒影——你的眼睛变成了竖瞳。你的夜视能力大幅提升——黑暗中原本看不见的涂鸦，现在清晰可见。',
  stateConditions: { playerSpecies: 'nekomata' },
  choices: [
    { id: 'neko_explore', text: '用猫的感官探索夜晚的城市', effects: { awareness: 5, setFlag: { neko_night_explored: true } }, resultText: '你的耳朵可以听到几个街区外的对话。你的眼睛可以看到屋顶上其他夜行生物的身影。这座城市在夜晚——完全是另一个世界。', nextNodeId: 'start' },
    { id: 'neko_stray', text: '寻找其他猫又', effects: { awareness: 4, setFlag: { neko_found_others: true } }, resultText: '你沿着屋顶跳跃——你的新身体比你想象的灵活得多。在神社的屋顶上，你遇到了另一条猫又。它看了你一眼——说：「新来的？理事会知道了吗？」', nextNodeId: 'start' },
    { id: 'neko_play', text: '去便利店偷吃鱼', effects: { erosion: 3, setFlag: { neko_stole_fish: true } }, resultText: '你无法抵抗本能。你潜入便利店——用猫的速度偷了一条秋刀鱼。小翠看到了你——她尖叫了一声，然后大笑。「你变成了猫！太可爱了！」', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：魅魔 ──────────────────────────────────────────────

const succubus_awakening = {
  id: 'succubus_awakening',
  scene: 'bar', dayMin: 3, dayMax: 6,
  title: '魅魔觉醒',
  narrative: '梦魇精华在你体内扩散。\n\n你感到一股暖流从小腹升起——扩散到全身。你的皮肤变得更光滑、更有光泽。你的身体比例开始微妙地变化——变得更吸引人。\n\n但真正的变化在内部。你能感受到周围人的欲望——像色彩缤纷的烟雾一样从他们身上飘出。你可以「吸收」这些欲望——把它变成自己的能量。',
  stateConditions: { playerSpecies: 'succubus' },
  choices: [
    { id: 'succubus_feed', text: '吸收一个人的欲望能量', effects: { erosion: 8, awareness: 3, setFlag: { succubus_fed: true } }, resultText: '你选了一个人——一个孤独地坐在角落的男人。你走过去——不用说话。你的存在本身已经是一种诱惑。你「吸收」了他过剩的欲望——他会感到一阵空虚，但不会有真正的伤害。而你——你感到力量涌入。', nextNodeId: 'succubus_power' },
    { id: 'succubus_control', text: '尝试控制自己的新能力', effects: { awareness: 6, erosion: -2, setFlag: { succubus_controlled: true } }, resultText: '你闭上眼睛——深呼吸。欲望的感知没有消失，但你学会了把它们隔离开。夜魅走到你面前——赞许地点头。「不错。大部分新人都在第一周就失控了。」', nextNodeId: 'start' },
  ]
};

const succubus_power = {
  id: 'succubus_power',
  scene: 'bar', dayMin: 4, dayMax: 7,
  title: '魅魔之力',
  narrative: '你感受到了自己的力量。\n\n你可以让任何人对你产生好感——不只是欲望。你可以影响他们的决定、改写他们的喜好、甚至让他们爱上你。\n\n但每一次使用——你都离人性更远一步。',
  stateConditions: { playerSpecies: 'succubus' },
  choices: [
    { id: 'succubus_charm', text: '对关键NPC使用魅惑能力', effects: { erosion: 6, awareness: 4, setFlag: { used_succubus_charm: true } }, resultText: '你选择了……对方看向你的眼神变了。那不是原本的他们——你改写了他们的一部分。你得到了需要的信息。但你也失去了一些东西。', nextNodeId: 'start' },
    { id: 'succubus_resist', text: '拒绝使用能力', effects: { awareness: 6, setFlag: { succubus_refrained: true } }, resultText: '你离开了酒吧。夜魅看着你的背影——轻声说：「你会回来的。饥饿感——最终会战胜一切。」', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：龙娘 ──────────────────────────────────────────────

const dragon_awakening = {
  id: 'dragon_awakening',
  scene: 'city_hall', dayMin: 5, dayMax: 7,
  title: '龙之力',
  narrative: '龙鳞萃取液在你的血管中燃烧。\n\n你的皮肤表面浮现出金色的鳞片——细密而坚硬。你的力量暴增——你单手握碎了手中的玻璃瓶。你的瞳孔变成了竖直的琥珀色。\n\n你感受到了——这座城市的「界线」。你可以看到现实的边缘——像一道微光的帷幕覆盖着一切。你可以撕开它。',
  stateConditions: { playerSpecies: 'dragon' },
  choices: [
    { id: 'dragon_tear', text: '撕开现实的帷幕', effects: { erosion: 10, awareness: 10, setFlag: { tore_reality_veil: true } }, resultText: '你伸出手——爪——刺入空气中。帷幕发出了撕裂的声音。你看到另一边——真实的世界。怪异和人类混杂的街道——没有伪装、没有掩饰。理事会正在惊慌——他们知道你看到了。', nextNodeId: 'true_ending' },
    { id: 'dragon_wait', text: '保留力量，等待时机', effects: { awareness: 5, setFlag: { dragon_waited: true } }, resultText: '你把力量压制了下来。你的眼睛恢复了正常的颜色。但你知道——你可以随时撕开这层伪装。你在等待最好的时机。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：无性化 ────────────────────────────────────────────

const neuter_perspective = {
  id: 'neuter_perspective',
  scene: 'shrine', dayMin: 3, dayMax: 6,
  title: '无性的视角',
  narrative: '你不再受到性别的束缚。\n\n世界在你眼中变得不同了——你不再被归类、不再被期待扮演某种角色。你可以更清晰地看到人们的本质——他们的性别只是一层外衣。\n\n狐铃看着你——她的眼神中带着敬畏。「你打破了界线。很少有人能做到。」',
  stateConditions: { playerGender: 'neuter' },
  choices: [
    { id: 'neuter_insight', text: '利用这种视角看穿理事会的伪装', effects: { awareness: 8, setFlag: { neuter_insight_gained: true } }, resultText: '理事会成员在你的眼中不再是穿着西装的人类——他们是各种各样的怪物，披着人皮。你不用再被他们的表象欺骗。', nextNodeId: 'start' },
    { id: 'neuter_guide', text: '帮助其他困惑于性别的人', effects: { awareness: 4, setFlag: { neuter_helped_others: true } }, resultText: '你开始在小镇中帮助那些对自己性别感到困惑的人。你成了他们的引路人——在一个一切都被定义好的世界里，你提供了一个「不定义」的选项。', nextNodeId: 'start' },
  ]
};

// ─── TSF专属分支：双性 ──────────────────────────────────────────────

const futanari_experience = {
  id: 'futanari_experience',
  scene: 'alley_night', dayMin: 3, dayMax: 6,
  title: '双性的体验',
  narrative: '你的身体现在同时拥有两性的特征。\n\n这不仅仅是身体的改变——你对世界的感知也变了。你能同时理解两种视角——不被单一性别的思维框架限制。\n\n但你也感受到——这个世界对「模糊」的恐惧。',
  stateConditions: { playerGender: 'futanari' },
  choices: [
    { id: 'futa_embrace', text: '拥抱自己的双重身份', effects: { awareness: 4, setFlag: { embraced_duality: true } }, resultText: '你不再试图定义自己。你就是你——既不完全属于任何一边。这种「中间态」让你看到了许多人看不到的灰色地带。', nextNodeId: 'start' },
    { id: 'futa_social', text: '测试社会对你的接受度', effects: { erosion: 4, awareness: 3, setFlag: { tested_social_bias: true } }, resultText: '结果如你所料——有些人排斥，有些人好奇，有些人完全不在乎。但你发现——那些最激烈排斥的人，往往是内心最不确定自己的人。', nextNodeId: 'start' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：规则警示节点（33个） — 每条规则的游戏内体现
// ═══════════════════════════════════════════════════════════════════════════

const candy_stranger = {
  id: 'candy_stranger', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '陌生人的糖果',
  narrative: '你在商店街走着，一个穿着斗篷的老妇人突然出现在你面前。她的笑容很慈祥——但太慈祥了，像画上去的一样。她摊开的手掌里放着几颗包装鲜艳的糖果。"小伙子/小姑娘，吃颗糖吧，这是自家做的。"\n\n你注意到她的指甲是黑色的。而且她的影子——在正午的阳光下——指向了完全错误的方向。',
  choices: [
    { id: 'candy_take', text: '接过糖果道谢', effects: { erosion: 8, awareness: 3, addItem: { id: 'mystery_candy', name: 'Mystery Candy', nameCN: '神秘糖果', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '一个陌生老妇人给你的糖果。包装纸上没有成分标签。有一股淡淡的……草药味。', icon: '🍬', flags: ['tsf_mystery'] } }, resultText: '糖果在你手心里——温热的。不像从口袋里拿出来的，倒像刚出炉的。老妇人微笑着点点头，转身消失在人群中。你低头看——糖果的包装纸上写着一排你读不懂的文字。', nextNodeId: '' },
    { id: 'candy_refuse', text: '礼貌地拒绝', effects: { awareness: 2, setFlag: { refused_stranger_candy: true } }, resultText: '老妇人的笑容僵了一瞬——但你几乎以为那是错觉。她收回手，耸了耸肩。"可惜了。"她转身离开，你看到她的斗篷下摆——没有脚。她在——飘。', nextNodeId: '' },
  ]
};

const antique_shop = {
  id: 'antique_shop', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '古董店的镜子',
  narrative: '一家不起眼的古董店橱窗里摆着一面华丽的雕花镜。你驻足观看——不是因为镜子本身，而是因为镜中的倒影吸引了你。镜中映出的不是街道，而是一个灯火通明的宴会厅，穿着古装的人们在跳舞。\n\n店门是开着的。一股陈旧的木头和熏香的气味飘了出来。你隐约听到从店内深处传来的音乐声——和你在镜中看到的宴会场景似乎同步。',
  choices: [
    { id: 'antique_enter', text: '走进店铺查看', effects: { erosion: 6, awareness: 3, setFlag: { entered_antique_shop: true } }, resultText: '你跨过门槛。一瞬间——音乐声变大了。店内的布局和你在橱窗里看到的不同——空间大得多，墙壁上挂满了各种镜子和油画。每幅画中的人物都在用不同的眼神看着你。柜台后面没有人——但一杯冒着热气的茶放在桌上，像是刚沏好的。', nextNodeId: '' },
    { id: 'antique_leave', text: '转身离开——别进去', effects: { awareness: 2, setFlag: { avoided_antique_shop: true } }, resultText: '你强迫自己移开目光。在你转身的瞬间——你从余光中看到橱窗镜子里的宴会场景停下来了。所有跳舞的人都转向了你。他们在——等你回头。你没有回头。', nextNodeId: '' },
  ]
};

const cousin_discovery = {
  id: 'cousin_discovery', scene: 'home_bedroom', dayMin: 1, dayMax: 3,
  title: '表姐的日记',
  narrative: '你在公寓抽屉的夹层里发现了一本泛黄的日记本。封面上写着"给住在这个房间的下一个人"。\n\n翻开第一页——字迹工整但透着焦虑："我叫小月。如果你看到这个——说明我已经不在了。不是死了——是"被调整"了。这个城市会把不听话的人抹去。我看到了太多不该看的东西。现在他们来"校正"我了。我把真相藏在这里——希望下一个能看到的人——能完成我做不到的事。"',
  choices: [
    { id: 'cousin_read', text: '仔细阅读整本日记', effects: { awareness: 6, erosion: 2, setFlag: { read_cousin_diary: true }, addItem: { id: 'cousin_diary', name: 'Cousin Diary', nameCN: '表姐的日记', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '一本泛黄的日记，记录着上一个住在这间公寓的人——小月——的发现。她看到了城市的真相，然后被"调整"了。', icon: 'item_key', flags: ['evidence'] } }, resultText: '日记一共四十三页。记录了小月在这座城市三个月的调查——她和你的发现几乎一模一样。最后几页的笔迹越来越潦草："他们来了。他们知道了。如果你看到这个——千万不要相信任何人。包括你自己。"最后一页被撕掉了一半——剩下的半页上只有两个字："神社。"', nextNodeId: '' },
    { id: 'cousin_ignore', text: '放下日记——不该看别人的隐私', effects: { erosion: 3, setFlag: { ignored_cousin_diary: true } }, resultText: '你合上日记本，把它放回原处。但在关上抽屉的那一刻——你看到夹层里还有一张照片。是日记作者和一个穿巫女服的女孩的合影——那个巫女的眼睛是金色的。你把照片也放了回去。但那张金色的眼睛——你忘不掉。', nextNodeId: '' },
  ]
};

const attic_warning = {
  id: 'attic_warning', scene: 'home_bedroom', dayMin: 1, dayMax: 4,
  title: '阁楼的警告',
  narrative: '公寓走廊尽头有一扇通往阁楼的小门。门上贴着一张褪色的纸条："危险——请勿打开。物业管理处。"\n\n纸条下方有一个小小的手写补充——像是后来被人加上去的，字迹很小："他们在上面。不是老鼠。别上去。"\n\n门缝中透出一丝微弱的光——不是日光或灯光，而是一种脉动的、淡紫色的荧光。你能听到极轻的声音从上方传来——像是某种生物的呼吸声。',
  choices: [
    { id: 'attic_open', text: '打开阁楼门查看', effects: { erosion: 7, awareness: 5, setFlag: { opened_attic: true } }, resultText: '门锁是老式的——轻轻一拧就开了。你推开木门——一股冷气和霉味扑面而来。阁楼里堆满了旧物——但你看到的东西让你血液凝固：天花板上覆盖着一层半透明的膜——像巨大的蛛网——在微微脉动。膜的中央包裹着一个人形的茧。它在发光——在呼吸。', nextNodeId: '' },
    { id: 'attic_obey', text: '遵守警告——不上楼', effects: { awareness: 1, setFlag: { obeyed_attic_warning: true } }, resultText: '你尊重了纸条上的警告。但当你回到房间准备睡觉时——天花板上传来了轻轻的敲击声。三声。停顿。三声。像是在回应你的选择。', nextNodeId: '' },
  ]
};

const goddess_statue = {
  id: 'goddess_statue', scene: 'shrine_grounds', dayMin: 2, dayMax: 7,
  title: '神像的低语',
  narrative: '神社侧殿里供奉着一尊你从未见过的神像。它不像任何已知的神明——面容是模糊的，像被刻意磨去了五官。但它的姿态——双臂张开，手心向上——像是在欢迎什么，又像是在祈求什么。\n\n神像的基座上刻着一行字："凡人啊，汝所求为何？"\n\n当你站在神像面前时——你感到耳边有低语。不是声音——是一股直接在脑海中产生的念头："我可以给你任何你想要的东西。任何。只要你说出来。"',
  choices: [
    { id: 'statue_wish', text: '对神像许愿——说出自己真正的渴望', effects: { erosion: 10, awareness: 3, setFlag: { wished_to_goddess: true } }, resultText: '你闭上眼睛，说出了心底最深的愿望。神像没有任何变化——但你的掌心里多了一件东西：一枚黑色的、温热的硬币。硬币上刻着一只睁开的眼睛。你把它握紧——感到一股力量涌入身体。但你同时也感到——有什么东西从你体内被取走了。', nextNodeId: '' },
    { id: 'statue_leave', text: '保持沉默——不向未知存在乞求', effects: { awareness: 3, setFlag: { silent_before_goddess: true } }, resultText: '你没有开口。低语持续了几秒——然后消失了。你感到一阵轻松——但同时也感到了一种……失望？像是错过了一个重要的机会。你转身离开时——神像的指尖似乎动了一下。只是一下。', nextNodeId: '' },
  ]
};

const choose_doctor = {
  id: 'choose_doctor', scene: 'city_hospital', dayMin: 3, dayMax: 7,
  title: '医者的选择',
  narrative: '医院的公告栏上贴着一张引人注目的海报："你对自己的记忆满意吗？如果不满意——来参加我们的免费记忆优化计划！第一个月免费！"\n\n海报上一个穿着白大褂的医生在微笑——他的笑容完美无瑕，但你知道那种笑容。你见过——在医院地下室的档案照片里，那些"被调整"的人都是这种笑容。\n\n海报下方有一个二维码。旁边站着一个护士，手里拿着平板电脑——她看到你在看海报，微笑着走过来："有兴趣吗？只需要五分钟的简单问卷——你就可以开始了。"',
  choices: [
    { id: 'doctor_signup', text: '参加"记忆优化"——看看他们到底在做什么', effects: { erosion: 8, awareness: 6, setFlag: { signed_up_memory_optimization: true } }, resultText: '你填了问卷——都是关于"你对最近的生活满意吗"之类的问题。但最后一道题是："你是否看到过其他人看不到的东西？"你犹豫了一下——选了"是"。护士的笑容僵了一瞬——然后变得更灿烂了。"请到三楼B区。医生会亲自接见你。"', nextNodeId: '' },
    { id: 'doctor_refuse', text: '拒绝——保持记忆的完整', effects: { awareness: 3, setFlag: { refused_memory_optimization: true } }, resultText: '你摇了摇头，说赶时间。护士的笑容没有变化——但她的声音低了一些："没关系。随时欢迎回来。毕竟——"好的记忆"比"真实的记忆"更让人幸福。"她最后那句话像一根刺一样扎进你的心里。', nextNodeId: '' },
  ]
};

const mystery_package = {
  id: 'mystery_package', scene: 'home_bedroom', dayMin: 1, dayMax: 4,
  title: '神秘的包裹',
  narrative: '你回到公寓时——门口放着一个包裹。没有寄件人信息，没有邮戳——甚至没有快递单号。包裹是深蓝色的，用黑色的绳子捆扎。\n\n包裹上贴着一张便签——字迹是印刷体："这是你的。你只是不记得了。"\n\n包裹很轻。你晃了晃——里面有轻微的金属碰撞声。绳子打了一个复杂的结——不像普通的蝴蝶结，而是一种你从未见过的编法。',
  choices: [
    { id: 'package_open', text: '拆开包裹', effects: { erosion: 5, awareness: 4, setFlag: { opened_mystery_package: true }, addItem: { id: 'mystery_key', name: 'Mystery Key', nameCN: '神秘钥匙', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '一把古铜色的钥匙，柄部刻着一个符号——和公寓门上的标记一样。', icon: 'item_key', flags: ['evidence'] } }, resultText: '你拆开了绳子。包裹里面是一个朴素的木盒子。打开盒子——里面躺着一把古铜色的钥匙和一张照片。照片上是你——但穿着你不认识的制服，站在你不认识的建筑前。你的表情很严肃——像是知道什么重要的事情。照片背面写着："S7储物柜——密码是你的生日。"', nextNodeId: '' },
    { id: 'package_ignore', text: '不打开——先放在一边', effects: { setFlag: { deferred_mystery_package: true } }, resultText: '你把包裹放在桌上。但你总是忍不住去看它。它像一个沉默的提醒——提醒你有些事情你不知道，有些人认识你而你却不认识他们。', nextNodeId: '' },
  ]
};

const wizard_encounter = {
  id: 'wizard_encounter', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '街角的占卜师',
  narrative: '在商店街的转角处——一个穿着华丽长袍的年轻人摆了一个占卜摊。桌上放着水晶球和塔罗牌。他看起来二十出头——但他的眼睛有一种不属于年轻人的深邃。\n\n他面前立着一块木牌："占卜——过去、现在、未来。但不包括被你忘记的部分。"最后几个字用红色的墨水写的，格外醒目。\n\n他看到你经过——微微一笑："你来了。我等你很久了——差不多……三世？四世？我记不清了。"',
  choices: [
    { id: 'wizard_reading', text: '让他为你占卜', effects: { awareness: 7, erosion: 3, setFlag: { got_reading_from_wizard: true } }, resultText: '你坐在他面前。他洗了牌——但牌在他手中流动得太流畅了，像水一样。他抽出三张牌——全部是空白的。"有意思。"他皱起眉头，"你的命运——是空白的。不是没有命运——而是被擦掉了。有人——或者某种力量——在反复重写你的命运线。"他抬头看你，表情严肃，"你这是第几次重来了？"', nextNodeId: '' },
    { id: 'wizard_ignore', text: '不信这套——直接走开', effects: { awareness: 1, setFlag: { ignored_wizard: true } }, resultText: '你摇了摇头，继续走。背后传来他的声音："没关系。你第五次经过的时候——我会再问你的。"你停下脚步。第五次？你回头——摊位已经不见了。和它一起消失的还有那个转角处的整片空地。', nextNodeId: '' },
  ]
};

const dressing_room = {
  id: 'dressing_room', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '试衣间的异常',
  narrative: '你走进一家服装店——不是因为你需要衣服，而是因为橱窗里一件外套的款式让你有一种奇怪的熟悉感。\n\n你拿着那件外套走进试衣间。拉上帘子——封闭的空间让你感到安心。你换上外套——大小正合适，像是为你量身定做的。\n\n你看向试衣镜——镜子里的你穿着外套，看起来很不错。但你不记得自己什么时候脱下了旧衣服。而且——镜子里的你——比你本人的动作快了那么零点几秒。就像镜像在——预演你的动作。',
  choices: [
    { id: 'dressing_stay', text: '仔细观察镜中的异常', effects: { awareness: 5, erosion: 3, setFlag: { noticed_dressing_mirror: true } }, resultText: '你盯着镜中的自己。一分钟后——镜子里的你眨了眨眼睛。你没有眨。镜子里的你笑了笑——一种很微妙的、不属于你的笑容。然后——镜中的你开口了——没有声音——但你的脑海中听到了一句话："记住，你才是倒影。"', nextNodeId: '' },
    { id: 'dressing_leave', text: '赶紧脱下外套离开', effects: { erosion: 2, setFlag: { fled_dressing_room: true } }, resultText: '你迅速脱下外套——但拉链卡住了。你越急越拉不开。你听到外面传来店员的声音——但你从帘子下方看到——店员的脚是悬空的。她在——飘。你终于扯下了外套，冲出了试衣间。店员微笑着站在柜台后面——她的脚好好地踩在地上。像是从未移动过。', nextNodeId: '' },
  ]
};

const loitering = {
  id: 'loitering', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '深夜的徘徊者',
  narrative: '夜深了。你走在空无一人的街道上——路灯的光芒在地面上投下一圈圈昏黄的光晕。\n\n你注意到有一个人在街对面的路灯下站着。他/她没有动——只是站在那里，面朝着你。你往前走——他/她没有跟上来。但你每次回头——他/她都在同一个距离。\n\n你停下来——他/她也停下来。你看不清他/她的脸——不论你怎么眯眼——那张脸始终被阴影笼罩着。但你有一种感觉——那个人的轮廓很熟悉。像你自己。',
  choices: [
    { id: 'loiter_approach', text: '主动走向那个影子', effects: { erosion: 8, awareness: 6, setFlag: { approached_loiterer: true } }, resultText: '你向它走去。每走一步——它就在后退，保持同样的距离。你开始跑——它开始向后飘移。你追了三条街——最后它在一条死胡同的尽头停下来了。你终于看清了它——那是你。但不是现在的你——是穿着不同衣服的你，留着不同发型的你。一个不同版本的你。它开口说："别再追了。你现在还没准备好见我。"然后它融入了墙壁。', nextNodeId: '' },
    { id: 'loiter_ignore', text: '装作没看到——快步回公寓', effects: { erosion: 2, setFlag: { ignored_loiterer: true } }, resultText: '你低着头快步往回走。你能感受到那道目光一直跟随你——直到你关上了公寓的门，锁上三道锁。你靠在门背上大口喘气。从门镜往外看——路灯下空无一人。但你听到门外传来一声极轻的叹息。', nextNodeId: '' },
  ]
};

const do_not_touch = {
  id: 'do_not_touch', scene: 'shrine_grounds', dayMin: 2, dayMax: 7,
  title: '不要触碰的封印',
  narrative: '神社正殿的侧墙上贴着一张古老的符咒。符纸已经泛黄，边缘卷曲——但上面的朱砂符文依然鲜红如新。符咒下方贴着一张现代打印的纸条——内容很简单："请勿触碰。"\n\n但符咒的角落里有一个细微的破损——像是被什么东西从内侧——从墙的另一面——抓破的。破损的边缘露出了一丝暗金色的光芒。\n\n你的手指不自觉地伸向了那个破损处——像是被一种无形的力量牵引着。',
  choices: [
    { id: 'touch_seal', text: '触碰符咒破损处', effects: { erosion: 9, awareness: 6, setFlag: { touched_shrine_seal: true } }, resultText: '你的指尖碰到破损处的瞬间——一股灼热感沿着手臂窜上来。你听到了尖叫声——不是人类的——是某种生物被压抑了太久的声音。符咒上的朱砂符文开始流动——像活过来一样——它们的红光和破损处的金光在对抗。你被一股力量弹开了——摔在地上。符咒恢复了原状。但你手中多了一小片金色的、像是鳞片的东西。', nextNodeId: '' },
    { id: 'touch_obey', text: '遵守提示——缩回手', effects: { awareness: 3, setFlag: { obeyed_shrine_warning: true } }, resultText: '你强迫自己把手放下来。符咒似乎在微微发光——像是在赞许你的克制。但你同时也感到——有什么东西在墙的另一面失望了。那东西慢慢远去——你能听到它的脚步声——蹄声——渐行渐远。', nextNodeId: '' },
  ]
};

const cat_ear_drawing = {
  id: 'cat_ear_drawing', scene: 'home_bedroom', dayMin: 1, dayMax: 5,
  title: '涂鸦的变化',
  narrative: '你醒来时——发现自己的手臂上有一片淡淡的墨水印。不是昨晚睡前有的。\n\n你仔细看——墨水印组成了一幅画：一只猫——但长着两条尾巴。画的线条很流畅，像是出自专业人士之手——但你完全不记得自己什么时候画过这个。\n\n更诡异的是——当你盯着看的时候——猫的尾巴动了一下。你揉了揉眼睛——尾巴不动了。但你确定刚才它确实动了。墨水印开始发痒——就像有什么东西正在从你的皮肤下生长出来。',
  choices: [
    { id: 'cat_wash', text: '用力搓洗——把墨水印洗掉', effects: { erosion: 4, setFlag: { washed_cat_drawing: true } }, resultText: '你用力搓洗——但墨水印纹丝不动。它不是在皮肤表面——它是在皮肤下面。你搓得越用力——它反而变得越鲜艳。最后你放弃了。当你从浴室出来时——你在镜子里看到自己的头顶——似乎有什么毛茸茸的东西——一晃而过。', nextNodeId: '' },
    { id: 'cat_accept', text: '接受它——观察它的变化', effects: { awareness: 5, erosion: 3, setFlag: { accepted_cat_mark: true } }, resultText: '你决定不理会它。但一整天——你总觉得有人在叫你的名字——用一种很轻很轻的、像猫叫一样的声音。而且你发现——你开始对鱼的味道特别敏感。', nextNodeId: '' },
  ]
};

const new_position = {
  id: 'new_position', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '新的职位',
  narrative: '公告栏上贴着一则招聘广告："市立医院——记忆优化项目——现诚聘项目协调员。待遇优厚。无需经验。提供全面培训。"\n\n广告上的联系人姓名是——小林护士。那位你在医院见过的、笑容完美到诡异的护士。\n\n广告的下方有一行小字——几乎看不清楚："通过本项目的筛选者——将获得永久居民身份。"永久居民——你突然意识到——你在这个城市里没有身份证明。没有任何能证明你存在的文件。',
  choices: [
    { id: 'position_apply', text: '申请这份工作——深入虎穴', effects: { erosion: 7, awareness: 5, setFlag: { applied_hospital_job: true } }, resultText: '你按照广告上的号码打了电话。接电话的正是小林护士——她的声音和你在医院听到的一模一样，甜美而空洞。"啊，是你。我猜到你会打电话了。"她轻笑了一声——那笑声让你后背发凉，"明天早上八点——来医院三楼报到。记得穿正装。你的培训——明天就开始。"', nextNodeId: '' },
    { id: 'position_ignore', text: '撕掉广告——不想和医院扯上关系', effects: { awareness: 2, setFlag: { tore_hospital_ad: true } }, resultText: '你撕下了广告。但手碰到纸面的瞬间——纸上的字迹发生了变化。原本的招聘信息消失了——取而代之的是一行红色的字："下次见。"你赶紧把纸扔掉——但它在你手中化成了灰烬。', nextNodeId: '' },
  ]
};

const unread_contract = {
  id: 'unread_contract', scene: 'home_bedroom', dayMin: 1, dayMax: 4,
  title: '未读的合同',
  narrative: '你在外套内侧口袋里发现了一张折叠整齐的纸。纸张的质地很好——像某种官方文件。\n\n你展开它——是一份合同。标题是"自愿参与常识覆盖计划同意书"。条款密密麻麻——你用目光扫过几个关键句子："签署者同意接受记忆调整"、"调整可能包括但不限于：人格微调、感知过滤、记忆重组"、"签署者放弃追究任何不适反应的权利"。\n\n合同最下方——有一个签名。是你的笔迹。日期是——三年前的今天。\n\n你完全不记得签过这个。',
  choices: [
    { id: 'contract_read', text: '仔细阅读全部条款——寻找漏洞', effects: { awareness: 6, erosion: 3, setFlag: { read_contract: true } }, resultText: '你一条条读下去——越读越心惊。第十七条注明："签署者每月需前往指定地点接受一次记忆维护。连续三个月未到者——将被列为"异常个体"——届时将采取进一步措施。"你翻到最后一页——最下方有一行极小的字："本合同的最终解释权归龙映市长所有。"', nextNodeId: '' },
    { id: 'contract_tear', text: '撕掉合同——不接受', effects: { erosion: 6, setFlag: { tore_contract: true } }, resultText: '你愤怒地撕碎了合同。纸片落在地上——但它们开始自己蠕动、重新组合。不到十秒——合同恢复了原状。一张新的、完好无损的合同——静静地躺在地板上。你听到——从空气中——传来了一个女性的笑声。"合同的墨迹——是用你的灵魂签的。你撕不掉的。"', nextNodeId: '' },
  ]
};

const radical_experiment = {
  id: 'radical_experiment', scene: 'city_hospital', dayMin: 3, dayMax: 7,
  title: '激进的实验',
  narrative: '医院地下三层的走廊尽头——有一间没有门牌号的实验室。你透过门上的玻璃窗向里看——里面灯火通明，但空无一人。\n\n实验台上放着一个打开的手提箱——里面整齐地排列着一排注射器。每支注射器里都装着不同颜色的液体——红色、蓝色、紫色、金色。箱子的盖子上刻着一行字："TSF血清系列——人体试验第一阶段。"\n\n旁边的显示器上滚动着数据——其中一行引起了你的注意："注射金色血清的个体——均出现了非自主物种转化。转化后个体表现出强烈的回归本能。"',
  choices: [
    { id: 'experiment_take', text: '偷一支血清——作为证据', effects: { erosion: 5, awareness: 4, setFlag: { stole_serum: true }, addItem: { id: 'stolen_serum', name: 'Stolen Serum', nameCN: '血清样本', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '从医院地下实验室偷来的血清。标签已经被撕掉了——只剩一个编号：TSF-07。', icon: 'item_key', flags: ['evidence'] } }, resultText: '你小心翼翼地推开门——门没有锁。你拿起一支金色血清放入口袋。就在你准备离开时——显示器突然亮了——屏幕上出现了一行字："样本已记录。感谢你的参与。"你意识到——这一切都是安排好的。你拿走的——是你被允许拿走的。', nextNodeId: '' },
    { id: 'experiment_photo', text: '拍照记录——不动任何东西', effects: { awareness: 6, setFlag: { photographed_experiment: true } }, resultText: '你拍下了实验室的照片——包括那些血清和显示器上的数据。照片清晰可见。你退出实验室——把门轻轻带上。但当你检查照片时——显示器上的文字变了。在照片中——屏幕上写着："下次来的时候——记得关门。"', nextNodeId: '' },
  ]
};

const abandoned_shrine = {
  id: 'abandoned_shrine', scene: 'shrine_grounds', dayMin: 2, dayMax: 7,
  title: '废弃的神社',
  narrative: '在神社后山的深处——你发现了一座被藤蔓和苔藓覆盖的废弃小神社。它看起来被遗弃了很久——但鸟居上的注连绳却是崭新的，像是刚刚被更换过。\n\n神社的拜殿前放着一面手镜——和你在公寓里看到的那面铜镜一模一样。镜面上凝结着水珠——像是一直有人在用它。\n\n拜殿的赛钱箱里——不是硬币——而是几颗犬齿。尖锐的、带着血迹的犬齿。',
  choices: [
    { id: 'abandoned_ring', text: '摇响拜殿前的铃铛', effects: { erosion: 8, awareness: 7, setFlag: { rang_abandoned_bell: true } }, resultText: '铃铛发出的声音不正常——低沉而浑厚——像是大钟的声音，而不是一个小铃铛该有的声响。声音在山中回荡——然后你听到了回应。从神社后方的黑暗中——传来了另一个铃声。更远。更深。像是有人在引你进去。', nextNodeId: '' },
    { id: 'abandoned_retreat', text: '后退出这片区域', effects: { awareness: 2, setFlag: { retreated_from_abandoned_shrine: true } }, resultText: '你小心翼翼地退出了鸟居的范围。当你跨过界线时——你明显感到空气中的温度变暖了。像是从一个冰冷的世界回到了正常的世界。你回头看——废弃神社在薄暮中若隐若现——但你似乎看到鸟居下站着一个穿着白衣的身影。只是一瞬间。', nextNodeId: '' },
  ]
};

const friend_science = {
  id: 'friend_science', scene: 'old_school', dayMin: 3, dayMax: 7,
  title: '理科教室的标本',
  narrative: '学校的理科教室里整整齐齐地排列着一排福尔马林标本瓶。青蛙、蛇、老鼠——正常的中学生会看到的标本。\n\n但在一排标本瓶的最后——有一个瓶子被白布盖着。你掀起白布的一角——里面泡着一个……人类耳朵。完整的、成人大小的耳朵。\n\n瓶子上贴着标签——不是学名——而是一个人的名字。那个名字是——你表姐日记里提到的小月。',
  choices: [
    { id: 'science_inspect', text: '仔细检查标本瓶和标签', effects: { awareness: 7, erosion: 3, setFlag: { inspected_ear_specimen: true } }, resultText: '你凑近看——标签下方还有一行小字："回收日期：2026年3月。备注：个体拒绝接受记忆调整。已回收认知器官。"你的手开始发抖。你认出了耳朵上的那颗小痣和你表姐日记里描述的位置一模一样。', nextNodeId: '' },
    { id: 'science_leave', text: '放下白布——赶紧离开', effects: { erosion: 4, setFlag: { fled_science_room: true } }, resultText: '你盖上白布——转身时撞到了一个放满烧杯的架子。玻璃破碎的声音在空荡荡的走廊里回荡。你跑出理科教室——但在走廊尽头——你看到一个穿着白色实验服的人影站在转角处。他没有追你——只是站在那里——手里拿着一个和你刚才看到的一样的标本瓶。', nextNodeId: '' },
  ]
};

const mirror_hand = {
  id: 'mirror_hand', scene: 'home_bedroom', dayMin: 1, dayMax: 4,
  title: '镜中的手',
  narrative: '夜里——你被一种声音唤醒。不是从房间传来的——是从镜子方向传来的。\n\n你看向放在桌上的古铜镜——镜面在月光下泛着淡淡的银光。一只手——一只苍白的手——正从镜面中伸出来。手指修长，指尖几乎要碰到了桌面。\n\n那只手在摸索——像是在寻找什么。它摸索到了你放在桌边的一支笔——然后缩回了镜中。镜面恢复了平静。像是从未发生过什么。',
  choices: [
    { id: 'mirror_hand_grab', text: '抓住那只手——和它对话', effects: { erosion: 9, awareness: 7, setFlag: { grabbed_mirror_hand: true } }, resultText: '你一个箭步冲过去——抓住了那只正准备缩回的手腕。指尖的触感冰冷——像是握住了一块冰。手臂的主人停顿了一下——然后从镜中传出了一个被压低的声音："放手。"你没有放。那只手开始用力回拉——力量比你大得多。你的手被拉入了镜中——你的手臂穿越了冰冷的镜面——你看到了镜子的另一侧。一座和你房间一模一样的房间——但一切都是相反的。', nextNodeId: '' },
    { id: 'mirror_hand_watch', text: '不动声色地观察——看它要做什么', effects: { awareness: 5, setFlag: { observed_mirror_hand: true } }, resultText: '你屏住呼吸。那只手摸索了一会儿——拿走了你的笔——然后缩了回去。镜面恢复平静。你走到镜子前——镜中的你看起来正常。但你的笔——真的不见了。你打开抽屉——你失踪的笔正躺在抽屉里。像是从未被拿走一样。', nextNodeId: '' },
  ]
};

const alien_encounter = {
  id: 'alien_encounter', scene: 'old_school', dayMin: 3, dayMax: 7,
  title: '非人的同窗',
  narrative: '你走在学校荒废的走廊上——突然听到一个教室里传来声响。你靠近门上的玻璃窗——里面坐着一个穿着旧校服的女孩。她背对着你，正在写什么东西。\n\n"进来吧——门没锁。"她的声音很轻——但你听得清清楚楚。\n\n你推开门。她转过头——她的脸是正常的——太正常了。但她的脖子——她的脖子上长着三对鳃裂——像是鱼的鳃——正在微微张合。她看着你惊讶的表情——笑了笑："别怕。我是二年级的。我出生就这样了——只是大部分同学看不到。"',
  choices: [
    { id: 'alien_talk', text: '和她交谈——问她的经历', effects: { awareness: 5, setFlag: { talked_to_gill_girl: true } }, resultText: '她叫真鱼。她在这所学校读了很多年——因为"外面的世界不接受她这样的"。"理事会说他们会帮我"调整"——让我变得完全人类的样子，"她摸了摸自己的鳃，"但我拒绝了。这是我的一部分。我不想要完美的记忆——我只想记住真实的自己。"', nextNodeId: '' },
    { id: 'alien_retreat', text: '找借口离开——你还不习惯和"非人"相处', effects: { erosion: 4, setFlag: { fled_from_gill_girl: true } }, resultText: '你后退了一步。真鱼的眼神暗了一瞬——然后她低头继续写字。"没关系。你也会习惯的。毕竟——你自己也在变成"非人"。"你低头看自己的手——皮肤上有什么淡淡的东西在浮现。是什么？你冲出教室。', nextNodeId: '' },
  ]
};

const talking_cat = {
  id: 'talking_cat', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '会说话的猫',
  narrative: '一只黑色的猫蹲在便利店门口的台阶上。它看起来很普通——除了它的眼睛。一只是绿色的，一只是蓝色的。\n\n你经过它时——它开口了。不是猫叫——是人话。一个低沉的、略带沙哑的男声："喂。你——身上有镜子的味道。"\n\n你停下脚步。黑猫舔了舔爪子——继续说："别那么惊讶。在这座城市里——会说话的动物是最不奇怪的东西。"它站了起来——甩了甩尾巴——它的尾巴尖端分成了两条——它是猫又。',
  choices: [
    { id: 'cat_talk', text: '蹲下来和猫对话', effects: { awareness: 4, setFlag: { talked_to_cat: true } }, resultText: '"你想知道真相？"猫又眯起眼睛——它的表情出奇地像人。"去车站。S7站台。午夜到两点之间有一列不存在的列车。如果你上去了——你会看到城市的真实面貌。但警告你——看到真相的人——不再能假装看不见。"', nextNodeId: '' },
    { id: 'cat_ignore', text: '假装没听到——继续走', effects: { setFlag: { ignored_talking_cat: true } }, resultText: '你假装没听见——继续走自己的路。身后的猫发出了一声很像人类叹息的声音："愚蠢。但——所有人一开始都这样。"你回头——猫消失了。台阶上只有一撮黑色的猫毛。', nextNodeId: '' },
  ]
};

const fairy_gold = {
  id: 'fairy_gold', scene: 'shrine_grounds', dayMin: 2, dayMax: 7,
  title: '精灵的金币',
  narrative: '在神社后院的古树下——你看到地面上有金色的闪光。拨开落叶——你发现了一枚古老的硬币。不是普通的日圆——是典型的金币，上面刻着你不认识的文字和图案。\n\n当你拿起金币时——一个细小的声音在你耳边响起——像是铃铛的余音："捡到我的金币——就是和我签订了契约哦。"\n\n你环顾四周——没有人。但在你的掌心里——那枚金币在发烫。金光中——你隐约看到了一个只有拇指大小的人形——她坐在你的手掌上——翅膀闪着露珠般的光。',
  choices: [
    { id: 'fairy_accept', text: '接受契约——收下金币', effects: { erosion: 6, awareness: 3, setFlag: { accepted_fairy_contract: true }, addItem: { id: 'fairy_gold_coin', name: 'Fairy Gold', nameCN: '精灵金币', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '一枚刻着古老文字的金币。持有者与森林精灵签订了契约——代价不明。', icon: 'item_key', flags: ['tsf_item'] } }, resultText: '金币在你手心中变凉了——但你知道它不再是普通的硬币了。你的耳朵里传来了清脆的笑声——然后声音消失。但你感觉到——有什么东西跟着你了。不是恶意的——但也不是完全无害的。像是你身后多了一个看不见的旅伴。', nextNodeId: '' },
    { id: 'fairy_return', text: '放下金币——不要随便签订契约', effects: { awareness: 2, setFlag: { refused_fairy_contract: true } }, resultText: '你把金币放回原处。那个声音再度响起——带着一丝失望但也有些赞许："谨慎是美德。但机会——不会等你第二次。"你转身离开——身后传来落叶被翻动的声音——像是小小的、失望的叹息。', nextNodeId: '' },
  ]
};

const witch_gift = {
  id: 'witch_gift', scene: 'town_center', dayMin: 3, dayMax: 7,
  title: '女巫的馈赠',
  narrative: '你在花店门口遇到了一个女人。她穿着深紫色的长裙，戴着一顶宽檐帽——在这座保守的城市里显得格外引人注目。\n\n她正在整理门口的盆栽——看到你时——她停下了手中的动作。她盯着你看了很久——久到让你感到不舒服。\n\n然后她笑了——一个温暖的、但充满了秘密的笑容："你有双好看的眼睛——能看到不该看到的东西的眼睛。"她从口袋里掏出一小瓶深蓝色的液体——瓶子里有银色的颗粒在缓慢旋转，像微型星云。"拿着。当你在黑暗中找不到路的时候——喝下它。"',
  choices: [
    { id: 'witch_accept', text: '收下小瓶', effects: { erosion: 4, awareness: 3, setFlag: { accepted_witch_potion: true }, addItem: { id: 'witch_starlight', name: 'Starlight Elixir', nameCN: '星光灵药', type: 'consumable', quantity: 1, maxStack: 1, usable: true, description: '女巫给你的神秘药水。深蓝色液体中漂浮着银色的颗粒——像流动的星空。', icon: 'item_key', flags: ['potion'] } }, resultText: '你将小瓶握在手中——瓶壁温热，像是活的。女巫点了点头——重新低头整理她的花。"记住——在完全黑暗的时候再使用。不要浪费。"她不再说话。你离开时——回头看——花店门口空无一人。但花香还在。', nextNodeId: '' },
    { id: 'witch_refuse', text: '礼貌拒绝——不轻易接受馈赠', effects: { awareness: 2, setFlag: { refused_witch_potion: true } }, resultText: '你摇了摇头。女巫耸了耸肩——把小瓶收了回去。她拿起一朵白色的花递给你："那至少收下这个吧。"你犹豫了一下——接过花。花瓣在你手心中慢慢变成了蓝色。你抬头——女巫已经消失了。', nextNodeId: '' },
  ]
};

const nymph_kiss = {
  id: 'nymph_kiss', scene: 'back_alley', dayMin: 3, dayMax: 7,
  title: '水边的吻',
  narrative: '在酒吧后方的暗巷深处——有一个被遗忘的小喷泉。喷泉早已干涸——但今夜——你经过时——它正在涌出清澈的水。\n\n水面上浮着一层淡淡的光——像是月光被收集在了这一小片水池中。水池边坐着一个赤足的少女——她穿着白色的薄纱裙——头发湿漉漉的——像是刚从水中走出来的。\n\n她抬头看你——她的眼睛是水蓝色的——但不像是人类的蓝——更像是晴朗天空本身的颜色。"你迷路了吗？"她的声音像流水一样清澈，"我可以——让你看到正确的路。"',
  choices: [
    { id: 'nymph_accept', text: '让她亲吻你的额头', effects: { erosion: 8, awareness: 7, setFlag: { kissed_by_nymph: true } }, resultText: '她站起身来——比你矮一个头——踮起脚尖在你的额头上轻轻一吻。她的唇冰冷而湿润——接触的瞬间——你的视野变得清明。你看到了——那些被常识覆盖的裂缝——像是空气中的玻璃裂痕——遍布整座城市。你看到了真正的世界——就在这层假象之下。但你同时也感到——自己的体温在下降。你在——变冷。', nextNodeId: '' },
    { id: 'nymph_decline', text: '后退——不对劲', effects: { awareness: 3, setFlag: { refused_nymph: true } }, resultText: '你后退了一步。少女歪了歪头——露出了一个悲伤的微笑。"害怕了吗？没关系。大多数人都会害怕。"她转身——走进了喷泉的水中——水面没有溅起任何涟漪——她沉了下去——消失在水光中。喷泉在她消失后——瞬间干涸了。', nextNodeId: '' },
  ]
};

const forbidden_book = {
  id: 'forbidden_book', scene: 'old_school', dayMin: 3, dayMax: 7,
  title: '禁书目录',
  narrative: '在学校图书馆最隐蔽的角落——你发现了一个上锁的书架。锁是普通的挂锁——但书架上贴着一张图书馆管理员的警告："本架图书仅供教师查阅。学生擅自阅读——后果自负。"\n\n你撬开了挂锁——书架上的书脊标题让你脊背发凉：《非常识生物图鉴》、《城市记忆改造工程纪要》、《TSF转化病例汇编》、《境界崩坏事件簿》……\n\n这些书——不应该存在于普通学校的图书馆里。或者说——这个图书馆——本来就不是给普通学生准备的。',
  choices: [
    { id: 'forbidden_take', text: '拿走《境界崩坏事件簿》', effects: { awareness: 7, erosion: 4, setFlag: { took_boundary_event_book: true }, addItem: { id: 'boundary_event_book', name: 'Boundary Collapse Records', nameCN: '境界崩坏事件簿', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '记录了城市三十年来所有境界崩坏事件的官方档案。封面盖着"机密"的印章。', icon: 'item_key', flags: ['forbidden', 'evidence'] } }, resultText: '你拿起最厚的那本——书的重量出乎意料，像是装订了金属板。你翻开——记录了自1999年以来城市发生的所有"异常事件"。每一页都附有照片——模糊的、扭曲的——但有一张你认得——是你公寓楼下的那条街道——照片中——街道上行走的人都没有脸。', nextNodeId: '' },
    { id: 'forbidden_read', text: '就地快速翻阅——不带走', effects: { awareness: 5, setFlag: { read_forbidden_books: true } }, resultText: '你快速翻阅了几本。你的手在抖——不是因为恐惧——而是因为你发现这些书中的描述和你这几天的经历完全吻合。常识覆盖的运作原理——TSF血清的配方——境界裂缝的分布图。你放下书时——你的世界观已经——被彻底改变了。', nextNodeId: '' },
  ]
};

const first_time = {
  id: 'first_time', scene: 'home_bedroom', dayMin: 1, dayMax: 2,
  title: '第一次异常',
  narrative: '你第一次明确感受到这个世界的裂痕——是在一个完全普通的时刻。\n\n你正在喝水。杯子里的水平静无波——但当你想放下杯子——你发现它粘在了你的手上。不是粘——是融入了。你的手指和玻璃杯的界面——模糊了。你分不清哪里是你的皮肤——哪里是杯壁。\n\n你惊恐地甩手——杯子摔碎在地上。你的手指恢复了正常。但地上的碎片——每一片都映着一小片天空——而且每一片映出的天空颜色都不一样。有的蓝色——有的紫色——有的——是星空。',
  choices: [
    { id: 'first_examine', text: '捡起碎片仔细观察', effects: { awareness: 5, erosion: 3, setFlag: { examined_first_anomaly: true } }, resultText: '你蹲下来捡起一片碎片——它在你指尖变暖了。你通过碎片看世界——世界变成了万花筒——重叠的、错位的——你看到了建筑物内部的结构——看到了墙壁另一侧的管道——看到了隔壁房间里一个正在读书的人——但那个人有三个影子。', nextNodeId: '' },
    { id: 'first_ignore', text: '清理碎片——假装只是一个意外', effects: { erosion: 4, setFlag: { ignored_first_anomaly: true } }, resultText: '你把碎片扫进垃圾桶。但每一片碎片在落进桶底时——都发出了一声极轻的——像是叹息的声音。你半夜醒来——发现垃圾桶自己倒了。碎片在地上排列成了一句话："你已经看到了。"', nextNodeId: '' },
  ]
};

const vr_app = {
  id: 'vr_app', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '虚拟现实体验',
  narrative: '商店街上新开了一家VR体验店。招牌上写着："梦镜——让你体验不一样的人生！"\n\n店门口排着长队——都是年轻人在等着试用。但他们的表情——不是兴奋——而是一种空洞的期待。像是被什么东西吸引着——而不是自己选择来的。\n\n店内的广告屏幕上播放着宣传片："厌倦了现在的自己吗？想变成完全不同的人吗？梦镜——让你在一小时内体验全新的人生。性别、年龄、物种——没有限制！"最后两个字"物种"——在屏幕上闪了一下才消失。像是——不该被看到的词。',
  choices: [
    { id: 'vr_try', text: '排队体验——看看这是什么', effects: { erosion: 7, awareness: 4, setFlag: { tried_vr_app: true } }, resultText: '你戴上头盔。一瞬间——你不再是人类了。你变成了一只鸟——在天空中飞翔——那种自由感如此真实——你几乎忘记了这是假的。但头盔摘下后——你仍然能感受到翅膀的幻痛。而且——你的背上——肩胛骨的位置——有两条轻微的凸起。像是有什么——想要长出来。', nextNodeId: '' },
    { id: 'vr_refuse', text: '不排队——观察其他体验者的变化', effects: { awareness: 5, setFlag: { observed_vr_users: true } }, resultText: '你站在一旁观察。每个体验者摘下头盔后——都有一瞬间表情是空白的——像是大脑还没有完全回到自己的身体。而且你注意到——有些人走出店后——走路的姿势变了。有些不自觉地歪着头——像是在听你不存在的声音。有些不时伸手摸自己的背——像是那里有什么。', nextNodeId: '' },
  ]
};

const hypnosis_gamble = {
  id: 'hypnosis_gamble', scene: 'back_alley', dayMin: 3, dayMax: 7,
  title: '催眠赌局',
  narrative: '魅魔酒吧的地下室深处——有一扇铁门。门后偶尔传出狂热的人声和清脆的筹码声。\n\n你推开铁门——里面是一个秘密赌场。但赌桌上的不是筹码——是人们赌上了自己的记忆。\n\n荷官是一个穿着燕尾服的狐妖——她的九条尾巴在身后轻轻摆动。她用优雅的声音宣布着规则："每一局——赢家可以从输家的记忆中抽取一段——归为己有。或者——你可以选择把你的记忆转化成——现实。"\n\n她看向刚进来的你——微微一笑："新玩家？要试试手气吗？"',
  choices: [
    { id: 'gamble_play', text: '参加一局', effects: { erosion: 9, awareness: 5, setFlag: { played_memory_gamble: true } }, resultText: '你坐上了赌桌。牌是记忆的碎片——你能感受到掌心的牌上承载着别人的喜怒哀乐。你赢了——你抽取了一段记忆：一次夏日的海边旅行，一个女孩的笑脸——温暖的、真实的——但这不是你的记忆。你赢来的幸福。但走出赌场时——你发现你不记得自己童年的暑假了。那段记忆——被当作赌注——输掉了。', nextNodeId: '' },
    { id: 'gamble_leave', text: '退出——记忆不是赌注', effects: { awareness: 3, setFlag: { refused_gamble: true } }, resultText: '你退出了。狐妖耸了耸肩——她的尾巴们像是在无声地嘲笑你的谨慎。"不玩也好。但记住——你已经看到了这里。你的记忆——已经被标记了。"', nextNodeId: '' },
  ]
};

const summoning = {
  id: 'summoning', scene: 'shrine_grounds', dayMin: 3, dayMax: 7,
  title: '召唤仪式',
  narrative: '在神社后山的遗迹中——地面上画着一个巨大的圆形法阵。符文是用鲜血画的——虽然已经干涸变黑——但依然散发着浓重的铁锈味。\n\n法阵的中心放着一面小铜镜——和你的那面一模一样。镜子周围排列着五根黑色的蜡烛——全部燃尽了——留下了扭曲的蜡泪。\n\n地面上散落着几张纸片——像是一次失败的召唤仪式的记录。你捡起一张——上面写着："第37次尝试——召唤对象：境界守护者——结果：失败。原因：献祭者记忆残留过高。"下方还有一行不同的笔迹："第38次——换一个自愿者。"',
  choices: [
    { id: 'summon_activate', text: '用自己的血重新激活法阵', effects: { erosion: 12, awareness: 8, setFlag: { activated_summoning: true } }, resultText: '你划破手指——血滴落在法阵上——瞬间——符文亮起了红光。地面的震动从你的脚底传来——法阵中央的铜镜开始旋转——镜面变成了一个漩涡。从漩涡深处——传来了一声叹息——古老而疲惫——"又是你。你又把我叫来了。"是你在镜中世界听到的那个声音——境界守护者。', nextNodeId: '' },
    { id: 'summon_clean', text: '清除法阵——不让任何人再使用它', effects: { awareness: 4, setFlag: { cleaned_summoning_circle: true } }, resultText: '你擦掉了符文——用泥土覆盖了血迹。但当你擦到法阵中心时——地面下传来了敲击声——像是有什么东西被困在下面——在感谢你。你加快了动作——完成后——你瘫坐在地上。敲击声停了。但你掌心里的那枚铜镜——温热了一瞬。', nextNodeId: '' },
  ]
};

const strange_animals = {
  id: 'strange_animals', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '异常的动物们',
  narrative: '你注意到这座城市里的动物——都有些不对劲。\n\n便利店门口蹲着三只鸽子——但它们不像是鸽子。它们的羽毛在阳光下泛着金属的光泽——而且它们有——四只眼睛。你走近时——它们没有飞走——而是齐齐转过头看着你——动作完全同步——像是被同一个意识控制的。\n\n一只野猫从垃圾桶后面探出头——它嘴里叼着一条鱼——但鱼还在挣扎——不只是挣扎——鱼在——喵喵叫？',
  choices: [
    { id: 'animals_observe', text: '花时间观察这些动物的行为', effects: { awareness: 4, erosion: 2, setFlag: { observed_strange_animals: true } }, resultText: '你坐在长椅上观察了半小时。鸽子们在固定的时间——整点时——一起飞起来——在城市上空绕三圈——然后落回原位。像是在执行某种程序。野猫们从不互相打架——它们见面时会用头触碰对方——然后交换——某种信息。这座城市里的动物——比人类更像是这个世界的原住民。', nextNodeId: '' },
    { id: 'animals_feed', text: '尝试用食物和它们互动', effects: { erosion: 3, setFlag: { fed_strange_animals: true } }, resultText: '你扔了一块面包给鸽子——最前面的那只啄了一口——它的喙没有碰到面包——面包就消失了。像是被——传送走了。鸽子转过头看着你——它的四只眼睛同时眨了两次——像是在说："谢谢。"你突然意识到——这些动物可能是这座城市的"监视器"。', nextNodeId: '' },
  ]
};

const teleporter = {
  id: 'teleporter', scene: 'subway_station', dayMin: 3, dayMax: 7,
  title: 'S7站台',
  narrative: '你找到了地铁站深处那个不在地图上的站台——S7。\n\n站台的入口被一道铁栅栏锁着——栅栏上挂着"维修中——禁止进入"的牌子。但铁锁是打开的——像是有人专为你留了门。\n\n你推开栅栏——沿着一条向下延伸的楼梯走了大约两分钟。站台很老旧——像是几十年前的风格——但异常干净。站牌上的字不是日文——而是一种你不认识的语言——但你能读懂它的意思："境界线站——下一站：真实。"\n\n站台上没有列车——但你能感受到铁轨在微微震动——有东西正在接近。',
  choices: [
    { id: 'teleport_wait', text: '等待列车到来——上车', effects: { erosion: 8, awareness: 9, setFlag: { boarded_s7_train: true } }, resultText: '列车从隧道中无声地驶来——不是普通的列车——车身是半透明的——你能看到车内坐满了——各种形态的存在。有人类——有完全不像人类的东西。车门打开——没有声音。你踏上了列车——车门在你身后关闭。透过车窗——你看到S7站台的灯光在远去——列车驶入了一个——由星光构成的隧道。', nextNodeId: '' },
    { id: 'teleport_leave', text: '记录下位置——改天再来', effects: { awareness: 4, setFlag: { found_s7_platform: true } }, resultText: '你退出了站台。但当你走上楼梯时——你听到身后的铁轨上传来了列车到站的声音——你回头——列车停在那里。车门开着——像是在等你。你没有上车。车门关上了——列车无声地驶离。但你手中的手机显示——时间是三小时后。你在站台里——待了三个小时？', nextNodeId: '' },
  ]
};

const unknown_item = {
  id: 'unknown_item', scene: 'home_bedroom', dayMin: 1, dayMax: 5,
  title: '无名之物',
  narrative: '你在枕头下发现了一件不属于你的东西。\n\n那是一个手掌大小的石质雕像——雕刻的是一只蜷缩着的生物——但它的身形在你注视时不断变化——有时像猫——有时像婴儿——有时像一团纯粹的几何形体。\n\n雕像底部刻着一行字——字迹很新——像是刚刻上去的："这是你上次留下的。你说——如果下次你忘记了——就把它放在你枕头下。现在你忘了。所以我放了。"\n\n你的冷汗沿着脊背流下来。"上次"——你什么时候有过"上次"？',
  choices: [
    { id: 'unknown_keep', text: '留下雕像——看看会发生什么', effects: { erosion: 6, awareness: 5, setFlag: { kept_unknown_statue: true }, addItem: { id: 'shifting_statue', name: 'Shifting Statue', nameCN: '变化雕像', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '一个会自己改变形状的石头雕像。底部刻着一行字——像是你自己留给自己的提醒。', icon: 'item_key', flags: ['tsf_item', 'mysterious'] } }, resultText: '你把雕像放在桌上。夜里——你听到极轻的脚步声——在房间里。你假装睡着了——从眼缝中——你看到雕像在桌上站立了起来——它伸展了身体——变成了一个细长的影子——它在房间里走了一圈——检查了门和窗户——然后回到桌上——重新变回了雕像的形态。它在——帮你守夜？', nextNodeId: '' },
    { id: 'unknown_discard', text: '把雕像扔掉——不想再卷入更多', effects: { erosion: 3, setFlag: { discarded_unknown_statue: true } }, resultText: '你把雕像扔进了垃圾道。但当夜——你梦到了一个场景：一个和你长得一模一样的人——在哭泣——对你说："你扔掉了我。你又扔掉了我。"你醒来时——枕头是湿的。', nextNodeId: '' },
  ]
};

const double_effect = {
  id: 'double_effect', scene: 'convenience_store', dayMin: 2, dayMax: 7,
  title: '双重效果',
  narrative: '小翠在收银台后面偷偷向你招手——示意你过去。\n\n"我跟你说件事——你别害怕。"她压低声音，"我昨天进了一批新货——是普通的能量饮料。但我打开一罐的时候——它变成了——"她从柜台下拿出一个空的易拉罐——标签上印着"TSF-能量PLUS"——但字迹在流动——像是活的。\n\n"我没有喝——但我看到——搬运工喝了一口——他的耳朵就变成了——尖的。精灵的那种。"她的眼神里充满了担忧，"这种饮料——正在全市的便利店销售。"',
  choices: [
    { id: 'double_buy', text: '买一罐留作证据', effects: { awareness: 4, erosion: 2, setFlag: { bought_tsf_drink: true }, addItem: { id: 'tsf_energy_drink', name: 'TSF Energy Drink', nameCN: 'TSF能量饮料', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '一罐疑似含有TSF成分的能量饮料。标签上的文字会在你不注意时变化。', icon: 'item_key', flags: ['evidence', 'tsf_item'] } }, resultText: '你买了一罐。小翠不愿意收钱——但你坚持付了。你把易拉罐装进口袋——它在你口袋里微微震动——像是活物。你离开便利店时——你看到对面街角的自动售货机里——也摆满了同样的饮料。', nextNodeId: '' },
    { id: 'double_warn', text: '让小翠把剩下的退回去——不要卖了', effects: { awareness: 2, setFlag: { warned_xiaocui_about_drink: true } }, resultText: '小翠点了点头——她打了个电话给供应商。但对方说——"这批货是理事会直接调拨的——不能退。"小翠挂了电话——她的脸色苍白。"理事会——他们已经开始——大规模投放了。"', nextNodeId: '' },
  ]
};

const defy_fate = {
  id: 'defy_fate', scene: 'town_center', dayMin: 3, dayMax: 7,
  title: '反抗命运',
  narrative: '商店街的中央——一群人围在一起。你挤进人群——发现了一个穿着黑色长袍的人站在高台上——不是占卜师——是一个……宣讲者。\n\n"各位市民！"他的声音洪亮而狂热，"你们有没有觉得——自己的生活——像是被安排好的？像是有人——在替你们做决定？"\n\n人群窃窃私语。他继续说："你们是对的。因为我们——都活在常识覆盖之中！"\n\n此言一出——人群中有人倒抽一口冷气——有人害怕地退后——但更多的人——露出了恍然大悟的表情。',
  choices: [
    { id: 'defy_join', text: '加入宣讲者——和他一起揭露真相', effects: { awareness: 6, erosion: 5, setFlag: { joined_defier: true } }, resultText: '你走上了高台。你和宣讲者并肩而立——你对着人群说出了你看到的真相：公告栏的日期、医院的档案、模糊的人群。人群中——有人开始哭泣——有人开始愤怒地呐喊。然后——警笛声响起——理事会的安保部队到了。宣讲者拉住你的手——塞给你一张纸条："逃。你比我更有价值。"', nextNodeId: '' },
    { id: 'defy_retreat', text: '悄悄退出人群——观望', effects: { awareness: 3, setFlag: { observed_defier: true } }, resultText: '你退到了人群边缘。宣讲者的话语在你的心中引起了强烈的共鸣——但你也知道——公开对抗理事会的下场。你看到安保部队带走了他——他没有反抗——只是微笑着看着人群。他在被押上车前——看了你一眼——对你——眨了眨眼。像是在说——"轮到你了。"', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：共通线补充节点（10个） — D1-D3线性流程
// ═══════════════════════════════════════════════════════════════════════════

const d1_morning_routine = {
  id: 'd1_morning_routine', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '清晨的日常',
  narrative: '你从那张陌生的床上醒来——这是你在"这个世界"的第一次完整的早晨。窗外的光线依然是那种不自然的金黄色——像是永远停在了傍晚。\n\n你检查了自己的身体——一切正常。但你在后颈处摸到了一个小小的凸起——像是埋藏在皮肤下的——芯片。只有米粒大小——不痛不痒——但你不记得自己做过任何植入手术。\n\n浴室镜子上凝结着一层水汽——但你睡前并没有洗过澡。水汽上有人用手指画了一个符号——和公寓门上的那个符号一模一样。',
  choices: [
    { id: 'morning_check', text: '仔细检查后颈的凸起', effects: { awareness: 3, setFlag: { found_neck_implant: true } }, resultText: '你对着镜子试图看清楚——但不管怎么转头——你都看不到那个位置。你用手指仔细感受——确实是异物——边缘光滑——规则的圆形——不像是自然生长出来的。你决定先不管它——但你知道——你的身体里——有什么不属于你的东西。', nextNodeId: 'explore_room' },
    { id: 'morning_go', text: '不管了——先出门再说', effects: { setFlag: { ignored_implant: true } }, resultText: '你穿上衣服——决定先不去想那个植入物。但在穿外套时——你发现外套口袋里有一张小票——是便利店的收据。日期是昨天——但你昨天才刚"醒来"。收据上的商品是——一瓶水和——"TSF-血清（测试用）"。', nextNodeId: 'explore_room' },
  ]
};

const d1_letter_content = {
  id: 'd1_letter_content', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '信的内容',
  narrative: '你坐在床边——手里握着那封自己写给自己的信。晨光透过窗帘的缝隙照在信纸上——你注意到了一些之前没看到的细节。\n\n信纸的材质很特殊——不是普通的纸——在光线下能看到嵌入纸中的银色纤维——像是某种电路。当你的指温传达到纸上时——那些银色纤维微微发亮——然后——纸上浮现了原本看不见的文字。\n\n在"别相信这个世界"的下方——出现了隐形的第二段话："我现在躲在S7站台写这封信。理事会的人在找我。他们已经找到了三个像我一样看到了真相的人。那三个人——都‘消失’了。我很快也会消失。但在我消失之前——我会把这个证据留给你。"',
  choices: [
    { id: 'letter_search', text: '检查信中提到的S7站台信息', effects: { awareness: 5, setFlag: { found_s7_clue_in_letter: true } }, resultText: '你翻看信纸的背面——在特定的光线下——浮现了一张手绘的地图。从公寓出发——穿过商店街——到达地铁站——然后在B3层——有一个没有标记的入口。入口上画着一个符号——和你门前的一模一样。', nextNodeId: 'leave_home' },
    { id: 'letter_save', text: '小心收好——这封信比看起来更重要', effects: { awareness: 3, setFlag: { treasured_letter: true } }, resultText: '你把信折好——放进了内衣口袋——离身体最近的地方。信纸贴在心口——微微发凉。不——不是发凉。是信在——读取你的心跳？', nextNodeId: 'leave_home' },
  ]
};

const d1_mirror_talk = {
  id: 'd1_mirror_talk', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '镜中对话',
  narrative: '你站在铜镜前——凝视着自己的倒影。铜镜的镜面不如水银镜清晰——你的轮廓有些模糊——像是隔着一层薄雾在看自己。\n\n但当你集中精神时——镜中的你开口了。不是你的声音——是一种从镜中传来的、带着轻微回音的声音——和你在公寓里听到的境界守护者的声音很像。\n\n"你在看自己。但你看的不是真正的自己。"镜中的影像发生了变化——你的倒影的眼中——映出了另一个场景：一条无尽的走廊——两侧是无数扇门——每一扇门上都有一个不同的名字。有一扇门上——写着你的名字。',
  choices: [
    { id: 'mirror_ask_identity', text: '问它"真正的我是什么？"', effects: { awareness: 6, erosion: 3, setFlag: { asked_mirror_identity: true } }, resultText: '镜中的影像笑了——那种笑容不带有任何温度。"真正的你——是一把钥匙。不是门的钥匙——是境界的钥匙。每一个持有古镜的人——都是钥匙。你来到这里——不是偶然。是有东西在召唤你。"', nextNodeId: 'leave_home' },
    { id: 'mirror_ignore', text: '用布盖上镜子——不听它的蛊惑', effects: { erosion: 2, setFlag: { covered_mirror_again: true } }, resultText: '你猛地用床单盖住了镜子。镜中传来的声音在床单下变成了闷闷的笑声："你遮得住镜子——但遮不住你自己的眼睛。你会再看我的。你总是会。"', nextNodeId: 'leave_home' },
  ]
};

const d2_street_explore = {
  id: 'd2_street_explore', scene: 'town_square', dayMin: 2, dayMax: 2,
  title: '街角的异样',
  narrative: '商店街的白日喧嚣中——你注意到了一些微妙的异样。一个卖气球的老人——他的气球都是普通的颜色——但它们的绳子——全部伸向同一个方向——像是被同一种力量牵引着。\n\n一个推着婴儿车的母亲从你身边走过——婴儿车里没有婴儿——而是一团模糊的、蠕动的阴影。但每个路人看到婴儿车时——都会露出善意的微笑说"好可爱的孩子"。\n\n你揉了揉眼睛——再看——婴儿车里的阴影消失了——取而代之的是一个真正的、正在睡觉的婴儿。但你的眼角余光中——阴影还在。',
  choices: [
    { id: 'street_investigate', text: '走近婴儿车仔细观察', effects: { awareness: 5, erosion: 3, setFlag: { investigated_baby_carriage: true } }, resultText: '你假装系鞋带——凑近了婴儿车。在最近的距离——你透过婴儿车的遮阳篷看到了真相：里面不是婴儿——是一团不断变化形态的灰色物质——它在模仿婴儿的形状。但当母亲低头看时——那团物质迅速凝固成了可爱的婴儿模样。母亲抬头看到你——微笑——那笑容和医院护士的一模一样。', nextNodeId: 'town_arrival' },
    { id: 'street_continue', text: '装作没看到——继续自己的探索', effects: { awareness: 2, setFlag: { ignored_street_anomaly: true } }, resultText: '你移开视线——继续走自己的路。但"正常"的定义——在你心中已经彻底崩塌了。', nextNodeId: 'town_arrival' },
  ]
};

const d2_convenience_talk = {
  id: 'd2_convenience_talk', scene: 'convenience_store', dayMin: 2, dayMax: 2,
  title: '便利店里的悄悄话',
  narrative: '你在便利店买完东西——正要离开时——小翠叫住了你。她看了看四周——确认没有其他客人——然后压低了声音。\n\n"我有件事要告诉你。"她的表情是你在她脸上从未见过的——认真——几乎是——恐惧。"昨天晚上——打烊之后——我在地下室听到了声音。不是老鼠——是人声。很多人在——哭。"\n\n她抓住你的手腕——她的手在发抖——而且你注意到——她的皮肤——在不安时会变得透明——你几乎能看到她皮下流动的胶状物质。"我不敢下去看。但我知道——那不是第一次了。每周三晚上——地下室都会有声音。"',
  choices: [
    { id: 'convenience_help', text: '答应陪她一起调查地下室', effects: { awareness: 5, affinity: { npcId: 'cui_slime', amount: 5 }, setFlag: { promised_xiaocui_investigation: true } }, resultText: '小翠松了一口气——她的眼中带着感激和担忧。"谢谢你。明天晚上——打烊后——我在店里等你。"她压低了声音——几乎听不见——"不要告诉任何人。"', nextNodeId: 'town_arrival' },
    { id: 'convenience_advise', text: '建议她报警——不要自己冒险', effects: { awareness: 2, setFlag: { advised_xiaocui_police: true } }, resultText: '小翠苦笑了一声——那笑容比哭还难看。"报警？你觉得——这座城市里的警察——会帮我们吗？"她松开了你的手——低下头。"算了。当我没说过。"她转身回到柜台后面——背影显得格外孤单。', nextNodeId: 'town_arrival' },
  ]
};

const d2_bulletin_detail = {
  id: 'd2_bulletin_detail', scene: 'town_square', dayMin: 2, dayMax: 2,
  title: '公告栏的细节',
  narrative: '你花了更多时间仔细研究公告栏上的每一张纸——不是走马观花——而是一张一张地读。\n\n大部分都是普通的社区通知：瑜伽班招生、失物招领、周末跳蚤市场。但当你凑近看那些印刷品的边缘时——你发现了一个微妙的模式：每一张公告的角落——都印着同一个极小的符号。和你公寓门上的一模一样。\n\n你数了数——一共二十三张公告。二十三个符号。像是——某种认证标记。表明这些信息是经过"许可"被张贴的。\n\n那么——没有被贴出来的信息呢？那些不被允许存在的——真相呢？',
  choices: [
    { id: 'bulletin_detail_collect', text: '收集带有符号的公告作为样本', effects: { awareness: 4, setFlag: { collected_bulletin_samples: true } }, resultText: '你小心地撕下了三张带有符号的公告。纸张在你手中微微发热——符号像是在回应你的触碰。你把它们折好放进口袋——现在你有了证据——证明这座城市的"正常"信息——都经过了某种审查。', nextNodeId: 'town_arrival' },
    { id: 'bulletin_detail_photo', text: '用手机拍下全景照片', effects: { awareness: 3, setFlag: { photographed_bulletin_panorama: true } }, resultText: '你后退几步——拍下了公告栏的全景。照片中——公告栏看起来很普通。但你放大照片时——你看到了一个你肉眼没有捕捉到的细节：公告栏最上方的空白处——用极淡的铅笔写着一行字："下一个公告——会在你准备好之后出现。"', nextNodeId: 'town_arrival' },
  ]
};

const d3_shrine_deep = {
  id: 'd3_shrine_deep', scene: 'shrine_grounds', dayMin: 3, dayMax: 3,
  title: '神社的深处',
  narrative: '狐铃带你参观了神社不对外开放的区域。在正殿的后方——穿过一条被竹帘遮蔽的走廊——是一间狭小的内殿。\n\n内殿里没有神像——只有一面巨大的铜镜嵌在墙中。镜面不是反光的——它在流动——像是一池静止的水银。\n\n"这是‘观真之镜’。"狐铃站在你身边——她的声音在内殿中产生了微妙的回音。"它能映出事物的真实形态——不被常识覆盖扭曲的真实。你想看看——自己真正的样子吗？"',
  choices: [
    { id: 'shrine_deep_look', text: '站到镜前看自己的真实形态', effects: { awareness: 8, erosion: 4, setFlag: { looked_into_truth_mirror: true } }, resultText: '你站到镜前。镜面波动——然后你看到了。你的倒影在镜中不是单一的一个——而是很多个重叠在一起。一个你穿着古代的衣服——一个你长着翅膀——一个你完全是由光芒构成的——还有一个你——和现在的你一模一样。这些"你"都在对你微笑。你明白了——你不仅仅是"一个人"。你是很多种可能的集合——而现在的你——只是其中的一个选择。', nextNodeId: 'meet_kitsune' },
    { id: 'shrine_deep_refuse', text: '后退——还不想知道真相', effects: { erosion: 2, setFlag: { refused_truth_mirror: true } }, resultText: '你摇了摇头。狐铃没有强迫你——她只是轻轻叹了口气。"没关系。那面镜子不会移动。当你准备好的时候——它还在那里。"她带你离开了内殿。但在转身的瞬间——你的余光看到镜中有一个你的倒影——在朝你挥手告别。', nextNodeId: 'meet_kitsune' },
  ]
};

const d3_kitsune_truth = {
  id: 'd3_kitsune_truth', scene: 'shrine_grounds', dayMin: 3, dayMax: 3,
  title: '狐铃的真身',
  narrative: '在神社后院的小屋中——狐铃为你泡了一壶茶。茶水的颜色是淡金色的——表面浮着一层微光——像是混入了月亮碎片。\n\n"你看到我的耳朵了吧。"她指了指头顶——她的狐狸耳朵微微抖动了一下。"我不是完全的人类。我是九尾狐的后裔——虽然现在只剩下一条尾巴了。"\n\n她低头看着茶杯——金色的眼睛中倒映着茶水的波纹。"三百年前——那场仪式失败的时候——我的祖先们用自己的力量封印了境界的裂缝。代价是——他们失去了大部分的妖力——变成了一尾狐。"\n\n她抬起头看着你——认真地说："而你——你是那个封印的关键。你的每一次轮回——都是为了调整封印。但这一次——封印开始松动了。"',
  choices: [
    { id: 'kitsune_truth_ask', text: '追问封印松动的原因和后果', effects: { awareness: 6, setFlag: { asked_seal_deterioration: true } }, resultText: '狐铃的表情变得凝重。"原因——是常识覆盖本身在不断削弱境界的稳定性。每一次记忆改写——都在境界线上留下了一道划痕。划痕越来越多——封印就越来越脆弱。"她停顿了一下——声音变得更低——"如果封印彻底崩溃——两个世界的边界会消失。不是融合——是碰撞。结果——没有人能预测。"', nextNodeId: 'shrine_secret' },
    { id: 'kitsune_truth_trust', text: '表示信任她——愿意协助', effects: { affinity: { npcId: 'kitsune_miko', amount: 5 }, setFlag: { trusted_kitsune_fully: true } }, resultText: '狐铃的肩膀微微放松——你才意识到她一直紧绷着。她的耳朵垂了下来——那是狐狸表达安心的方式。"谢谢。有你这句话——我感觉不那么孤单了。"她轻声说。', nextNodeId: 'shrine_secret' },
  ]
};

const d3_branch_choice = {
  id: 'd3_branch_choice', scene: 'shrine_grounds', dayMin: 3, dayMax: 3,
  title: '岔路口的抉择',
  narrative: '你站在神社的鸟居前——夕阳把你的影子拉得很长。前方有三条路——分别通往三种不同的未来。\n\n狐铃站在你身旁——她的狐狸耳朵在风中轻轻颤动。她给了你三个忠告——也可以说是三个选择：\n\n"如果你想知道这座城市的全部真相——去医院。那里的地下室——藏着理事会的核心机密。"\n\n"如果你想要力量——去小巷深处。那里有一些……非人类的存在——他们可以给你改变自我的能力。"\n\n"如果你只想活下去——回到日常中去。假装什么都没看到。也许——你还能安全地多活一段时间。"\n\n风吹过神社的风铃——发出了清脆的响声。她看着你——金色的眼睛中倒映着你的身影。"选择吧。但记住——有些选择——没有回头路。"',
  choices: [
    { id: 'branch_truth', text: '去医院——追寻真相', effects: { awareness: 5, setFlag: { route_truth: true } }, resultText: '你选择了真相之路。狐铃点了点头——像是早就预料到了你的选择。"医院的地下三层——注意掌纹锁。你的掌纹——能打开很多东西。"', nextNodeId: 'hospital_arrival' },
    { id: 'branch_tsf', text: '去小巷——追求力量', effects: { erosion: 5, setFlag: { route_tsf: true } }, resultText: '你选择了力量之路。狐铃的眼神中闪过一丝担忧——但她没有劝阻。"小巷深处的酒吧——去找夜魅。她会指引你。"', nextNodeId: 'alley_arrival' },
    { id: 'branch_daily', text: '回到日常——寻求安宁', effects: { erosion: -3, setFlag: { route_daily: true } }, resultText: '你选择了日常之路。狐铃微微一笑——但那笑容中带着一丝苦涩。"也许——这是最聪明的选择。但常识会找到你的。它从不放过任何一个——看到了真相的人。"', nextNodeId: 'd1_morning_routine' },
  ]
};

const d3_fateful_meeting = {
  id: 'd3_fateful_meeting', scene: 'shrine_grounds', dayMin: 3, dayMax: 3,
  title: '命运的重逢',
  narrative: '就在你准备离开神社时——一个意想不到的人出现了。\n\n一个穿着风衣的男人站在参道的尽头——他的脸上带着疲惫的笑容。当他走近时——你认出了他——他就是你在表姐日记照片里看到的那个人——和表姐合影的人。\n\n"你好。我是小月的弟弟。"他的声音有些沙哑——像是很久没有和人说过话了。"我姐姐留下的日记——你看到了吧。"\n\n他走近了几步——你注意到他的脖子上——有一个和你后颈一样的——小小的凸起。"我们都是被植入者。这座城市的每一个‘外来者’——脑中都被植入了监控芯片。"他苦笑了一声——"所以——我们的对话——理事会在听着。"',
  choices: [
    { id: 'fateful_talk', text: '和他私下交谈——避开监听', effects: { awareness: 6, setFlag: { met_xiaoyue_brother: true } }, resultText: '他点了点头——从口袋里掏出一个银色的小装置按下了开关。周围的空气似乎变得沉重了一瞬。"便携式结界发生器——能屏蔽三分钟的监控。"他快速说——"时间不多。记住三件事：第一——S7列车在午夜运行。第二——不要接受任何来自理事会的"免费体检"。第三——"他停顿了一下——直视着你的眼睛——"你已经死过很多次了。每一次——他们都会重置你的记忆。但这一次——你有机会打破循环。"', nextNodeId: 'shrine_secret' },
    { id: 'fateful_cautious', text: '保持距离——不轻易相信陌生人', effects: { erosion: 3, setFlag: { cautious_of_brother: true } }, resultText: '你后退了一步。他理解地点了点头——退回了参道。"谨慎是对的。在这个城市里——信任是最危险的奢侈品。"他转身准备离开——但又停住了——没有回头——说了一句："如果你改变主意——S7站台。午夜。报我的名字——"晓"。"他消失在暮色中。', nextNodeId: 'shrine_secret' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：真相线节点（15个） — D4-D7连贯叙事
// ═══════════════════════════════════════════════════════════════════════════

const truth_hospital_start = {
  id: 'truth_hospital_start', scene: 'city_hospital', dayMin: 4, dayMax: 4,
  title: '医院的真相之路',
  narrative: '你按照决心来到了医院。这一次——你不是来探索的——你是来寻找真相的。\n\n你避开了主大厅——直接走向通往地下室的楼梯。每一层楼的标志牌上——都写着"无关人员禁止进入"。但你知道——你不是无关人员。你的掌纹——是钥匙。\n\n在B3层的铁门前——你深吸一口气——把手放在了掌纹扫描器上。红灯闪烁了一下——然后变成了绿色。铁门发出了沉重的解锁声。门开了——你看到的不是你之前见过的走廊——而是一条向下延伸的新通道——之前从未对你开放过。',
  choices: [
    { id: 'truth_hospital_descend', text: '沿着新通道向下走', effects: { awareness: 6, setFlag: { entered_truth_hospital_depth: true } }, resultText: '通道两侧的墙壁上嵌着一排排发光的试管——里面漂浮着不同颜色的液体——和你在地下实验室看到的TSF血清一样。通道尽头是一扇刻满符文的青铜门——门上没有把手——只有一个手掌形状的凹痕。你把右手放了上去。门——在你面前无声地打开了。', nextNodeId: 'truth_doctor_vampire' },
    { id: 'truth_hospital_scout', text: '先退出——叫上帮手再来', effects: { awareness: 3, setFlag: { scouted_hospital_first: true } }, resultText: '你决定不贸然行动。你记下了位置——退回了地面。但在你转身的瞬间——你听到身后的铁门重新锁上了。这次——它没有给你开锁的机会。这条通道——可能只开放一次。', nextNodeId: 'front_desk' },
  ]
};

const truth_doctor_vampire = {
  id: 'truth_doctor_vampire', scene: 'city_hospital', dayMin: 4, dayMax: 4,
  title: '血月的真相',
  narrative: '青铜门后——是一间宽敞的圆形厅室。墙壁上覆盖着发光的符文——像活物一样缓慢流动。厅室中央——站着血月。\n\n她穿着白大褂——但这一次——她没有微笑。她的表情是你从未见过的——严肃——甚至可以说是——尊敬。\n\n"你能走到这里——说明你真的想知道了。"她的声音在圆厅中回荡。她抬手——指向厅室中央的一个全息投影——那是这座城市的三维地图——但上面覆盖着无数条发光的线——像血管一样——从一个中心点辐射到城市的每一个角落。\n\n"这是常识覆盖网络的真实结构。"血月说。"每一个发光点——都是一个记忆调整基站。而中心——就是你现在站着的地方——医院的B3层。这里是整个系统的——大脑。"',
  choices: [
    { id: 'truth_vampire_ask', text: '问她——为什么要帮理事会做这些', effects: { awareness: 5, setFlag: { asked_vampire_motivation: true } }, resultText: '血月的表情第一次出现了裂痕——她低下头——沉默了很久。"因为我害怕。"她的声音几乎听不见。"三百年前——我是第一批被转化的吸血鬼之一。我见过理事会真正的力量。如果你不服从——他们不会杀死你。他们会让你——"从不曾存在"。"她抬起头——眼中有着暗红色的光芒——"但最近——我开始想——也许"从不曾存在"——都比活在谎言中要好。"', nextNodeId: 'truth_morgue' },
    { id: 'truth_vampire_ally', text: '请求她加入你——共同对抗理事会', effects: { awareness: 4, affinity: { npcId: 'vampire_doctor', amount: 5 }, setFlag: { recruited_vampire: true } }, resultText: '血月沉默地凝视了你很久。然后——她笑了——那是一个真正的、带着解脱意味的笑容。"你知道吗——三百年来——你是第一个说‘一起’的人。"她摘下了白大褂——下面穿着一件黑色的紧身衣。"我一直等着有人能走进这扇门。现在你来了。"', nextNodeId: 'truth_morgue' },
  ]
};

const truth_morgue = {
  id: 'truth_morgue', scene: 'city_hospital', dayMin: 4, dayMax: 4,
  title: '真正的秘密',
  narrative: '血月带你进入了圆形厅室深处的一个隐藏房间。房间很小——只有十平方米左右——但四面的墙壁上全是屏幕。\n\n屏幕上显示着这座城市每一个角落的实时画面——便利店、学校、神社、小巷——甚至你的公寓卧室。每一个画面都有人在活动——但每一个人的头上——都悬浮着一串数字。\n\n"这是记忆监控系统。"血月指着屏幕。"每一个市民的记忆状态——都被实时追踪。绿色代表稳定——黄色代表出现偏差——红色代表——需要干预。"\n\n你看到了自己的画面。你的头上——数字是黄色的——而且在不断闪烁。"你的记忆偏差值正在上升——因为他们正在调整你的记忆。现在——立刻。"',
  choices: [
    { id: 'truth_morgue_disrupt', text: '尝试关闭监控系统', effects: { awareness: 7, erosion: 5, setFlag: { tried_shutdown_monitor: true } }, resultText: '你冲到主控台前——但屏幕上弹出了一个对话窗口——上面显示着你的脸。"我知道你会来。我是龙映——通过这个系统在和你对话。你确定要关闭它吗？如果你关掉了——你将永远无法离开这座城市。你会被留在这里——和那些被你释放的记忆——一起。"', nextNodeId: 'truth_school_archive' },
    { id: 'truth_morgue_record', text: '记录一切——作为证据', effects: { awareness: 6, setFlag: { recorded_morgue_evidence: true } }, resultText: '你用血月给的手机拍下了所有的屏幕画面——包括你自己的监控数据。几百GB的证据——现在就在你的口袋里。但当你拍完最后一张照片时——你看到自己的数字从黄色变成了红色。他们知道你来过了。', nextNodeId: 'truth_school_archive' },
  ]
};

const truth_school_archive = {
  id: 'truth_school_archive', scene: 'old_school', dayMin: 5, dayMax: 5,
  title: '学校的秘密档案室',
  narrative: '你来到学校——不是为了上课——而是为了寻找被藏在这里的另一份档案。血月告诉你——学校的旧图书馆地下——还有一间被遗忘的档案室。\n\n你找到了通往地下室的隐蔽入口——在一排看起来普通的书架后面。地下室的空气尘封而干燥——但这里的资料比医院的更古老——更原始。\n\n这里存放着常识覆盖计划的最初版本——写在泛黄的羊皮纸上——由人类和妖怪共同起草。你翻阅了最初的协议——上面写着："为维护两界和平——自愿建立认知过滤网——双方同意——牺牲真实的记忆——换取共同的生存。"\n\n这份协议的签署日期是——1724年。距今——整整三百年。',
  choices: [
    { id: 'truth_archive_take', text: '带走原始协议作为铁证', effects: { awareness: 7, setFlag: { took_original_agreement: true }, addItem: { id: 'original_agreement', name: 'Original Treaty', nameCN: '原始协议', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '1724年由人类与妖怪共同签署的原始协议——常识覆盖计划的起源文件。羊皮纸已经泛黄——但字迹依然清晰。', icon: 'item_key', flags: ['evidence'] } }, resultText: '你小心地将协议卷好——放入了防护管中。这份文件——是世界上最重要的历史证据之一。但当你把它拿起来时——你注意到协议的最下方——有一行用不同颜色墨水写的补充条款——字迹和你公寓门上的符号一样——"本协议——将在签署者自愿废除时——终止。"自愿——这意味着——你有权终止它。', nextNodeId: 'truth_newspaper' },
    { id: 'truth_archive_photo', text: '拍照存档——不移动原件', effects: { awareness: 5, setFlag: { photographed_agreement: true } }, resultText: '你拍下了每一页——包括那个补充条款。照片很清晰——但你注意到——在你按下快门的瞬间——协议上的部分文字——像是活过来一样——重新排列了一次。它——在对你做出回应。', nextNodeId: 'truth_newspaper' },
  ]
};

const truth_newspaper = {
  id: 'truth_newspaper', scene: 'old_school', dayMin: 5, dayMax: 5,
  title: '旧报纸的线索',
  narrative: '在档案室的角落里——堆放着一摞泛黄的旧报纸。最上面的几张是1999年的——和你在公告栏上看到的日期吻合。\n\n你随手拿起一张——标题是"市长龙映宣布城市改造计划——迈向新世纪"。照片中的龙映——和你在市政厅见到的一模一样——二十七年过去了——她没有变老。\n\n但这张报纸最吸引你的——是角落里的一则小广告——只有拇指大小——但字迹是手写的——在印刷体中格外显眼："真相不会消失——只是等待被发现。S7站台——午夜。"和你在小巷涂鸦上看到的——一模一样的标记。',
  choices: [
    { id: 'truth_newspaper_collect', text: '收集所有带有S7标记的报纸', effects: { awareness: 5, setFlag: { collected_s7_newspapers: true } }, resultText: '你在报纸堆中翻找——找到了十多份带有S7标记的报纸——时间跨度从1999年到2025年。每一份上都有一条手写的线索——像是有人在时间的长河中——留下了连续的导航标记。', nextNodeId: 'truth_mayor_conspiracy' },
    { id: 'truth_newspaper_decipher', text: '尝试解读所有手写线索的模式', effects: { awareness: 6, setFlag: { deciphered_s7_pattern: true } }, resultText: '你把所有的手写线索按时间顺序排列——发现了一个模式：每一条线索——都指向下一步调查的方向。从1999年的"看公告栏"——到2005年的"去医院地下室"——到2012年的"狐铃知道真相"——到2020年的"小心体检"——再到2025年的最后一则——"你已经足够接近了。下一步——去市政厅。"', nextNodeId: 'truth_mayor_conspiracy' },
  ]
};

const truth_mayor_conspiracy = {
  id: 'truth_mayor_conspiracy', scene: 'town_hall', dayMin: 6, dayMax: 6,
  title: '市长的阴谋',
  narrative: '你带着收集到的所有证据——来到了市政厅。但这一次——你不是从正门进入的。血月为你提供了一条暗道——通过地下管网——直接通往市长办公室的下方。\n\n在办公室的正下方——有一间隐藏的密室。密室的一面墙是单向玻璃——你可以看到楼上的市长办公室。龙映正在里面——但她的样子——和你上次见到的不一样。\n\n她的头上——长出了一对黑色的龙角——在灯光下泛着暗紫色的光。她的眼睛——是完全的竖直瞳孔——金色的——像某种古老的爬行动物。她在打电话——声音从墙上的扩音器中传出——"第三阶段的覆盖计划提前了。那个觉醒者已经进入了B3层。必须在她/他看到更多之前——重置。"\n\n她挂断电话——转向了你所在的方向——直直地看着单向玻璃——像是在直接看着你。然后——她微微一笑。她知道你在那里。',
  choices: [
    { id: 'truth_mayor_confront', text: '冲上去当面对质', effects: { awareness: 6, erosion: 4, setFlag: { confronted_mayor_early: true } }, resultText: '你一脚踢开了密室的暗门——出现在了市长办公室中。龙映没有惊讶——她靠在椅背上——双手交叠放在桌上。"我就知道你会来。我一直在等你。"她的声音平静得可怕——像是一切都在她的预料之中。', nextNodeId: 'truth_dragon_confront' },
    { id: 'truth_mayor_record', text: '继续隐藏——录下她的对话', effects: { awareness: 4, setFlag: { recorded_mayor_conversation: true } }, resultText: '你忍住了冲出去的冲动——继续记录。龙映打了第二个电话——这次是用一种你听不懂的语言——但你能感受到话语中的力量——像是某种古老的语言——每一个音节都在空气中引起微弱的震动。她挂断电话后——对着空无一人的办公室说了一句——用你听得懂的语言——"你还是不出来吗？那我等你。"', nextNodeId: 'truth_dragon_confront' },
  ]
};

const truth_dragon_confront = {
  id: 'truth_dragon_confront', scene: 'town_hall', dayMin: 6, dayMax: 6,
  title: '龙映的对峙',
  narrative: '你和龙映面对面对峙着。空气在你们之间凝固了。\n\n她的龙角在灯光下闪着幽光——她的金色竖瞳直视着你的眼睛——像是在阅读你的灵魂。"你知道我为什么这么做。"她的声音低沉而平稳——像是在陈述一个不可辩驳的事实。"三百年前——在你——你的前世——和我——一起造成了境界的崩溃之后——我必须找到一个方法来控制损害。"\n\n她站了起来——绕过办公桌走到你面前——身材比你高出一个头——她的影子在墙上投射出龙的形态。"常识覆盖——不是折磨。是一种保护。你不是受害者——"她的手指点了点你的胸口——"你是创始人之一。"',
  choices: [
    { id: 'truth_dragon_deny', text: '否认——拒绝接受自己是共犯', effects: { awareness: 6, erosion: 5, setFlag: { denied_dragon_accusation: true } }, resultText: '"不。你撒谎。"你的声音比想象中坚定。龙映没有生气——她只是露出了一个悲伤的笑容——那笑容让她看起来像是背负了千年重担的老人。"我想相信你说的是真的——但你每一次转世——在记忆重置的间隙——都会回到这间办公室。都会想起一切。都会——再一次——认同我的选择。"她从桌上拿起一面小铜镜——照向你——镜中的你——穿着古代的衣服——和你在地下神社镜中看到的那个古代你——一模一样。', nextNodeId: 'truth_police_coop' },
    { id: 'truth_dragon_listen', text: '听她说完——了解全部真相', effects: { awareness: 8, setFlag: { heard_dragon_full_story: true } }, resultText: '龙映的故事比你能想象的更复杂。三百年——不是两个世界和平共处的三百年——而是一场缓慢的、悄无声息的灭绝。妖怪的现实——正在被人类的常识——一点一点地——覆盖掉。常识覆盖——在保护人类免受真相冲击的同时——也在缓慢地杀死妖怪世界的存在。"所以——"她看着你——"你需要做出选择。是让我继续这个计划——让妖怪在不知不觉中消失——还是打破这个系统——冒着两个世界都毁灭的风险——让真相重见天日。"', nextNodeId: 'truth_police_coop' },
  ]
};

const truth_police_coop = {
  id: 'truth_police_coop', scene: 'town_hall', dayMin: 6, dayMax: 6,
  title: '警方的合作',
  narrative: '你和龙映的对峙被一阵敲门声打断了。一个穿着警服的男人走了进来——但他不是普通的警察。他的肩上有着特殊的徽章——一只睁开的眼睛——和你在神秘包裹中拿到的硬币上的图案一样。\n\n"局长。"龙映向他点了点头。"这位就是那个觉醒者。"\n\n警长看向你——他的目光锐利而冷静。"我一直在等一个能看到的人。这座城市里的警察——有一半是理事会的走狗。但另一半——"他稍微掀起了制服——露出里面的一枚挂坠——和你在神社里看到的金色鳞片一样——"是站在真相这一边的。"\n\n他向你伸出了手。"我有你需要的资源——但我也需要你的帮助。请跟我来。"',
  choices: [
    { id: 'truth_police_follow', text: '信任他——跟他走', effects: { awareness: 5, setFlag: { followed_police_chief: true } }, resultText: '你跟着警长走出了办公室。龙映没有阻止你们——她只是坐回了椅子上——闭着眼睛——像是在做一个艰难的决定。在走廊里——警长低声告诉你——"她在犹豫。她不是我们的敌人——但她也不是我们的朋友。她是一个被困在自己选择中的——囚徒。"', nextNodeId: 'truth_evidence_public' },
    { id: 'truth_police_cautious', text: '保持谨慎——不轻易信任', effects: { awareness: 3, setFlag: { cautious_with_police: true } }, resultText: '"我需要先确认你的身份。"警长点了点头——从上衣口袋掏出证件递给你。他的名字是——"雾岛诚"。证件照片看起来是真的——但照片里的人——比你面前的人年轻了至少二十岁。"我做警察二十七年了。"他像是看出了你的顾虑——"这座城市的变化——我一点一点都看在眼里。"', nextNodeId: 'truth_evidence_public' },
  ]
};

const truth_evidence_public = {
  id: 'truth_evidence_public', scene: 'town_hall', dayMin: 6, dayMax: 6,
  title: '证据的公开',
  narrative: '警长带你来到警局地下室的一间密室。这里比医院的地下室更简陋——但更安全。墙壁上贴着这座城市的地图——标记了所有常识覆盖基站的位置。\n\n"我们需要把你的证据公之于众。"警长打开了一个加密的保险箱——里面是一台老式的胶片投影仪。"现代的通讯方式都在理事会的监控之下。但胶片——他们管不到。"\n\n他拿出了十几个胶卷盒——里面是他多年收集的证据——加上你带来的新证据。"明天是城市建立纪念日——会有全市广播。我已经安排了一个人在广播站——在纪念致辞的时候——我们会用他们的频道播放这些证据——持续三十秒。三十秒之后——他们就会切断信号。但这三十秒——足够让这座城市醒来。"',
  choices: [
    { id: 'truth_evidence_agree', text: '同意这个计划——公开证据', effects: { awareness: 6, setFlag: { agreed_broadcast_plan: true } }, resultText: '"好。"警长握了握你的手——他的手温暖而坚定。"明天中午十二点。你会站在市政厅的楼顶——看着这座城市——看到真相降临的那一刻。"', nextNodeId: 'truth_alley_graffiti' },
    { id: 'truth_evidence_edit', text: '建议修改计划——先争取更多支持', effects: { awareness: 4, setFlag: { modified_broadcast_plan: true } }, resultText: '"你说得对——光靠播送证据可能不够。"警长思考了一下——"你有人可以联络吗？神社的狐铃？便利店的史莱姆？魅魔酒吧？多一些帮手——胜算更大。"', nextNodeId: 'truth_alley_graffiti' },
  ]
};

const truth_alley_graffiti = {
  id: 'truth_alley_graffiti', scene: 'back_alley', dayMin: 6, dayMax: 6,
  title: '小巷的最后线索',
  narrative: '在最后的行动之前——你决定再回一趟小巷。那些发光的涂鸦——在夜色中显得比之前更亮了——像是在为你送行。\n\n你沿着涂鸦的路线走——它们今天排列成了一条明确的路径——通往魅魔酒吧的地下室。你推开门——夜魅和警长已经在等你了。\n\n"我们有一个问题。"夜魅的神色严肃。"理事会在纪念日当天——会启动一台新的装置——‘认知固化仪’。一旦启动——常识覆盖将从临时措施变成永久性的。到时候——没有人——包括你——还能再看到真相。"\n\n她把手放在你的肩上——你不禁注意到她的角——比上次见面时长大了。"我们必须在广播之前——先摧毁它。"',
  choices: [
    { id: 'truth_alley_join', text: '加入摧毁计划', effects: { awareness: 5, setFlag: { joined_device_raid: true } }, resultText: '"好。"警长点了点头——递给你一张地图——上面标明了装置的位置——市政厅地下三层的备用发电机房。"它是用特殊的结界材料制成的——普通的武器摧毁不了。但——"他从怀里拿出一把古老的匕首——刀身上刻满了符文——"这把刀——是用"境界碎片"锻造的。它能切开任何结界。"', nextNodeId: 'truth_mirror_world' },
    { id: 'truth_alley_coordinate', text: '协调多方力量——确保计划无缝衔接', effects: { awareness: 4, setFlag: { coordinated_raid: true } }, resultText: '你成了计划的枢纽——连接神社、便利店、酒吧和警长四方力量。狐铃负责用符咒干扰理事会的感知——小翠用她的史莱姆能力渗透管道——夜魅负责吸引安保队的注意——警长提供武器和通道。而你——你负责去摧毁认知固化仪。', nextNodeId: 'truth_mirror_world' },
  ]
};

const truth_mirror_world = {
  id: 'truth_mirror_world', scene: 'mirror_dimension', dayMin: 7, dayMax: 7,
  title: '镜中世界的指引',
  narrative: '行动前夜——你无法入睡。你坐在公寓里——手中握着那面古铜镜。镜面平静如水——倒映着你的脸——但这一次——你没有在镜中看到自己。\n\n你看到的是——一个广阔的、由光芒构成的图书馆。书架无限延伸——每一本书都是一段记忆——每一段记忆——都是某个人被改写前的真实人生。\n\n那个声音——境界守护者——再次响起。"你准备好了。"这不是疑问——是陈述。"你是我等待了三百年的那个人。不是你的前世——而是你——这一世的你。因为只有当你知道了所有真相——依然选择站出来——你才是真正的钥匙。"\n\n镜面上浮现了一个坐标——不是地理位置——而是一个记忆坐标。一段被封印的记忆——只有你亲自去取回——才能真正理解一切。',
  choices: [
    { id: 'truth_mirror_retrieve', text: '进入镜中——取回那段记忆', effects: { awareness: 10, erosion: 5, setFlag: { retrieved_ancient_memory: true } }, resultText: '你让自己的意识沉入镜中。记忆的潮水将你淹没——你看到了三百年前的场景。你——站在法阵中央——和龙映并肩——面对着境界的裂缝。你是那个提出常识覆盖的人。不是龙映——是你。你——才是这个计划的——真正创造者。你跪倒在地——不是因为恐惧——而是因为——你终于记起来了。你终于——知道了一切。', nextNodeId: 'truth_boundary_explore' },
    { id: 'truth_mirror_decline', text: '先不取回——专注于眼前的计划', effects: { awareness: 5, setFlag: { deferred_memory_retrieval: true } }, resultText: '"明智。"境界守护者的声音带着一丝赞许——"过去的记忆不会跑掉。明天的行动——更重要。"镜面恢复了平静。但你掌心里的镜子——比之前更温热了。像是——在为你加油。', nextNodeId: 'truth_boundary_explore' },
  ]
};

const truth_boundary_explore = {
  id: 'truth_boundary_explore', scene: 'mirror_dimension', dayMin: 7, dayMax: 7,
  title: '境界的真相',
  narrative: '你站在镜中世界的深处——这里是两个世界的交界处。你在现实中从未见过这样的景象：人类的城市和妖怪的世界——像两张幻灯片叠在一起——在你眼前不断切换。\n\n你能看到——理事会的认知固化仪——像一颗黑色的心脏——嵌在两层现实的交接处——正在缓慢地——把妖怪世界的那一层——压碎。\n\n你知道你现在必须做什么了。不是摧毁仪器——而是——做出一个更根本的选择。\n\n境界守护者出现在你面前——这次——她有形态了——一个和你长得一模一样——但由光构成的人形。"你可以选择摧毁固化仪——但这只是暂时的胜利。只要两个世界的境界仍然脆弱——总会有人再次尝试控制。"\n\n"或者——你可以选择——真正修复境界线。让两个世界——在平等等——共存。"',
  choices: [
    { id: 'truth_boundary_fix', text: '选择修复境界——追求真正的共存', effects: { awareness: 10, erosion: -10, setFlag: { chose_repair_boundary: true } }, resultText: '"好。"境界守护者微笑——她的光芒变得更加明亮。"你做出了——和你前世完全不同的选择。这一次——你真的在改变了。"', nextNodeId: 'truth_final_choice' },
    { id: 'truth_boundary_destroy', text: '选择摧毁固化仪——先解决眼前的威脅', effects: { erosion: 5, awareness: 5, setFlag: { chose_destroy_cognifier: true } }, resultText: '境界守护者沉默了一瞬——然后点了点头。"这也是一种选择。务实。但记住——摧毁一个装置——比重建一个世界——容易得多。但也许——一步一步来——才是正确的路。"', nextNodeId: 'truth_final_choice' },
  ]
};

const truth_final_choice = {
  id: 'truth_final_choice', scene: 'town_hall', dayMin: 7, dayMax: 7,
  title: '最后的抉择',
  narrative: '你站在市政厅地下三层的发电机房门前。门后——就是认知固化仪。只要摧毁它——常识覆盖就会开始瓦解。人类的记忆——将不再被改写。\n\n但你的口袋里——还装着那份三百年前的原始协议。它的补充条款写着——"本协议——将在签署者自愿废除时——终止。"\n\n你有两个选择：用境界碎片锻造的匕首——物理摧毁固化仪——或者——用你自己的意志——以创始人的身份——宣告协议的废除。\n\n前者——快速——但可能会有后遗症。后者——彻底——但需要你在所有人面前——承认自己就是三百年前的那个人。\n\n警长在对讲机里催你——"时间不多了。纪念致辞将在十分钟后开始。"\n\n你握着匕首——另一只手里——攥着那份古老的协议——抉择的时刻到了。',
  choices: [
    { id: 'truth_final_declare', text: '宣告协议废除——用创始人的身份结束这一切', effects: { awareness: 12, erosion: -8, setFlag: { declared_treaty_void: true } }, resultText: '你把协议高高举起——用尽全身的力气——宣布——"以协议的签署者——以境界的建立者和守护者——我宣布——这份协议——从此刻起——正式废除！"\n\n你的声音在空间中产生了奇异的回响——协议在你手中发出了耀眼的光芒——然后——化作无数光点——散入空气中。整栋建筑开始震动——你听到了——从城市的每一个角落——传来的——人们惊呼的声音。因为——常识覆盖——正在崩塌。真实——正在回归。', nextNodeId: 'truth_awakening' },
    { id: 'truth_final_stab', text: '用匕首摧毁固化仪——物理破坏', effects: { awareness: 8, erosion: 3, setFlag: { stabbed_cognifier: true } }, resultText: '你冲进机房——仪器比你想象的更大——一台黑色的、脉动的巨大装置——像一颗金属心脏。你用尽全身力气——将匕首刺入了它的核心。\n\n仪器发出了一声尖啸——不是机械的声音——而是某种生物的惨叫声。然后——它停止了。碎片散落一地。你成功了。但在这个过程中——你感到一阵巨大的疲惫——像是你的一部分——也随着那个仪器一起——被摧毁了。', nextNodeId: 'truth_awakening' },
  ]
};

const truth_awakening = {
  id: 'truth_awakening', scene: 'town_hall', dayMin: 7, dayMax: 7,
  title: '觉醒',
  narrative: '一切结束了——或者说——一切开始了。\n\n你拖着疲惫的身体——走出市政厅的大门。外面的世界——看起来和之前一模一样——但一切又都不一样了。\n\n天空中——出现了第二个月亮。银色的——比月亮更大——更近——那是妖怪世界的月亮。\n\n街道上——人们抬头看着天空——有些人惊恐——有些人流泪——但更多的人——露出了——恍然大悟的表情。像是刚从一场漫长的梦中醒来。\n\n你看到了小翠——她站在便利店门口——她没有再维持人类的外形——她变成了透明的、发着淡蓝色光芒的史莱姆形态——在晨曦中闪闪发光。她看到你——用触手向你挥了挥手。\n\n狐铃站在神社的石阶上——她的九条尾巴——全部恢复了——在空中如金色火焰般飘动。\n\n夜魅从酒吧里走了出来——她摘下了那副伪装人类的眼镜——她的角——现在完全伸展了——在晨光中闪着神秘的光泽。\n\n这座城市——醒了。而你是——那个叫醒它的人。',
  choices: [
    { id: 'awakening_end', text: '走向新的一天——迎接未知的未来', effects: { awareness: 10, setFlag: { completed_truth_route: true } }, resultText: '你深吸了一口气——空气的味道不一样了——更清新——更复杂——混杂着花香、大海的气息——以及——某种你无法命名的——来自另一个世界的芬芳。你迈出脚步——走向这个——终于真实了的世界。', nextNodeId: 'true_ending' },
    { id: 'awakening_help', text: '去帮助那些还在困惑中的人', effects: { awareness: 8, setFlag: { helped_awakening_citizens: true } }, resultText: '你走向人群——那些在街头茫然无措的人们。他们看到你——像是看到了一个锚点——一个知道发生了什么的人。你开始解释——不是全部真相——而是他们所能接受的开始。这是一个漫长的过程——但你知道——你不会再独自面对了。', nextNodeId: 'true_ending' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：TSF线节点（20个） — 5种族每条4节点链
// ═══════════════════════════════════════════════════════════════════════════

const tsf_basement_discover = {
  id: 'tsf_basement_discover', scene: 'back_alley', dayMin: 4, dayMax: 5,
  title: '地下室发现',
  narrative: '你按照狐铃的指引来到了小巷深处的酒吧——夜魅在等你。\n\n她没有多问——直接带你走进了酒吧地下更深的一层。这里不是一个普通的房间——墙壁上嵌满了发光的试管——其中装着各种颜色的液体——和你在医院地下实验室看到的TSF血清一模一样。\n\n"这些东西——是理事会最大的秘密。"夜魅的声音在石室中回荡。"TSF——Trans-Species Fluid——跨物种转化液。它能改写人类的基因组——让你变成任何一种——存在于这座城市里的——非人种族。"\n\n她走到一排试管前——指尖滑过那些发光的瓶身——"史莱姆、狐妖、吸血鬼、魅魔、猫又——甚至龙。每一种血清——对应一种转化。"\n\n她回头看着你——目光在昏暗的灯光下闪烁——"你选择变为什么？"',
  choices: [
    { id: 'tsf_choose_slime', text: '选择史莱姆血清——拥抱流动的形态', effects: { erosion: 5, setFlag: { chose_slime_serum: true, player_species: 'slime' } }, resultText: '你拿起了那管翠绿色的血清。夜魅点了点头——"明智的选择。史莱姆是最容易适应的——你的身体会变得柔软而可变——几乎不可能被伤害。"', nextNodeId: 'tsf_slime_chain_1' },
    { id: 'tsf_choose_kitsune', text: '选择狐妖血清——追求智慧与灵性', effects: { erosion: 5, setFlag: { chose_kitsune_serum: true, player_species: 'kitsune' } }, resultText: '你选择了那管金色的血清。夜魅的眼中闪过一丝赞许——"狐妖——是这座城市里最古老的妖怪之一。你选择了智慧之路。"', nextNodeId: 'tsf_kitsune_chain_1' },
    { id: 'tsf_choose_vampire', text: '选择吸血鬼血清——渴望力量与永恒', effects: { erosion: 6, setFlag: { chose_vampire_serum: true, player_species: 'vampire' } }, resultText: '你拿起了那管深红色的血清。夜魅的表情变得严肃——"吸血鬼——力量强大——但代价也最大。你将不再能看到阳光——你将永远渴望血液。你确定吗？"', nextNodeId: 'tsf_vampire_chain_1' },
    { id: 'tsf_choose_succubus', text: '选择魅魔血清——沉浸在欲望之中', effects: { erosion: 7, setFlag: { chose_succubus_serum: true, player_species: 'succubus' } }, resultText: '你选择了那管紫色的血清。夜魅笑了——那是一种复杂的笑容——"魅魔。你选择了和我一样的路。这条路——充满了诱惑——也充满了孤独。"', nextNodeId: 'tsf_succubus_chain_1' },
  ]
};

const tsf_serum_choice = {
  id: 'tsf_serum_choice', scene: 'back_alley', dayMin: 4, dayMax: 5,
  title: '血清的选择',
  narrative: '在你做出选择之前——夜魅拦住了你。"等一下。在注射之前——你必须知道一件事。"\n\n她的表情变得严肃。"这些血清——不是理事会的产物。它们是——这个城市本身——在回应人类对‘另一个自我’的渴望时——自然形成的。理事会只是发现了它们——然后加以利用。"\n\n她拿起一支银色的血清——"这一支——是猫又血清。它比其他血清更温和——但效果也更加……调皮。"\n\n她放下银色的——拿起了另一支——闪着金色光泽的——"龙血血清——最强的——但也最危险。它能让你拥有龙的力量——但也会让你——像龙映一样——被自己的力量囚禁。"\n\n桌上还放着最后一支——透明的——几乎是水一样的液体——"这个——是特殊的。它不是转化血清——而是‘逆转血清’。如果你后悔了——它可以让你恢复原状。"',
  choices: [
    { id: 'tsf_serum_slime', text: '还是要史莱姆血清', effects: { setFlag: { chose_slime_serum: true, player_species: 'slime' } }, resultText: '"好。"夜魅把翠绿色的试管递给你。', nextNodeId: 'tsf_slime_chain_1' },
    { id: 'tsf_serum_kitsune', text: '还是要狐妖血清', effects: { setFlag: { chose_kitsune_serum: true, player_species: 'kitsune' } }, resultText: '"好。"夜魅把金色的试管递给你。', nextNodeId: 'tsf_kitsune_chain_1' },
    { id: 'tsf_serum_vampire', text: '还是要吸血鬼血清', effects: { setFlag: { chose_vampire_serum: true, player_species: 'vampire' } }, resultText: '"好。"夜魅把深红色的试管递给你。', nextNodeId: 'tsf_vampire_chain_1' },
    { id: 'tsf_serum_nekomata', text: '选择猫又血清——想要更温和的转化', effects: { erosion: 3, setFlag: { chose_nekomata_serum: true, player_species: 'nekomata' } }, resultText: '"猫又——不错的选择。"夜魅把银色的试管递给你——"你会保留大部分人类的特征——只是多了一对耳朵和尾巴——以及——猫的直觉。"', nextNodeId: 'tsf_nekomata_chain_1' },
  ]
};

const tsf_slime_chain_1 = {
  id: 'tsf_slime_chain_1', scene: 'convenience_store', dayMin: 4, dayMax: 5,
  title: '史莱姆转化·第一步',
  narrative: '你注射了史莱姆血清。效果几乎是瞬间的——你的皮肤开始变得柔软——像是融化了一样——但你并没有感到疼痛——而是一种奇异的——解放感。\n\n小翠在一边看着——她满脸担忧——但更多的是好奇。"你……你真的变成史莱姆了？"她小心翼翼地碰了碰你的手——你的手指在她的触碰下延伸出了一根细长的触手——然后缩了回去。\n\n"史莱姆的初期症状——身体会变得不稳定。"小翠用她自己的经验告诉你——"你需要学会控制形态——不然你会变成一滩……嗯——就是字面意义上的一滩。"\n\n她拿出了一面小镜子——你看到镜中的自己——五官正在缓慢地融化——但你可以用意念控制——你用力想象自己的脸——它——重新固定了下来——但比之前更——光滑了——像是塑料的一样。',
  conditions: { hasFlag: 'chose_slime_serum' },
  choices: [
    { id: 'tsf_slime_practice', text: '跟小翠学习控制史莱姆形态', effects: { awareness: 4, affinity: { npcId: 'cui_slime', amount: 3 }, setFlag: { slime_learned_control: true } }, resultText: '小翠耐心地教你如何维持人形——"想象你的体内有一个骨架——你用黏液填满它——稳住——不要急。"经过一个小时的练习——你终于可以稳稳地保持人类的外形了——但如果你走神——你的手就会融化。', nextNodeId: 'tsf_slime_chain_2' },
    { id: 'tsf_slime_explore', text: '先以原始形态探索一下世界', effects: { erosion: 5, awareness: 3, setFlag: { slime_explored_raw: true } }, resultText: '你放任自己变成了一滩——从门缝下流了出去。世界在你眼中变得完全不同——你能感知到空气的流动——地面的振动——以及——这座城市地下——无数条管道中流动的其他史莱姆——你们在共享一个微弱的集体意识。', nextNodeId: 'tsf_slime_chain_2' },
  ]
};

const tsf_slime_chain_2 = {
  id: 'tsf_slime_chain_2', scene: 'convenience_store', dayMin: 5, dayMax: 6,
  title: '史莱姆转化·第二步',
  narrative: '你逐渐适应了作为史莱姆的存在。你发现了一些有趣的事情——你可以通过接触读取物体的记忆。一块石头拥有大地亿万年的记忆——一枚硬币知道它在多少人的手中流转过。\n\n小翠的地下室——那面脉动的膜——现在你理解了它是什么。它是由成千上万的史莱姆融合而成的——一个巨大的集体意识库——储存着所有被常识覆盖抹去的人的原始记忆。\n\n"那些消失的人——他们没有死——"小翠的声音很轻——"他们的记忆——他们的灵魂——被吸收进了这面膜里。如果你愿意——你可以进入它——和他们交流。"',
  conditions: { hasFlag: 'chose_slime_serum' },
  choices: [
    { id: 'tsf_slime_enter_membrane', text: '进入集体意识——与消失者交流', effects: { awareness: 8, erosion: 5, setFlag: { slime_entered_hivemind: true } }, resultText: '你将身体融入了那面巨大的膜中——无数人的记忆涌入你的意识——你听到了他们的声音——"告诉我的家人我还活着"——"不要让他们忘记我"——"真相——不要让真相消失"。你从膜中退出时——眼泪——或者说——类似眼泪的液体——从你的脸颊滑落。', nextNodeId: 'tsf_slime_chain_3' },
    { id: 'tsf_slime_guard', text: '守在膜前——保护这个记忆库', effects: { awareness: 4, setFlag: { slime_guarded_membrane: true } }, resultText: '你决定守护这个记忆库。你将自己的部分身体融入了膜的边缘——成为了它的一部分——这样你就能感知到任何试图接近它的人。你是最后一个守卫者——但你知道——你不是孤单的。', nextNodeId: 'tsf_slime_chain_3' },
  ]
};

const tsf_slime_chain_3 = {
  id: 'tsf_slime_chain_3', scene: 'convenience_store', dayMin: 6, dayMax: 7,
  title: '史莱姆转化·第三步',
  narrative: '作为史莱姆——你已经掌握了全部能力。你可以将自己的身体扩展到极限——覆盖一间房间——或者压缩成一个弹珠大小。你可以穿过任何缝隙——通过下水道进入城市的任何角落。\n\n但你面临一个选择：史莱姆的最终形态——是由你决定的。你可以选择成为一个独立的个体——保持你作为人类的个性——或者——融入集体的海洋——成为史莱姆集体意识的一部分——和其他史莱姆共享一个更大的——"自我"。',
  conditions: { hasFlag: 'chose_slime_serum' },
  choices: [
    { id: 'tsf_slime_individual', text: '保持独立——作为个体的史莱姆', effects: { awareness: 5, setFlag: { slime_kept_individuality: true } }, resultText: '你选择了——做自己。你的身体凝固成了稳定的人类形态——比以前更完美——更光滑——但你保留了你的记忆——你的个性——以及——你的自由意志。你是一个独立的史莱姆——不是一个细胞。', nextNodeId: 'tsf_slime_ending' },
    { id: 'tsf_slime_merge', text: '融入集体——成为更大的存在', effects: { erosion: 8, awareness: 10, setFlag: { slime_merged_with_hive: true } }, resultText: '你融入了那面膜中——不是消失——而是扩展。你的意识和其他史莱姆的意识融合在了一起——你成为了一个更大的存在——一个由无数记忆构成的集体意识。你——现在知道了这座城市的一切——每一个被遗忘的名字——每一段被改写的历史——都在你的体内流动。你是——活着的历史。', nextNodeId: 'tsf_slime_ending' },
  ]
};

const tsf_slime_ending = {
  id: 'tsf_slime_ending', scene: 'town_center', dayMin: 7, dayMax: 7,
  title: '史莱姆的结局',
  narrative: '作为史莱姆——你找到了一种全新的存在方式。无论你选择了独立还是融合——你——都已经不再是原来的你了。\n\n这座城市在你眼中——不再是钢筋混凝土的森林——而是一个巨大的、流动的——生命体。每一根管道都是血管——每一盏路灯都是眼睛——而你——是它的一部分——或者——是它的见证者。\n\n小翠站在你身边——她也以史莱姆的形态——两团透明的、发着微光的存在——在黎明中并肩。\n\n"感觉怎么样？"她的声音直接在你的意识中响起。\n\n你感受着自己流动的身体——感受着这座城市在你体内脉动的节奏——感受着那些被遗忘的记忆——在你体内低语。\n\n"感觉……自由。"你回答。',
  conditions: { hasFlag: 'chose_slime_serum' },
  choices: [
    { id: 'tsf_slime_end_main', text: '以史莱姆形态继续生活在城市里', effects: { setFlag: { slime_ending_complete: true } }, resultText: '你走出了便利店——融入了清晨的光线中。没有人注意到你——你——可以是任何人——可以是任何形状。你是这座城市里最新——也最古老的居民之一。', nextNodeId: '' },
  ]
};

const tsf_kitsune_chain_1 = {
  id: 'tsf_kitsune_chain_1', scene: 'shrine_grounds', dayMin: 4, dayMax: 5,
  title: '狐妖转化·第一步',
  narrative: '你注射了狐妖血清。反应来得比预想中更温和——你的身体先是感到一阵温暖——然后——你的耳朵开始移动——你的头顶长出了一对毛茸茸的金色狐耳。\n\n狐铃看到你的新耳朵——她微微愣了一下——然后忍不住笑了。"你选了狐妖。我就知道你会选这条路。"\n\n她的尾巴在身后轻轻摆动——"狐妖的力量不在于身体——而在于感知。你现在能感知到人类世界中——那些属于妖怪的波动。闭上眼睛试试。"',
  conditions: { hasFlag: 'chose_kitsune_serum' },
  choices: [
    { id: 'tsf_kitsune_sense', text: '闭上眼睛感知妖力的流动', effects: { awareness: 6, setFlag: { kitsune_learned_sense: true } }, resultText: '你闭上眼睛——起初什么都感觉不到——然后——你开始看到了——不是用眼睛看——而是用感知。城市中有无数条金色的线在流动——那是妖力的脉络。每一条线都连接着一个妖怪——有些很亮——有些很弱——有些已经黯淡到几乎消失——那些是被常识覆盖几乎完全抹去的存在。', nextNodeId: 'tsf_kitsune_chain_2' },
    { id: 'tsf_kitsune_practical', text: '让狐铃教你基础的狐妖术', effects: { awareness: 4, affinity: { npcId: 'kitsune_miko', amount: 3 }, setFlag: { kitsune_learned_magic: true } }, resultText: '狐铃教你如何用妖力点燃狐火——一团金色的火焰在你的掌心跳动——不是热的——而是温暖的——像是被阳光照射的感觉。"狐火——是我们狐妖的标记——它不会烧伤人——只会烧伤谎言。"她微笑着。', nextNodeId: 'tsf_kitsune_chain_2' },
  ]
};

const tsf_kitsune_chain_2 = {
  id: 'tsf_kitsune_chain_2', scene: 'shrine_grounds', dayMin: 5, dayMax: 6,
  title: '狐妖转化·第二步',
  narrative: '你的狐妖能力在逐渐增长。你的耳朵可以听到很远的声音——你的眼睛可以在黑暗中看到妖力的流动。但你最强大——也最危险的新能力是——幻术。\n\n狐铃严肃地告诉你——"狐妖的幻术不是欺骗——是揭示。你把对方内心深处最想看到的东西——投射到现实中。但过度使用——会让你分不清幻象和现实。"\n\n你在一面古镜前练习——你看着镜中的自己——你的狐耳——你的金色眼睛——你已经——不完全是人类了。你是狐妖。',
  conditions: { hasFlag: 'chose_kitsune_serum' },
  choices: [
    { id: 'tsf_kitsune_illusion', text: '练习幻术——用善意的方式帮助他人', effects: { awareness: 5, setFlag: { kitsune_practiced_illusion: true } }, resultText: '你在神社里找了一个伤心的人——一个失去了孩子的母亲。你编织了一个幻象——让她看到了孩子的笑容——温暖而真实。她流泪了——但这次——是喜悦的泪水。你明白了——幻术不是欺骗——而是——给予。', nextNodeId: 'tsf_kitsune_chain_3' },
    { id: 'tsf_kitsune_boundary', text: '用狐妖感知探索境界的状态', effects: { awareness: 7, setFlag: { kitsune_sensed_boundary: true } }, resultText: '你把自己的感知延伸到境界线上——你看到了——那层不断被常识覆盖冲击的脆弱屏障。它正在——变形——像是被风吹拂的薄膜。在那些最薄弱的地方——你看到了——和你一样的金色狐妖——她们在用自身的力量——加固着境界线。', nextNodeId: 'tsf_kitsune_chain_3' },
  ]
};

const tsf_kitsune_chain_3 = {
  id: 'tsf_kitsune_chain_3', scene: 'shrine_grounds', dayMin: 6, dayMax: 7,
  title: '狐妖转化·第三步',
  narrative: '你的最终转化完成了。你现在的妖力已经足够强大——你的耳朵后面长出了第二对较小的耳朵——你的尾巴从一条分成了两条——然后是三条。\n\n狐铃看着你——她的眼中有着复杂的情绪——骄傲——怀念——还有一丝悲伤。"你成长得很快。快到我有些——担心。"\n\n她告诉你——狐妖的最终形态——是由你的选择决定的。如果你选择用妖力保护这座城市——你将成为一个守护者。如果你选择用妖力寻找更深层的真相——你将成为一个探索者。',
  conditions: { hasFlag: 'chose_kitsune_serum' },
  choices: [
    { id: 'tsf_kitsune_guardian', text: '选择成为狐妖守护者', effects: { awareness: 6, setFlag: { kitsune_became_guardian: true } }, resultText: '你选择将自己的力量献给这座城市的守护。狐铃笑了——她轻轻地用额头碰了碰你的额头——那是狐妖之间的——最高敬意。"欢迎加入——守护者的行列。"', nextNodeId: 'tsf_kitsune_ending' },
    { id: 'tsf_kitsune_seeker', text: '选择成为狐妖探索者', effects: { awareness: 8, setFlag: { kitsune_became_seeker: true } }, resultText: '你选择用狐妖的力量——深入境界线的裂缝——去寻找最终的真实。狐铃握了握你的手——"那就去吧。但记住——无论你在另一侧看到了什么——这里——永远有你的归处。"', nextNodeId: 'tsf_kitsune_ending' },
  ]
};

const tsf_kitsune_ending = {
  id: 'tsf_kitsune_ending', scene: 'shrine_grounds', dayMin: 7, dayMax: 7,
  title: '狐妖的结局',
  narrative: '作为狐妖——你找到了自己在两个世界之间的位置。你的三条金色尾巴在身后轻轻摆动——每一根都代表着你获得的一段智慧。\n\n你站在神社的鸟居下——夕阳把你的影子拉得很长——你的狐耳在风中微微抖动——你能听到城市中每一个妖怪的心跳——能感受到境界线上每一个裂缝的脉动。\n\n狐铃站在你身边——她的九条尾巴在暮色中如金色火焰般闪耀。"你感觉如何？"她问。\n\n你感受着体内流动的古老力量——感受着与你祖先相连的血脉——感受着作为守护者/探索者的使命。\n\n"我感觉——我终于——属于这里了。"你回答。',
  conditions: { hasFlag: 'chose_kitsune_serum' },
  choices: [
    { id: 'tsf_kitsune_end_main', text: '以狐妖形态守护这座城市', effects: { setFlag: { kitsune_ending_complete: true } }, resultText: '你和狐铃并肩站在神社的石阶上——两只狐妖——守护着人类和妖怪之间的那条细细的——但永远存在的——境界线。', nextNodeId: '' },
  ]
};

const tsf_vampire_chain_1 = {
  id: 'tsf_vampire_chain_1', scene: 'city_hospital', dayMin: 4, dayMax: 5,
  title: '吸血鬼转化·第一步',
  narrative: '吸血鬼血清的效果迅速而剧烈。你感到一阵冰冷的灼热从注射点扩散到全身——你的心跳——慢了下来。越来越慢。——然后——停了。\n\n你惊慌地摸着自己的胸口——没有心跳——但你——还活着。你还在呼吸——但你的呼吸不再需要氧气——你的血液——不再流动——而是——在你的血管中——缓慢地脉动——像是一种全新的循环系统。\n\n血月站在你面前——她递给你一面镜子。你看到自己的脸——你的皮肤变得苍白——你的瞳孔变成了暗红色——你的犬齿——变得更长——更尖。\n\n"欢迎加入血族。"她的声音带着一种仪式性的庄重。',
  conditions: { hasFlag: 'chose_vampire_serum' },
  choices: [
    { id: 'tsf_vampire_accept', text: '接受吸血鬼的身份', effects: { awareness: 5, setFlag: { vampire_accepted_form: true } }, resultText: '你看着镜中的自己——苍白的皮肤——红色的眼睛——尖锐的犬齿——你不再是人类了。但你感到的不是恐惧——而是一种——平静。像是你终于——成为了——真正的自己。', nextNodeId: 'tsf_vampire_chain_2' },
    { id: 'tsf_vampire_panic', text: '惊慌失措——拒绝接受', effects: { erosion: 6, setFlag: { vampire_panicked: true } }, resultText: '"不——这不对——我——"你后退了几步。血月没有靠近——她只是平静地看着你。"恐慌是正常的。每个新血族都会经历这个阶段。但你的身体——已经变了。你要么学会控制——要么——被本能吞噬。"', nextNodeId: 'tsf_vampire_chain_2' },
  ]
};

const tsf_vampire_chain_2 = {
  id: 'tsf_vampire_chain_2', scene: 'city_hospital', dayMin: 5, dayMax: 6,
  title: '吸血鬼转化·第二步',
  narrative: '作为新生的吸血鬼——你需要面对最强烈的——本能。对血的渴望。\n\n血月带你来到医院的血液科——她打开了储血冰箱——里面整齐地排列着一袋袋血浆。"这个是给你的——不是人血——是动物血配制的替代品。味道不如人血——但可以维持你的生命。"\n\n你接过血浆——透过塑料袋——你看到暗红色的液体在你面前——你的喉咙开始发紧——你的犬齿自动伸长了——你的身体——在渴望。\n\n你撕开包装——喝下了第一口——温热的——略带铁锈味的——但你从未尝过如此——鲜活的味道。',
  conditions: { hasFlag: 'chose_vampire_serum' },
  choices: [
    { id: 'tsf_vampire_control', text: '学会控制血之渴望', effects: { awareness: 5, setFlag: { vampire_learned_control: true } }, resultText: '你强迫自己喝动物血——虽然你的身体渴望更多——但你的意志战胜了本能。血月拍了拍你的肩——"你很坚强。大部分新血族——都会在第一次渴望中失控。"', nextNodeId: 'tsf_vampire_chain_3' },
    { id: 'tsf_vampire_hunt', text: '跟随本能——寻找真正的血液', effects: { erosion: 8, awareness: 3, setFlag: { vampire_hunted_humans: true } }, resultText: '你无法抵抗本能的召唤。夜更深时——你溜出了医院——你的吸血鬼感官引导你找到了一个独行的人。你咬了他——但你控制住了——只取了一点点——然后就逃走了。你靠在墙上喘气——嘴角还残留着血迹——你感到——前所未有的——罪恶感。', nextNodeId: 'tsf_vampire_chain_3' },
  ]
};

const tsf_vampire_chain_3 = {
  id: 'tsf_vampire_chain_3', scene: 'city_hospital', dayMin: 6, dayMax: 7,
  title: '吸血鬼转化·第三步',
  narrative: '你已经掌握了吸血鬼的能力。你可以在夜间高速移动——你的力量是人类的数倍——你的感官可以覆盖整栋医院的范围。\n\n但血月告诉你——吸血鬼的最终能力——是"血之记忆"。通过饮用一个人的血液——你可以读取他的全部记忆——甚至可以——短暂地——接管他的身体。\n\n"这是一个强大的能力——也是一个危险的诅咒。"血月的声音在空旷的病房中回荡——"你可以用它来——从理事会的成员那里——获取机密。但你每一次使用——都会让你离人性——更远一步。"',
  conditions: { hasFlag: 'chose_vampire_serum' },
  choices: [
    { id: 'tsf_vampire_use_power', text: '对理事会成员使用血之记忆', effects: { awareness: 8, erosion: 6, setFlag: { vampire_used_blood_memory: true } }, resultText: '你找到了一个理事会的低级官员——在深夜——你袭击了他——只是让他昏厥——然后饮用了他的血。他的记忆涌入了你的脑海——医院的秘密——S7站台的用途——认知固化仪的位置——还有——龙映的真实计划——比你想象的——更加深远。', nextNodeId: 'tsf_vampire_ending' },
    { id: 'tsf_vampire_refrain', text: '拒绝使用——保持人性的底线', effects: { awareness: 5, erosion: -3, setFlag: { vampire_refrained_from_blood: true } }, resultText: '你选择了克制。血月看着你——她的眼中有着复杂的表情——骄傲——以及——某种深沉的悲伤。"你比我强。三百年前——我没有你的自制力。"她转头看向窗外——"也许——你会走出一条——和我不同的路。"', nextNodeId: 'tsf_vampire_ending' },
  ]
};

const tsf_vampire_ending = {
  id: 'tsf_vampire_ending', scene: 'city_hospital', dayMin: 7, dayMax: 7,
  title: '吸血鬼的结局',
  narrative: '作为吸血鬼——你站在了血族和人类之间的边界上。你的心跳停止了——但你的心——并没有消失。\n\n血月站在医院的屋顶上——和你一起看着城市在夜色中苏醒。那些灯光——在她眼中——是流动的血液的颜色。\n\n"当了一百年的吸血鬼之后——你会习惯的。"她的声音在夜风中显得有些遥远。"但你会永远记得——你作为人类的最后一个黄昏——那天的阳光的温度——那天的风的味道。"\n\n你看着自己的手——苍白——修长——不再属于人类的形态。但它——仍然是你的手。你选择用它做什么——是你自己的事。\n\n你和血月并肩坐在屋顶边缘——两个吸血鬼——注视着这座——正在从常识覆盖中苏醒的城市。',
  conditions: { hasFlag: 'chose_vampire_serum' },
  choices: [
    { id: 'tsf_vampire_end_main', text: '以吸血鬼形态在夜晚守护城市', effects: { setFlag: { vampire_ending_complete: true } }, resultText: '你从屋顶跃起——消失在夜色中。你成了这座城市的夜间守护者——一个在阴影中行走的——血族。', nextNodeId: '' },
  ]
};

const tsf_succubus_chain_1 = {
  id: 'tsf_succubus_chain_1', scene: 'back_alley', dayMin: 4, dayMax: 5,
  title: '魅魔转化·第一步',
  narrative: '魅魔血清的效果是最微妙的——也是最深刻的。你感到的不是身体的变化——而是感知的转变。\n\n突然间——你能够感受到周围每一个人的情绪——像是一条条彩色的河流——从他们身上流向你。街上的行人——他们的欲望、恐惧、希望——像是无形的触角——在你的意识周围舞动。\n\n夜魅看着你脸上的表情变化——她知道你正在经历什么。"很震撼——对吧？第一次感知到所有人心里的——那个世界。"\n\n她给你倒了一杯酒——酒液是深紫色的——在她的指尖下发出微弱的磷光。"魅魔的力量——不是你想的那种——低俗的诱惑。我们是欲望的管理者——不是奴隶。我们帮助人们——理清自己真正想要的东西。"',
  conditions: { hasFlag: 'chose_succubus_serum' },
  choices: [
    { id: 'tsf_succubus_learn', text: '跟夜魅学习管理欲望的能力', effects: { awareness: 5, affinity: { npcId: 'succubus_bartender', amount: 3 }, setFlag: { succubus_learned_control: true } }, resultText: '夜魅教你如何过滤那些情感的噪音——"想象你的意识周围有一层薄膜——你选择让什么进来——让什么出去。"你练习了一整晚——当清晨来临时——你已经可以在这个充满情感波动的世界中——保持内心的平静了。', nextNodeId: 'tsf_succubus_chain_2' },
    { id: 'tsf_succubus_explore', text: '沉浸在新的感知中——探索这座城市的情感地图', effects: { erosion: 5, awareness: 5, setFlag: { succubus_explored_emotions: true } }, resultText: '你走出酒吧——用你的新感官探索城市。你感受到了——便利店小翠的担忧——神社狐铃的坚定——医院血月的悲伤——市政厅龙映的——沉重。这座城市——表面上是平静的——但情感的地下河流——汹涌而复杂。', nextNodeId: 'tsf_succubus_chain_2' },
  ]
};

const tsf_succubus_chain_2 = {
  id: 'tsf_succubus_chain_2', scene: 'back_alley', dayMin: 5, dayMax: 6,
  title: '魅魔转化·第二步',
  narrative: '你的魅魔能力进一步觉醒了。你现在可以不只是感知情绪——你可以——影响它们。\n\n夜魅用一个简单的实验来示范——她让酒吧里一个烦恼的男人——在五分钟内——从愁眉苦脸变成了开怀大笑。没有人注意到她做了什么——连那个男人自己都不知道自己为什么突然开心了起来。\n\n"魅魔的诱惑——不是强迫——而是引导。"夜魅抽着一根细长的香烟——烟雾在昏黄的灯光下形成了奇异的形状——"你轻轻地——把一个人内心的某种情绪——放大一点点。快乐——希望——信任——或者——恐惧——怀疑。"\n\n她看着你——"你会选择——放大什么样的情绪？"',
  conditions: { hasFlag: 'chose_succubus_serum' },
  choices: [
    { id: 'tsf_succubus_kind', text: '放大人们心中的希望和善意', effects: { awareness: 5, setFlag: { succubus_spread_hope: true } }, resultText: '你在商店街走了一圈——悄悄地——在每一个经过你的人心中——种下了一颗希望的种子。你看到有人突然抬头看了看天空——露出了微笑——有人停下脚步——帮陌生人捡起了掉落的物品。你没有控制他们——你只是——给了他们一个——变得更好的机会。', nextNodeId: 'tsf_succubus_chain_3' },
    { id: 'tsf_succubus_control', text: '对理事会成员植入恐惧——削弱他们的意志', effects: { erosion: 6, awareness: 4, setFlag: { succubus_used_fear: true } }, resultText: '你找到了一个理事会的巡逻队员——你从他的恐惧入手——轻轻一推——他心中的不安变成了彻底的恐慌。他丢下了枪——逃走了。但你感到——这种力量——很容易上瘾。你必须在——还能控制的时候——停下。', nextNodeId: 'tsf_succubus_chain_3' },
  ]
};

const tsf_succubus_chain_3 = {
  id: 'tsf_succubus_chain_3', scene: 'back_alley', dayMin: 6, dayMax: 7,
  title: '魅魔转化·第三步',
  narrative: '你的魅魔力量已经完全觉醒。你不再只是一个欲望的感知者——你成为了一个欲望的——编织者。\n\n但夜魅警告你——"魅魔的最终形态——有一个陷阱。当你太习惯于读取和影响他人的情绪时——你可能会忘记——你自己的情绪是什么。你会变成一个——为他人而存在的镜子——但镜子本身——是空的。"\n\n她把手放在你的肩上——这是她第一次——表现出真诚的关心——"所以——在成为最好的魅魔之前——先搞清楚——你自己想要什么。"',
  conditions: { hasFlag: 'chose_succubus_serum' },
  choices: [
    { id: 'tsf_succubus_self', text: '花时间审视自己的内心——找到真实的欲望', effects: { awareness: 7, setFlag: { succubus_found_self: true } }, resultText: '你关闭了感知——静坐在酒吧的角落里——你问自己——我真正想要的是什么？答案不是来自你的魅魔本能——而是来自你心底深处那个——还在改变之前的你——"我想要——真相——和自由。"', nextNodeId: 'tsf_succubus_ending' },
    { id: 'tsf_succubus_full', text: '完全拥抱魅魔的力量——用它来对抗理事会', effects: { erosion: 7, awareness: 5, setFlag: { succubus_embraced_power: true } }, resultText: '你决定使用魅魔的全部力量。你走入市政厅——你的存在本身就让那些理事会的成员心神不宁。你不需要威胁——你只需要——存在——他们的抵抗意志就在你的面前——土崩瓦解。', nextNodeId: 'tsf_succubus_ending' },
  ]
};

const tsf_succubus_ending = {
  id: 'tsf_succubus_ending', scene: 'back_alley', dayMin: 7, dayMax: 7,
  title: '魅魔的结局',
  narrative: '作为魅魔——你成为了这座城市情感的——守护者和平衡者。\n\n夜魅的酒吧——现在成了你的第二个家。你和夜魅并肩站在吧台后面——两只魅魔——用她们的方式——守护着这座城市的情感健康。\n\n有人在哭泣——你轻轻拂过她的心灵——悲伤需要被释放——你给了她安全哭泣的空间。有人在愤怒——你帮助他把怒火转化为行动的勇气。有人在爱——你让他的爱——变得更加真实——不被欲望蒙蔽。\n\n这是一份不为人知的工作——没有人感谢你——没有人知道你做了什么。但你知道——这座城市——因为你的存在——情绪更加平稳——人心更加温暖。\n\n夜魅碰了碰你的酒杯——"欢迎——成为这座城市的——看不见的守护者。"',
  conditions: { hasFlag: 'chose_succubus_serum' },
  choices: [
    { id: 'tsf_succubus_end_main', text: '以魅魔形态继续守护这座城市', effects: { setFlag: { succubus_ending_complete: true } }, resultText: '你放下了酒杯——走出酒吧——融入了夜色中的人群。每一个你经过的人——都感到了一阵温暖——但他们不知道——那是你的祝福。', nextNodeId: '' },
  ]
};

const tsf_nekomata_chain_1 = {
  id: 'tsf_nekomata_chain_1', scene: 'back_alley', dayMin: 4, dayMax: 5,
  title: '猫又转化·第一步',
  narrative: '猫又血清的效果是最温和的——也是最令人愉悦的。你在注射后感到一阵困意——然后在半梦半醒中——你的身体开始变化。\n\n当你醒来时——头顶多了一对黑色的猫耳——你的尾骨处——多了一条长长的、末端分叉的猫尾。\n\n你试着动了动耳朵——它们真的可以独立转动。你试着摇了摇尾巴——它可以表达你的情绪——在你意识到自己在想什么之前——尾巴就先做出反应了。\n\n夜魅看着你——忍不住笑了——"你变成了一只猫。不是——是猫又。这座城市里最自由——也最狡猾的妖怪。"',
  conditions: { hasFlag: 'chose_nekomata_serum' },
  choices: [
    { id: 'tsf_neko_explore_night', text: '以猫又形态探索夜晚的城市', effects: { awareness: 5, setFlag: { neko_explored_night_city: true } }, resultText: '你跑上了屋顶——你的新身体轻盈而敏捷——一步可以跨越几米的距离。从高处俯瞰——夜晚的城市在你眼中完全不同了——你能看到热量的痕迹——听到几公里外的声音——感知到——那些藏身于黑暗中的——其他妖怪。', nextNodeId: 'tsf_nekomata_chain_2' },
    { id: 'tsf_neko_learn', text: '先熟悉猫又的能力——不急着出门', effects: { awareness: 3, setFlag: { neko_learned_basics: true } }, resultText: '你花了一些时间来适应你的新身体——学会了如何控制耳朵和尾巴——如何用猫的感官来感知世界——以及——如何——发出呼噜声？你发现自己在夜魅摸你的头时——不自觉地发出了呼噜声——你脸红了——不——你脸红了——但猫又形态下——你的耳朵会发烫。', nextNodeId: 'tsf_nekomata_chain_2' },
  ]
};

const tsf_nekomata_chain_2 = {
  id: 'tsf_nekomata_chain_2', scene: 'town_center', dayMin: 5, dayMax: 6,
  title: '猫又转化·第二步',
  narrative: '作为猫又——你发现了一些独特的能力。你可以和城市里的所有猫——和猫又——进行心灵交流。整个城市的猫科动物——都是你的眼睛和耳朵。\n\n你通过猫的网络——得知了关于理事会的一个重要情报：他们正在准备一台名为"认知固化仪"的装置——将在纪念日那天启动。\n\n信息来自——一直蹲在便利店门口的黑猫——就是那只和你说过话的猫又。"他们把它藏在市政厅地下三层。你只有一次机会——在它启动之前——摧毁它。"黑猫甩了甩尾巴——"如果你需要帮手——我们猫群——会帮你的。"',
  conditions: { hasFlag: 'chose_nekomata_serum' },
  choices: [
    { id: 'tsf_neko_accept_help', text: '接受猫群的帮助', effects: { awareness: 5, setFlag: { neko_accepted_cat_help: true } }, resultText: '"喵——明智的选择。"黑猫点了点头——它身后——黑暗中——亮起了一双双绿色的眼睛。几十只猫——都在看着你——等待你的命令。你——成了猫群的首领。', nextNodeId: '' },
    { id: 'tsf_neko_solo', text: '独自行动——不想连累它们', effects: { awareness: 3, setFlag: { neko_declined_help: true } }, resultText: '"喵——固执的人类——变成了猫还是这么固执。"黑猫叹了口气——"好吧——但如果你需要帮助——在屋顶上叫一声——我们会来的。"', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：日常线节点（12个） — 4NPC各3节点链
// ═══════════════════════════════════════════════════════════════════════════

const daily_flower_help = {
  id: 'daily_flower_help', scene: 'town_center', dayMin: 4, dayMax: 5,
  title: '花店的请求',
  narrative: '你在商店街上走着——花店门口的那个女巫——上次给你药水的那个女人——向你招了招手。\n\n"你来啦。我正好需要帮手。"她递给你一篮奇异的种子——种子的颜色在阳光下变幻——从银色到紫色——"这些是梦境花的种子。帮我种在城市的四个角落——神社东侧、学校后院、医院花坛、和小巷的喷泉旁。"\n\n她眨了眨眼——"种下它们——你就会看到——这座城市的——另一个面貌。"',
  choices: [
    { id: 'daily_flower_accept', text: '接受请求——帮她种花', effects: { awareness: 3, setFlag: { helped_plant_flowers: true } }, resultText: '你花了半天时间——把种子种在了她指定的四个位置。当你把最后一颗种子埋入小巷喷泉旁的泥土中时——地面轻轻震动了一下——你看到——从四棵种子生长的方向——有微弱的金色光线——在空中连接成了一个四边形。', nextNodeId: 'daily_hana_friendly' },
    { id: 'daily_flower_decline', text: '婉拒——自己还有事', effects: { setFlag: { declined_flower_request: true } }, resultText: '女巫没有勉强——她耸了耸肩——"好吧——这些种子——会等一个愿意种下它们的人。"她把花篮收回了柜台下面——但你注意到——有一粒种子——自己滚到了地上——跟在了你的脚后。', nextNodeId: 'daily_hana_friendly' },
  ]
};

const daily_hana_friendly = {
  id: 'daily_hana_friendly', scene: 'town_center', dayMin: 4, dayMax: 5,
  title: '花店的友谊',
  narrative: '花店的女巫告诉你——她叫"花音"。她是这座城市里为数不多的——既不属于理事会——也不属于任何妖怪派系的——中立者。\n\n"我做花——是因为花——是真实的东西。"她一边修剪花枝——一边轻声说——"不管你给它们施加什么常识覆盖——花——只会按照自己的方式生长。它们——拒绝被欺骗。"\n\n她剪下一朵深蓝色的玫瑰递给你——"这朵玫瑰——是在被常识覆盖最严重的区域——市政厅的花坛里采的。它本该开红色的花——但它开了蓝色。它在——反抗。"\n\n你接过玫瑰——它的花瓣上——有细小的银色纹路——像是——某种在地面下流动的力量的痕迹。',
  choices: [
    { id: 'daily_hana_accept', text: '收下玫瑰——作为护身符', effects: { awareness: 3, setFlag: { kept_blue_rose: true }, addItem: { id: 'blue_rose', name: 'Blue Rose', nameCN: '蓝色玫瑰', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '花音送的蓝色玫瑰。花瓣上有银色纹路——散发着淡淡的、不属于这个世界的光芒。', icon: 'item_key', flags: ['mysterious'] } }, resultText: '蓝色玫瑰在你手中微微发光——你感到一股温暖的力量从花瓣传入你的掌心。它是一种提醒——提醒你——即使在最被控制的地方——真实——依然在生长。', nextNodeId: 'daily_shrine_festival' },
    { id: 'daily_hana_decline', text: '婉拒——不能随便收下不该有的东西', effects: { setFlag: { refused_rose: true } }, resultText: '花音没有生气——她把玫瑰插回了花瓶里——"等你想要的时候——再来拿。花——不会凋谢——在这个城市里——花的时间——是静止的。"', nextNodeId: 'daily_shrine_festival' },
  ]
};

const daily_shrine_festival = {
  id: 'daily_shrine_festival', scene: 'shrine_grounds', dayMin: 5, dayMax: 6,
  title: '神社的祭典',
  narrative: '神社正在准备一场祭典——不是为了任何神——而是为了"庆祝城市的和平"。你明白——这其实是常识覆盖的一次集体强化仪式——通过集体的欢庆——让人们更加接受"正常"的表象。\n\n但狐铃告诉你——祭典也有另一面。"你知道——祭典的起源——是人类和妖怪一起庆祝丰收的活动。在常识覆盖之前——每年这个时候——妖怪和人类会一起跳舞——一起喝酒——一起忘记彼此的隔阂。"\n\n她的金色眼睛在灯笼的光芒中闪烁——"今晚——我会在祭典中——打开一个小小的境界裂缝。只有一瞬——但我希望你能——真正看到——祭典本来的样子。"',
  choices: [
    { id: 'daily_festival_join', text: '参加祭典——体验妖怪和人类的共舞', effects: { awareness: 5, setFlag: { joined_real_festival: true } }, resultText: '在狐铃打开裂缝的那一瞬间——你看到了真正的祭典。人类和妖怪手牵着手——围成巨大的圆圈——在火光中跳舞。狐妖甩着尾巴吹笛——史莱姆在灯笼里发光——吸血鬼在阴影中微笑——魅魔在人群中穿行——没有人害怕——没有人躲藏。那一刻——你知道了——什么才是——真正的和平。', nextNodeId: 'daily_kitsune_date' },
    { id: 'daily_festival_observe', text: '在遠處观察——记录祭典的真相', effects: { awareness: 3, setFlag: { observed_festival: true } }, resultText: '你站在山坡上俯瞰神社——从远处——你看到了祭典的全貌。在常人眼中——那是一个普通的夏日祭典——但在你的眼中——灯笼的光芒中——你能看到那些——非人类的輪廓——在人群中舞动。常识覆盖——正在和真实——在这一个夜晚——短暂地——共存。', nextNodeId: 'daily_kitsune_date' },
  ]
};

const daily_kitsune_date = {
  id: 'daily_kitsune_date', scene: 'shrine_grounds', dayMin: 5, dayMax: 6,
  title: '狐铃的邀约',
  narrative: '祭典结束后——狐铃找到了你。她的脸红红的——不是因为酒——而是因为某种她不愿意承认的情绪。\n\n"要不要……去后山走走？"她的狐狸尾巴在身后不安地摆动——"今晚的月亮——很漂亮。"\n\n你和她并肩走在月光下的山路上——她的金色眼睛在夜色中发着温暖的光。她很少说话——但她偶尔投来的目光——比任何言语都更加丰富。\n\n你们在神社后山的观景台上停下——整座城市在脚下铺展开来——灯火通明。狐铃轻声说——"你知道吗——在这三百年里——你是第一个让我——想带来看月亮的人。"',
  choices: [
    { id: 'daily_date_kitsune_accept', text: '握住她的手——回应她的感情', effects: { affinity: { npcId: 'kitsune_miko', amount: 10 }, setFlag: { held_kitsune_hand: true } }, resultText: '你的手指碰到了她的指尖——她轻轻一颤——但没有抽回。两只手——慢慢握在了一起。她的尾巴——不由自主地——缠上了你的手腕——松软的——温暖的——像是在说——"不要放开。"', nextNodeId: 'daily_kitsune_confession' },
    { id: 'daily_date_friendly', text: '保持朋友的距离——温和地回应', effects: { affinity: { npcId: 'kitsune_miko', amount: 5 }, setFlag: { friendly_with_kitsune_date: true } }, resultText: '你对她笑了笑——感谢她的分享。她似乎有些失望——但她很快调整了表情——"嗯——朋友也很好。"她抬头看着月亮——但你的余光捕捉到——她的尾巴——垂下去了那么一点点。', nextNodeId: 'daily_kitsune_confession' },
  ]
};

const daily_kitsune_confession = {
  id: 'daily_kitsune_confession', scene: 'shrine_grounds', dayMin: 6, dayMax: 7,
  title: '狐铃的告白',
  narrative: '月光下的狐铃——终于说出了她藏了三百年的秘密。\n\n"我见过你的很多次转世。"她的声音很轻——像是怕惊碎了什么。"每一世——我都会在人群中认出你——不是因为你的长相——而是因为你的灵魂——有一种独特的光芒。"\n\n她低头看着自己的手——"每一次——我都想上前和你说话。但每一次——常识覆盖会在你完全觉醒之前——把你重置。我——只能看着你——一次又一次地——忘记我。"\n\n她抬起头——金色的眼睛中——有泪光——"但这一次——你走到了这么远。你看到了真相——你还没有被重置。所以——这一次——我想告诉你——"她深吸一口气——"我一直在等你。等了——三百年。"',
  choices: [
    { id: 'daily_kitsune_confess_accept', text: '接受她的感情——告诉她你也是', effects: { affinity: { npcId: 'kitsune_miko', amount: 10 }, setFlag: { accepted_kitsune_confession: true } }, resultText: '你把她轻轻拥入怀中——她在你的怀里颤抖——像一个终于找到了归处的小动物。她的尾巴紧紧地绕着你——像是害怕你会突然消失一样。"这一次——"你在她耳边说——"我不会再忘记了。"', nextNodeId: 'daily_npc_ending' },
    { id: 'daily_kitsune_confess_delay', text: '现在还无法回应——但承诺不会忘记', effects: { affinity: { npcId: 'kitsune_miko', amount: 5 }, setFlag: { deferred_kitsune_confession: true } }, resultText: '她点了点头——抹去了眼角的泪光——"嗯——没关系。我等你——等了这么久——再等一段时间——也没关系。"她努力挤出了一个微笑——但她的眼中——有着坚定不移的光芒。', nextNodeId: 'daily_npc_ending' },
  ]
};

const daily_hospital_shift = {
  id: 'daily_hospital_shift', scene: 'city_hospital', dayMin: 4, dayMax: 5,
  title: '医院的轮班',
  narrative: '你在医院里帮忙做志愿者——不是因为你有什么医学知识——而是因为血月请求你帮忙照看那些——正在经历记忆调整后遗症的患者。\n\n这些患者被进行了常识覆盖——但身体还记得真相。有些人不停地流泪——不知道为什么。有些人反复在纸上画着同一个图案——是你在公寓门上看到的那个符号。\n\n你坐在一个老年患者的床边——他握着你的手——用极其清晰的声音说——"我女儿——她是一条白蛇。我很想她。但他们告诉我——我——没有女儿。"他的眼中满是困惑和痛苦。',
  choices: [
    { id: 'daily_hospital_comfort', text: '安慰他——告诉他他的记忆是真实的', effects: { awareness: 4, setFlag: { comforted_patient: true } }, resultText: '你握着他的手——轻声说——"你的女儿——是一条白蛇。她爱你——你也爱她。你没有记错。"老人的眼泪夺眶而出——他紧紧地握着你的手——"谢谢——谢谢你——你是这三百年来——第一个说真话的人。"——然后——他安详地闭上了眼睛。不是死了——是从记忆的牢笼中——解脱了。', nextNodeId: 'daily_vampire_night' },
    { id: 'daily_hospital_report', text: '记录他的症状——报告给血月', effects: { awareness: 2, setFlag: { reported_patient: true } }, resultText: '你记录了老人的情况——血月看着报告——沉默了很久。"这种情况越来越多。常识覆盖——在松动。"她抬起头——暗红色的眼睛中有光——"你的到来——正在改变这座城市。"', nextNodeId: 'daily_vampire_night' },
  ]
};

const daily_vampire_night = {
  id: 'daily_vampire_night', scene: 'city_hospital', dayMin: 5, dayMax: 6,
  title: '吸血鬼的夜晚',
  narrative: '夜班结束后——血月邀请你到医院的天台。在城市的灯火之上——她露出了难得的——放松的表情。\n\n"你知道——吸血鬼为什么选择住在医院吗？"她问。你摇头。她笑了笑——"因为医院——是生与死的交界处。我们吸血鬼——既不属于生者——也不属于死者。我们在边界上——看着两边。"\n\n她从口袋里拿出一瓶深红色的液体——不是血——是红酒。"三百年前——我是这家医院的创始人之一。那时候——它还是一个草药铺子。那时候——我来这里——是为了救我的妹妹。"\n\n她的声音在夜风中变得遥远——"我没能救她。但我——把这家医院——变成了我能做到的最好的样子。"',
  choices: [
    { id: 'daily_vampire_share', text: '分享你自己的故事——彼此的慰藉', effects: { affinity: { npcId: 'vampire_doctor', amount: 5 }, setFlag: { shared_story_with_vampire: true } }, resultText: '你告诉了她你的经历——那个陌生的房间——那面铜镜——那封来自未来的信。血月静静地听着——然后轻轻地说——"你知道吗——我和你一样。我们都在寻找——一个属于我们的地方。"', nextNodeId: 'daily_vampire_secret' },
    { id: 'daily_vampire_question', text: '追问她关于理事会的更多秘密', effects: { awareness: 4, setFlag: { asked_vampire_secrets: true } }, resultText: '血月的表情变得复杂——"理事会的秘密——就像洋葱。你剥开一层——还有一层。但我可以告诉你一件事——"她压低声音——"龙映——不是真正的领导者。真正的决策者——是一群你从未见过的人。"', nextNodeId: 'daily_vampire_secret' },
  ]
};

const daily_vampire_secret = {
  id: 'daily_vampire_secret', scene: 'city_hospital', dayMin: 6, dayMax: 7,
  title: '血月的秘密',
  narrative: '血月带你来到了医院的档案室——最深处——有一面墙——看起来和其他墙壁没有区别。但她按下了某块砖——墙壁无声地滑开了——露出一条暗道。\n\n"这是我三百年来——一直隐藏的东西。"她的声音在窄小的通道中回荡。\n\n通道尽头——是一间小小的——但令人震惊的房间。房间的四面墙上——挂满了肖像画。每一幅画上——都是同一个人。你。不同时代的你——穿着不同的衣服——站在不同的背景前——但每一幅——都是你。\n\n"每一世——我都会偷偷给你画一幅像。"血月的声音有些沙哑——"不是出于任何特殊的情感——而是为了证明——你真的存在。在常识覆盖不断抹去你的痕迹时——我用我的画笔——把你留在这个世界上。"',
  choices: [
    { id: 'daily_secret_thanks', text: '感谢她——这比任何证据都有力', effects: { affinity: { npcId: 'vampire_doctor', amount: 5 }, setFlag: { thanked_vampire_for_portraits: true } }, resultText: '你看着那些画——每一幅中的你——都有不同的眼神——但都带着同样的——倔强的光芒。"谢谢你——让我知道自己——不是第一次在这里。"血月轻轻地笑了——"不客气。毕竟——为一个灵魂画三百年的肖像——是我最不后悔的事。"', nextNodeId: 'daily_npc_ending' },
    { id: 'daily_secret_question', text: '问她和狐铃的关系——她也认识狐铃吧', effects: { awareness: 3, setFlag: { asked_vampire_about_kitsune: true } }, resultText: '血月微微一愣——然后露出了一个复杂的微笑。"她啊——是的——我们认识。很久了。我们——都在用自己的方式——守护着你的轮回。"她停顿了一下——"不过——她在那边的山上守护你——我在这边的医院守护你。我们——分工合作。"', nextNodeId: 'daily_npc_ending' },
  ]
};

const daily_convenience_night = {
  id: 'daily_convenience_night', scene: 'convenience_store', dayMin: 4, dayMax: 5,
  title: '便利店的夜班',
  narrative: '你在便利店和小翠一起值夜班。深夜的客人很少——但每一个进来的——都让你感到一种——说不出的熟悉。\n\n凌晨两点——一个穿着老式校服的女孩走了进来。她买了一个饭团和一瓶弹珠汽水——在付钱时——她看着你——突然说——"你的眼睛——比以前亮了。"然后她走了。\n\n小翠看着你——她的眼中有着担忧——"那个女孩——不是人。——她是——一个‘残留记忆’。一个在常识覆盖中被抹去的人的记忆——在这座城市的某个角落——凝结成了独立的——存在。"',
  choices: [
    { id: 'daily_convenience_chase', text: '追出去找那个女孩', effects: { awareness: 4, setFlag: { chased_memory_girl: true } }, resultText: '你冲出便利店——但街道上空无一人。只是在路灯下——有一个饭团的包装纸——被风吹着——在地上画着圈。包装纸上——用歪歪扭扭的字写着——"下次见。"', nextNodeId: 'daily_cui_friendship' },
    { id: 'daily_convenience_stay', text: '留在店里——和小翠聊聊', effects: { affinity: { npcId: 'cui_slime', amount: 3 }, setFlag: { stayed_with_xiaocui: true } }, resultText: '你没有追出去。小翠松了一口气——"谢谢你没有去。那些记忆残留——很危险——如果你跟着它们走——你可能会——在另一个时间迷路。"她握住了你的手——她的手是柔软的——温暖的——像一团温暖的水。', nextNodeId: 'daily_cui_friendship' },
  ]
};

const daily_cui_friendship = {
  id: 'daily_cui_friendship', scene: 'convenience_store', dayMin: 5, dayMax: 6,
  title: '小翠的友谊',
  narrative: '在一个安静的午后——小翠关上了便利店的门——挂上了"休息中"的牌子。这是你第一次看到她——不是作为店员——而是作为一个——普通的女孩。\n\n她带你去了一家隐藏在巷子里的小拉面馆。老板是一只河童——但他的伪装非常好——看起来就是一个普通的、秃头的中年男人——只是他的头顶——在不注意的时候——会反射出一种——不属于人类皮肤的光泽。\n\n"这家店——是妖怪们常来的地方。"小翠一边吃面——一边低声说——"在这里——没有人需要伪装。老板知道我是史莱姆——但他不在乎。"\n\n你吃了一口面——汤头浓郁——面条劲道——老板的手艺确实不错。更重要的是——在这里——你第一次感觉到了——什么是"正常"——不是被强制覆盖的正常——而是——真正的——和不同的人——和平共处——的正常。',
  choices: [
    { id: 'daily_cui_trust', text: '和小翠敞开心扉——真正信任她', effects: { affinity: { npcId: 'cui_slime', amount: 5 }, setFlag: { trusted_xiaocui: true } }, resultText: '你告诉了她你的一切——那个陌生的房间——那封信——那面铜镜——你的恐惧——你的困惑——你的决心。小翠静静地听着——然后——她隔着桌子——握住了你的手——"你不再是一个人了。你有我——有狐铃——有血月——有夜魅——还有——那些愿意看到真相的人。"', nextNodeId: 'daily_cui_warning' },
    { id: 'daily_cui_memory', text: '问她关于便利店地下室的事', effects: { awareness: 3, setFlag: { asked_cui_basement: true } }, resultText: '小翠的表情暗了一下——"地下室——那是我最不想让你知道的地方。但——如果你坚持——我可以在明天晚上——带你下去看看。"', nextNodeId: 'daily_cui_warning' },
  ]
};

const daily_cui_warning = {
  id: 'daily_cui_warning', scene: 'convenience_store', dayMin: 6, dayMax: 7,
  title: '小翠的警告',
  narrative: '小翠的表情变得严肃起来——她从口袋里拿出了一张折叠的纸——递给你。\n\n"这是我昨天晚上——在我的史莱姆形态下——从地下室的墙壁上——读到的信息。不是用文字写的——是用记忆写的。"\n\n你展开纸——上面是小翠歪歪扭扭的字迹——她记录了一段来自集体意识的警告：\n\n"觉醒者——你已经走得太远。理事会已经注意到了你。在纪念日之前——他们会在你体内植入‘最终覆盖’——让你永远忘记自己是谁。""唯一的躲避方法——是在纪念日前一天——进入镜中世界——在境界的裂缝中躲过覆盖——然后在覆盖完成后——再回来——带着覆盖前的记忆。"\n\n小翠看着你——她的眼中充满了泪水——"我知道这听起来很疯狂——但——这是唯一的办法了。"',
  choices: [
    { id: 'daily_cui_obey', text: '相信她的警告——准备进入镜中世界', effects: { awareness: 5, setFlag: { prepared_for_mirror_hide: true } }, resultText: '你决定相信小翠。她紧紧地抱住了你——她的身体柔软而温暖——像一团会呼吸的水。"一定要回来。"她闷闷地说。', nextNodeId: 'daily_npc_ending' },
    { id: 'daily_cui_doubt', text: '怀疑——这可能是一个陷阱', effects: { awareness: 2, setFlag: { doubted_cui_warning: true } }, resultText: '你无法确定这条信息的真实性。小翠低下了头——"我理解你的怀疑。但——请小心。不管你去哪里——请——小心。"', nextNodeId: 'daily_npc_ending' },
  ]
};

const daily_npc_ending = {
  id: 'daily_npc_ending', scene: 'town_center', dayMin: 7, dayMax: 7,
  title: '日常的尽头',
  narrative: '你选择了日常之路——不是逃避——而是另一种形式的面对。你选择了和这座城市里的人——那些真实的存在——建立联系——而不是去追寻宏大的真相。\n\n但你发现——在日常之中——真相其实一直都在。花店的蓝色玫瑰、神社的祭典、医院的夜班、便利店的深夜谈话——这些看似普通的事情——都是这座被覆盖的城市中——最真实的碎片。\n\n你感受到——那些你伤害过的人——其实在他们的日常中——也在等待一个能看到真相的人。你说出的一句真话——给了那个老人解脱。你握住的一只手——给了狐铃三百年来第一次温暖。你的一次信任——给了小翠继续坚持下去的勇气。\n\n也许——真相不一定要通过爆炸性的揭露来实现。也许——真相——就是在一个又一个的日常瞬间中——被传递下去的。\n\n你站在商店街的十字路口——朝着你的公寓走去。明天——又是新的一天。在这座被常识覆盖的城市里——你将继续——在日常中——守护那些——微小的真实。',
  choices: [
    { id: 'daily_end_main', text: '回到公寓——迎接明天的日常', effects: { setFlag: { completed_daily_route: true } }, resultText: '你推开公寓的门——那个陌生的房间——现在已经不那么陌生了。你躺在床上——月光透过窗帘的缝隙照进来——你在月光中——看到了——不计其数的微小光芒——像是这座城市的——真实记忆——在夜晚——偷偷地——闪烁着。', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增节点：规则警示（27）、共通线（10）、真相线（12）、TSF线（20）、日常线（11）
// 总计80个——追加于原有网络之后
// ═══════════════════════════════════════════════════════════════════════════

const ad_watch = {
  id: 'ad_watch', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '甜蜜陷阱',
  narrative: '商店街的入口处新开了一家糖果店。橱窗里陈列着五颜六色的棒棒糖和巧克力，每一颗都闪着诱人的光泽。一个穿着粉色围裙的女孩站在门口，微笑着向路过的行人递出试吃品。\n\n你走近了一些——那股甜味太过浓烈了，像是某种化学合成品。女孩的笑容也太过标准——像是一个被设定好程序的玩偶。她的眼睛——当你仔细看时——没有瞳孔——只有一片——均匀的深粉色。',
  choices: [
    { id: 'ad_watch_take', text: '接过糖果', effects: {erosion: 3, setFlag: {took_candy: true}}, resultText: '糖果在你手中化了——是渗入了你的皮肤。你感到一阵晕眩——当你恢复意识时——你已经站在糖果店的柜台后面——穿着那件粉色围裙。', nextNodeId: '' },
    { id: 'ad_watch_refuse', text: '礼貌拒绝，快步离开', effects: {awareness: 3, setFlag: {refused_candy: true}}, resultText: '你摇了摇头从糖果店前走过。那个女孩的笑容在你转身的瞬间消失了——她的表情变得空白。你心中一紧——加快了脚步。', nextNodeId: 'town_arrival' }
  ]
};

const cousin_find = {
  id: 'cousin_find', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '堂兄的发现',


  narrative: '你在旧书店里翻看古籍时——一只手突然按在了书页上。是你的堂兄——他的脸色很差——眼眶下有浓重的阴影。\n\n他压低声音说——"我找到了表姐留下的录音——她录下了自己被重置记忆的全过程。"他的手在颤抖——"理事会的成员来了——问了她一些话——然后——她在录音里——变成了另一个人。声音、语气、记忆——全部被换掉了。"',
  choices: [
    { id: 'cousin_find_ask', text: '追问录音的下落', effects: {awareness: 5, setFlag: {asked_audio_location: true}}, resultText: '堂兄的眼睛里闪过一丝恐惧——"我把录音藏在S7站台的储物柜里——编号173。"他递给你一把黄铜钥匙——"拿着它——但小心——他们知道我发现了太多。"', nextNodeId: '' },
    { id: 'cousin_find_warn', text: '警告他小心', effects: {awareness: 3, setFlag: {warned_cousin: true}}, resultText: '堂兄苦笑了一声——"太迟了。从你表姐消失的那天起——我就已经被盯上了。"他匆匆离开了——走路的姿势有些僵硬。', nextNodeId: 'town_arrival' }
  ]
};

const attic_search = {
  id: 'attic_search', scene: 'home_bedroom', dayMin: 1, dayMax: 7,
  title: '阁楼的秘密',


  narrative: '你公寓的天花板上有一道方形缝隙——通向阁楼。你从未注意过它——但今天——缝隙边缘——有一缕暗红色的光渗出来。\n\n你搬来椅子推开了活板门。阁楼里——放着一个神龛——里面不是神像——而是一枚发出暗红色光芒的水晶。水晶里——封着一只眼睛——活的——它在看你。',
  choices: [
    { id: 'attic_search_touch', text: '触碰那枚水晶', effects: {erosion: 5, awareness: 3, setFlag: {touched_attic_crystal: true}}, resultText: '你的指尖触及水晶的瞬间——那只眼睛眨了一下。一股不属于你的记忆涌入脑海——你看到公寓的过去：一个女人坐在你现在的位置上——写着和你收到的那封信一模一样的信——她抬头看天花板——说——"下一个——就是你。"', nextNodeId: '' },
    { id: 'attic_search_cover', text: '盖住水晶退出阁楼', effects: {awareness: 3, setFlag: {covered_crystal: true}}, resultText: '你用布盖住了神龛。红光被遮住了——但你仍然能感觉到那种被注视的感觉——穿透布料——注视着你。', nextNodeId: 'leave_home' }
  ]
};

const crazy_doctor = {
  id: 'crazy_doctor', scene: 'hospital', dayMin: 1, dayMax: 7,
  title: '挑剔的医生',


  narrative: '医院大厅里——一个你从未见过的医生叫住了你。他的白大褂泛着淡蓝色——名牌上写着"主治医师·雾岛"。他看到你时——眼睛亮了一下。\n\n"你来了。我等你很久了。"他的声音过于热切——"我在研究一种基因层面的新疗法——需要一位特殊的志愿者。只需要一小管血——和一次全麻体检。"他凑近了一步——你闻到了消毒水混着的甜腻花香。',
  choices: [
    { id: 'crazy_doctor_agree', text: '同意做志愿者', effects: {erosion: 5, setFlag: {agreed_volunteer: true}}, resultText: '你点了头。医生的笑容扩大到了一个不正常的弧度——他带你走向一扇标着"实验区"的门——门上有一个符号——和你公寓门上的一模一样。', nextNodeId: '' },
    { id: 'crazy_doctor_refuse', text: '婉拒找借口离开', effects: {awareness: 3, setFlag: {refused_volunteer: true}}, resultText: '"抱歉——我赶时间。"你后退一步。医生的笑容凝固了一瞬——"如果你改变主意——我随时欢迎。"你转身离开——知道他的目光一直追随着你。', nextNodeId: 'front_desk' }
  ]
};

const shy_person = {
  id: 'shy_person', scene: 'school', dayMin: 1, dayMax: 7,
  title: '安静的角落',


  narrative: '图书馆最后一排书架和墙壁的夹缝里——坐着一个瘦弱的女孩。她低着头——刘海遮住了大半张脸——指甲缝里有暗红色的痕迹。\n\n你走近时她猛地抬头——那一瞬你看到了她的眼睛——不是正常人的瞳孔——是竖直的——像某种古老的爬行动物。她迅速低下头——把脸埋进臂弯——"别看我。你不该看到我。"',
  choices: [
    { id: 'shy_person_talk', text: '温和地问她是否需要帮助', effects: {awareness: 3, setFlag: {talked_to_shy_girl: true}}, resultText: '她沉默了很久才慢慢抬头——这次瞳孔恢复了圆形——但她脸上的恐惧比你见过的任何一种都要深沉——"你真好心——但帮助我的人——最后都会被卷进来。"', nextNodeId: '' },
    { id: 'shy_person_leave', text: '保持距离离开', effects: {setFlag: {left_shy_girl_alone: true}}, resultText: '你点头退出了那个角落。女孩重新低下头——轻声说——"也对。没人愿意的。"那句话在你脑中不断回响。', nextNodeId: 'library' }
  ]
};

const wizard_meet = {
  id: 'wizard_meet', scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '巷中的巫师',


  narrative: '深夜的小巷深处——一个佝偻的身影从阴影中浮现。他穿着宽大的黑袍——手握着扭曲的木杖——兜帽下露出覆盖着细密鳞片的下巴。\n\n"迷路的小羊羔。"他的声音像是两块石头在摩擦——"你在找什么？真相？力量？还是——另一个自己？"他伸出枯瘦的手——黑色的长指甲——"我都可以给你——只要你——付得起代价。"',
  choices: [
    { id: 'wizard_meet_ask', text: '问他代价是什么', effects: {erosion: 3, awareness: 3, setFlag: {asked_wizard_price: true}}, resultText: '巫师发出低哑的笑——"代价很简单——把你在三天后午夜在神社鸟居下看到的任何东西都告诉我。"兜帽下闪过一道光——你看到他的眼睛——是两团跳动的紫色火焰。', nextNodeId: '' },
    { id: 'wizard_meet_flee', text: '赶紧跑', effects: {awareness: 3, setFlag: {fled_from_wizard: true}}, resultText: '你转身就跑——身后传来低笑声——"跑吧——但午夜你会回到这条巷子。你总是会。"他的话语像诅咒一样粘在了你的脑海里。', nextNodeId: 'alley_arrival' }
  ]
};

const dressing_change = {
  id: 'dressing_change', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '更衣室的怪异',
  narrative: '服装店的更衣室里——你正要试穿一件黑色金纹和服——但镜中映出的不是你的脸。镜中的你穿着纯白色的和服——她在笑——而你——没有在笑。她的指尖穿过了镜面——碰到了你的肩膀——冰冷——刺骨。',
  choices: [
    { id: 'dressing_change_touch', text: '触摸镜中的手', effects: {erosion: 4, awareness: 3, setFlag: {touched_mirror_hand_dressing: true}}, resultText: '你的手指碰到了镜中的指尖——瞬间你看到了三百年前的景象——没有楼房只有森林和神社——天空中飞着龙——妖怪和人类在月光下共舞。然后景象消失了——镜中的你穿着白和服在对你轻轻鞠躬。', nextNodeId: '' },
    { id: 'dressing_change_leave', text: '放下衣服离开', effects: {awareness: 2, setFlag: {left_dressing_room: true}}, resultText: '你放下和服退出更衣室。店员没有说任何话——但你听到身后传来镜中的声音——"下次——我会等你准备好。"', nextNodeId: 'town_arrival' }
  ]
};

const loiter_danger = {
  id: 'loiter_danger', scene: 'town_center', dayMin: 1, dayMax: 7,
  title: '闲逛的风险',


  narrative: '你在商店街上漫无目的地走着——但你的直觉在提醒你——有什么不对。街上人的行走路线是有规律的——像是被看不见的轨道引导着。\n\n你停下脚步——在你旁边——三个人也同时停了下来——保持着和你相同的距离——形成一个等边三角形——将你围在中间。他们在按照你的节奏行动。',
  choices: [
    { id: 'loiter_danger_act', text: '突然改变方向测试', effects: {awareness: 4, setFlag: {tested_followers: true}}, resultText: '你向左转——三人同时左转。你急停——三人同时急停。你后背发凉——他们不是人——是被你吸引的认知回响——你的行动决定了他们的行为。你是他们的指挥。', nextNodeId: '' },
    { id: 'loiter_danger_leave', text: '尽快离开这条街', effects: {awareness: 3, setFlag: {left_loiter_area: true}}, resultText: '你冲进超市的人流——回头——他们站在门口没有跟进来——像是在等待你再次回到街上。', nextNodeId: 'town_arrival' }
  ]
};

const road_trip = {
  id: 'road_trip', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '公路旅行',


  narrative: '电线杆上贴着一张褪色海报——"勇气之旅——七天环城公路旅行——免费——仅限本周。"路线图上标注着"遗忘站""回声谷""镜湖""终点·新世界"。\n\n你的手指碰到海报——纸张在指尖下微微颤动——像活的皮肤。报名地址是一家挂着"旅行者驿站"招牌的小店——窗户紧闭——门半开着——门缝里透出不属于这个季节的冰冷气息。',
  choices: [
    { id: 'road_trip_enter', text: '走进驿站报名', effects: {erosion: 4, setFlag: {entered_travel_inn: true}}, resultText: '你推开门——一片漆黑。一个声音从深处传来——"你来了。我们一直在等你。"灯亮了——你面前不是旅行驿站——是一个站台——S7站台。一列老旧的火车停在面前——车门为你打开了。', nextNodeId: '' },
    { id: 'road_trip_ignore', text: '记住地点但不进入', effects: {awareness: 3, setFlag: {noted_travel_inn: true}}, resultText: '你拍下海报照片但没有进入。你有一种感觉——这次旅行的"终点"——是你可能回不来的地方。', nextNodeId: 'town_arrival' }
  ]
};

const forbidden_sign = {
  id: 'forbidden_sign', scene: 'shrine', dayMin: 1, dayMax: 7,
  title: '禁止触摸',


  narrative: '神社后院——注连绳围着的区域内——竖立着一根刻满符文的古老木柱。符文的线条在你的注视下缓慢蠕动。旁边的木牌写着——"禁止触摸"——违者自担后果。\n\n你的掌心发热——低头看——掌心里浮现了和木柱上一模一样的符文——它在发光。',
  choices: [
    { id: 'forbidden_sign_touch', text: '触碰木柱一探究竟', effects: {erosion: 5, awareness: 4, setFlag: {touched_forbidden_pillar: true}}, resultText: '指尖碰到木柱的一瞬——你感到有什么东西通过木柱流入体内。你看到了这座城市被建立之前的土地——那时的天空——那时的森林。那些记忆留在了你的脑海里——而木柱上的符文——消失了——转移到了你的身上。', nextNodeId: '' },
    { id: 'forbidden_sign_retreat', text: '退后不碰', effects: {awareness: 2, setFlag: {avoided_forbidden_pillar: true}}, resultText: '你后退了几步——掌心的符文渐渐淡去——但你的手仍然感到一种轻微的麻木——像是木柱在你触碰之前就已经碰到了你。', nextNodeId: 'shrine_arrival' }
  ]
};

const gender_fantasy = {
  id: 'gender_fantasy', scene: 'home_bedroom', dayMin: 1, dayMax: 7,
  title: '镜中的另一个你',


  narrative: '你走到铜镜前——镜中的你看起来有些不一样。不是脸不同——是感觉不同——你的倒影看起来更柔和——更像你有时在梦中见到的那个版本的自己。\n\n你摇头准备离开——但镜中的你没有跟着摇头。她伸出手要触碰镜面——嘴唇无声地说——"换我来。"你的手指不自觉地伸向了镜面。',
  choices: [
    { id: 'gender_fantasy_touch', text: '触碰镜面让镜中的你出来', effects: {erosion: 6, awareness: 4, setFlag: {touched_gender_mirror: true}}, resultText: '指尖碰到冰凉的镜面——然后穿了过去。一阵晕眩后你站在镜子的另一边——镜外你的倒影在用你的身体对你微笑——"谢谢——我终于出来了。"', nextNodeId: '' },
    { id: 'gender_fantasy_step_back', text: '后退不理会幻觉', effects: {awareness: 3, setFlag: {resisted_gender_mirror: true}}, resultText: '你强迫自己退后一步。镜中的你露出了失望的表情——然后恢复了正常。但你那一整天都觉得自己的身体有些陌生——像是某个角落被换掉了。', nextNodeId: 'leave_home' }
  ]
};

const wishing_well = {
  id: 'wishing_well', scene: 'shrine', dayMin: 1, dayMax: 7,
  title: '许愿井',


  narrative: '神社角落里有一口被藤蔓掩盖的古井。井口刻着字——"投一枚硬币——许一个愿望——井会帮你实现。"\n\n你往井里看——水面上映出的不是你的脸——而是一张不同的面孔——年轻的——穿着古代服装——在对你微笑。井底有金色鳞片闪闪发光——你在那些光中看到了许愿的画面——你变成了另一种样子——在另一个世界里自由生活。',
  choices: [
    { id: 'wishing_well_coin', text: '投下硬币许愿', effects: {erosion: 5, setFlag: {wished_at_well: true}}, resultText: '硬币落入井中没有溅起水花——而是被水面直接吞没。井水沸腾起来——金色光芒从井底升起笼罩了你。你的身体开始变化——但变化了一半就停住了——井能实现愿望——但它需要更多的代价。', nextNodeId: '' },
    { id: 'wishing_well_leave', text: '不投离开', effects: {awareness: 2, setFlag: {ignored_wishing_well: true}}, resultText: '你把硬币收回了口袋。但你的倒影没有跟着离开——水面上的那张脸仍然在微笑——像是在说——"你还会回来的。"', nextNodeId: 'shrine_arrival' }
  ]
};

const fan_draw = {
  id: 'fan_draw', scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '街头画师',


  narrative: '广场上一个年轻的画师叫住了你——"你的轮廓太适合了！让我给你画上猫耳和尾巴——不收钱！"他太热情了——你坐在了他的画架前。\n\n十五分钟后他把画转向你——画中的你不只是画上了猫耳——你的瞳孔变成了竖瞳——嘴边隐约可见细小的胡须——不像人类。而且——你的头顶——真的有些痒。',
  choices: [
    { id: 'fan_draw_accept', text: '收下画作道谢', effects: {erosion: 3, setFlag: {accepted_cat_art: true}}, resultText: '你接过画——纸上的银光闪了一下。头顶的痒变成了刺痛——有东西正从你的头皮里长出来。你摸了摸——指尖碰到了一对毛茸茸的猫耳。画师已经收摊走了——留下你站在广场中央——头上多了一对可能是真的猫耳。', nextNodeId: '' },
    { id: 'fan_draw_refuse', text: '婉拒', effects: {awareness: 2, setFlag: {refused_cat_art: true}}, resultText: '你礼貌谢绝——但画师还是把画塞进你手里。你低头看——画中的猫耳你——正在对你眨眼睛。', nextNodeId: 'town_arrival' }
  ]
};

const new_pose = {
  id: 'new_pose', scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '新的体验',
  narrative: '魅魔酒吧深处有间不对外开放的房间。夜魅今晚喝了很多酒——她的角在灯光下泛着柔和的光晕。她靠在吧台上问你——"你想不想体验一些新的东西——不是坏事——是完全全新的身体感受。"她的指尖跳动着紫色荧光——那是魅魔之力——触碰后会让你体验到从未有过的感受。',
  choices: [
    { id: 'new_pose_accept', text: '让她碰你体验新感受', effects: {erosion: 6, setFlag: {experienced_new_sensation: true}}, resultText: '她的指尖碰到你的手腕——一股电流般的暖流涌遍全身。你的身体不再受骨骼的限制——关节可以向任何方向弯曲——皮肤的感觉变得无比敏锐。但这种体验也让正常身体的感受变得越来越遥远。', nextNodeId: '' },
    { id: 'new_pose_refuse', text: '婉拒今晚只想喝酒', effects: {erosion: 2, setFlag: {refused_new_experience: true}}, resultText: '夜魅耸肩收回手——"那就喝酒吧。"她把一杯深紫色的酒推到你面前——你喝了一口——味道像是记忆的味道。', nextNodeId: 'bar_secret' }
  ]
};

const sign_contract = {
  id: 'sign_contract', scene: 'city_hall', dayMin: 2, dayMax: 7,
  title: '未读的合同',


  narrative: '市政厅公告栏上贴着一份征召志愿者的公告——密密麻麻三页A4纸——标题是"城市发展计划第十三次志愿者招募"。\n\n下方已有许多人签名——但每一份签名都带着同一种微弱的颤抖——像是被外力控制着签下去的。你拿起桌上的笔——笔杆冰得异常——你扫了一眼合同内容——但每一个字都在你的目光扫过后重新排列成完全不同的句子。这份合同不让你看清真实条款。',
  choices: [
    { id: 'sign_contract_sign', text: '签下名字', effects: {erosion: 5, setFlag: {signed_contract: true}}, resultText: '笔尖碰到纸的瞬间——墨迹自行蔓延成你从未见过的名字——是你前世的名字。纸张发光了一瞬——然后你感到有什么东西从你身上剥离了——你的一部分属于了这座城市。', nextNodeId: '' },
    { id: 'sign_contract_skip', text: '不签离开', effects: {awareness: 3, setFlag: {refused_contract: true}}, resultText: '你放下笔离开——但纸张在你身后又多了一个签名——登记台后面没有人——笔在自行移动。', nextNodeId: 'town_hall' }
  ]
};

const volunteer_exp = {
  id: 'volunteer_exp', scene: 'hospital', dayMin: 3, dayMax: 7,
  title: '志愿者的代价',


  narrative: '医院地下二层——一扇标着"临床试验·志愿者招募"的门半开着。里面是一排排的床——每张床上都躺着人——头上连着电线——连接到天花板上的巨大机器。所有人的脑电波同步——像是共享同一个梦境。\n\n护士微笑着走来——笑容和糖果店女孩一模一样——"躺下做几个梦——醒来后会获得丰厚的报酬。"机器表面布满和你古镜上一模一样的符文。',
  choices: [
    { id: 'volunteer_exp_agree', text: '躺下接受实验', effects: {erosion: 6, setFlag: {joined_clinical_trial: true}}, resultText: '你躺上床——电线连接到太阳穴。机器启动——一阵低沉的声音后你的意识开始模糊——你梦到了你的前世——你站在神社祭坛前——穿着古代衣袍——面前站着年轻的龙映——你握着刀——刺向了她。', nextNodeId: '' },
    { id: 'volunteer_exp_refuse', text: '拒绝退出房间', effects: {awareness: 3, setFlag: {refused_clinical_trial: true}}, resultText: '你退出房间——护士的笑容没有消失——她在门口目送你——"下次准备好了再来。"你快步走向楼梯——但后颈的那个小凸起——在发烫。', nextNodeId: 'front_desk' }
  ]
};

const haunted_place = {
  id: 'haunted_place', scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '古庙的回声',




  narrative: '神社西北角——狐铃特意避开的区域——有一座倒塌的小庙。比主殿更古老——像是城市建成前就已存在。庙门封死——但门缝里透出微光。\n\n你凑近门缝——里面有一个法阵——中央插着一把剑——剑身上缠绕着一根干枯的白色狐狸尾巴——还在微微颤动。\n\n"你不该来这里。"狐铃的声音第一次这么冷。',
  choices: [
    { id: 'haunted_place_ask', text: '问她小庙的来历', effects: {awareness: 5, setFlag: {asked_about_small_shrine: true}}, resultText: '狐铃沉默了很久——"那是我的前辈——初代九尾狐。三百年前她用自己作为代价封印了第一个裂缝——剑封印了她——她的尾巴是封印的锁。她现在还在承受痛苦。"', nextNodeId: '' },
    { id: 'haunted_place_retreat', text: '道歉退回主殿', effects: {awareness: 2, setFlag: {left_small_shrine: true}}, resultText: '你低头退回主殿。狐铃一整天没再说话——但你知道她不是生你的气——她是怕你也变成小庙里的一把剑。', nextNodeId: 'shrine_arrival' }
  ]
};

const fan_mail = {
  id: 'fan_mail', scene: 'school', dayMin: 2, dayMax: 7,
  title: '狂热崇拜者',


  narrative: '你的课桌抽屉里塞满了信——用红色墨水写的同一句话——"我知道你的秘密。"字迹有的端正有的狂乱——有的像是用指甲刻在纸上。信封上没有署名——但背面都画着和你古镜上一模一样的符文。\n\n你数了数——二十九封——昨天抽屉里还什么都没有。你抬头——窗外一个人影一闪而过。',
  choices: [
    { id: 'fan_mail_read', text: '拆开一封查看', effects: {erosion: 3, awareness: 4, setFlag: {read_fan_mail: true}}, resultText: '信纸在你手中瞬间变黄——像是几十年的时间在几秒内流过。纸上只有一句话——"你是第七个觉醒者——前六个都被重置了——你是最后一个机会。"角落画着小小的S7标志。', nextNodeId: '' },
    { id: 'fan_mail_burn', text: '烧掉这些信', effects: {setFlag: {burned_fan_mail: true}}, resultText: '你用打火机点燃一封——火焰是蓝色的。燃烧时你听到了极其微弱的哭声从火焰中传来。你把剩下的都烧了——但那哭声持续了一整天。', nextNodeId: 'library' }
  ]
};

const clumsy_lab = {
  id: 'clumsy_lab', scene: 'hospital', dayMin: 2, dayMax: 7,
  title: '实验室意外',


  narrative: '你在商店街绊了一跤——擦破了膝盖。值班医生看到你的伤口时表情变了——他没有做常规消毒——而是抽了你的血说是"常规检查"。\n\n你在急诊室等了很久——久到医院的时钟转了三圈但分钟没有移动过。你坐起来——护士站空无一人——但电脑屏幕上显示着你的病历——血型一栏写的不是A/B/AB/O——而是一个你从未见过的符号——备注——"非人类谱系——疑似觉醒中。"',
  choices: [
    { id: 'clumsy_lab_investigate', text: '拍下病历做证据', effects: {awareness: 5, setFlag: {photographed_medical_record: true}}, resultText: '你用手机拍下屏幕。闪光灯亮起的瞬间走廊的灯全亮了——护士从拐角走来微笑说——"久等了——一切正常——可以回家了。"但你知道那不正常。', nextNodeId: '' },
    { id: 'clumsy_lab_leave', text: '直接离开不做声张', effects: {awareness: 2, setFlag: {left_hospital_quietly: true}}, resultText: '你穿上外套快步离开医院。从你踏入这座城市的第一天起——他们就在监视你的每一滴血。', nextNodeId: 'front_desk' }
  ]
};

const mirror_hand_out = {
  id: 'mirror_hand_out', scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '镜中的手',


  narrative: '深夜巷子里——一扇被打碎的车窗玻璃散落在地。你在碎片中看到多个倒影——每个碎片里都有一个不同的你。\n\n你蹲下想捡起一片较大的——碎片里伸出了一只手——和你的手一模一样——指尖对着指尖——穿过了玻璃握住了你。冰冷但有力。一个声音从碎片中传来——和你一样的声音——"我终于碰到你了。"',
  choices: [
    { id: 'mirror_hand_follow', text: '握住那只手跟它走', effects: {erosion: 5, awareness: 4, setFlag: {followed_mirror_hand: true}}, resultText: '那只手用力一拉——你的意识一阵恍惚。清醒时你站在一面巨大的落地古镜前——镜面像水面一样波动。你知道穿过它会到达一个完全不同的地方——但那里有你想要的一切答案。', nextNodeId: '' },
    { id: 'mirror_hand_release', text: '松手挣脱', effects: {awareness: 3, setFlag: {released_mirror_hand: true}}, resultText: '你甩开了那只手——碎片碎成了更细的颗粒。但你的手心上留下了一个银色的印记——形状和古镜上的符文一模一样。', nextNodeId: 'graffiti' }
  ]
};

const alien_dna = {
  id: 'alien_dna', scene: 'alley_night', dayMin: 3, dayMax: 7,
  title: '改造者来访',


  narrative: '深夜你被一种奇怪的声音吵醒——不是从窗外传来——是从你的身体内部。手臂皮肤下有细小的光点在移动——顺着你的血管游走。\n\n门自己滑开了——门外站着一个银皮肤的人形——眼睛的位置是两团蓝色光芒。他的声音直接在你脑海中响起——"我们是这座城市的第一批原住民——在人类和妖怪之前我们就存在。你的DNA有我们的痕迹——我们需要把它收回来。"',
  choices: [
    { id: 'alien_dna_allow', text: '让他收回DNA', effects: {erosion: 6, awareness: 5, setFlag: {allowed_alien_dna_extraction: true}}, resultText: '银色触须刺入你的手臂——没有疼痛——而是一种深层的剥夺感。但作为交换——你看到了这座城市在人类和妖怪出现之前的模样——一片银色光芒的海洋——无数意识在其中流动。你获得了那份知识。', nextNodeId: '' },
    { id: 'alien_dna_refuse', text: '拒绝关上意识的门', effects: {awareness: 3, setFlag: {refused_alien_extraction: true}}, resultText: '你用力关上了意识的大门。人影的蓝光闪烁了一下——"你会改变主意的——那个印记在你的灵魂里——不是你能关掉的。"他无声地消失在空气中。', nextNodeId: 'mirror_dimension' }
  ]
};

const talking_animal = {
  id: 'talking_animal', scene: 'alley_night', dayMin: 1, dayMax: 7,
  title: '说话的动物',


  narrative: '小巷垃圾桶旁蹲着一只黑猫。它看着你——你准备移开视线时它开口了——低沉成年男性的声音——"你被跟踪了。别回头看——继续走——听我说。"\n\n你的脚步僵住了。猫走在你的脚边——"我是理事会的观察员——被植入这只猫的身体七年了。如果你想逃——S7站台——三天后的午夜——有一列不在任何时刻表上的火车——坐上它你可以离开这座城市。"',
  choices: [
    { id: 'talking_animal_trust', text: '相信它问更多细节', effects: {awareness: 4, setFlag: {trusted_talking_cat: true}}, resultText: '猫蹲下来——绿眼在黑暗中发光——"三天后午夜——S7站台。记住——不要带任何来自这座城市的东西——包括那面古镜——它会认出你。"它说完转身消失在巷子的阴影中。', nextNodeId: '' },
    { id: 'talking_animal_skeptic', text: '怀疑——猫怎么会说话', effects: {awareness: 2, setFlag: {skeptical_of_cat: true}}, resultText: '你揉了揉眼睛——猫不见了。它坐的地方只有一片黑色羽毛——你捡起羽毛——它在你手中化作了灰烬。', nextNodeId: 'alley_arrival' }
  ]
};

const other_people_stuff = {
  id: 'other_people_stuff', scene: 'school', dayMin: 2, dayMax: 7,
  title: '别人的物品',


  narrative: '学校的失物招领处堆满了无人认领的物品。你推开门——箱子里有旧眼镜、发黄笔记本、照片。你拿起一张——一群人站在市政厅前——背面写着——"1999年第一批志愿者。"十二个人——但一张脸模糊了——像是被抹去了。\n\n你拿起另一张——同一场景——只剩十一个人。最后一张最新——照片上只有一个人背对着镜头站在S7站台入口——背影看起来有些熟悉。你看了看自己的衣服——和照片里的人穿着同样的外套。',
  choices: [
    { id: 'other_stuff_investigate', text: '翻看更多照片', effects: {awareness: 5, setFlag: {investigated_photo_collection: true}}, resultText: '你翻遍整箱照片——每一张记录着志愿者从十二个减少到十个到八个到三个到一个。而最后一个是你。每一组照片间隔大约二十年——对应着重置周期。', nextNodeId: '' },
    { id: 'other_stuff_leave', text: '放下照片离开', effects: {awareness: 2, setFlag: {left_photo_room: true}}, resultText: '你放下照片退出了房间。但那最后一张照片里的背影一直浮现在你眼前——那不是巧合——那是某种预告。', nextNodeId: 'library' }
  ]
};

const fairy_gold_steal = {
  id: 'fairy_gold_steal', scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '妖精的金子',


  narrative: '神社供奉箱旁边多了一个小篮子——装满金色硬币——每一枚都发着柔和的光——像内部有火焰在燃烧。没有说明——但这些显然不是人类货币——是妖精的金子。\n\n传说拿一枚金币就会在三天内十倍地失去你最重要的东西——但它们在阳光下太美了——你看到自己在月光下变成猫又自由奔跑的画面。你的手不自觉地伸向了篮子。',
  choices: [
    { id: 'fairy_gold_steal_take', text: '拿走一枚金币', effects: {erosion: 5, setFlag: {took_fairy_gold: true}}, resultText: '金币在你掌心化开变成了液体渗入皮肤。你没有立即失去什么——但妖精的交易从不即时兑现——它们会在你最幸福的时候来收取代价。', nextNodeId: '' },
    { id: 'fairy_gold_steal_leave', text: '不碰离开', effects: {awareness: 2, setFlag: {left_fairy_gold: true}}, resultText: '你转身走开了。但你背后传来极轻微的金币碰撞声——像是那篮硬币在对你表达遗憾。', nextNodeId: 'shrine_arrival' }
  ]
};

const wrong_bathroom = {
  id: 'wrong_bathroom', scene: 'school', dayMin: 1, dayMax: 7,
  title: '错误的门',


  narrative: '你急着用洗手间推开了那扇门——但走进去就知道不对。这里太大了——天花板高得像教堂——墙壁贴满了从地板到天花板的古镜。\n\n每一面镜子里都映出了不同的你——每个都穿着不同风格的服装。门从外面锁死了——你推不开。一个声音从所有镜子里同时响起——"你走错了门——但现在你出不去了——除非你选择了一个你想成为的自己。"',
  choices: [
    { id: 'wrong_bathroom_choose', text: '选择其中一个镜像', effects: {erosion: 4, setFlag: {chosen_mirror_self: true}}, resultText: '你指向了看起来最像你自己的那个——其他镜子里你都碎裂了——只剩你选择的那个从镜中走出和你重叠。你的衣服变成了那套装束——你的脸微妙地和以前不一样了。', nextNodeId: '' },
    { id: 'wrong_bathroom_wait', text: '原地等待有人开门', effects: {awareness: 3, setFlag: {waited_in_mirror_room: true}}, resultText: '你闭眼坐下不看不听。不知过了多久门从外面打开了——一个学生探进头——"你怎么在女厕里面？"你走出去——但手在微微发抖。', nextNodeId: 'library' }
  ]
};

const witch_gift_accept = {
  id: 'witch_gift_accept', scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '女巫的馈赠',


  narrative: '小巷深处——一个摆着水晶球的老妇人坐在昏暗路灯下。她的手指上戴满戒指——每一枚嵌着不同颜色的宝石——但靠近看——那是凝固的眼球。\n\n她拿起一枚精致银戒递向你——"送给你——不收费——是礼物。"戒指内侧刻着极小的字——"带我走——但不要戴上——除非你想成为新的女巫。"',
  choices: [
    { id: 'witch_gift_accept_take', text: '收下但不戴', effects: {awareness: 3, setFlag: {accepted_witch_ring: true}}, resultText: '你接过银戒——它在你掌心微微发热。老妇人笑了——"聪明的选择——留着它——当走投无路时戴上它——你会知道该怎么做。"', nextNodeId: '' },
    { id: 'witch_gift_accept_wear', text: '直接戴上戒指', effects: {erosion: 5, setFlag: {wore_witch_ring: true}}, resultText: '银戒滑入你的手指——瞬间收紧。一阵电流般的冲击——你获得了看到他人真名的能力——每个人头上都浮现了灵魂的名字——包括你自己——你看到了你的真名——不是你现在的名字——是你前世的。', nextNodeId: '' },
    { id: 'witch_gift_accept_decline', text: '婉拒', effects: {awareness: 2, setFlag: {declined_witch_gift: true}}, resultText: '"谨慎的孩子。"她收回了戒指——"但你错过了保护自己的机会。"她消失在小巷阴影中——就像从未存在过。', nextNodeId: 'graffiti' }
  ]
};

const nymph_kiss_danger = {
  id: 'nymph_kiss_danger', scene: 'alley_night', dayMin: 3, dayMax: 7,
  title: '月下之吻',


  narrative: '深夜神社后山的溪边——月光洒在水面上。你听到了歌声——从上游传来——你沿着溪流走去——看到一个赤足少女站在溪水中央。她的长发像流动的水银——浅金色眼睛不像人类——她——是属于水的存在。\n\n她向你走来——水面没有留下脚印。她微微踮起脚尖——"你看起来很孤独——让我给你一个吻——让你忘记所有烦恼的吻。"她的嘴唇泛着微微的蓝色荧光。',
  choices: [
    { id: 'nymph_kiss_accept', text: '接受她的吻', effects: {erosion: 7, setFlag: {kissed_nymph: true}}, resultText: '她的唇碰到你的唇——冰凉带着溪水的气息。一瞬间你感到自己融化了——不是比喻——是你的身体在真正变成水。你的意识随着溪流流向了城市的每一个角落——你成为了城市水循环的一部分——你无处不在。', nextNodeId: '' },
    { id: 'nymph_kiss_retreat', text: '后退拒绝', effects: {awareness: 3, setFlag: {resisted_nymph_kiss: true}}, resultText: '你后退了一步。她歪了歪头——"下次月圆之夜——我会再来。"她沉入了溪水深处——没有浮起。', nextNodeId: 'shrine_arrival' }
  ]
};

const d1_morning = {
  id: 'd1_morning', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '晨起',
  narrative: '清晨第一缕光线透过窗帘缝隙——你睁开眼。天花板上的裂纹更深了——像是有什么东西在昨夜试图爬出来。被子上有淡淡花香——不是你的味道。窗台上多了一朵白花——花瓣上的露珠是红色的。地板上——一行浅浅的脚印从窗口延伸到你的床边——然后在床头消失了——脚印很小——像是孩子的。',
  choices: [
    { id: 'd1_morning_explore', text: '检查房间变化', effects: {awareness: 3, setFlag: {checked_morning_room: true}}, resultText: '你发现抽屉里多了一张纸条——字迹歪歪扭扭——"姐姐/哥哥——我看到你床底下的东西了——它一直在看你。"', nextNodeId: 'explore_room' },
    { id: 'd1_morning_out', text: '直接离开', effects: {setFlag: {left_morning_room: true}}, resultText: '你推门而出——但眼角扫到床底下有什么东西动了一下。', nextNodeId: 'leave_home' }
  ]
};

const d1_letter = {
  id: 'd1_letter', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '信纸的背面',


  narrative: '你再次拿起那封信翻到背面——在晨光的角度下看到一行极浅的铅笔字——"如果你在读这个——说明你已经醒来了第二次。我不记得是第几次写这封信了——但我希望这次你能成功。"\n\n字迹是你的。信纸边缘微微卷起——你轻轻摩挲发现夹层里有一张极薄的微型胶片。',
  choices: [
    { id: 'd1_letter_film', text: '查看胶片', effects: {awareness: 4, setFlag: {found_letter_film: true}}, resultText: '你对着光看——胶片上是一张照片——你的背影——但房间的墙纸和家具摆放和现在不一样——那是上一次循环中的你的房间。', nextNodeId: 'read_letter' },
    { id: 'd1_letter_save_film', text: '小心收好胶片', effects: {awareness: 3, setFlag: {saved_letter_film: true}}, resultText: '你把胶片夹进日记本里——它很小——但它存在的本身就是你留给自己的最重要的证据。', nextNodeId: 'read_letter' }
  ]
};

const d1_mirror = {
  id: 'd1_mirror', scene: 'home_bedroom', dayMin: 1, dayMax: 1,
  title: '镜中延迟',


  narrative: '你站在铜镜前——一切正常——你抬手镜中的你抬手——但慢了半秒。不——是镜中的你比你快了半秒——你看到了自己半秒后的动作。\n\n镜中的你用口型说——"快走——他们来了。"你听到了门外走廊上的脚步声——不止一个人——沉重的制式皮靴踩在木地板上的声音。',
  choices: [
    { id: 'd1_mirror_hide', text: '躲到窗帘后', effects: {awareness: 3, setFlag: {hid_from_visitors: true}}, resultText: '你闪到窗帘后——脚步声在你门口停住了——你听到了频率极低的呼吸声——然后脚步声远去了。从窗帘后出来——镜中的你竖起了大拇指。', nextNodeId: 'leave_home' },
    { id: 'd1_mirror_peek', text: '从门缝偷看', effects: {erosion: 3, awareness: 4, setFlag: {peeked_at_visitors: true}}, resultText: '你从门缝看出去——三个穿黑制服戴帽子的人——领口的徽章是一只睁开的眼睛——当你盯着它看时——那只眼睛转向了你。你猛地关上门浑身冰凉。', nextNodeId: 'leave_home' }
  ]
};

const d2_street = {
  id: 'd2_street', scene: 'town_center', dayMin: 2, dayMax: 2,
  title: '商店街清晨',


  narrative: '第二天早晨——商店街刚刚苏醒。卖早餐摊的蒸汽在上升过程中会弯曲——像是在躲避什么看不见的东西。送报少年骑车经过——带起的落叶在空中组成了你熟悉的符号——然后散落。\n\n便利店门口小翠正在整理货架——她看到你露出灿烂笑容——但你看到她眼睛微微发红——像是哭过。她对你轻轻摇头——示意现在不要说任何重要的话。',
  choices: [
    { id: 'd2_street_help', text: '进去帮忙', effects: {affinity: {npcId: 'cui_slime', amount: 2}, awareness: 2, setFlag: {helped_cui_morning: true}}, resultText: '你帮小翠摆货——她在矿泉水瓶之间塞了一张纸条——"理事会的人在店里装了监听器——今晚老地方见。"', nextNodeId: 'town_arrival' },
    { id: 'd2_street_explore_alone', text: '自己逛街', effects: {awareness: 2, setFlag: {explored_street_alone: true}}, resultText: '你沿街走着——每个橱窗倒影里的你都在做不同的表情——你的倒影在活过来。', nextNodeId: 'town_arrival' }
  ]
};

const d2_friend_call = {
  id: 'd2_friend_call', scene: 'town_center', dayMin: 2, dayMax: 2,
  title: '神秘来电',


  narrative: '手机震动——来电显示是你自己的号码。你犹豫了一下接通——电话那头是你自己的声音但更沙哑更疲惫——"不要回公寓——他们在你地板下埋了一个装置——在你睡觉时它会修改你的记忆。"\n\n你听到电话那边有和你这边一模一样的街背景音——他在你附近——"我在你身后的咖啡店二楼——不要回头——继续走到下一个路口左转——我在那里等你。"电话挂断了。',
  choices: [
    { id: 'd2_call_follow', text: '按指示前往', effects: {awareness: 5, setFlag: {followed_call_instructions: true}}, resultText: '你走到路口左转——小巷空无一人——但地上放着一部老式手机——屏幕亮着——"我现在不能见你。这部手机是加密的——用它联系我。"', nextNodeId: 'town_arrival' },
    { id: 'd2_call_ignore', text: '挂断不理', effects: {setFlag: {ignored_mystery_call: true}}, resultText: '你挂断电话——但忍不住回头看咖啡店——二楼靠窗坐着一个人——隔着玻璃看着你——嘴唇无声地说——"下次。"', nextNodeId: 'town_arrival' }
  ]
};

const d3_shrine_path = {
  id: 'd3_shrine_path', scene: 'shrine', dayMin: 3, dayMax: 3,
  title: '石阶之路',


  narrative: '通往神社的石阶——之前是九十九级——今天第一百级出现了。石阶两侧的石灯笼里没有火——但内部有微弱的石头本身发出的光。\n\n你走上一级——身后的石阶消失了——来路变成了一片空白。你只能向前——到达新的第一百级时——石阶上刻着一行字——"你走得越远——回头的路就越少——真相也是一样。"',
  choices: [
    { id: 'd3_path_continue', text: '继续向上走', effects: {awareness: 3, setFlag: {climbed_new_steps: true}}, resultText: '你继续向上——身后石阶不断消失——但神社大门越来越近。在鸟居下回头——整条石阶都消失了——只剩一片漂浮在云雾中的虚空。你已经回不了头了。', nextNodeId: 'shrine_arrival' },
    { id: 'd3_path_stay', text: '停在原地观察', effects: {awareness: 4, setFlag: {observed_vanish_steps: true}}, resultText: '你停在第一百级上仔细观察——石阶不是消失——是被从下方卷起来了——像一卷地毯。这说明这条石阶是有人操控的。', nextNodeId: 'shrine_arrival' }
  ]
};

const d3_kitsune_greeting = {
  id: 'd3_kitsune_greeting', scene: 'shrine', dayMin: 3, dayMax: 3,
  title: '狐铃的问候',


  narrative: '狐铃正在神社主殿前打扫——红白巫女服在晨风中轻轻飘动——她的狐狸耳朵微微抖动——像是对你的到来做出了回应。\n\n她停下扫帚转身对你微笑——"你又来了。""又"字说得格外重——她知道那些被重置的你来过的记忆。她走近压低声音——"你今天看到的——是真实的你。之前无数次——你看到的都是被过滤过的版本——今天不一样——你已经开始记得了。"',
  choices: [
    { id: 'd3_greeting_ask', text: '问她关于重置的事', effects: {awareness: 5, setFlag: {asked_kitsune_about_reset: true}}, resultText: '狐铃的微笑带上了一丝苦涩——"每一次重置我都会看着你回到这里——你的眼神从不认识到认识——从陌生到信任。"她顿了顿——"来——我泡茶给你——我们有很多话要说。"', nextNodeId: 'meet_kitsune' },
    { id: 'd3_greeting_observe', text: '静静听她说', effects: {affinity: {npcId: 'kitsune_miko', amount: 2}, setFlag: {listened_to_kitsune: true}}, resultText: '你没有追问——站到她身边看她扫地。鸟居风铃在风中发出清脆响声——这是一个普通的清晨——但在不普通的世界里——这样的普通就是最珍贵的时刻。', nextNodeId: 'meet_kitsune' }
  ]
};

const d3_choice_weight = {
  id: 'd3_choice_weight', scene: 'shrine', dayMin: 3, dayMax: 3,
  title: '抉择的重量',




  narrative: '你站在参道上面临三条路——但这一次你清楚地知道每一条路通向什么样的未来。不是猜测——是记忆——模糊却真实存在。\n\n你记得曾经选择过医院——在地下室深处看到了由记忆构成的巨大网络。你记得曾经选择过小巷——喝下了改变一生的血清。你记得曾经选择过日常——和城市里的非人类们建立了深刻的联系。\n\n这些记忆不属于这一世的你——但它们真实地存在于你的脑海里。你的身体比意识更早地做出了选择。',
  choices: [
    { id: 'd3_weight_truth', text: '走向医院追寻真相', effects: {awareness: 5, setFlag: {chose_truth_from_memory: true}}, resultText: '你的脚步带着你走向医院方向——每一个转弯每一个路标——像是走了几百次的回家的路。', nextNodeId: 'hospital_arrival' },
    { id: 'd3_weight_tsf', text: '走向小巷追求力量', effects: {erosion: 3, awareness: 3, setFlag: {chose_tsf_from_memory: true}}, resultText: '你的脚步带着你走向小巷方向——风吹过巷口——你闻到了混杂着草药和血液的血清的味道。', nextNodeId: 'alley_arrival' },
    { id: 'd3_weight_daily', text: '走向日常选择联系', effects: {awareness: 3, setFlag: {chose_daily_from_memory: true}}, resultText: '你的脚步带着你走回商店街——远处便利店的灯光亮着——你几乎能看到小翠在柜台后面对你挥手。', nextNodeId: 'town_arrival' }
  ]
};

const d4_morning_recap = {
  id: 'd4_morning_recap', scene: 'home_bedroom', dayMin: 4, dayMax: 4,
  title: '第四天的回望',




  narrative: '第四天——你醒来时比之前更加清醒。睡眠的雾霾终于开始散去。你坐在床边回想着过去三天——每一件事都清晰地刻在脑海里。\n\n你想起了陌生房间和桌上的信。商店街的异常和小翠的警告。神社的狐铃和那三条通向不同未来的路。你还想起了一些不可能是你亲身经历的记忆——碎片——一个女人穿着和服在樱花树下等你——你的手里握着一把剑——面前是一头银色的龙。\n\n你深吸一口气——今天你要走得更远。',
  choices: [
    { id: 'd4_recap_forward', text: '继续向前目标明确', effects: {awareness: 4, setFlag: {recap_moved_forward: true}}, resultText: '你穿衣出门——脚步比前两天更坚定。每一次循环都在让你更接近真相。', nextNodeId: 'hospital_arrival' },
    { id: 'd4_recap_train', text: '去S7站台看看', effects: {awareness: 3, setFlag: {recap_went_s7: true}}, resultText: '你改变计划先去了S7站台——那个出现在信里梦里每一条线索中的地方——你去亲眼看看。', nextNodeId: 'town_arrival' }
  ]
};

const d4_letter_new = {
  id: 'd4_letter_new', scene: 'home_bedroom', dayMin: 4, dayMax: 4,
  title: '新的来信',


  narrative: '你的枕头下面多了一封信——信封上只有一个符号——和你古镜上的符文一模一样。拆开信——字迹是血月的——\n\n"觉醒者：如果你读到这封信——说明你已经通过了第三天的选择。你现在看到的只是冰山一角。医院的B3层保存着这座城市的完整历史——不是被改写过的——是真正的历史。来见我——我有一样东西要给你。它在第一次见到我的地方等着你。"',
  choices: [
    { id: 'd4_letter_go_hospital', text: '去医院见血月', effects: {awareness: 4, setFlag: {went_to_vampire_after_letter: true}}, resultText: '你收起信直接出门去医院——你知道她说的地方——是你第一次到医院时的那个前台——她一直在那里等你。', nextNodeId: 'hospital_arrival' },
    { id: 'd4_letter_keep', text: '收好信晚点再去', effects: {awareness: 2, setFlag: {kept_vampire_letter: true}}, resultText: '你把信折好放进口袋。这封信让你知道——你在这座城市里不是完全孤单的。', nextNodeId: 'town_arrival' }
  ]
};

const truth_hospital_arrival = {
  id: 'truth_hospital_arrival', scene: 'hospital', dayMin: 4, dayMax: 4,
  title: '医院大厅异常',


  narrative: '你推开医院大门——今天的大厅不一样了。灯光的颜色从暖白变成了淡蓝——像是某种消毒模式被激活了。接待台后面没有护士——只有一台老旧电脑——屏幕滚动着一行字——"已识别觉醒者——欢迎到B3层。"\n\n电梯门在你面前自动打开——楼层按钮多了一个你之前没见过的——B3。你走进电梯——门关上——电梯没有向下而是向上到了顶层——门打开——你看到的不是天台——而是一条从未见过的走廊——墙壁上覆盖着和你古镜上一模一样的银色纹路。',
  choices: [
    { id: 'truth_hall_enter', text: '走进走廊', effects: {awareness: 5, setFlag: {entered_hidden_hall: true}}, resultText: '你踏入走廊——身后的电梯门消失了变成一堵完整的墙。走廊两侧每隔几步就有一扇紧闭的门——"记忆档案1999-2026""实验体追踪记录""重置频率统计""第173次循环观测笔记"。173次——你在这个走廊里看到了自己循环的次数。', nextNodeId: 'truth_doctor_meet' },
    { id: 'truth_hall_cautious', text: '在安全距离观察', effects: {awareness: 3, setFlag: {observed_hall_first: true}}, resultText: '你在门口犹豫——但你知道进来了就不能回头。深吸一口气向前迈出了脚步。', nextNodeId: 'truth_doctor_meet' }
  ]
};

const truth_doctor_meet = {
  id: 'truth_doctor_meet', scene: 'hospital', dayMin: 4, dayMax: 4,
  title: '血月的真相',


  narrative: '走廊尽头是一间宽敞的房间——血月背对着你站在一面巨大的屏幕前。屏幕上是你和她的合影——但你穿着古代服饰——背景是一片燃烧的神社。\n\n"你来了。"她没有回头——"你已经见过狐铃了——她告诉了你关于封印的事。但她没有告诉你的是——你和龙映——是兄妹。不是血缘上的——在境界层面上你们是同一枚硬币的两面——她负责覆盖——你负责觉醒——你们互相制衡。"',
  choices: [
    { id: 'truth_doctor_believe', text: '相信她追问更多', effects: {awareness: 6, setFlag: {believed_doctor_truth: true}}, resultText: '"三百年前你们出生在同一片月光下——被同一种力量选中。龙映选择了秩序——你选择了自由——然后那一天你们互相封印了彼此。"血月的眼中有着深沉的悲伤——"你不是觉醒者——你是解封者。"', nextNodeId: 'truth_morgue_explore' },
    { id: 'truth_doctor_doubt', text: '不敢相信太荒谬了', effects: {awareness: 4, setFlag: {doubted_doctor_truth: true}}, resultText: '血月没有生气——她按下一个按钮——屏幕上出现了你的脑部扫描图——你的海马体有反复被重置留下的物理损伤痕迹。', nextNodeId: 'truth_morgue_explore' }
  ]
};

const truth_morgue_explore = {
  id: 'truth_morgue_explore', scene: 'hospital', dayMin: 4, dayMax: 4,
  title: '太平间档案',


  narrative: '血月带你来到真正的B3层——一间占地巨大的地下档案库。成千上万个黑色档案盒整齐排列——像一个巨型的墓园——每个盒子代表一个被抹去记忆的人。\n\n你走到标着"173"的架子前——打开你的档案盒——里面有每一次循环的记录——照片、笔迹样本、脑电波图——和一张发黄的纸——上面用你自己的字迹写着——"如果我看到了这份档案——说明我已在循环中失去了计数——请帮帮我。"那是你在上一次循环中自己写下的求救信。',
  choices: [
    { id: 'truth_morgue_read', text: '阅读全部档案', effects: {awareness: 7, setFlag: {read_own_archive: true}}, resultText: '你一页页翻着记录着173次循环的档案——每一次你都在靠近真相——然后在最后一步被重置。每一次你都会留下一些线索给下一次的自己。你的手在颤抖——但你的眼睛不肯离开那些纸页。', nextNodeId: 'truth_old_newspaper' },
    { id: 'truth_morgue_collect', text: '带着档案离开', effects: {awareness: 5, setFlag: {collected_own_archive: true}}, resultText: '你把档案塞进外套——173次循环记录的重量——不仅是纸张的重量——还有173次失败的重压。', nextNodeId: 'truth_old_newspaper' }
  ]
};

const truth_old_newspaper = {
  id: 'truth_old_newspaper', scene: 'school', dayMin: 5, dayMax: 5,
  title: '发黄的报纸',


  narrative: '学校的旧档案室里——你找到了另一份重要线索。一份1999年3月15日的发黄报纸——头版头条——"市长龙映宣布记忆优化计划即将启动。"照片中的龙映年轻而自信——和现在一模一样——二十七年没有变老。\n\n报纸角落有一则手写小广告——在印刷体中格外显眼——"真相不会消失——只是等待被发现。S7站台——午夜。"字迹和你在小巷涂鸦上看到的一模一样。这份报纸的日期——正是这座城市开始"正常"运转的那一天。',
  choices: [
    { id: 'truth_newspaper_collect', text: '收集所有S7标记报纸', effects: {awareness: 5, setFlag: {collected_s7_newspapers: true}}, resultText: '你在档案室翻找——找到十几份带有S7标记的报纸——时间跨度从1999年到2025年——每份上都有手写线索——像是有人在时间的长河中留下了连续的导航标记。', nextNodeId: 'truth_alley_clue' },
    { id: 'truth_newspaper_decipher', text: '解读手写线索模式', effects: {awareness: 6, setFlag: {deciphered_s7_pattern: true}}, resultText: '你把线索按时间排列——发现了一个模式——每一条都指向下一步方向——从"看公告栏"到"去医院地下室"到"狐铃知道真相"到最后一则——"你已经足够接近了——下一步去市政厅。"', nextNodeId: 'truth_alley_clue' }
  ]
};

const truth_alley_clue = {
  id: 'truth_alley_clue', scene: 'alley_night', dayMin: 5, dayMax: 5,
  title: '小巷新涂鸦',




  narrative: '你回到深夜的小巷——墙壁上的涂鸦比之前更多了。新的图案出现在之前空白的地方——不是随意的涂鸦——是一幅完整的——地图。\n\n你能看出那是市政厅的地下结构——标注着一条从未出现在官方图纸上的通道——通往一个叫"核心控制室"的地方。涂鸦的颜料在黑暗中发着微弱的蓝光——和你古镜的光芒一模一样。\n\n地图下方——有一行小字——"认知固化仪的位置——纪念日当天启动——在此之前摧毁它——否则——重置永久化。"字迹——和旧报纸上的手写线索——出自同一只手。',
  choices: [
    { id: 'truth_alley_go', text: '按地图去市政厅', effects: {awareness: 5, setFlag: {followed_alley_map: true}}, resultText: '你记下了地图的每一个细节——通道入口在市政厅西侧的下水道检查井——你需要一个撬棍和一把能在水下呼吸的东西。你的手电筒光——照在地图上时——蓝色的线条流动了起来——像活的一样。', nextNodeId: 'truth_city_hall_infil' },
    { id: 'truth_alley_record', text: '拍下地图记录', effects: {awareness: 4, setFlag: {photographed_alley_map: true}}, resultText: '你用手机拍下了涂鸦地图。照片中的地图——比你肉眼看到的——多了几条额外的通道——像是——照片能捕捉到肉眼看不到的信息。', nextNodeId: 'truth_city_hall_infil' }
  ]
};

const truth_city_hall_infil = {
  id: 'truth_city_hall_infil', scene: 'city_hall', dayMin: 6, dayMax: 6,
  title: '潜入市政厅',




  narrative: '你按照涂鸦地图的指引——从西侧下水道检查井进入了市政厅的地下管网。管道狭窄而昏暗——你的手电筒在生锈的铁管上投出长长的影子。\n\n通道尽头是一扇厚重的铁门——门上没有把手——只有一个掌纹识别器。你犹豫了一下——把手放了上去。红灯闪烁——然后变成了绿色——铁门发出了沉重的解锁声。\n\n门后——是一条铺着红色地毯的走廊——两边墙上挂着历任市长的肖像画——从第一任到现任——全部都是龙映——同一个面孔——不同的衣服和年代背景。她——在每一幅画里——都戴着那对龙角。',
  choices: [
    { id: 'truth_hall_infil_go', text: '沿着走廊深入', effects: {awareness: 6, setFlag: {proceeded_hall_infil: true}}, resultText: '你沿着走廊走到尽头——一扇双开木门前——透过门缝——你听到了龙映的声音——"第三阶段的覆盖计划提前了——那个觉醒者已经进入了B3层——必须在他看到更多之前——重置。"她在打电话——但说完后她转向了你所在的方向——微微一笑——她知道你在这里。', nextNodeId: 'truth_dragon_meet' },
    { id: 'truth_hall_infil_hide', text: '先躲起来观察', effects: {awareness: 4, setFlag: {hid_in_city_hall: true}}, resultText: '你闪进旁边的壁橱——透过百叶窗的缝隙——看到龙映的办公室里——她挂断电话后——对着空无一人的房间说了一句——"你还是不出来吗——那我等你。"', nextNodeId: 'truth_dragon_meet' }
  ]
};

const truth_dragon_meet = {
  id: 'truth_dragon_meet', scene: 'city_hall', dayMin: 6, dayMax: 6,
  title: '龙娘市长',




  narrative: '你推开门走进市长办公室——龙映靠在椅背上——双手交叠放在桌上——像是一切都在她预料之中。\n\n她的头上长着黑色的龙角——在灯光下闪着暗紫色的光——她的金色竖瞳直视着你——"你知道我为什么这么做。三百年前——在你和我的前世一起造成了境界崩溃之后——我必须找到一个方法来控制损害。"\n\n她站起来绕过办公桌走到你面前——比你高出一个头——影子在墙上投射出龙的形态——"常识覆盖不是折磨——是一种保护。你不是受害者——"她的手指点了点你的胸口——"你是创始人之一。"',
  choices: [
    { id: 'truth_dragon_deny', text: '否认拒绝接受', effects: {awareness: 6, erosion: 5, setFlag: {denied_dragon_accusation: true}}, resultText: '"不——你撒谎。"你的声音比想象中坚定。龙映露出了悲伤的笑容——"你每一次转世在记忆重置的间隙都会回到这里——都会想起一切——都会再一次认同我的选择。"她从桌上拿起一面小铜镜照向你——镜中的你穿着古代衣服——和你在神社地下看到的古代你一模一样。', nextNodeId: 'truth_police_help' },
    { id: 'truth_dragon_listen', text: '听她说完', effects: {awareness: 8, setFlag: {heard_dragon_full_story: true}}, resultText: '龙映的故事比你想象的更复杂——三百年不是和平共处——而是一场缓慢的悄无声息的灭绝——妖怪的现实正在被人类的常识一点一点覆盖掉。"所以——你需要做出选择——是让我继续这个计划——还是打破这个系统——冒着两个世界都毁灭的风险。"', nextNodeId: 'truth_police_help' }
  ]
};

const truth_police_help = {
  id: 'truth_police_help', scene: 'city_hall', dayMin: 6, dayMax: 6,
  title: '老狼的帮助',




  narrative: '你离开市长办公室时——一个穿着警服的男人在走廊里等你。他的肩上有着特殊的徽章——一只睁开的眼睛——和你在古镜上看到的图案一样。\n\n"我是雾岛警长。"他的声音低沉但友善——"这座城市里的警察有一半是理事会的走狗——但另一半——是站在真相这一边的。"他掀起制服——露出里面的金色挂坠——和你在神社里看到的金色鳞片一样。\n\n"我有你需要的资源——也有你需要的信息。跟我来。"',
  choices: [
    { id: 'truth_police_follow', text: '信任他跟他走', effects: {awareness: 5, setFlag: {followed_police_chief: true}}, resultText: '你跟着警长穿过秘密通道来到警局地下室的一间密室——墙壁上贴着城市地图——标记了所有常识覆盖基站的位置。"我们需要在纪念日当天——用城市广播系统播放你的证据——持续三十秒——让这座城市醒来。"', nextNodeId: 'truth_evidence_assemble' },
    { id: 'truth_police_cautious', text: '保持谨慎', effects: {awareness: 3, setFlag: {cautious_with_police: true}}, resultText: '警长掏出证件递给——"雾岛诚——从警二十七年。这座城市的变化——我一点一点都看在眼里。"', nextNodeId: 'truth_evidence_assemble' }
  ]
};

const truth_evidence_assemble = {
  id: 'truth_evidence_assemble', scene: 'city_hall', dayMin: 6, dayMax: 6,
  title: '整理证据',




  narrative: '你坐在警长的密室里——把收集到的所有证据摊在桌上——旧报纸、照片、档案盒、录音笔、手机里的照片——每一件都指向同一个真相——这座城市建立在被反复改写的记忆之上。\n\n警长拿出了一台老式胶片投影仪——"现代通讯方式都在理事会的监控之下——但胶片——他们管不到。"他拿出十几个胶卷盒——里面是他多年收集的证据——加上你带来的新证据——足够组成一部完整的纪录片。\n\n"明天中午十二点——城市纪念致辞时——我们会在广播中播放这些证据——持续三十秒。三十秒——足够让这座城市醒来。"',
  choices: [
    { id: 'truth_evidence_agree', text: '同意这个计划', effects: {awareness: 6, setFlag: {agreed_broadcast_plan: true}}, resultText: '"好。"警长握了握你的手——"明天中午十二点——你站在市政厅楼顶——看着这座城市——看到真相降临的那一刻。"', nextNodeId: 'truth_final_confront' },
    { id: 'truth_evidence_edit', text: '建议先争取更多支持', effects: {awareness: 4, setFlag: {modified_broadcast_plan: true}}, resultText: '"你说得对——光靠播放证据可能不够。你有人可以联络吗？神社的狐铃——便利店的史莱姆——魅魔酒吧——多一些帮手胜算更大。"', nextNodeId: 'truth_final_confront' }
  ]
};

const truth_final_confront = {
  id: 'truth_final_confront', scene: 'city_hall', dayMin: 7, dayMax: 7,
  title: '最终对决',




  narrative: '纪念日当天——你站在市政厅地下三层的发电机房门前。门后就是认知固化仪——只要摧毁它——常识覆盖就会开始瓦解。但你的口袋里还装着那份三百年前的原始协议——补充条款写着——"本协议将在签署者自愿废除时终止。"\n\n你有两个选择：用境界碎片锻造的匕首物理摧毁固化仪——或者——以创始人的身份宣告协议废除。前者快速但可能有后遗症——后者彻底但需要你在所有人面前承认自己就是三百年前的那个人。\n\n你握着匕首——另一只手里攥着古老的协议——抉择的时刻到了。',
  choices: [
    { id: 'truth_final_declare', text: '宣告协议废除', effects: {awareness: 12, erosion: -8, setFlag: {declared_treaty_void: true}}, resultText: '你把协议高高举起——"以协议的签署者——以境界的建立者和守护者——我宣布——这份协议——从此刻起——正式废除！"协议在你手中化作无数光点散入空气——建筑开始震动——常识覆盖——正在崩塌。', nextNodeId: 'truth_awakening_end' },
    { id: 'truth_final_stab', text: '用匕首摧毁固化仪', effects: {awareness: 8, erosion: 3, setFlag: {stabbed_cognifier: true}}, resultText: '你冲进机房将匕首刺入仪器核心——它发出了一声尖啸——然后停止了。碎片散落一地——你成功了——但你感到巨大的疲惫——像是你的一部分也随着那个仪器一起被摧毁了。', nextNodeId: 'truth_awakening_end' }
  ]
};

const truth_awakening_end = {
  id: 'truth_awakening_end', scene: 'city_hall', dayMin: 7, dayMax: 7,
  title: '真相觉醒',






  narrative: '一切结束了——或者说——一切开始了。你拖着疲惫的身体走出市政厅——外面的世界看起来和之前一模一样——但一切又都不一样了。\n\n天空中出现了第二个月亮——银色的——那是妖怪世界的月亮。街道上人们抬头看着天空——有些人惊恐——有些人流泪——更多的人露出了恍然大悟的表情——像刚从一场漫长的梦中醒来。\n\n小翠站在便利店门口——她没有再维持人类外形——变成了透明的发着淡蓝色光芒的史莱姆形态——看到你——用触手向你挥手。狐铃站在神社石阶上——九条尾巴全部恢复了——在空中如金色火焰般飘动。\n\n这座城市醒了——而你是那个叫醒它的人。',
  choices: [
    { id: 'awakening_end_new', text: '走向新的一天', effects: {awareness: 10, setFlag: {completed_truth_route: true}}, resultText: '你深吸一口气——空气的味道不一样了——更清新更复杂——混杂着花香和大海的气息——以及来自另一个世界的芬芳。你迈出脚步走向这个终于真实了的世界。', nextNodeId: 'true_ending' },
    { id: 'awakening_help_new', text: '帮助困惑中的人', effects: {awareness: 8, setFlag: {helped_awakening_citizens: true}}, resultText: '你走向那些在街头茫然无措的人们——他们看到你像是看到了一个锚点——你开始解释——不是全部真相——而是他们能接受的开始。', nextNodeId: 'true_ending' }
  ]
};

const truth_peace_end = {
  id: 'truth_peace_end', scene: 'town_center', dayMin: 7, dayMax: 7,
  title: '和平离开',






  narrative: '你选择了另一种方式——不摧毁固化仪——也不宣告废除协议。你选择离开。\n\n在纪念日的傍晚——你独自来到了S7站台。站台上空无一人——只有一列老旧的火车停在轨道上——车门敞开着——像是在等你。\n\n你踏上火车时——回头看了这座城市最后一眼。夕阳把建筑的轮廓镀成了金色——你能看到——在城市的上空——视线模糊处——有另一个世界的影子——和这个世界——平静地重叠着。\n\n你没有改变这座城市——但这座城市——改变了你。你坐了下来——火车缓缓启动——穿过一片金色的光芒——驶向——你真正记忆中的——那个世界。',
  choices: [
    { id: 'peace_end_leave', text: '离开这座城市', effects: {awareness: 5, setFlag: {completed_peace_route: true}}, resultText: '火车穿过光芒——当光线消散时——你看到了熟悉的景色——你真正的家。你回来了——但你口袋里的那面小铜镜——还在。它——提醒你——那些真实发生过的一切。', nextNodeId: 'normal_ending' }
  ]
};

const tsf_slime_discover = {
  id: 'tsf_slime_discover', scene: 'alley_night', dayMin: 4, dayMax: 5,
  title: '史莱姆发现',


  narrative: '夜魅带你来到酒吧地下更深处——墙壁上嵌满了发光的试管——里面装着各种颜色的液体——和你看到的TSF血清一模一样。\n\n她指向一管翠绿色的血清——"史莱姆血清——最温和的转化——你的身体会变得柔软而可变——几乎不可能被伤害——但你需要学会控制形态——不然你会变成一滩。"',
  choices: [
    { id: 'tsf_slime_discover_take', text: '拿取史莱姆血清', effects: {erosion: 3, setFlag: {discovered_slime_serum: true}}, resultText: '翠绿色的试管在你手中微微发光——你能感受到里面液体涌动着的生命力。', nextNodeId: 'tsf_slime_drink' }
  ]
};

const tsf_slime_drink = {
  id: 'tsf_slime_drink', scene: 'convenience_store', dayMin: 4, dayMax: 5,
  title: '史莱姆转化',




  narrative: '你注射了史莱姆血清——效果几乎是瞬间的。你的皮肤开始变得柔软——像是融化了一样——但没有疼痛——而是一种奇异的解放感。\n\n小翠在旁边看着——满脸担忧但更多好奇——"你真的变成史莱姆了？"她小心地碰了碰你的手——你的手指在她的触碰下延伸出一根细长的触手——然后缩了回去。\n\n小翠拿出镜子——你看到镜中的自己五官正在缓慢融化——但你可以用意念控制——你用力想象自己的脸——它重新固定了下来——但比之前更光滑——像是塑料一样。',
  choices: [
    { id: 'tsf_slime_drink_practice', text: '跟小翠学习控制', effects: {awareness: 4, affinity: {npcId: 'cui_slime', amount: 3}, setFlag: {slime_learned_control: true}}, resultText: '小翠耐心教你如何维持人形——经过一小时练习——你终于可以稳稳保持人类外形——但如果你走神——你的手就会融化。', nextNodeId: 'tsf_slime_explore' },
    { id: 'tsf_slime_drink_raw', text: '以原始形态探索', effects: {erosion: 5, awareness: 3, setFlag: {slime_explored_raw: true}}, resultText: '你放任自己变成一滩从门缝下流了出去——你能感知到空气的流动和地面的振动——以及城市地下无数管道中流动的其他史莱姆——你们共享一个微弱的集体意识。', nextNodeId: 'tsf_slime_explore' }
  ]
};

const tsf_slime_explore = {
  id: 'tsf_slime_explore', scene: 'convenience_store', dayMin: 5, dayMax: 6,
  title: '史莱姆探索',


  narrative: '你逐渐适应了作为史莱姆的存在。你发现可以通过接触读取物体的记忆——一块石头有大地亿万年的记忆——一枚硬币知道它在多少人的手中流转过。\n\n小翠的地下室那面脉动的膜——现在你理解了——它是由成千上万史莱姆融合而成的集体意识库——储存着所有被常识覆盖抹去的人的原始记忆。"那些消失的人没有死——"小翠轻声说——"他们的记忆被吸收进了这面膜里——你可以进入它和他们交流。"',
  choices: [
    { id: 'tsf_slime_explore_enter', text: '进入集体意识', effects: {awareness: 8, erosion: 5, setFlag: {slime_entered_hivemind: true}}, resultText: '你融入那面巨大的膜中——无数人的记忆涌入你的意识——"告诉我的家人我还活着""不要让他们忘记我""真相——不要让真相消失"。你退出时眼泪——或者说类似眼泪的液体——从你的脸颊滑落。', nextNodeId: 'tsf_slime_resolve' },
    { id: 'tsf_slime_explore_guard', text: '守护这个记忆库', effects: {awareness: 4, setFlag: {slime_guarded_membrane: true}}, resultText: '你将部分身体融入膜边缘成为它的一部分——这样你就能感知到任何试图接近它的人。你是最后一个守卫者——但你知道你不是孤单的。', nextNodeId: 'tsf_slime_resolve' }
  ]
};

const tsf_slime_resolve = {
  id: 'tsf_slime_resolve', scene: 'town_center', dayMin: 6, dayMax: 7,
  title: '史莱姆结局',




  narrative: '作为史莱姆——你已经掌握了全部能力。你的身体可以扩展到覆盖一间房间——也可以压缩成弹珠大小。你面临最终的选择——保持独立个体——还是融入集体的海洋。\n\n小翠以史莱姆的形态站在你身边——两团透明的发着微光的存在在黎明中并肩。"感觉怎么样？"她的声音直接在你的意识中响起。\n\n你感受着自己流动的身体和城市在你体内脉动的节奏——"感觉……自由。"',
  choices: [
    { id: 'tsf_slime_resolve_individual', text: '保持独立', effects: {awareness: 5, setFlag: {slime_kept_individuality: true}}, resultText: '你的身体凝固成稳定的人类形态——比以前更完美更光滑——但你保留了记忆个性和自由意志。你是一个独立的史莱姆——不是一个细胞。', nextNodeId: '' },
    { id: 'tsf_slime_resolve_merge', text: '融入集体', effects: {erosion: 8, awareness: 10, setFlag: {slime_merged_with_hive: true}}, resultText: '你融入那面膜中——你的意识和其他史莱姆融合在一起——你成为了一个由无数记忆构成的集体意识——你现在知道了这座城市的一切。', nextNodeId: '' }
  ]
};

const tsf_kitsune_discover = {
  id: 'tsf_kitsune_discover', scene: 'shrine', dayMin: 4, dayMax: 5,
  title: '狐妖发现',


  narrative: '狐铃带你来到神社内殿——在供奉着古镜的神龛下——她取出了一小管金色的血清。液体在试管中流动时——像是里面有星星在闪烁。\n\n"狐妖血清——选择了你。"她的声音带着一种仪式性的庄重——"狐妖的力量不在于身体而在于感知——你将能感知到人类世界中那些属于妖怪的波动。"',
  choices: [
    { id: 'tsf_kitsune_discover_take', text: '接过血清', effects: {erosion: 3, setFlag: {discovered_kitsune_serum: true}}, resultText: '金色的试管在你手中散发出温暖的光芒——你感到一股古老的智慧在呼唤你。', nextNodeId: 'tsf_kitsune_drink' }
  ]
};

const tsf_kitsune_drink = {
  id: 'tsf_kitsune_drink', scene: 'shrine', dayMin: 4, dayMax: 5,
  title: '狐妖转化',


  narrative: '你注射了狐妖血清——反应比预想温和。你的身体先是感到一阵温暖——然后你的耳朵开始移动——头顶长出了一对毛茸茸的金色狐耳。\n\n狐铃看到你的新耳朵微微愣了一下——然后忍不住笑了——"你选了狐妖。我就知道你会选这条路。"她的尾巴在身后轻轻摆动——"闭上眼睛试试——感知妖力的流动。"',
  choices: [
    { id: 'tsf_kitsune_drink_sense', text: '闭眼感知', effects: {awareness: 6, setFlag: {kitsune_learned_sense: true}}, resultText: '你闭上眼睛——起初什么都感觉不到——然后——你开始看到了——城市中有无数条金色的线在流动——那是妖力的脉络——每一条线都连接着一个妖怪。', nextNodeId: 'tsf_kitsune_explore' },
    { id: 'tsf_kitsune_drink_practical', text: '让狐铃教基础术法', effects: {awareness: 4, affinity: {npcId: 'kitsune_miko', amount: 3}, setFlag: {kitsune_learned_magic: true}}, resultText: '狐铃教你用妖力点燃狐火——一团金色的火焰在你的掌心跳动——不是热的是温暖的——"狐火不会烧伤人——只会烧伤谎言。"', nextNodeId: 'tsf_kitsune_explore' }
  ]
};

const tsf_kitsune_explore = {
  id: 'tsf_kitsune_explore', scene: 'shrine', dayMin: 5, dayMax: 6,
  title: '狐妖探索',


  narrative: '你的狐妖能力在增长——耳朵能听到很远的声音——眼睛能在黑暗中看到妖力的流动。你最强大的新能力是幻术——"狐妖的幻术不是欺骗——是揭示——你把对方内心深处最想看到的东西投射到现实中。"\n\n狐铃严肃地警告——"但过度使用会让你分不清幻象和现实。"你在古镜前练习——看着镜中的自己——你的狐耳你的金色眼睛——你已经不再是完全的人类了。',
  choices: [
    { id: 'tsf_kitsune_explore_illusion', text: '练习幻术帮助他人', effects: {awareness: 5, setFlag: {kitsune_practiced_illusion: true}}, resultText: '你在神社找了一个失去孩子的母亲——编织了一个幻象让她看到了孩子的笑容。她流泪了——但这次是喜悦的泪水。你明白了——幻术不是欺骗——是给予。', nextNodeId: 'tsf_kitsune_resolve' },
    { id: 'tsf_kitsune_explore_boundary', text: '探索境界线状态', effects: {awareness: 7, setFlag: {kitsune_sensed_boundary: true}}, resultText: '你把感知延伸到境界线上——看到了那层被常识覆盖冲击的脆弱屏障。在那些最薄弱的地方——有和你一样的金色狐妖在用自身力量加固着境界线。', nextNodeId: 'tsf_kitsune_resolve' }
  ]
};

const tsf_kitsune_resolve = {
  id: 'tsf_kitsune_resolve', scene: 'shrine', dayMin: 6, dayMax: 7,
  title: '狐妖结局',


  narrative: '你的最终转化完成了——妖力足够强大——耳朵后面长出了第二对较小的耳朵——尾巴从一条分成了三条。狐铃看着你——眼中有着骄傲怀念和一丝悲伤。\n\n"狐妖的最终形态由你的选择决定——"她告诉你——"如果你选择用妖力保护这座城市——你将成为一个守护者。如果你选择寻找更深层的真相——你将成为一个探索者。"',
  choices: [
    { id: 'tsf_kitsune_resolve_guard', text: '成为守护者', effects: {awareness: 6, setFlag: {kitsune_became_guardian: true}}, resultText: '狐铃用额头轻轻碰了碰你的额头——那是狐妖之间的最高敬意——"欢迎加入守护者的行列。"', nextNodeId: '' },
    { id: 'tsf_kitsune_resolve_seek', text: '成为探索者', effects: {awareness: 8, setFlag: {kitsune_became_seeker: true}}, resultText: '你选择深入境界线的裂缝去追寻最终的真实。狐铃握了握你的手——"无论你在另一侧看到了什么——这里永远有你的归处。"', nextNodeId: '' }
  ]
};

const tsf_vampire_discover = {
  id: 'tsf_vampire_discover', scene: 'hospital', dayMin: 4, dayMax: 5,
  title: '吸血鬼发现',


  narrative: '血月在值班室等你——她从保险柜中取出一管深红色的血清——液体在灯光下像是活的一样在脉动。\n\n"吸血鬼血清——力量最强大但代价也最重的转化。你将不再能看到阳光——你将永远渴望血液。"她的暗红色眼睛直视着你——"你确定要走上这条路吗？"',
  choices: [
    { id: 'tsf_vampire_discover_take', text: '接过血清', effects: {erosion: 4, setFlag: {discovered_vampire_serum: true}}, resultText: '深红色的试管在你手中发烫——你听到——极其微弱的——心跳声从试管中传来。', nextNodeId: 'tsf_vampire_drink' }
  ]
};

const tsf_vampire_drink = {
  id: 'tsf_vampire_drink', scene: 'hospital', dayMin: 4, dayMax: 5,
  title: '吸血鬼转化',




  narrative: '吸血鬼血清的效果迅速而剧烈——一阵冰冷的灼热从注射点扩散到全身——你的心跳慢了下来——越来越慢——然后——停了。\n\n你惊慌地摸着自己的胸口——没有心跳——但你——还活着。血月递给你一面镜子——你的皮肤变得苍白——瞳孔变成了暗红色——犬齿变得更长更尖。\n\n"欢迎加入血族。"她的声音带着仪式性的庄重。',
  choices: [
    { id: 'tsf_vampire_drink_accept', text: '接受身份', effects: {awareness: 5, setFlag: {vampire_accepted_form: true}}, resultText: '你看着镜中的自己——苍白的皮肤红色的眼睛尖锐的犬齿——你不是人类了。但你感到的不是恐惧——而是一种平静——像是你终于成为了真正的自己。', nextNodeId: 'tsf_vampire_hunt' },
    { id: 'tsf_vampire_drink_panic', text: '惊慌拒绝', effects: {erosion: 6, setFlag: {vampire_panicked: true}}, resultText: '"不——这不对——"你后退几步。血月平静地看着你——"恐慌是正常的——每个新血族都会经历。但你的身体已经变了——你要么学会控制——要么被本能吞噬。"', nextNodeId: 'tsf_vampire_hunt' }
  ]
};

const tsf_vampire_hunt = {
  id: 'tsf_vampire_hunt', scene: 'hospital', dayMin: 5, dayMax: 6,
  title: '血之渴望',




  narrative: '作为新生的吸血鬼——你需要面对最强烈的本能——对血的渴望。血月带你来到血液科——她打开储血冰箱递给你一袋血浆——"动物血配制的替代品——可以维持生命。"\n\n你接过血浆——你的喉咙发紧——犬齿自动伸长——你的身体在渴望。你撕开包装喝下第一口——温热的略带铁锈味的——但你从未尝过如此鲜活的味道。\n\n你看着自己的手——苍白修长——不再属于人类的形态。但它仍然是你的手。你选择用它做什么——是你自己的事。',
  choices: [
    { id: 'tsf_vampire_hunt_control', text: '学会控制渴望', effects: {awareness: 5, setFlag: {vampire_learned_control: true}}, resultText: '你强迫自己喝动物血——虽然身体渴望更多——但你的意志战胜了本能。血月拍了拍你的肩——"你很坚强。大部分新血族都会在第一次渴望中失控。"', nextNodeId: 'tsf_vampire_resolve' },
    { id: 'tsf_vampire_hunt_indulge', text: '跟随本能', effects: {erosion: 8, awareness: 3, setFlag: {vampire_hunted_humans: true}}, resultText: '你无法抵抗本能的召唤——深夜溜出医院找到了一个独行的人。你咬了他——只取了一点点——然后逃走了。你靠在墙上喘气——嘴角残留着血迹——感到前所未有的罪恶感。', nextNodeId: 'tsf_vampire_resolve' }
  ]
};

const tsf_vampire_resolve = {
  id: 'tsf_vampire_resolve', scene: 'hospital', dayMin: 6, dayMax: 7,
  title: '吸血鬼结局',




  narrative: '你已经掌握了吸血鬼的能力——夜间高速移动——力量是人类的数倍——感官覆盖整栋医院。血月告诉你吸血鬼的最终能力——"血之记忆"——通过饮用一个人的血液读取他的全部记忆。\n\n"这是一个强大的能力——也是一个危险的诅咒。每一次使用——都会让你离人性更远一步。"\n\n你和血月并肩坐在医院屋顶上——两个吸血鬼——注视着这座正在从常识覆盖中苏醒的城市。',
  choices: [
    { id: 'tsf_vampire_resolve_use', text: '使用血之记忆获取情报', effects: {awareness: 8, erosion: 6, setFlag: {vampire_used_blood_memory: true}}, resultText: '你找到理事会的低级官员——在深夜袭击了他——饮用了他的血。他的记忆涌入你的脑海——医院的秘密——S7站台的用途——认知固化仪的位置——你知道了龙映的真正计划。', nextNodeId: '' },
    { id: 'tsf_vampire_resolve_refrain', text: '保持人性底线', effects: {awareness: 5, erosion: -3, setFlag: {vampire_refrained_from_blood: true}}, resultText: '血月看着你的眼中有着复杂的表情——骄傲和深沉的悲伤——"你比我强。三百年前我没有你的自制力——也许你会走出一条和我不同的路。"', nextNodeId: '' }
  ]
};

const tsf_succubus_discover = {
  id: 'tsf_succubus_discover', scene: 'alley_night', dayMin: 4, dayMax: 5,
  title: '魅魔发现',


  narrative: '夜魅从吧台下取出了一管紫色的血清——液体中悬浮着细小的光点——像是夜空中被捕获的星星。\n\n"魅魔血清——最微妙也最深刻的转化。"她旋转着试管——"你将能感受到每一个人的情绪——欲望恐惧希望——像彩色的河流从他们身上流向你。我们是欲望的管理者——不是奴隶。"',
  choices: [
    { id: 'tsf_succubus_discover_take', text: '接过血清', effects: {erosion: 3, setFlag: {discovered_succubus_serum: true}}, resultText: '紫色试管在你手中散发着温暖柔和的光芒——你感到一种深邃的共鸣从心底升起。', nextNodeId: 'tsf_succubus_drink' }
  ]
};

const tsf_succubus_drink = {
  id: 'tsf_succubus_drink', scene: 'alley_night', dayMin: 4, dayMax: 5,
  title: '魅魔转化',




  narrative: '魅魔血清的效果最微妙也最深刻——你感到的不是身体变化——而是感知的转变。突然间——你能感受到周围每一个人的情绪——像是一条条彩色的河流从他们身上流向你。\n\n夜魅看着你脸上的表情变化——她知道你正在经历什么——"很震撼吧——第一次感知到所有人心里那个世界。"\n\n她给你倒了一杯深紫色的酒——"魅魔的力量不是低俗的诱惑——我们帮助人们理清自己真正想要的东西。"',
  choices: [
    { id: 'tsf_succubus_drink_learn', text: '跟夜魅学习管理', effects: {awareness: 5, affinity: {npcId: 'succubus_bartender', amount: 3}, setFlag: {succubus_learned_control: true}}, resultText: '夜魅教你如何过滤情感噪音——经过一整晚练习——当清晨来临时——你已经可以在充满情感波动的世界中保持内心平静了。', nextNodeId: 'tsf_succubus_charm' },
    { id: 'tsf_succubus_drink_explore', text: '探索城市情感地图', effects: {erosion: 5, awareness: 5, setFlag: {succubus_explored_emotions: true}}, resultText: '你走出酒吧用新感官探索城市——感受到便利店小翠的担忧——神社狐铃的坚定——医院血月的悲伤——市政厅龙映的沉重。这座城市表面平静——但情感的地下河流汹涌复杂。', nextNodeId: 'tsf_succubus_charm' }
  ]
};

const tsf_succubus_charm = {
  id: 'tsf_succubus_charm', scene: 'alley_night', dayMin: 5, dayMax: 6,
  title: '魅魔魅惑',


  narrative: '你的魅魔能力进一步觉醒——你现在不只是感知情绪——你可以影响它们。夜魅用一个简单的实验示范——她让酒吧里一个烦恼的男人在五分钟内从愁眉苦脸变成了开怀大笑——没有人注意到她做了什么。\n\n"魅魔的诱惑不是强迫——是引导——你轻轻地——把一个人内心的某种情绪放大一点点。"她抽着细长的香烟——烟雾在灯光下形成奇异形状——"你会选择放大什么样的情绪？"',
  choices: [
    { id: 'tsf_succubus_charm_kind', text: '放大希望和善意', effects: {awareness: 5, setFlag: {succubus_spread_hope: true}}, resultText: '你在商店街走了一圈——在每一个经过你的人心中种下了一颗希望的种子。有人突然抬头看天空露出了微笑——有人停下脚步帮陌生人捡起掉落的物品。你没有控制他们——你只是给了他们一个变得更好的机会。', nextNodeId: 'tsf_succubus_resolve' },
    { id: 'tsf_succubus_charm_fear', text: '对理事会植入恐惧', effects: {erosion: 6, awareness: 4, setFlag: {succubus_used_fear: true}}, resultText: '你找到了一个理事会巡逻队员——从他的恐惧入手轻轻一推——他心中的不安变成了彻底的恐慌。他丢下枪逃走了——但你感到这种力量很容易上瘾——你必须在还能控制的时候停下。', nextNodeId: 'tsf_succubus_resolve' }
  ]
};

const tsf_succubus_resolve = {
  id: 'tsf_succubus_resolve', scene: 'alley_night', dayMin: 6, dayMax: 7,
  title: '魅魔结局',


  narrative: '你的魅魔力量已经完全觉醒——你不再只是一个欲望的感知者——你成为了欲望的编织者。但夜魅警告你——"魅魔的最终形态有一个陷阱——当你太习惯于读取和影响他人的情绪时——你可能会忘记你自己的情绪是什么。你会变成一面为他人而存在的镜子——但镜子本身是空的。"\n\n"所以——在成为最好的魅魔之前——先搞清楚你自己想要什么。"',
  choices: [
    { id: 'tsf_succubus_resolve_self', text: '审视内心找到真我', effects: {awareness: 7, setFlag: {succubus_found_self: true}}, resultText: '你关闭感知静坐在酒吧角落——问自己——我真正想要的是什么？答案来自心底深处那个还在改变之前的你——"我想要——真相——和自由。"', nextNodeId: '' },
    { id: 'tsf_succubus_resolve_full', text: '拥抱全部力量', effects: {erosion: 7, awareness: 5, setFlag: {succubus_embraced_power: true}}, resultText: '你走入市政厅——你的存在本身就让理事会的成员心神不宁。你不需要威胁——你只需要存在——他们的抵抗意志就在你面前土崩瓦解。', nextNodeId: '' }
  ]
};

const tsf_nekomata_discover = {
  id: 'tsf_nekomata_discover', scene: 'alley_night', dayMin: 4, dayMax: 5,
  title: '猫又发现',


  narrative: '夜魅从柜台下拿出了一管银色的血清——比其他所有血清都更小巧——液体呈现出珍珠般的光泽。\n\n"猫又血清——最温和也最俏皮的转化。你会保留大部分人类特征——只是多了一对耳朵和尾巴——以及猫的直觉。"她摇了摇试管——"而且——你永远不用担心从高处掉下来——猫又总是四脚着地。"',
  choices: [
    { id: 'tsf_nekomata_discover_take', text: '接过血清', effects: {erosion: 2, setFlag: {discovered_nekomata_serum: true}}, resultText: '银色试管在你手中轻轻摇晃——你感到一种顽皮的能量从液体中传来——像是小猫在挠你的指尖。', nextNodeId: 'tsf_nekomata_drink' }
  ]
};

const tsf_nekomata_drink = {
  id: 'tsf_nekomata_drink', scene: 'alley_night', dayMin: 4, dayMax: 5,
  title: '猫又转化',




  narrative: '猫又血清的效果最温和也最令人愉悦——注射后你感到一阵困意——在半梦半醒中你的身体开始变化。当你醒来时——头顶多了一对黑色猫耳——尾骨处多了一条末端分叉的猫尾。\n\n你试着动了动耳朵——它们真的可以独立转动。你摇了摇尾巴——它可以表达你的情绪——在你意识到自己在想什么之前尾巴就先做出反应了。\n\n夜魅忍不住笑了——"你变成了一只猫。不是——是猫又——这座城市里最自由也最狡猾的妖怪。"',
  choices: [
    { id: 'tsf_nekomata_drink_night', text: '探索夜晚城市', effects: {awareness: 5, setFlag: {neko_explored_night_city: true}}, resultText: '你跑上屋顶——新身体轻盈敏捷——一步能跨越几米。从高处俯瞰——夜晚的城市完全不同——你能看到热量的痕迹——听到几公里外的声音——感知到那些藏身黑暗中的其他妖怪。', nextNodeId: 'tsf_nekomata_night' },
    { id: 'tsf_nekomata_drink_learn', text: '先熟悉能力', effects: {awareness: 3, setFlag: {neko_learned_basics: true}}, resultText: '你花时间适应新身体——学会控制耳朵和尾巴——用猫的感官感知世界——以及——如何发出呼噜声。当夜魅摸你的头时你不自觉地呼噜了——你耳朵发烫。', nextNodeId: 'tsf_nekomata_night' }
  ]
};

const tsf_nekomata_night = {
  id: 'tsf_nekomata_night', scene: 'town_center', dayMin: 5, dayMax: 6,
  title: '猫又之夜',




  narrative: '作为猫又——你发现可以和城市里所有猫——包括猫又——进行心灵交流。整座城市的猫科动物都是你的眼睛和耳朵。\n\n通过猫的网络——你得知了重要情报——理事会正在准备一台名为"认知固化仪"的装置——将在纪念日那天启动。\n\n信息来自便利店门口的黑猫——"他们把它藏在市政厅地下三层——你只有一次机会在它启动前摧毁它——如果你需要帮手——我们猫群会帮你。"',
  choices: [
    { id: 'tsf_nekomata_night_accept', text: '接受猫群帮助', effects: {awareness: 5, setFlag: {neko_accepted_cat_help: true}}, resultText: '黑猫点了点头——它身后黑暗中亮起了一双双绿色眼睛。几十只猫都在看着你等待你的命令——你成了猫群的首领。', nextNodeId: 'tsf_nekomata_resolve' },
    { id: 'tsf_nekomata_night_solo', text: '独自行动', effects: {awareness: 3, setFlag: {neko_declined_help: true}}, resultText: '黑猫叹了口气——"固执的人类变成了猫还是这么固执——好吧——如果你需要帮助——在屋顶叫一声——我们会来的。"', nextNodeId: 'tsf_nekomata_resolve' }
  ]
};

const tsf_nekomata_resolve = {
  id: 'tsf_nekomata_resolve', scene: 'town_center', dayMin: 6, dayMax: 7,
  title: '猫又结局',




  narrative: '作为猫又——你找到了自己独特的平衡。你在人类和妖怪之间——在严肃和顽皮之间——在独立和群体之间——找到了自己的位置。\n\n你的猫耳在风中微微抖动——你能听到城市里每一个角落的声音——孩子的笑声——老人的叹息——便利店收银机的响声——和——风中传来的——其他猫又的——呼唤。\n\n你不再是人类——但你也不完全是妖怪。你是猫又——自由的——敏捷的——和这座城市的每一个角落——都建立了连接的——存在。',
  choices: [
    { id: 'tsf_nekomata_resolve_guard', text: '以猫又形态守护城市', effects: {awareness: 5, setFlag: {nekomata_ending_complete: true}}, resultText: '你轻巧地跳上屋顶——在月光下——你的尾巴优雅地摆动。你成了这座城市的暗夜守护者——在屋檐之间穿行——注视着那些在常识覆盖下——快要被遗忘的微小真实。', nextNodeId: '' }
  ]
};

const daily_hana_help = {
  id: 'daily_hana_help', scene: 'town_center', dayMin: 4, dayMax: 5,
  title: '花店帮忙',
  narrative: '花店的女巫花音向你招手——"你来啦——我正好需要帮手。"她递给你一篮奇异的种子——颜色在阳光下从银色变幻到紫色——"这些是梦境花的种子——帮我种在城市的四个角落——神社东侧学校后院医院花坛和小巷喷泉旁——种下它们你就会看到这座城市的另一个面貌。"',
  choices: [
    { id: 'daily_hana_help_accept', text: '接受请求去种花', effects: {awareness: 3, setFlag: {helped_plant_flowers: true}}, resultText: '你花了半天时间把种子种在四个指定位置——最后一颗种子入土时——地面轻震——四棵种子生长的方向有微弱的金色光线在空中连接成了一个四边形。', nextNodeId: 'daily_hana_talk' },
    { id: 'daily_hana_help_decline', text: '婉拒', effects: {setFlag: {declined_flower_request: true}}, resultText: '花音耸肩没有勉强——但你注意到有一粒种子自己滚到地上跟在了你的脚后。', nextNodeId: 'daily_hana_talk' }
  ]
};

const daily_hana_talk = {
  id: 'daily_hana_talk', scene: 'town_center', dayMin: 4, dayMax: 5,
  title: '花店对话',


  narrative: '花音告诉你——她是这座城市里为数不多既不属于理事会也不属于任何妖怪派系的中立者。"我做花——是因为花是真实的东西——不管你给它们施加什么常识覆盖——花只会按照自己的方式生长——它们拒绝被欺骗。"\n\n她剪下一朵深蓝色玫瑰递给你——"这是在市政厅花坛采的——它本该开红色——但它开了蓝色——它在反抗。"花瓣上有细小的银色纹路——像是地面下流动力量的痕迹。',
  choices: [
    { id: 'daily_hana_talk_accept', text: '收下玫瑰做护身符', effects: {awareness: 3, setFlag: {kept_blue_rose: true}, addItem: {id: 'blue_rose', name: 'Blue Rose', nameCN: '蓝色玫瑰', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '花音送的蓝色玫瑰——花瓣上有银色纹路。', icon: 'item_key', flags: ['mysterious']}}, resultText: '蓝色玫瑰在你手中微微发光——一股温暖的力量从花瓣传入掌心。它提醒你——即使在最被控制的地方——真实依然在生长。', nextNodeId: 'daily_hana_evening' },
    { id: 'daily_hana_talk_decline', text: '婉拒', effects: {setFlag: {refused_rose: true}}, resultText: '花音把玫瑰插回花瓶——"等你想要的时候再来拿。花不会凋谢——在这个城市里花的时间是静止的。"', nextNodeId: 'daily_hana_evening' }
  ]
};

const daily_hana_evening = {
  id: 'daily_hana_evening', scene: 'town_center', dayMin: 5, dayMax: 6,
  title: '花店夜晚',




  narrative: '傍晚花音关上了花店的门——她泡了一壶花茶——茶水的颜色是淡金色的——和你在神社喝到的那壶很像。\n\n"你看到了吧——这座城市的真实。"她在你对面的椅子上坐下——烛光在她的脸上投下温暖的光影——"我不是理事会的人——也不是妖怪的盟友——我只是一个种花的——但我能告诉你一件事——"她压低声音——"那枚古镜——不只是钥匙——它也是一个囚笼的上锁装置——如果把钥匙转错方向——被锁进去的——不是理事会——是你自己。"\n\n她的眼中——有着三百年的——见证过一切的——平静。',
  choices: [
    { id: 'daily_hana_evening_thank', text: '感谢她的忠告', effects: {awareness: 4, affinity: {npcId: 'hana_witch', amount: 3}, setFlag: {thanked_hana_warning: true}}, resultText: '花音微微一笑——"你是一个愿意听劝的人——这在觉醒者中很罕见。大多数人只会一股脑冲向真相——然后被真相吞噬。"', nextNodeId: 'daily_kitsune_festival' },
    { id: 'daily_hana_evening_ask', text: '追问古镜的更多秘密', effects: {awareness: 5, setFlag: {asked_hana_about_mirror: true}}, resultText: '花音沉默了一瞬——"古镜不是一面——是有两面。一面在你这里——另一面——在龙映手中。你们两人手中的镜子——合在一起——就是境界之锁的完整钥匙。"', nextNodeId: 'daily_kitsune_festival' }
  ]
};

const daily_kitsune_festival = {
  id: 'daily_kitsune_festival', scene: 'shrine', dayMin: 5, dayMax: 6,
  title: '神社祭典',


  narrative: '神社正在准备一场祭典——不是为了神——而是为了"庆祝城市的和平"。但狐铃告诉你——祭典也有另一面——"在常识覆盖之前——每年这个时候——妖怪和人类会一起跳舞一起喝酒一起忘记彼此的隔阂。"\n\n她的金色眼睛在灯笼光芒中闪烁——"今晚我会在祭典中打开一个小小的境界裂缝——只有一瞬——但我希望你能真正看到祭典本来的样子。"',
  choices: [
    { id: 'daily_kitsune_festival_join', text: '参加祭典', effects: {awareness: 5, setFlag: {joined_real_festival: true}}, resultText: '在狐铃打开裂缝的那一瞬间——你看到了真正的祭典——人类和妖怪手牵手围成巨大圆圈在火光中跳舞——狐妖甩着尾巴吹笛——史莱姆在灯笼里发光——吸血鬼在阴影中微笑。那一刻你知道了什么是真正的和平。', nextNodeId: 'daily_kitsune_night' },
    { id: 'daily_kitsune_festival_observe', text: '在远处观察', effects: {awareness: 3, setFlag: {observed_festival: true}}, resultText: '从山坡上俯瞰——在常人眼中那是一个普通夏日祭典——但在你的眼中——灯笼光芒中能看到非人类的轮廓在人群中舞动——常识覆盖和真实在这个夜晚短暂共存。', nextNodeId: 'daily_kitsune_night' }
  ]
};

const daily_kitsune_night = {
  id: 'daily_kitsune_night', scene: 'shrine', dayMin: 5, dayMax: 6,
  title: '祭典后的独处',




  narrative: '祭典结束后——狐铃找到了你。她的脸红红的——不是因为酒——而是因为某种她不愿承认的情绪。\n\n"要不要……去后山走走？"她的尾巴不安地摆动——"今晚的月亮很漂亮。"\n\n你们并肩走在月光下的山路上——她的金色眼睛在夜色中发着温暖的光。你们在神社后山观景台停下——整座城市在脚下铺展开来灯火通明。她轻声说——"在这三百年里——你是第一个让我想带来看月亮的人。"',
  choices: [
    { id: 'daily_kitsune_night_hold', text: '握住她的手', effects: {affinity: {npcId: 'kitsune_miko', amount: 10}, setFlag: {held_kitsune_hand: true}}, resultText: '你的手指碰到她的指尖——她轻轻一颤但没有抽回。两只手慢慢握在一起——她的尾巴不由自主地缠上了你的手腕——松软温暖——像是在说不要放开。', nextNodeId: 'daily_kitsune_confess' },
    { id: 'daily_kitsune_night_friendly', text: '保持朋友距离', effects: {affinity: {npcId: 'kitsune_miko', amount: 5}, setFlag: {friendly_with_kitsune_date: true}}, resultText: '你对她笑了笑感谢分享。她似乎有些失望但很快调整了表情——"嗯——朋友也很好。"她抬头看月亮——但你的余光捕捉到她的尾巴垂下去了一点点。', nextNodeId: 'daily_kitsune_confess' }
  ]
};

const daily_kitsune_confess = {
  id: 'daily_kitsune_confess', scene: 'shrine', dayMin: 6, dayMax: 7,
  title: '狐铃的告白',




  narrative: '月光下——狐铃说出了藏了三百年的秘密。"我见过你的很多次转世——每一世我都会在人群中认出你——不是因为长相——是因为你的灵魂有一种独特的光芒。"\n\n她低头看着自己的手——"每一次我都想上前和你说话——但常识覆盖总在你完全觉醒前把你重置。我只能看着你一次又一次地忘记我。"\n\n她抬起头——金色眼睛中有泪光——"但这一次你走到了这么远——你还没有被重置。所以这一次——我想告诉你——我一直在等你——等了——三百年。"',
  choices: [
    { id: 'daily_kitsune_confess_accept', text: '接受她的感情', effects: {affinity: {npcId: 'kitsune_miko', amount: 10}, setFlag: {accepted_kitsune_confession: true}}, resultText: '你把她轻轻拥入怀中——她在你怀里颤抖——像一个终于找到归处的小动物。她的尾巴紧紧地绕着你——像是害怕你会突然消失。"这一次——"你在她耳边说——"我不会再忘记了。"', nextNodeId: '' },
    { id: 'daily_kitsune_confess_delay', text: '承诺不会忘记', effects: {affinity: {npcId: 'kitsune_miko', amount: 5}, setFlag: {deferred_kitsune_confession: true}}, resultText: '她点了点头抹去泪光——"嗯——没关系。我等你等了这么久——再等一段时间也没关系。"她努力微笑——但眼中有着坚定不移的光芒。', nextNodeId: '' }
  ]
};

const daily_vampire_shift = {
  id: 'daily_vampire_shift', scene: 'hospital', dayMin: 4, dayMax: 5,
  title: '夜班帮忙',


  narrative: '你在医院做志愿者帮忙照看正在经历记忆调整后遗症的患者。这些人被进行了常识覆盖——但身体还记得真相——有人不停地流泪不知道为什么——有人反复画着同一个符号——你公寓门上的那个。\n\n一个老年患者握着你的手——用极其清晰的声音说——"我女儿——她是一条白蛇。我很想她——但他们告诉我我没有女儿。"他的眼中充满了困惑和痛苦——你知道他说的是真的。',
  choices: [
    { id: 'daily_vampire_shift_comfort', text: '安慰他记忆是真实的', effects: {awareness: 4, setFlag: {comforted_patient: true}}, resultText: '你握着他的手轻声说——"你的女儿是一条白蛇——她爱你你也爱她——你没有记错。"老人眼泪夺眶而出——"谢谢——你是这三百年来第一个说真话的人。"他安详地闭上了眼睛——不是死了——是从记忆的牢笼中解脱了。', nextNodeId: 'daily_vampire_story' },
    { id: 'daily_vampire_shift_report', text: '记录症状报告血月', effects: {awareness: 2, setFlag: {reported_patient: true}}, resultText: '血月看着报告沉默了很久——"这种情况越来越多——常识覆盖在松动——你的到来正在改变这座城市。"', nextNodeId: 'daily_vampire_story' }
  ]
};

const daily_vampire_story = {
  id: 'daily_vampire_story', scene: 'hospital', dayMin: 5, dayMax: 6,
  title: '血月的故事',




  narrative: '夜班结束后——血月邀请你到医院天台。在城市的灯火之上——她露出了难得的放松的表情。\n\n"你知道吸血鬼为什么选择住在医院吗？"她点燃了一支细长的烟——"因为医院是生与死的交界处——我们吸血鬼既不属于生者也不属于死者——我们在边界上看着两边。"\n\n她从口袋里拿出一瓶深红色液体——不是血是红酒——"三百年前我是这家医院的创始人之一——那时候它还是一个草药铺子。我来这里——是为了救我的妹妹——我没能救她——但把她变成了我能做到的最好的样子。"',
  choices: [
    { id: 'daily_vampire_story_share', text: '分享你的故事', effects: {affinity: {npcId: 'vampire_doctor', amount: 5}, setFlag: {shared_story_with_vampire: true}}, resultText: '你告诉了她你的经历——陌生房间——铜镜——来自未来的信。血月静静听着——"你知道吗——我和你一样——我们都在寻找一个属于我们的地方。"', nextNodeId: 'daily_vampire_trust' },
    { id: 'daily_vampire_story_ask', text: '追问理事会秘密', effects: {awareness: 4, setFlag: {asked_vampire_secrets: true}}, resultText: '血月表情变得复杂——"理事会的秘密就像洋葱——剥开一层还有一层。但龙映不是真正的领导者——真正的决策者是一群你从未见过的人。"', nextNodeId: 'daily_vampire_trust' }
  ]
};

const daily_vampire_trust = {
  id: 'daily_vampire_trust', scene: 'hospital', dayMin: 6, dayMax: 7,
  title: '血月的信任',


  narrative: '血月带你来到医院档案室最深处——她按下一块砖——墙壁无声滑开露出一条暗道。通道尽头是一间令人震惊的房间——四面墙上挂满了肖像画——每一幅都是同一个你——不同时代的你——穿着不同的衣服站在不同的背景前。\n\n"每一世——我都会偷偷给你画一幅像。"她的声音有些沙哑——"不是为了任何特殊的情感——是为了证明你真的存在——在常识覆盖不断抹去你的痕迹时——我用画笔把你留在世界上。"',
  choices: [
    { id: 'daily_vampire_trust_thanks', text: '感谢她', effects: {affinity: {npcId: 'vampire_doctor', amount: 5}, setFlag: {thanked_vampire_for_portraits: true}}, resultText: '你看着那些画——每一幅中的你都有不同的眼神——但都带着同样倔强的光芒。"谢谢你让我知道自己不是第一次在这里。"血月轻轻笑了——"不客气——为一个灵魂画三百年的肖像——是我不后悔的事。"', nextNodeId: '' },
    { id: 'daily_vampire_trust_ask', text: '问她关于狐铃', effects: {awareness: 3, setFlag: {asked_vampire_about_kitsune: true}}, resultText: '血月微微一愣——露出了复杂的微笑——"她啊——是的——我们认识很久了。我们都在用自己的方式守护着你的轮回——她在山上——我在这里——分工合作。"', nextNodeId: '' }
  ]
};

const daily_cui_help = {
  id: 'daily_cui_help', scene: 'convenience_store', dayMin: 4, dayMax: 5,
  title: '帮小翠的忙',




  narrative: '你在便利店帮忙——小翠今天看起来有些心神不宁。她在整理货架时不断看向窗外——像是在等什么人——又像是在躲什么人。\n\n"你感觉到了吗？"她压低声音——"今天的城市——有什么不一样。"她所说的"不一样"——是你也感觉到了的——空气中有一种微弱的——颤动的——像是绷紧的琴弦——随时会断掉的感觉。\n\n这时——一个穿黑色制服的人走进了店里——没有看任何商品——径直走向了收银台。他的制服领口——有那只睁开的眼睛徽章。',
  choices: [
    { id: 'daily_cui_help_protect', text: '挡在小翠前面', effects: {awareness: 3, affinity: {npcId: 'cui_slime', amount: 3}, setFlag: {protected_cui_from_agent: true}}, resultText: '你站到了小翠面前——那个制服男人看了你一眼——他的视线在你脸上停留了几秒——然后转身离开了。小翠在你身后松了一口气——她轻轻拉了一下你的衣角——"谢谢——你是第一个——在这里保护我的人。"', nextNodeId: 'daily_cui_secret' },
    { id: 'daily_cui_help_observe', text: '在旁观察局势', effects: {awareness: 2, setFlag: {observed_agent_visit: true}}, resultText: '你保持沉默观察——那个男人在收银台前停了几秒——和小翠交换了一个你无法解读的眼神——然后离开了。他走后小翠的肩膀明显放松了——但她没有解释什么。', nextNodeId: 'daily_cui_secret' }
  ]
};

const daily_cui_secret = {
  id: 'daily_cui_secret', scene: 'convenience_store', dayMin: 5, dayMax: 6,
  title: '小翠的秘密',




  narrative: '小翠关上了便利店的门挂上"休息中"的牌子——她带你走下通往地下室的那段楼梯。但这次——她没有停在地下室——而是推开了一个你之前从未注意到的暗门。\n\n暗门后是一间小房间——墙壁上贴满了照片和剪报——全都是关于"失踪人口"的报道。"这些人——"小翠的声音很轻——"都是消失了但没有被重置的人——他们没有被吸收进常识覆盖——他们是——真正地——从这座城市里——被抹除了。"\n\n她的手指划过一张照片——"这是我的姐姐——她也是史莱姆——她在我之前——在这家便利店工作。有一天——她突然就不见了。店长说——她被调走了。但我知道——她不是被调走了。"小翠的眼泪滴落在地上——在水泥地面上留下了小小的——腐蚀的痕迹。',
  choices: [
    { id: 'daily_cui_secret_hug', text: '拥抱安慰她', effects: {affinity: {npcId: 'cui_slime', amount: 5}, setFlag: {comforted_cui_about_sister: true}}, resultText: '你轻轻抱住了小翠——她的身体柔软而温暖——她靠在你肩上哭了很久。她的眼泪在地板上留下了小小的痕迹——但你在那一刻——不觉得那是腐蚀——而是一种——悲伤的证明。', nextNodeId: '' },
    { id: 'daily_cui_secret_promise', text: '承诺帮她找姐姐', effects: {affinity: {npcId: 'cui_slime', amount: 5}, setFlag: {promised_to_find_sister: true}}, resultText: '"我向你保证——如果我能找到任何关于你姐姐的线索——我一定会告诉你。"小翠抬起头——眼中含着泪光——"你……你是认真的吗？从来没有人——对我说过这种话。"', nextNodeId: '' }
  ]
};




// ═══════════════════════════════════════════════════════════════════════════
// 新增：附身深化线（15个节点） — 附身后的深化剧情
// ═══════════════════════════════════════════════════════════════════════════

const possessed_kitsune_deep = {
  id: 'possessed_kitsune_deep',
  scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '神社的幽深之处',
  narrative: '作为狐铃，你穿过神社主殿后方的隐蔽通道。通道两侧的墙壁上镶嵌着发光的矿石——它们散发出淡蓝色的微光，将你的狐耳轮廓投映在墙上。越往里走，空气中妖气的浓度越高——你能感觉到它在你的新身体中共鸣。\n\n通道尽头是一扇巨大的石门，上面雕刻着九尾狐的图腾。石门缝隙中透出金色的光芒——那后面是神社真正的核心：一座古老的封印祭坛。狐铃的记忆告诉你，这座祭坛封印着初代九尾妖狐的一部分魂魄。',
  conditions: { hasFlag: 'possessed_kitsune' },
  choices: [
    { id: 'pk_deep_enter', text: '推开石门进入祭坛', effects: { awareness: 8, erosion: 6, setFlag: { entered_kitsune_altar: true } }, resultText: '石门在低沉的轰鸣声中缓缓打开。祭坛中央悬浮着一颗金色的珠子——那是九尾妖狐的内丹。你一靠近，内丹就开始发光，你的身体不由自主地被它吸引。狐铃的意识在你脑海中低语：「别碰它——那是一切的开始。」', nextNodeId: 'possessed_kitsune_memory' },
    { id: 'pk_deep_retreat', text: '退出通道——这里太过危险', effects: { awareness: 3, setFlag: { retreated_from_altar: true } }, resultText: '你后退几步，金色的光芒渐渐减弱。但你感到狐铃的内心深处松了一口气——也有一丝失望。她知道你还不够信任她。', nextNodeId: '' },
    { id: 'pk_deep_call', text: '尝试呼唤狐铃的意识对话', effects: { awareness: 5, setFlag: { talked_to_kitsune_inside: true } }, resultText: '你闭上眼睛，在心中呼唤狐铃。她的意识浮现了——不是作为记忆碎片，而是作为一个完整的灵魂。她的声音很轻：「你能听到我……太好了。我一直想告诉你——关于这座神社的真正故事。」', nextNodeId: 'possessed_kitsune_memory' },
  ]
};

const possessed_kitsune_memory = {
  id: 'possessed_kitsune_memory',
  scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '狐铃的记忆深处',
  narrative: '内丹的光芒包裹了你。你被拉入了狐铃的记忆之海——不是碎片式的浮光掠影，而是连贯的、完整的一生。你看到她还是幼狐时在山间嬉戏的场景——那时的她还不知道人类的存在。你看到她在江户时代第一次化为人形——她学着用双脚走路，笨拙而可爱。\n\n但你看到了更深的东西——她三百年前曾与一个人类相爱。那个人类和你长得一模一样。那是你的前世。她的职责不仅是守护裂缝——她更是在等你回来。',
  stateConditions: { requiredFlags: { entered_kitsune_altar: true } },
  choices: [
    { id: 'pkm_embrace', text: '拥抱这段记忆——承认你们之间的联系', effects: { awareness: 8, erosion: 4, affinity: { npcId: 'kitsune', amount: 10 }, setFlag: { accepted_kitsune_memories: true } }, resultText: '你接纳了她的记忆——包括她对你的前世的爱情。你能感受到她三百年来的孤独和等待。她身体中属于她的意识轻轻颤抖——她没想到你会接受这一切。', nextNodeId: 'possessed_kitsune_choice' },
    { id: 'pkm_detach', text: '保持距离——这些是她的记忆，不是你的', effects: { awareness: 5, erosion: 2, setFlag: { rejected_kitsune_memories: true } }, resultText: '你试图把自己从记忆中抽离。但狐铃的意识拉住了你——「请至少听完。我等你等了三个世纪——不是要你爱我。只是要你知道——你从来不是一个人在这座城市里战斗。」', nextNodeId: 'possessed_kitsune_choice' },
  ]
};

const possessed_kitsune_choice = {
  id: 'possessed_kitsune_choice',
  scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '永恒的抉择',
  narrative: '狐铃的意识静静地站在你的灵魂面前。她现在的形态是一只巨大的金色九尾狐——不再是那个娇小的人类女孩形象。她的声音在你的脑海中回响：「你已经看到了我的一切。现在——你有选择。」\n\n她告诉你，如果你愿意，你可以永远留在她的身体里。你们可以共享这一具身体——两个灵魂共存。她的力量将成为你的力量——但你将永远无法回到自己原来的身体。另一种选择是离开——回到你自己的躯壳，继续作为一个独立的人类活着。但这座城市需要她，她不能跟你走。',
  stateConditions: { requiredFlags: { accepted_kitsune_memories: true } },
  choices: [
    { id: 'pkc_stay', text: '永远留在狐铃体内——两个灵魂共存', effects: { erosion: 15, awareness: 10, setFlag: { stayed_in_kitsune: true, player_species: 'kitsune' } }, resultText: '你做出了选择。你的灵魂融入狐铃的身体——两团意识缓缓融合。你感受到了前所未有的完整——她的力量、她的记忆、她的爱——一切都成为了你的一部分。你睁开眼——世界在你的狐瞳中变得清晰。你低声说：「我回来了。」狐铃的声音也在你的心中回应：「欢迎回来。」', nextNodeId: '' },
    { id: 'pkc_leave', text: '离开她的身体——但承诺会回来帮她', effects: { awareness: 8, erosion: -3, setFlag: { promised_kitsune_return: true } }, resultText: '你轻轻退出她的身体。回到自己躯壳的那一刻——你感到一阵空虚。但你看到狐铃站在那里，眼中含着泪光——她在微笑。「谢谢你。三百年的等待——至少这一次——我说出了想说的话。」', nextNodeId: '' },
  ]
};

const possessed_slime_basement = {
  id: 'possessed_slime_basement',
  scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '史莱姆的地下视角',
  narrative: '你让小翠的身体液化——从门缝渗透进便利店的地下室。作为史莱姆的你，对空间的感知完全不同——你能感受到每一个角落的湿度、温度、以及空气中飘浮的微粒。\n\n地下室的真正入口隐藏在货架后面的一堵假墙里。穿过去后——你发现这里不是一个房间，而是一条向下的隧道。隧道壁上覆盖着半透明的黏液——和你身体的成分相同。这是小翠多年来反复经过留下的痕迹。隧道通向——一个地下洞穴。\n\n洞穴中央有一个巨大的水池——池中的液体是淡蓝色的，散发着微光。这不是水——是浓缩的史莱姆原浆。',
  conditions: { hasFlag: 'possessed_slime' },
  choices: [
    { id: 'psb_dive', text: '跳入史莱姆原浆池', effects: { awareness: 8, erosion: 8, setFlag: { dove_into_slime_pool: true } }, resultText: '你跃入池中——池水没有溅起水花。你的身体和池水融合——你感受到周围无数史莱姆的意识在微弱地振动。这个池子是史莱姆们的「集体意识池」——所有在这座城市里的史莱姆都通过它连接。你听到了它们的声音——像无数细小的铃铛在风中碰撞。', nextNodeId: 'possessed_slime_customers' },
    { id: 'psb_inspect', text: '仔细检查洞穴的墙壁', effects: { awareness: 5, setFlag: { inspected_slime_cave_walls: true } }, resultText: '墙壁上有奇怪的刻痕——不是文字，更像是某种地图。你认出了一些标记——神社的位置、医院、市政厅——还有一条线连接了所有这些地点。这条线——是用血画上去的。', nextNodeId: 'possessed_slime_customers' },
  ]
};

const possessed_slime_customers = {
  id: 'possessed_slime_customers',
  scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '史莱姆的通感',
  narrative: '当你的意识与史莱姆原浆池连接后，你获得了新的能力——你可以通过便利店地板上的微小黏液残留物，感知到曾经踏进店里的每一个人的情绪和真实想法。\n\n你闭上眼——一个个影像浮现：一个常客，表面上微笑着买烟——却在想今天晚上该怎么面对酗酒的丈夫。一个学生，买了便当——心里却在盘算怎么报复欺负他的同学。一个西装革履的男人——脑子里全是昨晚做的噩梦——梦中他变成了一只章鱼。\n\n等等——梦到变成章鱼？那不是普通的梦。那个男人的意识中夹杂着不属于人类的东西——他的思维边缘有妖气的残留。',
  stateConditions: { requiredFlags: { dove_into_slime_pool: true } },
  choices: [
    { id: 'psc_follow_man', text: '锁定那个有妖气的男人——跟踪他', effects: { awareness: 8, erosion: 5, setFlag: { tracked_contaminated_customer: true } }, resultText: '你在记忆中锁定了他——他是便利店的老主顾，每天早上七点来买咖啡。他的妖气残留很淡——但确实存在。说明他和某个妖怪有过亲密接触——可能是他的家人或伴侣。', nextNodeId: '' },
    { id: 'psc_read_all', text: '尝试读取所有顾客的记忆——筛选关键信息', effects: { awareness: 10, erosion: 6, setFlag: { scanned_all_customers: true } }, resultText: '大量记忆涌入你的意识——你看到了这座城市的真实面貌。大部分居民都在常识覆盖的影响下过着平凡的生活——但有十几个人，他们的意识中有「裂缝」。他们时不时地看到不该看到的东西。他们以为自己疯了。', nextNodeId: 'possessed_slime_transform' },
    { id: 'psc_disconnect', text: '断开连接——这股信息太庞大了', effects: { erosion: 3, setFlag: { disconnected_from_slime_pool: true } }, resultText: '你猛地断开连接。大脑一阵眩晕——信息过载让你的史莱姆身体震荡了几下。但你已经知道了——这座城市里有很多「觉醒者」。他们只是还不知道自己觉醒了。', nextNodeId: '' },
  ]
};

const possessed_slime_transform = {
  id: 'possessed_slime_transform',
  scene: 'home_bedroom', dayMin: 3, dayMax: 7,
  title: '永恒史莱姆',
  narrative: '你站在镜子前——看着小翠的脸。但你知道这只是暂时的容器。你感受到史莱姆原浆池的召唤——它在你体内低语。你可以选择——彻底放弃人类的形态，将自己的存在完全转化为史莱姆。\n\n小翠的意识在颤抖——她害怕。她怕你夺走她的身体，也怕你离开她。她的声音从你内心深处传来：「如果你真的想……我可以把身体完全交给你。我反正……没什么值得留恋的。」\n\n但她说谎了。你从共享的记忆中看到她心底的愿望——她一直想成为一个真正的人类女孩。',
  stateConditions: { requiredFlags: { dove_into_slime_pool: true } },
  choices: [
    { id: 'pst_become_slime', text: '接受史莱姆的形态——永远留在这具身体里', effects: { erosion: 15, awareness: 6, setFlag: { became_permanent_slime: true, player_species: 'slime' } }, resultText: '你放弃了自己的人类身体——意识完全转移到了小翠的躯壳中。你的身体熔化成蓝色的半透明凝胶——然后重新塑形。你不再是原来的你——你是小翠。或者说——你既是小翠，也是你自己。两个灵魂融合成了一体。', nextNodeId: '' },
    { id: 'pst_reassure', text: '安慰小翠——你不会夺走她的一切', effects: { awareness: 6, erosion: -3, affinity: { npcId: 'xiaocui', amount: 10 }, setFlag: { reassured_xiaocui: true } }, resultText: '你轻轻握住自己的手——小翠的手。「我不会夺走你的身体。你是你——我是我。但我保证——我会帮你实现你的愿望。」她愣了一下——然后你感到她的意识紧紧抱住了你。', nextNodeId: '' },
  ]
};

const possessed_vampire_coven = {
  id: 'possessed_vampire_coven',
  scene: 'hospital', dayMin: 2, dayMax: 7,
  title: '吸血鬼议会',
  narrative: '血月收到了来自吸血鬼议会的紧急召集令。你控制她的身体前往集会地点——位于医院地下第三层的隐秘会议室。会议室的墙壁由黑色的岩石砌成，天花板上悬挂着巨大的水晶吊灯——但灯光不是电，而是萤火虫般的微光生物。\n\n长桌两侧坐着七个吸血鬼。他们的目光落在你身上——不是看血月，而是看「你」。他们知道你在这具身体里。一个年老的女吸血鬼开口——她的声音像砂纸摩擦：「入侵者。我们一直在等你。你知道血月是谁吗？你知道——她在议会中的位置——是什么吗？」\n\n她停顿了一下：「她是我们的检察官。负责审判违背血族律条的成员。而现在，你——一个人类——占据了她的身体。这是死罪。」',
  conditions: { hasFlag: 'possessed_vampire' },
  choices: [
    { id: 'pvc_defend', text: '用血月的身份为自己辩解——你是在帮她', effects: { awareness: 6, erosion: 4, setFlag: { defended_in_coven: true } }, resultText: '你挺直脊背——血月的身体自然而然地散发出检察官的威严。你告诉他们你来这里是为了揭露常识覆盖的真相——而血月是自愿让你进来的。年长的女吸血鬼眯起眼睛：「有趣。你确实有她的气势。那么——让我们看看你有没有她的能力。」', nextNodeId: 'possessed_vampire_hunt' },
    { id: 'pvc_attack', text: '先发制人——展示力量威慑议会', effects: { erosion: 10, awareness: 4, setFlag: { intimidated_coven: true } }, resultText: '你激发血月的吸血鬼之力——血红色的能量从你体内爆发。水晶吊灯剧烈摇晃。几个年轻的吸血鬼后退了一步。但年长的女吸血鬼只是微笑——「很好。你有资格参加今晚的狩猎。」', nextNodeId: 'possessed_vampire_hunt' },
  ]
};

const possessed_vampire_hunt = {
  id: 'possessed_vampire_hunt',
  scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '血族狩猎',
  narrative: '午夜时分，你跟随议会成员来到了城市边缘的废弃工业区。狩猎开始了——但猎物不是人类，而是从常识覆盖裂缝中逃逸出来的「异常生物」。一只融合了人类记忆碎片的畸变体——它看起来像是一个由十几个人的肢体拼接而成的怪物。\n\n议会的年轻吸血鬼们兴奋地扑上去——他们把这当作游戏。但你看到那只怪物眼中的痛苦——它不是恶意的产物。它是常识覆盖故障的受害者。它曾是人类记忆的一部分——被剥离后扭曲成了这个样子。\n\n你在血月的记忆中找到了相关知识：这些畸变体是可以被「净化」的——而不是被消灭。',
  stateConditions: { requiredFlags: { defended_in_coven: true } },
  choices: [
    { id: 'pvh_cleanse', text: '尝试净化畸变体——而不是杀死它', effects: { awareness: 10, erosion: 5, setFlag: { cleansed_abomination: true } }, resultText: '你走向怪物——无视议会的警告。你伸出手——血月的吸血鬼能量化作柔和的光芒包裹了畸变体。它扭曲的肢体开始消融——不是被消灭——而是被分离。十几个人形光影从怪物身体中飘出——那是被囚禁的记忆碎片。它们升上夜空——回归了它们应去的地方。议会沉默了。', nextNodeId: 'possessed_vampire_eternity' },
    { id: 'pvh_kill', text: '参与狩猎——用暴力的方式解决问题', effects: { erosion: 8, setFlag: { joined_vampire_hunt: true } }, resultText: '你加入了狩猎。血月的身体本能地知道如何战斗——你的速度快到看不清。你在三秒内撕裂了怪物的核心——它的身体化为一滩黑色的液体消失了。议会成员向你投来赞赏的目光——但你低下头，看到那滩液体在月光下微微冒着气泡。那是……眼泪的形状。', nextNodeId: 'possessed_vampire_eternity' },
    { id: 'pvh_refuse', text: '拒绝参与——质疑议会的残忍', effects: { awareness: 8, erosion: 2, setFlag: { refused_vampire_hunt: true } }, resultText: '你放下武器——不，血月没有武器，她的武器就是她自己。你站在原地不动。「我来这里不是为了杀戮。」年长的女吸血鬼看着你——然后笑了。「你果然和她一样。血月当年也说过同样的话。三百年了——她还没变。」', nextNodeId: 'possessed_vampire_eternity' },
  ]
};

const possessed_vampire_eternity = {
  id: 'possessed_vampire_eternity',
  scene: 'alley_night', dayMin: 3, dayMax: 7,
  title: '永生的邀约',
  narrative: '狩猎结束后，年长的女吸血鬼单独留下了你。她带你到工业区的一座高塔顶端——从这里可以看到整座城市。在吸血鬼的夜视眼中，城市像一幅由红色和蓝色的光线编织的网。\n\n「你已经证明了自己。」她转过身看着你——月光照在她苍老的脸上。「血月的身体里住着一个有趣的灵魂。我想给你一个选择——你可以真正成为我们中的一员。」\n\n她递给你一个水晶小瓶——里面盛着深红色的液体。不是血——是吸血鬼的「原初精华」。喝下它——即使离开血月的身体——你也会成为真正的吸血鬼。你的身体将永不衰老。代价是——你将永远渴望血液。\n\n「你不必现在决定。但天亮前——我会在这里等你。」',
  stateConditions: { requiredFlags: { defended_in_coven: true } },
  choices: [
    { id: 'pve_accept', text: '喝下原初精华——接受永生', effects: { erosion: 15, awareness: 8, setFlag: { accepted_vampire_eternity: true, player_species: 'vampire' } }, resultText: '你打开瓶盖一饮而尽。液体冰冷却甜美——像是把整个冬天的味道都浓缩在了一口之中。你的心脏——血月的心脏——停跳了。然后重新开始——以新的节奏。你感到自己的牙齿变得尖锐——你对月亮的感知变得前所未有的清晰。你成为了一个真正的吸血鬼。', nextNodeId: '' },
    { id: 'pve_decline', text: '拒绝——你不想失去人类的身份', effects: { awareness: 8, erosion: -3, setFlag: { refused_vampire_eternity: true } }, resultText: '你把瓶子还给她。「我很感激。但我想用自己的方式活着——或死去。」她没有生气——反而露出了欣慰的表情。「你是第一个拒绝我的人。血月选择了你——果然没有错。」', nextNodeId: '' },
  ]
};

const possessed_succubus_bar = {
  id: 'possessed_succubus_bar',
  scene: 'bar', dayMin: 2, dayMax: 7,
  title: '魅魔的管理之夜',
  narrative: '夜魅把酒吧完全交给你管理一晚。你穿着她的衣服站在吧台后面——黑色的蕾丝连衣裙勾勒出魅魔身体的曲线。你的翅膀从背后舒展开来——薄如蝉翼的黑色翼膜，边缘泛着紫色的微光。\n\n酒吧里的客人形形色色——有人类，有妖怪，还有一些你分辨不出是什么的存在。他们都用期待的眼神看着你。今晚是「满月之夜」——魅魔酒吧每周一次的特别活动。作为代理店主——你需要为客人「提供服务」。不是普通的酒水服务——而是情感能量的交换。\n\n一个看起来疲惫不堪的中年男人坐在吧台前。他的情绪能量是灰暗的——充满了厌倦和绝望。他需要一些……慰藉。',
  conditions: { hasFlag: 'possessed_succubus' },
  choices: [
    { id: 'psb_serve_kind', text: '温柔地倾听他的烦恼——用魅魔的力量安抚他', effects: { awareness: 6, erosion: 4, setFlag: { kindly_served_customer: true } }, resultText: '你给他倒了一杯酒——不是普通的酒，而是你用自己的情绪能量调制的微光液体。他喝了一口——眼泪流了下来。他开始倾诉——他的妻子离开了他，他失去了工作。你轻轻地触碰他的额头——你吸收了他的绝望，同时给了他一丝温暖的希望。他离开时——脸上带着久违的微笑。', nextNodeId: 'possessed_succubus_power' },
    { id: 'psb_serve_harsh', text: '用强硬的方式赶走他——魅魔的酒吧不接待弱者', effects: { erosion: 8, setFlag: { harshly_served_customer: true } }, resultText: '你打了个响指——男人的椅子向后滑出三米。他惊恐地看着你。「今晚是满月之夜——没时间照顾你这种弱小的情绪。」他的脸色从惊恐变成了愤怒——但你的魅魔气场让他不敢发作。他灰溜溜地走了。其他客人看着你——有些在害怕，有些在兴奋。', nextNodeId: 'possessed_succubus_power' },
    { id: 'psb_observe', text: '先观察——看看夜魅平时是怎么处理的', effects: { awareness: 4, setFlag: { observed_succubus_bar: true } }, resultText: '你靠在吧台上观察。夜魅的记忆碎片浮现——她用魅魔的方式管理这家酒吧已经一百多年了。她不是靠力量统治这里——而是靠平衡。给每个客人他们需要的——不多不少。这样才能维持酒吧的稳定。', nextNodeId: 'possessed_succubus_power' },
  ]
};

const possessed_succubus_power = {
  id: 'possessed_succubus_power',
  scene: 'bar', dayMin: 2, dayMax: 7,
  title: '魅魔的影响力',
  narrative: '午夜过后，酒吧的气氛变得更加暧昧。你能感受到每个客人的欲望——像彩色的烟雾在空气中飘荡。你发现你可以影响这些欲望——可以放大它们，也可以抑制它们。\n\n一个穿着西装的妖怪走向你——他是城市议会的成员。他看你的眼神不只是欣赏——还有试探。他想试探你这个「新任代理店主」的深浅。他的欲望不是性——而是权力。他想知道你是否可以成为他的棋子。\n\n夜魅的记忆告诉你——这个人很危险。他每周都来，每次都在试探边界。他不是普通的客人——他是「规则」的一部分。',
  stateConditions: { requiredFlags: { kindly_served_customer: true } },
  choices: [
    { id: 'psp_charm', text: '用魅惑能力反制他——让他成为你的棋子', effects: { awareness: 6, erosion: 8, setFlag: { charmed_council_member: true } }, resultText: '你对他露出魅魔的微笑——你的瞳孔变成了紫色。他的眼神一瞬间变得涣散。你把一句话植入他的潜意识：「你会支持我们做的任何决定。」他眨了眨眼——恢复了正常。但他看你的眼神已经不同了——带着一丝无法理解的迷恋。他点点头——退回了自己的座位。', nextNodeId: 'possessed_succubus_cost' },
    { id: 'psp_confront', text: '直接揭穿他的意图——在所有人面前让他难堪', effects: { awareness: 5, erosion: 5, setFlag: { confronted_council_member: true } }, resultText: '你提高声音——让所有人都能听到：「议员先生——您今晚是有公务要和我说吗？还是说——您想在满月之夜聊点……私事？」周围的客人看向他。他的脸色变了——但他保持了微笑。「不——我只是来享受服务的。你做得很好。」他转身离开——但你看到他握紧了拳头。', nextNodeId: 'possessed_succubus_cost' },
  ]
};

const possessed_succubus_cost = {
  id: 'possessed_succubus_cost',
  scene: 'bar', dayMin: 3, dayMax: 7,
  title: '魅魔的代价',
  narrative: '天快亮了。酒吧的客人陆续散去。你独自坐在吧台后面——感到一阵从未有过的疲惫。不是身体的疲惫——魅魔的身体充满活力。是灵魂的疲惫。\n\n你低头看自己的手——皮肤比昨晚暗淡了一些。你的翅膀边缘开始卷曲——像烧焦的纸。魅魔的力量不是免费的——每一次使用都在消耗你的「存在」。夜魅之所以能活几百年——是因为她从不滥用力量。每一次情感交换——你的一部分被带走了。\n\n夜魅在黎明前回到了酒吧。她看着你的样子——轻轻叹了口气：「第一次过度使用的感觉？很难受对吧。你的脸——比昨天老了五岁。」\n\n你走到镜子前——她说得对。你的眼角有了细微的皱纹。你的眼神——失去了少年人的清澈。',
  stateConditions: { requiredFlags: { kindly_served_customer: true } },
  choices: [
    { id: 'psc_rest', text: '接受代价——休息一段时间恢复', effects: { awareness: 6, erosion: 3, setFlag: { accepted_succubus_cost: true } }, resultText: '你点点头——承认自己做得太过火了。夜魅拍了拍你的肩膀——「第一次都会有这个阶段。学会控制——是魅魔成长的第一步。」她给了你一杯特制的茶——喝下后，你感到灵魂的疲惫减轻了一些。', nextNodeId: '' },
    { id: 'psc_indulge', text: '不管代价——力量才是最重要的', effects: { erosion: 12, setFlag: { indulged_succubus_power: true } }, resultText: '你甩开夜魅的手——「我不在乎。力量就是力量。」夜魅的眼神冷了下来。「那么——你会死得很年轻。魅魔的结局只有一个——因为过度消耗而消散。我不想看到你变成那样。」', nextNodeId: '' },
    { id: 'psc_leave_body', text: '离开夜魅的身体——回到自己', effects: { awareness: 5, setFlag: { left_succubus_body: true } }, resultText: '你从夜魅的身体中退出。回到自己躯壳的瞬间——你摸了摸自己的脸。没有皱纹。你还是你。但你的灵魂深处——留存着那一夜的记忆。你知道那种力量的味道了。你也知道它的代价了。', nextNodeId: '' },
  ]
};

const possessed_dragon_authority = {
  id: 'possessed_dragon_authority',
  scene: 'city_hall', dayMin: 3, dayMax: 7,
  title: '龙娘的权力',
  narrative: '作为龙映，你坐在市政厅顶层的办公室里。宽大的皮革座椅被你的龙尾环绕——窗外可以俯瞰整座城市。你的金色龙瞳中映出每一栋建筑、每一条街道的真实面貌。\n\n龙映的记忆在你脑海中展开——你看到了她作为城市实际统治者的日常。她不需要发布命令——她的存在本身就是命令。每天都有打扮成人类的妖怪来向她汇报——某条街道的常识覆盖出现了裂缝，某个公务员的记忆需要修正，某个外来者需要被「处理」。\n\n办公桌上放着一份文件——《城市异常报告·本周摘要》。你翻开它——第一页上写着你的名字。\n\n「目标：身份不明——记忆移植后的实验体。现任常识覆盖核心的潜在候选者。」\n\n附着一张你的照片。',
  conditions: { hasFlag: 'possessed_dragon' },
  choices: [
    { id: 'pda_read_report', text: '仔细阅读关于自己的那份报告', effects: { awareness: 10, erosion: 5, setFlag: { read_own_report: true } }, resultText: '报告很详细——记录了你的编号、植入的记忆类型、以及预期的行为模式。上面写着你的「保质期」——当常识覆盖核心需要更换时——你就会成为候选人。下面有一行小字——是龙映的手写批注：「这个不行。放他/她走。」', nextNodeId: 'possessed_dragon_truth' },
    { id: 'pda_rule_city', text: '体验一下统治者的权力——下达几个命令', effects: { erosion: 8, awareness: 4, setFlag: { tasted_dragon_authority: true } }, resultText: '你拿起桌上的印章——龙映的龙纹印章。你在一份文件上盖了章——批准了一条新规章。你的龙尾愉悦地摆动了一下。权力的感觉——甜美而危险。但龙映的意识在你体内冷哼一声——「好玩吗？你每盖一次章——都在延长这座城市的谎言。」', nextNodeId: 'possessed_dragon_truth' },
  ]
};

const possessed_dragon_truth = {
  id: 'possessed_dragon_truth',
  scene: 'city_hall', dayMin: 3, dayMax: 7,
  title: '龙映的全局认知',
  narrative: '你深入龙映的记忆——她对这个城市的认知远远超出你的想象。她能看到常识覆盖的每一根丝线——像一张巨大的蜘蛛网笼罩着城市的天空。每一根丝线的末端都连接着一个人的意识。\n\n她看到了城市的起源——三百年前七个妖怪和那个人类法师共同编织了这个巨大的结界。龙映当时是其中最年轻的——她负责维持结界的稳定。三百年过去了，最初的七个妖怪中只有她还在。其他的——有的死了，有的疯了，有的——被她自己封印了。\n\n「你想知道真相吗？」龙映的声音在你的脑海中响起——不是龙映的身体在说话，而是她的灵魂。「这座城市是一个监狱。常识覆盖是锁链。而我是典狱长。你想知道——为什么我要做这个典狱长吗？」',
  stateConditions: { requiredFlags: { read_own_report: true } },
  choices: [
    { id: 'pdt_ask_why', text: '问她为什么选择成为典狱长', effects: { awareness: 8, setFlag: { asked_dragon_why: true } }, resultText: '龙映沉默了。然后——她的记忆向你开放——她曾经爱上了一个人类。那个人类知道了妖怪的存在，并要求她带他进入妖怪的世界。常识覆盖当时还不稳定——他看到了太多不该看的。最后——她不得不亲手抹去他的记忆。他忘记了他们的一切。但他还活着——活在这座城市的某个角落。她做典狱长——是为了确保没有人再经历这样的痛苦。', nextNodeId: '' },
    { id: 'pdt_see_past', text: '查看城市三百年前的真实面貌', effects: { awareness: 10, erosion: 6, setFlag: { saw_city_past: true } }, resultText: '你通过龙映的眼睛看到了三百年前——人类和妖怪的战争烧毁了半个城市。街道上流淌的不再是雨水——而是血。一个和你长得一模一样的人站在废墟中央——高举双手——金色的光芒从他/她体内涌出——形成了最初的常识覆盖。那人的脸——是你自己。你的前世。', nextNodeId: 'possessed_dragon_choice' },
  ]
};

const possessed_dragon_choice = {
  id: 'possessed_dragon_choice',
  scene: 'city_hall', dayMin: 4, dayMax: 7,
  title: '龙娘的统治抉择',
  narrative: '龙映把她的办公桌抽屉打开——里面放着一顶王冠。不是普通的王冠——它由龙鳞和人类的记忆结晶交织而成。这是城市统治者的象征。\n\n「你可以选择留在这里——以我的身份统治这座城市。」龙映的声音平静得可怕。「你有人类的同理心——也有妖怪的力量。你可能会做得比我好——也可能毁掉一切。」\n\n她站起身——把王冠递给你。她的龙瞳凝视着你——不是审视——而是恳求。「我累了。我已经守了三百年。如果你愿意接手——我会把一切都给你。」\n\n王冠在你手中微微发光。你能感受到它的重量——不仅是物理上的重量。这是三百年来每一任统治者的责任和罪孽的结晶。',
  stateConditions: { requiredFlags: { saw_city_past: true } },
  choices: [
    { id: 'pdc_accept', text: '接受王冠——以龙娘的身份统治城市', effects: { erosion: 15, awareness: 10, setFlag: { became_dragon_ruler: true, player_species: 'dragon' } }, resultText: '你戴上王冠。龙映的力量涌入你的体内——不是侵略性的——而是像水流一样自然。你感受到了城市的每一个角落——每一盏路灯、每一块铺路石、每一个人的心跳。你睁开眼——你的眼睛变成了龙瞳。城市就在你的掌心。龙映的灵魂退居幕后——带着一丝如释重负的叹息。', nextNodeId: '' },
    { id: 'pdc_refuse', text: '拒绝——这不是你想要的力量', effects: { awareness: 8, erosion: -5, setFlag: { refused_dragon_crown: true } }, resultText: '你把王冠放回抽屉。龙映没有惊讶——她似乎早就预料到了。「你比我以为的更聪明。」她关上抽屉——「那么——我只能继续做这个典狱长了。但你记住——当你需要帮助的时候——龙族的城市随时向你敞开。」', nextNodeId: '' },
    { id: 'pdc_destroy', text: '不戴王冠——也不让任何人戴上', effects: { awareness: 8, erosion: 10, setFlag: { promised_destroy_crown: true } }, resultText: '你拿起王冠——用力砸向地面。龙鳞碎裂——记忆结晶飞散。龙映震惊地看着你——然后——她笑了。第一次——真正的笑了。「你……你做了我一直想做的事。三百年来——第一次有人敢这么做。」天花板开始龟裂——常识覆盖出现了动摇。', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：NPC个人结局线（10个节点）
// ═══════════════════════════════════════════════════════════════════════════

const npc_kitsune_confession = {
  id: 'npc_kitsune_confession',
  scene: 'shrine', dayMin: 5, dayMax: 7,
  title: '狐铃的告白',
  narrative: '黄昏的神社空无一人。狐铃站在主殿前——金色的夕阳在她身后勾勒出她的轮廓。她的狐耳微微抖动——她听到了你的脚步声，但没有回头。\n\n「你来了。」她的声音比平时更轻柔。「我一直在想——要怎么跟你说。」她转过身——她的眼中含着泪光。不是悲伤——是某种终于下定决心后的释然。\n\n「我不是人类。你知道的。但我爱上了你——从第一眼见到你的时候。不——比那更早。我在裂缝中看到过你的前世——很多次。每一世我都告诉自己——这一世不要陷进去。但每一次——看到你的脸——我就……」她说不下去了。',
  choices: [
    { id: 'nkc_accept', text: '接受她的感情——你也有同样的感觉', effects: { awareness: 8, erosion: 4, affinity: { npcId: 'kitsune', amount: 15 }, setFlag: { accepted_kitsune_love: true } }, resultText: '你走上前——轻轻握住她的手。她的手在颤抖。你感觉到她三百年来的所有孤独——在这一刻——全部被你的一个动作融化了。她扑进你的怀里——哭得像个孩子。神社的钟声在这一刻自己响了起来——像是上天在祝福你们。', nextNodeId: 'npc_kitsune_leave' },
    { id: 'nkc_gentle_refuse', text: '温柔地拒绝——你无法回应这份跨越三世的感情', effects: { awareness: 8, erosion: 2, affinity: { npcId: 'kitsune', amount: -5 }, setFlag: { gently_refused_kitsune: true } }, resultText: '你深吸一口气——说出了拒绝的话。狐铃的微笑凝固了一瞬——然后她低下了头。「嗯……我早就猜到了。」她擦掉眼泪——努力保持微笑。「没关系。等了你这么久——能说出口——已经很好了。」', nextNodeId: '' },
    { id: 'nkc_confused', text: '你也很混乱——需要时间想清楚', effects: { awareness: 5, setFlag: { confused_about_kitsune: true } }, resultText: '你诚实地说出了你的困惑。狐铃轻轻点头——「我明白。这对你来说太突然了。我会等的——就像我一直等的那样。」她转身面向夕阳。她的背影看起来——既坚强又脆弱。', nextNodeId: 'npc_kitsune_leave' },
  ]
};

const npc_kitsune_leave = {
  id: 'npc_kitsune_leave',
  scene: 'shrine', dayMin: 5, dayMax: 7,
  title: '离开还是留下',
  narrative: '夜色降临。狐铃和你并肩坐在神社的台阶上——她靠在你的肩膀上。远处的城市灯火通明——但你看到的只是常识覆盖制造出来的虚假和平。\n\n「我一直在想一个问题。」狐铃轻声说——「如果有一天——你打破了常识覆盖——这个世界上的人类都会记得妖怪的存在。到那时候——你觉得他们会怎么做？他们会害怕。他们会攻击我们。战争会再次开始。」\n\n她抬起头看着你——她的眼中映着月光。「所以在那一刻到来之前——我想问你——你想离开这里吗？我知道一条路——离开这座城市的结界范围。那里没有常识覆盖——但有真正的世界。我们可以去那里——一起。」',
  conditions: { hasFlag: 'accepted_kitsune_love' },
  choices: [
    { id: 'nkl_go', text: '跟她一起离开——去真正的世界', effects: { awareness: 8, setFlag: { leave_with_kitsune: true } }, resultText: '你握住她的手——「好。我们一起走。」她眼中绽放出光芒——你第一次看到她笑得这么彻底。她拉着你站起来——神社后面的裂缝打开了一条通道——另一边的空气带着森林和自由的味道。你们一起走向那道门。', nextNodeId: 'npc_kitsune_stay' },
    { id: 'nkl_stay', text: '留下来战斗——打破常识覆盖才是正确的', effects: { awareness: 8, erosion: 5, setFlag: { stay_to_fight: true } }, resultText: '你摇了摇头。「我不能逃避。如果我走了——这一切还会继续。你的三百年等待——不能白费。」狐铃沉默了很久——然后轻轻笑了。「我就知道你会这么说。你每一世都这么说。」她握紧你的手——「那么——我留下来帮你。」', nextNodeId: '' },
  ]
};

const npc_kitsune_stay = {
  id: 'npc_kitsune_stay',
  scene: 'shrine', dayMin: 6, dayMax: 7,
  title: '留在神社的结局',
  narrative: '你做出了留下的选择。但不知为何——你的脚步停在了那道裂缝前。你转身看着神社——看着这座城市。你真的能抛下这一切吗？\n\n狐铃也停下了——她看到你眼中的犹豫。她轻声说：「我知道你放不下。我也是。」\n\n她拉着你走回神社——「或许——我不需要离开这里就能幸福。只要你在我身边——我守护了三百年的城市——也是我的家。」\n\n她靠在你的肩上——「我们留下来——一起面对一切。不管发生什么——至少这次——我不是一个人。」',
  stateConditions: { requiredFlags: { leave_with_kitsune: true } },
  choices: [
    { id: 'nks_final_stay', text: '留下来——和狐铃一起面对结局', effects: { awareness: 6, setFlag: { final_stay_with_kitsune: true } }, resultText: '你紧紧握住她的手。裂缝在你们身后缓缓关闭。这座城市还在谎言中沉睡——而你们两个——将在黎明前做出最后的抉择。但至少——你们在一起。', nextNodeId: '' },
  ]
};

const npc_hana_feelings = {
  id: 'npc_hana_feelings',
  scene: 'town_center', dayMin: 5, dayMax: 7,
  title: '花音的感情',
  narrative: '花店即将打烊。花音正在整理剩下的花束——她的手指轻巧地修剪着枝叶。夕阳透过玻璃窗照进来——给她染上一层温暖的金色。\n\n你走进店里。她抬头看到你——露出了那个你熟悉的温柔微笑。「今天怎么这么晚？」她放下剪刀——给你倒了一杯花茶。\n\n你注意到她的手指上缠着绷带——被玫瑰花刺划伤的。她总是这么不小心。但她不在乎这些伤口——她更在乎花是否美丽。\n\n「我最近一直在想……」她低着头——搅动着杯中的花茶——「你知道为什么我从不离开这家店吗？即使这座城市……我觉得它有些不对劲。」她抬起头——「因为你会来。我知道。从一开始就知道。」',
  choices: [
    { id: 'nhf_ask_more', text: '问她为什么这么确定', effects: { awareness: 5, affinity: { npcId: 'hana', amount: 8 }, setFlag: { asked_hana_feelings: true } }, resultText: '她轻轻笑了——有些羞涩。「我做了一个梦。梦里有一个和我长得一样的女人——在一百多年前——也在等一个人。那个人——和你长得一样。」她把一朵白色山茶花递给你——「也许有些缘分——不止一辈子。」', nextNodeId: 'npc_hana_flower_eternal' },
    { id: 'nhf_confess', text: '坦白你对她的感情', effects: { awareness: 6, affinity: { npcId: 'hana', amount: 10 }, setFlag: { confessed_to_hana: true } }, resultText: '你说出了心里话。花音睁大了眼睛——手中的花掉在了地上。她愣了几秒——然后她的脸变得通红。她低下头——但你看到了她嘴角抑制不住的笑意。她捡起那朵花——插在你的衣领上。「我……我也一样。从你第一次进店的那天起。」', nextNodeId: 'npc_hana_flower_eternal' },
  ]
};

const npc_hana_flower_eternal = {
  id: 'npc_hana_flower_eternal',
  scene: 'town_center', dayMin: 6, dayMax: 7,
  title: '花店的未来',
  narrative: '花音关上店门。你们坐在花丛中间——茉莉的清香、玫瑰的浓郁、薰衣草的安宁——各种花香混合成一种温柔的拥抱。\n\n「我想告诉你一件事。」她取下脖子上的吊坠——打开——里面是一朵压干的小花。花瓣已经变成了褐色——但形状仍然完整——是一朵四叶草。\n\n「这是我家传的东西。我奶奶告诉我——这朵花是用特殊方法保存的——它不会腐朽。就像……某些感情一样。」\n\n她看着你——她的眼中有着比平时更深的坚定。「我不知道这座城市的真相是什么。但我感觉——你正在走向某个地方——很远的地方。如果有一天——你需要一个地方可以回来——这家店会一直在。我会一直在。」',
  stateConditions: { requiredFlags: { asked_hana_feelings: true } },
  choices: [
    { id: 'nhfe_promise', text: '承诺一定会回来', effects: { awareness: 4, affinity: { npcId: 'hana', amount: 8 }, setFlag: { promised_hana_return: true } }, resultText: '你握住她的手——「我保证——不管发生什么——我都会回到这家店。回到你身边。」她含着泪笑了——她把那朵四叶草吊坠放在你的手心里。「带着它。它会带你回家的。」', nextNodeId: '' },
    { id: 'nhfe_take_her', text: '邀请她和你一起走', effects: { awareness: 6, erosion: 3, setFlag: { invited_hana_along: true } }, resultText: '你认真地看着她——「如果你愿意——可以和我一起面对这一切。我不知道前面有什么——但至少——路上有你。」她犹豫了一瞬——然后用力点了点头。「我去收拾行李。」她起身时碰到了花瓶——水洒了一地——你们一起笑了。', nextNodeId: '' },
  ]
};

const npc_vampire_regret = {
  id: 'npc_vampire_regret',
  scene: 'hospital', dayMin: 5, dayMax: 7,
  title: '血月的悔恨',
  narrative: '深夜的医院安静得可怕。你在血月的办公室找到了她——她坐在黑暗中，没有开灯。月光从窗户照进来——她苍白的脸半明半暗。\n\n「你来了。」她的声音沙哑——不像平时那样冷静。她的面前放着一个相框——照片里是一个年轻的女孩和一个女人——像母女。\n\n「这是我的女儿。」血月指了指照片。「她是在我变成吸血鬼之前出生的。常识覆盖被建立的那一年——我选择接受吸血鬼化——以为这样可以保护她。」\n\n她的手指在相框边缘轻轻颤抖。「但我错了。常识覆盖抹去了人类对妖怪的记忆——也抹去了她对我的记忆。她现在……是我的病人。她不认识我。」\n\n她抬起头看着你——一滴血红色的眼泪从她眼角滑落。',
  choices: [
    { id: 'nvr_comfort', text: '安慰她——她当时已经尽力了', effects: { awareness: 5, affinity: { npcId: 'vampire', amount: 8 }, setFlag: { comforted_vampire: true } }, resultText: '你把手放在她的肩上。她僵硬了一瞬——然后放松了。「我是个懦夫。」她低声说。「我选择了永生——却失去了做母亲的资格。」你告诉她——也许还有弥补的机会。她眼中闪过一丝微弱的希望。', nextNodeId: 'npc_vampire_cure' },
    { id: 'nvr_blame', text: '质问她——为什么不早点告诉她女儿真相', effects: { awareness: 5, setFlag: { blamed_vampire: true } }, resultText: '你的话像刀刃一样锋利。血月没有反驳——她低下了头。「你说得对。我有一百次机会可以告诉她——但我选择了沉默。」她用手指抹去血泪——「也许——我是怕她恨我。」', nextNodeId: 'npc_vampire_cure' },
  ]
};

const npc_vampire_cure = {
  id: 'npc_vampire_cure',
  scene: 'hospital', dayMin: 6, dayMax: 7,
  title: '寻找解药',
  narrative: '血月打开了她办公桌的暗格——里面存放着厚厚的研究笔记。她翻开其中一页——上面画着复杂的分子结构图。\n\n「这些年我一直在偷偷研究——如何逆转吸血鬼化。」她指着笔记中的一段——「常识覆盖的核心能量可以用来重构细胞——理论上——它可以修复被吸血鬼病毒修改的基因序列。」\n\n她抬起头看着你——眼中不再是悔恨——而是决心。「如果我可以用常识覆盖的能量制造解药——我不仅可以变回人类——还可以帮助所有被它困住的人。」\n\n她合上笔记——胸口的起伏暴露了她的激动。「但要做到这一点——我需要接触到常识覆盖的核心。那在市政厅地下——龙映的管辖范围。我需要你的帮助。」',
  stateConditions: { requiredFlags: { comforted_vampire: true } },
  choices: [
    { id: 'nvc_help', text: '帮她拿到核心能量——一起制造解药', effects: { awareness: 8, erosion: 5, setFlag: { helping_vampire_cure: true } }, resultText: '你点了点头。血月的嘴角微微上扬——那是你第一次看到她真正地微笑——不是职业性的——而是一个母亲重新找到希望后发自内心的笑容。「谢谢你。不是为了我——而是为了这座城市里所有被困在谎言中的人。」', nextNodeId: '' },
    { id: 'nvc_cautious', text: '提醒她——常识覆盖崩溃可能引发混乱', effects: { awareness: 6, setFlag: { warned_vampire_about_risk: true } }, resultText: '血月点点头——「我知道。所以我不会完全摧毁它——我只是想修改它。让它可以保护人类——同时不再囚禁他们。」她翻开笔记的最后一页——上面写着她的计划——一个精心设计的平衡方案。', nextNodeId: '' },
  ]
};

const npc_cui_secret_reveal = {
  id: 'npc_cui_secret_reveal',
  scene: 'town_center', dayMin: 5, dayMax: 7,
  title: '小翠的真正身份',
  narrative: '便利店打烊后——小翠锁上了门。她深吸一口气——转身面对你。她的表情——不是平时那个怯懦害羞的店员——而是一种严肃到近乎陌生的神情。\n\n「我一直想告诉你的——但我不敢。」她低头看着自己的手——它们开始变得透明——你可以看到她体内的蓝色液体在缓缓流动。\n\n「我不是普通的史莱姆。我是——常识覆盖的一部分。」她抬起头——眼中满是不安。「我是被制造出来的。龙映用常识覆盖的能量创造了我和我的姐姐——用来监视这座城市里的人类情绪状态。我姐姐——她已经失踪五年了。她是因为发现了不该发现的东西——而被回收的。」\n\n她的声音开始颤抖。「下一个——可能就是我了。」',
  choices: [
    { id: 'ncsr_believe', text: '相信她——帮助她逃避被回收的命运', effects: { awareness: 6, affinity: { npcId: 'xiaocui', amount: 10 }, setFlag: { believed_cui_secret: true } }, resultText: '你握住她变得透明的手。「我不会让他们回收你。」小翠的眼泪滴在地上——不是水——是闪着微光的蓝色液体。她扑进你怀里——「你是第一个——知道真相后还愿意靠近我的人。」', nextNodeId: 'npc_cui_protect' },
    { id: 'ncsr_doubt', text: '怀疑她——这可能是陷阱', effects: { awareness: 4, erosion: 3, setFlag: { doubted_cui: true } }, resultText: '你后退了一步。小翠眼中的光芒暗淡了——她的手恢复了实体的样子。「也难怪……我毕竟是一件工具。」她转身走向货架深处——她的背影看起来那么小、那么孤单。', nextNodeId: '' },
  ]
};

const npc_cui_protect = {
  id: 'npc_cui_protect',
  scene: 'town_center', dayMin: 5, dayMax: 7,
  title: '保护她',
  narrative: '小翠停止了哭泣。她擦了擦眼泪——那些蓝色的液体在她的脸颊上留下了淡淡的痕迹。\n\n「如果你真的想帮我——有两件事是必要的。」她压低声音——「第一——我需要回收我姐姐的记忆碎片。她被回收后——一部分数据被保存在了医院的太平间里——就是那些记忆容器。」\n\n「第二——」她咬住下唇——「如果龙映发现我还保留着自我意识——她会立刻回收我。所以我需要——一个安全的地方。一个常识覆盖够不到的地方。」\n\n她期待地看着你。她眼中的恐惧和希望交织在一起——像一个溺水者看着最后一根浮木。',
  conditions: { hasFlag: 'believed_cui_secret' },
  choices: [
    { id: 'ncp_help_all', text: '帮她找回姐姐的记忆——然后带她去安全的地方', effects: { awareness: 8, erosion: 4, setFlag: { promised_protect_cui: true } }, resultText: '你制定了计划——先去医院太平间取回记忆碎片——然后找到神社的裂缝作为庇护所。小翠听着你的计划——她的眼睛越来越亮——「你真的……愿意为我冒这个险？」她握住你的手——冰凉而柔软——但这一次——她没有发抖。', nextNodeId: '' },
    { id: 'ncp_hide_first', text: '先把她藏起来——再考虑记忆碎片的事', effects: { awareness: 5, setFlag: { hid_cui_first: true } }, resultText: '你把小翠带到了你的公寓。她蜷缩在沙发上——像一只受惊的小动物。你给她倒了一杯水——她接过去时——她的手是透明的。「谢谢你。」她小声说——「不管结果如何——谢谢你愿意相信我。」', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：规则连锁线（8个节点） — 违反规则的连锁触发事件
// ═══════════════════════════════════════════════════════════════════════════

const rule_chain_3_violations = {
  id: 'rule_chain_3_violations',
  scene: 'home_bedroom', dayMin: 2, dayMax: 7,
  title: '规则的警告',
  narrative: '你的手机突然震动——屏幕上没有任何来电显示。你接起电话——那边只传来一个经过变声处理的声音：\n\n「你已经违反了三条规则。」\n\n电话挂断了。你还没来得及反应——床头的铜镜开始自己发光——镜面上浮现出一行字——像是被什么人用手指在雾气中写下的：\n\n「你正在引起注意。他们已经开始观察你。」\n\n你感到背后一阵凉意。不是错觉——房间的温度确实在下降。窗户上凝结了一层薄霜——尽管现在是夏天。',
  choices: [
    { id: 'rc3_investigate', text: '追查电话来源——拨回去', effects: { awareness: 6, erosion: 3, setFlag: { investigated_warning_call: true } }, resultText: '你回拨那个号码——是空号。但你注意到——在电话接通的那一瞬间——你听到了背景音里有医院广播的声音。打电话的人在某个医疗机构里。', nextNodeId: '' },
    { id: 'rc3_ignore', text: '当作恶作剧——继续日常行动', effects: { erosion: 5, setFlag: { ignored_first_warning: true } }, resultText: '你拉上窗帘——躺在床上告诉自己那只是恶作剧。但当你闭上眼睛时——你听到天花板上有细微的爬行声。不是老鼠——那种声音是有节奏的——像某种生物在用指甲在天花板上写字。', nextNodeId: '' },
    { id: 'rc3_check_mirror', text: '问铜镜——它似乎在传递信息', effects: { awareness: 8, setFlag: { asked_mirror_about_warning: true } }, resultText: '你拿起铜镜——盯着那行字。「谁在观察我？」镜面上的字消失了——新的字浮现：「每个人。」然后镜中的你——张开了嘴——无声地说了一个词：「跑。」', nextNodeId: '' },
  ]
};

const rule_chain_witch = {
  id: 'rule_chain_witch',
  scene: 'town_center', dayMin: 3, dayMax: 7,
  title: '女巫的追击',
  narrative: '违反#10、#31、#32三条规则的连锁效果触发了。你走在街上时——周围的空气突然变得沉重。路人的脸变得模糊——他们都用同样的眼神看着你——空洞而整齐——像是被操控的提线木偶。\n\n一个穿着黑色斗篷的女人从人群中走出。她的眼睛是纯白色的——没有瞳孔。她手里拿着一根金属手杖——手杖顶端的蓝色宝石正在发光。\n\n「你违反了女巫的三项戒律。」她的声音像是从很远的地方传来的——却清晰地在你耳边响起。「按照契约——你需要接受一次『检查』。」\n\n她举起手杖——蓝色光芒将你笼罩。你感到自己的身体在变得透明——她正在用魔法扫描你的存在。',
  choices: [
    { id: 'rcw_resist', text: '抵抗扫描——保持自己的秘密', effects: { awareness: 6, erosion: 5, setFlag: { resisted_witch_scan: true } }, resultText: '你集中精神——拒绝让她的魔法穿透你的意识。她有些惊讶——「有趣。你身上有不止一种力量。」她收回了手杖——「我们还会再见面的，违律者。」她转身消失在人群中——那些提线木偶般的路人恢复了正常。', nextNodeId: '' },
    { id: 'rcw_accept', text: '接受检查——让她看到你想让她看到的', effects: { awareness: 8, erosion: 3, setFlag: { fooled_witch_scan: true } }, resultText: '你放松身体——让她扫描——但你有意识地展示了一部分无关紧要的信息。她皱了皱眉——「你的纪录……不完整。但至少——你现在是『登记在册』的了。」她收起手杖——转身离去。你感到一阵轻松——但你不知道被登记意味着什么。', nextNodeId: '' },
  ]
};

const rule_chain_doctor = {
  id: 'rule_chain_doctor',
  scene: 'hospital', dayMin: 3, dayMax: 7,
  title: '医院的秘密',
  narrative: '当你同时违反#7和#20规则后——你在医院经历了一连串不寻常的事件。你去做常规检查时——医生看你的眼神变了。他没有用听诊器——而是用一种发光的仪器扫描了你。\n\n「你有意思。」医生推了推眼镜——他的镜片反射着仪器屏幕上的数据。「你的身体指标……不匹配。你身上标记的性征和你实际的染色体——对不上。」\n\n他站起身——锁上了诊室的门。「别担心——我不是要害你。我是这个医院里——少数知道真相的人之一。」他压低声音——「你身上发生的事情——不是疾病。是转变。而这座城市——有一整个系统在专门处理你这种情况。」',
  choices: [
    { id: 'rcd_trust', text: '信任医生——听他说明真相', effects: { awareness: 8, erosion: 4, setFlag: { trusted_secret_doctor: true } }, resultText: '医生从抽屉里拿出一份档案——封面贴着你的照片。标签上写着：「性别认知偏移·TSF倾向——观察中」。他翻开档案——里面详细记录了你的每一次转变——有些连你自己都不记得。「你被标记了——从你第一次进入这座城市开始。」', nextNodeId: '' },
    { id: 'rcd_escape', text: '感到危险——强行离开', effects: { erosion: 5, setFlag: { fled_from_doctor: true } }, resultText: '你推开医生——冲向门口。他在你身后说——「你跑不掉的。这个标记——不是我能决定的。是这座城市本身在你身上做的记号。」你的手在门把手上停顿了一秒——然后你拉开门冲了出去。', nextNodeId: '' },
  ]
};

const rule_chain_mirror = {
  id: 'rule_chain_mirror',
  scene: 'mirror_world', dayMin: 4, dayMax: 7,
  title: '镜中世界',
  narrative: '当你同时违反#14、#25和#43后——你身边的镜子开始出现异常。家中的穿衣镜不再反射你的动作——你举手时——镜中的你慢了半拍。你眨眼——镜中的你却睁着眼。\n\n到了某个临界点——你伸手触碰镜面时——手没有碰到玻璃。它穿了过去。一股冰凉的力量拉着你——将你整个拉入了镜中的世界。\n\n镜中世界是这座城市的镜像——但一切都被扭曲了。建筑物是颠倒的——天空是深紫色的——街道上的行人都是镜中倒影——他们的动作和你那边的世界完全相反。\n\n而你看到——在镜中世界——无数个你站在那里。不是你的倒影——是所有可能的你。不同性别、不同种族、不同选择的你。',
  choices: [
    { id: 'rcm_talk', text: '与镜中的自己对话——询问这个世界的真相', effects: { awareness: 8, erosion: 5, setFlag: { talked_to_mirror_selves: true } }, resultText: '你向那些「你」走去。他们同时开口——声音重叠——「我们是你的可能性。你的每一个选择——都会创造一个我们。当你违反的规则越多——我们能看到的你也就越多。」其中一个「你」走上前——「回到你的世界去——在你还知道自己是谁之前。」', nextNodeId: '' },
    { id: 'rcm_explore', text: '探索镜中世界的规则', effects: { awareness: 6, erosion: 8, setFlag: { explored_mirror_world_rules: true } }, resultText: '你在镜中世界里行走——发现这里的规则完全不同。重力是相反的——建筑的门通向意想不到的地方。你推开一扇门——发现自己到了神社的地下祭坛。再推开一扇——又回到了医院太平间。镜中世界是城市所有地点的「快捷方式」。常识覆盖——在镜中世界不存在。', nextNodeId: '' },
  ]
};

const rule_chain_gender = {
  id: 'rule_chain_gender',
  scene: 'home_bedroom', dayMin: 4, dayMax: 7,
  title: '性别认知混乱',
  narrative: '你站在镜子前——但你已经不确定自己看到的是什么了。你的脸时而像原来的自己——时而是另一副面孔——时而是男人——时而是女人——时而是两者都不是。\n\n你的身份证件在口袋里——你掏出来看——上面的性别一栏变成了模糊的墨迹。你翻出手机——通讯录里的联系人名字在不停变化——一会儿是男性名字——一会儿变成女性——然后又变回去。\n\n你感到头晕。你对自己是谁——产生了根本性的怀疑。你的记忆也开始混乱——你记得自己曾经是男性——也记得自己是女性——两条记忆线在你的脑海中交织——你分不清哪条是真的。\n\n你的手在颤抖。你看着镜子——里面的你开口说话了——用不同的声音不断切换：「选一个。你必须选一个身份。你不选——这座城市会替你选。」',
  choices: [
    { id: 'rcg_male', text: '坚持男性身份——无论如何', effects: { erosion: 8, setFlag: { claimed_male_identity: true } }, resultText: '你大声说出——「我是男人。」镜子中的各种面孔停了下来——融合成一张男性的脸。他/她看着你——表情复杂——「如你所愿。但你知道吗——你的声音在颤抖。你在说服自己——还是在说服我？」', nextNodeId: '' },
    { id: 'rcg_female', text: '选择女性身份——这更符合现在的感觉', effects: { erosion: 8, setFlag: { claimed_female_identity: true } }, resultText: '你深吸一口气——「我是女人。」镜中的面孔融合成一张女性的脸——她对你微笑——「你看起来更自在了。但——这是真实的你——还是只是你对现实的妥协？」', nextNodeId: '' },
    { id: 'rcg_neither', text: '拒绝选择——性别不应该定义你是谁', effects: { awareness: 8, erosion: 5, setFlag: { refused_gender_choice: true } }, resultText: '你看着镜子——「我不需要选。我就是我。」镜中的面孔们停止了切换——它们融合成一张中性的脸——看不出性别——但带着微笑。「终于——你是这一百年来第一个这么回答的人。」镜子裂开了——不是碎了——而是像一个界面一样退出了。你回到了现实。', nextNodeId: '' },
  ]
};

const rule_chain_cat = {
  id: 'rule_chain_cat',
  scene: 'alley_night', dayMin: 4, dayMax: 7,
  title: '猫化加速',
  narrative: '违反#17和#27后——你感觉身体的变化速度突然加快。你的四肢关节变得异常灵活——手指开始不自觉地弯曲成爪状。你的牙齿变得尖锐——舌尖能感受到空气中每一丝味道的变化。\n\n在路上——你听到的声音突然放大了无数倍。行人的脚步声像雷鸣——远处汽车的鸣笛像海啸——你双手捂住耳朵——但无济于事。\n\n你看到一个黑色的影子从巷子里走出来。是一只巨大的黑猫——它坐在地上——用一双湛蓝色的眼睛看着你。它开口说话了——声音是一个成年女性的嗓音——沉稳而带着一丝嘲弄：\n\n「你也感觉到了吧？身体在改变。如果你不及时停止——你会彻底变成一只猫。不是猫又——就是一只普通的野猫。然后——你会被这座城市『处理』掉。」',
  choices: [
    { id: 'rcc_resist_change', text: '集中精神抵抗变化——强行稳定形态', effects: { awareness: 8, erosion: 4, setFlag: { resisted_cat_acceleration: true } }, resultText: '你闭上眼睛——深呼吸——努力回想起自己人类的形态。你的心跳慢慢平稳下来——爪子缩回了手指——听觉恢复了正常。黑猫歪着头看你——「不错。你有很强的意志力。但意志力——也是会被消耗的。」它转身消失在黑暗中。', nextNodeId: '' },
    { id: 'rcc_embrace', text: '接受变化——看看变成猫会怎样', effects: { erosion: 10, setFlag: { embraced_cat_change: true } }, resultText: '你放开了控制——你的身体开始剧烈变化。你的脊柱弯曲——你的全身覆盖了黑色的毛发。你变成了——一只猫。黑猫绕着走了一圈——「有意思。你选择了这条路。那么——欢迎来到流浪者的世界。」它转身——「跟我来。我带你去见『野猫议会』。」', nextNodeId: '' },
  ]
};

const rule_chain_contract = {
  id: 'rule_chain_contract',
  scene: 'alley_night', dayMin: 5, dayMax: 7,
  title: '身份迷失',
  narrative: '你在口袋里发现了一张你从未签署过的合同。纸张是泛黄的羊皮纸——上面的字迹是暗红色的——不是墨水——是血。\n\n合同上写着你的名字——但内容你已经完全记不得了。你只看到最后一行：「签署此契约者——自愿放弃原有身份——接受城市的重新定义。」\n\n你的签名确实是你自己的笔迹——但你不记得签过这份合同。你检查口袋里的其他物品——你的钥匙不再匹配你家的门锁——你的手机通讯录里——所有联系人的名字都变成了「未识别个体」。\n\n你跑回公寓——用钥匙试了三次——都打不开门。你敲门——一个陌生人开了门——那个人穿着你的衣服——用你的锅在做饭。他看到你——露出了困惑的表情：「你是谁？怎么有我家的钥匙？」',
  choices: [
    { id: 'rccont_insist', text: '坚持这是你的家——和那个人对峙', effects: { awareness: 6, erosion: 5, setFlag: { confronted_identity_thief: true } }, resultText: '你冲进房间——指着墙上的照片——「那是我！这是我的房间！」那个人顺着你的手指看向照片——里面确实是你和另一个人的合影。但当你再看一眼时——照片里的人变成了陌生人的脸。你的一切痕迹——都在被抹去。', nextNodeId: '' },
    { id: 'rccont_retreat', text: '退出——保持冷静——找线索', effects: { awareness: 8, setFlag: { calmly_retreated_from_identity_crisis: true } }, resultText: '你退出公寓——在走廊里坐下。你闭上眼睛——你不记得自己的名字了。但你还记得一件事——那份合同的反面应该写着解除条款。你翻开记忆——确实——第七条写着：「若持有者记起自己的真实姓名——合同自动作废。」你的真实姓名是什么？', nextNodeId: '' },
  ]
};

const rule_chain_madness = {
  id: 'rule_chain_madness',
  scene: 'home_bedroom', dayMin: 5, dayMax: 7,
  title: '精神崩溃',
  narrative: '你已经违反了十条以上的规则。现实对你来说——像一张被撕裂的照片。你分不清什么是真的——什么是假的。\n\n天花板的裂缝在蠕动。墙壁上的花纹在呼吸。你听到有人在墙壁里说话——用三种不同的语言重复同一句话。你打开水龙头——流出来的不是水——是细沙。\n\n常识覆盖在你身上已经接近失效。你既能看到人类的世界——也能看到妖怪的世界——两者叠加在一起——像是用重影在看东西。你看到一个穿着西装的男人走过——他的身上叠着一条巨大的蜈蚣。你看到公交车站的老太太——她的人皮下是蠕动的触须。\n\n这个世界不再隐藏自己了。它向你展现了全部的真实——而你的大脑——正在全力拒绝接受这一切。你的鼻子开始流血。你的视线开始模糊。你的意识——在尖叫。',
  choices: [
    { id: 'rcm_ground', text: '尝试接地——抓住一件确定真实的东西', effects: { awareness: 8, erosion: 10, setFlag: { grounded_in_reality: true } }, resultText: '你抓住床头的铜镜——它是你少数确信真实的东西。握住它的瞬间——你感到一股电流从手臂传遍全身。镜面发光了——然后——你看到了一个画面：你站在一片白色的空间中——一个和你一模一样的人站在你面前。「常识覆盖在你身上碎得太快了。你承受不了全部的真实。让我帮你——过滤掉一部分。」', nextNodeId: '' },
    { id: 'rcm_surrender', text: '放弃抵抗——让疯狂吞噬你', effects: { erosion: 15, setFlag: { surrendered_to_madness: true } }, resultText: '你闭上眼睛——不再抵抗。常识覆盖在你身上完全失效了。你看到了这个世界的真正模样——美丽而恐怖——光和怪物共存——人类的记忆在城市上空漂浮。你不再害怕了——你和这座城市一样——既真实又虚幻。', nextNodeId: '' },
    { id: 'rcm_seek_help', text: '打电话给狐铃——她可能知道怎么办', effects: { awareness: 6, setFlag: { called_kitsune_for_help: true } }, resultText: '你拨通了狐铃的电话。你的声音在颤抖——语无伦次。但她听懂了。「待在那里别动。我马上来。」十分钟后——她出现在你的门口。她看到你的样子——迅速用手按住你的额头——一股温暖的力量流入你的脑海。混乱的感知慢慢平息——你重新看清了她的脸。她满脸担忧——「你违反了太多规则。我们得想办法——帮你稳定下来。」', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：复合结局前置节点（8个节点）
// ═══════════════════════════════════════════════════════════════════════════

const collector_tsf_check = {
  id: 'collector_tsf_check',
  scene: 'mirror_world', dayMin: 6, dayMax: 7,
  title: '全种族转化确认',
  narrative: '你站在一面巨大的棱镜前——镜面被分割成了五个区域。每一个区域反射出你的一种形态：史莱姆的蓝色半透明身体——狐铃的金色狐瞳——吸血鬼的苍白皮肤——魅魔的翅膀和尾巴——龙娘的鳞片和竖瞳。\n\n你完成了全部五种种族的转化。你体内流淌着五种截然不同的力量——它们原本应该互相排斥——却在你体内奇迹般地共存。\n\n棱镜中央开始发光——一行文字浮现：「多元之魂——检测完成。你已超越了单一存在的限制。你不再属于任何一个种族——你是所有种族的交汇点。」\n\n棱镜的碎片开始脱落——在它们后面——露出了一道金色的门。门的表面刻着和你铜镜上相同的符文——但更加古老和完整。',
  choices: [
    { id: 'ctc_enter', text: '推开金色之门——看看后面有什么', effects: { awareness: 10, erosion: 8, setFlag: { entered_collector_gate: true } }, resultText: '金色之门缓缓打开——光芒从门缝中涌出。门的另一边——是一个由纯粹的能量构成的空间。五个光球悬浮在中央——分别对应五种种族的力量核心。它们正在呼唤你——要你成为它们的新主人。', nextNodeId: '' },
    { id: 'ctc_hold', text: '先不进去——记住这个地方', effects: { awareness: 6, setFlag: { memorized_collector_gate: true } }, resultText: '你闭上眼睛——在脑海中标记了这个位置。五种力量在你体内共振——你感到自己站在某种进化的门槛上。你知道——当你准备好时——门会再次打开。', nextNodeId: '' },
  ]
};

const collector_ending_check = {
  id: 'collector_ending_check',
  scene: 'home_bedroom', dayMin: 6, dayMax: 7,
  title: '结局收集状态',
  narrative: '铜镜的表面泛起涟漪——然后在镜面上浮现出一系列条目。那不是你主动召唤的——是镜子自己开始显示这些信息。\n\n你看到的是一份「结局清单」——列出了你到目前为止解锁的所有可能结局——以及尚未解锁的。有些条目是完整的——比如你经历过的一些分支的结局。但更多的条目是灰色的——标注着「条件未达成」。\n\n镜面底部浮现出一行字：「如果想要看到真正的结局——你需要集齐至少三条主要路线的终点。」\n\n清单上还有一行小字——似乎是用不同的笔迹写的——「或者——创造你自己的结局。」',
  choices: [
    { id: 'cec_review', text: '仔细查看每条结局的达成条件', effects: { awareness: 6, setFlag: { reviewed_ending_list: true } }, resultText: '你仔细阅读了每一个灰色的条目。有些条件是你知道的——比如「狐铃的信任」或「血月的秘密」。但有些条件——你甚至不理解它们是什么意思——比如「七重镜影」或「虚空之子的呢喃」。', nextNodeId: '' },
    { id: 'cec_ignore', text: '现在不是看这个的时候', effects: { setFlag: { ignored_ending_list: true } }, resultText: '你挥手抹去了镜面上的文字。但你注意到——在你转身离开时——镜面最底部有一行新的字在缓缓浮现：「你还有24小时。」', nextNodeId: '' },
  ]
};

const harem_check = {
  id: 'harem_check',
  scene: 'town_center', dayMin: 6, dayMax: 7,
  title: '羁绊的连接',
  narrative: '你在咖啡厅里独坐时——几个熟悉的身影几乎同时走了进来。狐铃、花音、小翠——她们彼此不认识——但都因为你而聚集到了同一个地方。她们看到彼此时——空气凝固了一瞬。\n\n狐铃的狐耳警觉地竖起——她用审视的目光看着另外两个女孩。花音微笑着——但她手中的花茎被她捏出了痕迹。小翠缩着脖子——小声说：「诶——我不是来打扰你们的——我只是——」\n\n她们同时看向你。三个女孩——三种截然不同的气质——但眼中都带着同样的期待和不安。\n\n你意识到——你和她们的羁绊已经深到无法忽视的地步了。她们都在等你——等你做出选择。',
  choices: [
    { id: 'hc_kitsune', text: '走向狐铃——你选择了这段跨越三世的缘分', effects: { awareness: 6, affinity: { npcId: 'kitsune', amount: 10 }, setFlag: { harem_choose_kitsune: true } }, resultText: '你站起来——走向狐铃。她的狐耳抖动了一下——脸上绽开了难以置信的喜悦。花音低下头——手中的花掉了一朵——她轻声说「恭喜」。小翠微笑着——但她眼中的光芒暗淡了一瞬。', nextNodeId: '' },
    { id: 'hc_hana', text: '走向花音——她温柔的守候让你心动', effects: { awareness: 6, affinity: { npcId: 'hana', amount: 10 }, setFlag: { harem_choose_hana: true } }, resultText: '你走到花音面前。她抬眼看着你——眼泪已经在眼眶里打转——但她努力保持着微笑。狐铃轻哼了一声——转头看向窗外。小翠在中间左看右看——不知道该说什么。', nextNodeId: '' },
    { id: 'hc_cui', text: '走向小翠——她想保护她的心情让你心疼', effects: { awareness: 6, affinity: { npcId: 'xiaocui', amount: 10 }, setFlag: { harem_choose_cui: true } }, resultText: '你走到小翠面前——她愣住了——「诶？我……我吗？」她低头看着自己的手——它们因为紧张而变得半透明。「可是……我连人类都不是……」你握住她微凉的手——「我不在乎。」', nextNodeId: '' },
    { id: 'hc_none', text: '你谁都不选——现在不是谈感情的时候', effects: { awareness: 5, setFlag: { harem_choose_none: true } }, resultText: '你深吸一口气——「对不起——我现在没办法给你们答案。这座城市——我们所有人的命运——都在今晚决定。」你站起身——留下三个女孩坐在那里。你的身后——传来她们各自不同的叹息声。', nextNodeId: '' },
  ]
};

const survivor_check = {
  id: 'survivor_check',
  scene: 'home_bedroom', dayMin: 6, dayMax: 7,
  title: '未被触碰的纯净',
  narrative: '你站在镜子前检查自己——没有异样的特征——没有不属于你的变化。你仍然是完完全全的人类——没有被任何异常力量侵蚀。\n\n在这个被常识覆盖扭曲的城市里——你是一个异类。你经历了这一切——却从未允许自己被改变。你的意志力坚如磐石。\n\n铜镜中的你看起来比平时更加清晰——轮廓分明——眼神坚定。镜中的你开口了——不是镜子在说话——是你自己的直觉在具象化：「你保持了自我的完整。这是最难的成就。大多数人在第三天就已经忘记了自己原本的样子。」\n\n你低头看自己的手——真实的、人类的、没有变化的手。你突然感到一种奇异的自豪——你没有被这座城市吞噬。',
  choices: [
    { id: 'sc_continue', text: '保持这个状态直到最后', effects: { awareness: 8, setFlag: { survivor_pure_until_end: true } }, resultText: '你下定决心——不管发生什么——你都不会让这座城市改变你的本质。你整理好衣领——走向门口。门外的城市依然充满了谎言和怪物——但你——你是真实的。', nextNodeId: '' },
    { id: 'sc_question', text: '但——保持「不变」真的是最好的选择吗？', effects: { awareness: 4, setFlag: { questioned_purity: true } }, resultText: '你突然想到一个问题：所有人都变了——唯独你没有——这真的是因为你意志坚定？还是因为你——从一开始——就不是普通人？', nextNodeId: '' },
  ]
};

const rule_counter = {
  id: 'rule_counter',
  scene: 'home_bedroom', dayMin: 2, dayMax: 7,
  title: '规则计数器',
  narrative: '你的手机屏幕上无声地出现了一个应用图标——一个黑色的圆点上写着一个白色的「R」。你没有安装过这个应用——但它就在那里。\n\n你点开它——屏幕变成了一个简单的计数器界面。上面的数字显示了你当前违反的规则数量。每一行规则的下方——有一条短评——像是某种系统自动生成的评估：\n\n「当前违规：X条\n状态：观察中/已引起注意/危险/临界」\n\n屏幕底部还有一行小字——不断变化着——像是某种实时更新：「注意：每一条规则背后都有人注视着。你违反的规则越多——他们的目光就越聚集在你身上。」',
  choices: [
    { id: 'rco_check', text: '仔细查看自己违反了哪些规则', effects: { awareness: 5, setFlag: { checked_rule_details: true } }, resultText: '你翻看列表——每条规则后面都标注着触发的时间和地点。有些你记得——有些你完全没有印象。最让让你不安的是——有几条规则的触发时间——是你还在睡觉的时候。', nextNodeId: '' },
    { id: 'rco_ignore_app', text: '删掉这个应用——不想被监视', effects: { erosion: 3, setFlag: { deleted_rule_app: true } }, resultText: '你尝试长按删除——但应用纹丝不动。关机再开机——它还在那里。你意识到——这个应用不是装在你的手机里的——它是装在你「意识」里的。', nextNodeId: '' },
  ]
};

const gender_identity_crisis = {
  id: 'gender_identity_crisis',
  scene: 'home_bedroom', dayMin: 4, dayMax: 7,
  title: '性别认知深潜',
  narrative: '你经历了太多次性别转换——以至于你开始怀疑「性别」本身的真实性。你坐在床边——手里拿着那面铜镜——看着镜中不断变化的脸。\n\n每一次转换都留给了你一些东西——男性的思维方式、女性的情感体验——你不再是从前的你了。你的认知边界在扩展——你开始理解——性别不过是一层可以被穿脱的外衣。真正的你——是那个穿衣服的人——而不是衣服本身。\n\n但这种认知——让你感到更孤独了。因为很少有人能理解这种体验。你无法用语言向别人描述——同时拥有两种性别的记忆是什么感觉。\n\n你低头看着自己的手——它们一会儿是纤细的手指——一会儿是骨节分明的手掌——在你的控制下不断切换。',
  choices: [
    { id: 'gic_embrace_fluidity', text: '拥抱这种流动性——性别是你自由切换的工具', effects: { awareness: 8, erosion: 5, setFlag: { embraced_gender_fluidity: true } }, resultText: '你放下镜子——让身体自由地变化。这一刻你是男人——下一刻你是女人——再下一刻——你是一个全新的存在。你不再被束缚了——你的身份由你自己定义。你感到一种前所未有的自由。', nextNodeId: '' },
    { id: 'gic_seek_stability', text: '寻求稳定——你需要一个固定的锚点', effects: { awareness: 6, setFlag: { seek_gender_stability: true } }, resultText: '你闭上眼——深呼吸——努力把自己固定在一种形态上。最终——你选了最初的样子。睁开眼——镜中的你是你最早认识的那个自己。但你知道——现在的你——已经不完全是你了。', nextNodeId: '' },
    { id: 'gic_ask_mirror', text: '问铜镜——真实的你到底是什么性别', effects: { awareness: 6, erosion: 3, setFlag: { asked_mirror_gender_truth: true } }, resultText: '你举起铜镜——「告诉我——我是谁？」镜中的脸消失了——取而代之的是一片模糊的光影。光影中传来一个声音——古老而中性——「你没有固定的性别。你是一面镜子——映照出你对自己认知的投影。当你停止问这个问题时——你就找到了答案。」', nextNodeId: '' },
  ]
};

const species_memory = {
  id: 'species_memory',
  scene: 'mirror_world', dayMin: 5, dayMax: 7,
  title: '种族记忆融合',
  narrative: '你的体内现在流淌着来自不同种族的血液——史莱姆的适应力、狐铃的灵力、吸血鬼的夜视、魅魔的感知、龙族的力量。这些记忆在你的意识中交织——像几条河流汇入一片大海。\n\n你开始看到碎片化的影像——不是你的记忆——是种族的集体记忆。史莱姆的原始意识海洋——狐族在月光下的祭祀——吸血鬼在古堡中的宴会——魅魔在梦境中的舞蹈——龙族在山巅俯瞰云海。\n\n这些记忆如此真实——你开始分不清哪一段是你亲身经历的——哪一段是外来植入的。你的灵魂正在被这些记忆撑大——像一个不断膨胀的气球。你感到——你的意识正在超越「个体」的边界。',
  choices: [
    { id: 'sm_integrate', text: '尝试整合所有记忆——创造一个新的自我', effects: { awareness: 10, erosion: 8, setFlag: { integrated_species_memories: true } }, resultText: '你敞开意识——让所有种族的记忆涌入。它们在你体内碰撞、融合——产生出全新的感悟。你睁开眼——你的瞳孔变成了万花筒般的色彩——每一秒都在变换。你不再属于任何一个种族——你是一个全新的物种。', nextNodeId: '' },
    { id: 'sm_separate', text: '保持自我——拒绝被记忆淹没', effects: { awareness: 6, erosion: -3, setFlag: { resisted_species_merge: true } }, resultText: '你筑起精神的堤坝——将外来记忆隔离在意识的外围。你能感受到它们就在那里——随时可以融入——但你在边界线上维持着自我的完整。至少——暂时。', nextNodeId: '' },
  ]
};

const true_awakening_prep = {
  id: 'true_awakening_prep',
  scene: 'home_bedroom', dayMin: 6, dayMax: 7,
  title: '真相线最终准备',
  narrative: '第七天的黎明即将到来。你坐在房间里——检查自己所有的物品和记忆。铜镜、手机里收集的证据、从太平间拷贝的数据——每一件都是你对抗常识覆盖的武器。\n\n你把铜镜放在面前——它的表面现在像水面一样不停地波动。你知道——这面镜子是连接你和你前世的钥匙。它不仅仅是一件物品——它是你的「锚点」——帮助你在这个不断试图重塑你的世界中保持自我。\n\n你闭上眼睛——感受体内的变化。你走过了太多分支——经历了太多转变——但你还记得自己最初的样子。你是谁？你为什么来到这座城市？你的目的是什么？\n\n答案即将揭晓。今天——第七天——一切都会有一个了结。',
  choices: [
    { id: 'tap_fight', text: '准备好正面迎战——不管真相是什么', effects: { awareness: 10, erosion: 5, setFlag: { prepared_for_final_battle: true } }, resultText: '你站起身——检查了口袋里的所有物品——铜镜、血清、研究笔记。你深呼吸——推开门。晨光洒进来——第七天的太阳——和第一天一样——是不自然的金黄色。但你知道——今天——你将结束这一切。', nextNodeId: '' },
    { id: 'tap_peace', text: '选择和平的方式——对话而非对抗', effects: { awareness: 8, setFlag: { prepared_for_peaceful_ending: true } }, resultText: '你轻轻抚摸铜镜——「我不想再战斗了。」镜面泛起涟漪——仿佛在回应你。你决定——以对话和理解为武器——而不是暴力。但你知道——有些人不会接受和平的选项。', nextNodeId: '' },
    { id: 'tap_alone', text: '独自面对——不连累任何人', effects: { awareness: 6, erosion: 3, setFlag: { prepared_to_face_alone: true } }, resultText: '你写了几封信——给狐铃、花音、小翠、血月、夜魅——给每一个在这七天里走进你生命的人。然后你把信放在桌上——独自走向市政厅。这不是你一个人的战斗——但你选择了独自承担。', nextNodeId: '' },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// 新增：日常补充节点（7个节点） — 日常偶遇与随机事件
// ═══════════════════════════════════════════════════════════════════════════

const daily_nekomata = {
  id: 'daily_nekomata',
  scene: 'alley_night', dayMin: 2, dayMax: 7,
  title: '巷口的野猫',
  narrative: '你走过一条小巷时——听到一声微弱的猫叫。你停下脚步——墙角的一堆旧纸箱后面——一只瘦弱的三花猫正缩在那里。它的一只后腿似乎受了伤——血迹染红了它身下的纸板。\n\n它看着你——琥珀色的眼睛里没有恐惧——只有一种超越了物种的审视。那不是普通野猫的眼神——你在这座城市里待久了——你知道——这有可能是一只尚未觉醒的猫又。\n\n它轻声喵了一下——像是在向你求助——也像是在试探你。夜风吹过——你闻到了空气中若有若无的妖气。',
  choices: [
    { id: 'dn_help', text: '给它包扎伤口——带它去宠物医院', effects: { awareness: 3, affinity: { npcId: 'nekomata', amount: 5 }, setFlag: { helped_stray_cat: true } }, resultText: '你脱下外套——小心地靠近。猫没有躲闪——它让你把它抱起来。在去医院的路上——它一直盯着你的脸看——像是要把你的样子记住。你隐隐觉得——你做了一件会影响未来某个决定的事。', nextNodeId: '' },
    { id: 'dn_ignore', text: '默默走开——你还有更重要的事', effects: { erosion: 2, setFlag: { ignored_stray_cat: true } }, resultText: '你转身离开。走出几步后——你回头看了一眼——猫已经不在纸箱后面了。地上只有一摊血迹——和几片被风吹散的猫毛。你感到一阵不安——但你继续走了。', nextNodeId: '' },
    { id: 'dn_talk', text: '试着和它说话——你已经有和妖怪打交道的经验了', effects: { awareness: 5, setFlag: { talked_to_stray_cat: true } }, resultText: '你蹲下来——看着它的眼睛说：「你需要帮助吗？」猫歪了歪头——然后它开口了——用一个小女孩的声音：「你看得出来？你不是普通人呢。」猫站起身——腿上的伤正在以肉眼可见的速度愈合——「记住我的样子——下次见面——我会以别的形态出现。」', nextNodeId: '' },
  ]
};

const daily_bar_night = {
  id: 'daily_bar_night',
  scene: 'bar', dayMin: 2, dayMax: 7,
  title: '魅魔酒吧的深夜',
  narrative: '深夜的魅魔酒吧比白天更加迷人。紫色的灯光从墙壁内部透出——音乐低沉而令人放松——空气中飘荡着淡淡的香味——不是香水——是情绪的味道。\n\n你坐在吧台边——夜魅正在调一杯颜色不断变化的鸡尾酒。她看到你——微微一笑——「又来享受夜晚了？」\n\n她把酒推到你面前——「特别的——今晚限定。」杯子里的液体是深蓝色的——像夜空——上面漂浮着银色的微小光点——像星星。\n\n你端起酒杯——感到一股温暖的能量从杯壁传入你的掌心。这不仅仅是酒——夜魅在里面加入了某种特殊的东西。',
  choices: [
    { id: 'dbn_drink', text: '喝下这杯酒——接受夜魅的馈赠', effects: { awareness: 5, erosion: 4, setFlag: { drank_succubus_wine: true } }, resultText: '酒液入口——味道不像任何你喝过的东西。它带着一丝甜味——然后是一阵清凉——最后——你的意识短暂地离开了身体。你看到了自己的灵魂——漂浮在酒杯上方——闪耀着独特的光芒。夜魅轻声说：「每个人喝到这杯酒——都会看到自己的本质。」', nextNodeId: '' },
    { id: 'dbn_decline', text: '礼貌地拒绝——你不想欠她人情', effects: { awareness: 3, setFlag: { refused_succubus_wine: true } }, resultText: '你把酒杯推回去——「今晚还是算了。」夜魅没有勉强——她把酒杯举到自己面前——「那我替你喝了。」她一饮而尽——她的眼睛闪烁了一下——「嗯——你错过了很棒的体验。」', nextNodeId: '' },
    { id: 'dbn_talk', text: '和夜魅聊聊这座城市的夜晚秘密', effects: { awareness: 6, setFlag: { talked_night_secrets: true } }, resultText: '你问她——这座城市在夜晚的真实面貌。她擦拭着酒杯——缓缓说：「夜晚——是常识覆盖最薄弱的时候。如果你在午夜零点整——站在十字路口中央——你会看到没有覆盖的世界。但我不建议你这么做——看到的人——都会被记住。」', nextNodeId: '' },
  ]
};

const daily_shrine_morning = {
  id: 'daily_shrine_morning',
  scene: 'shrine', dayMin: 2, dayMax: 7,
  title: '神社的清晨',
  narrative: '清晨的神社笼罩在一层薄薄的雾气中。你踩着被露水打湿的石阶一步步向上——空气中有线香和晨露混合的气味——让人心旷神怡。\n\n狐铃正在主殿前扫地。她看到你来——停下了手中的动作——狐耳愉快地抖动了两下。\n\n「这么早就来了？」她微笑着——把扫帚靠在一边——「正好——今天早上我做了一些特别的团子——要不要尝尝？」\n\n她带你在神社的走廊上坐下——端出了一盘三色的糯米团子——粉色的、白色的、绿色的。在清晨的阳光下——蒸汽从团子上袅袅升起——那一瞬间——你觉得这座城市的所有秘密都可以暂时放下。',
  choices: [
    { id: 'dsm_eat', text: '品尝团子——和狐铃共度宁静的早晨', effects: { awareness: 3, affinity: { npcId: 'kitsune', amount: 5 }, setFlag: { ate_morning_dango: true } }, resultText: '你拿起一个粉色的团子——咬了一口。甜味在舌尖化开——不是普通的甜——带着一丝花香。狐铃看着你吃——眼中满是满足。「好吃吗？我加了一点狐狸特制的配方。」你笑了——这座城市的早晨——原来也可以这么平静。', nextNodeId: '' },
    { id: 'dsm_ask_urgent', text: '直接问她——关于常识覆盖和今天有什么计划', effects: { awareness: 5, setFlag: { asked_kitsune_plan: true } }, resultText: '你的问题让气氛变得沉重。狐铃放下手中的团子——叹了口气——「你就不能先享受一下团子吗？」但她的眼神变得认真了——「今晚——一切都会结束。不管结果如何——至少这一个早晨——是真实的。」', nextNodeId: '' },
  ]
};

const daily_hospital_midnight = {
  id: 'daily_hospital_midnight',
  scene: 'hospital', dayMin: 3, dayMax: 7,
  title: '医院午夜的响声',
  narrative: '午夜时分——医院的长廊空无一人。荧光灯管发出微弱的嗡嗡声——在地板上投下惨白的光。你本不该在探视时间之后还留在这里——但你听到了那个声音。\n\n从地下一层传来的声响——有节奏的敲击声——像是什么东西在敲打金属。三下——停顿——三下——停顿。不是随机的——是某种信号。\n\n电梯门在你的面前打开——里面没有人——但按钮面板上——地下三层的按钮在自行发光。电梯似乎在等你进去。\n\n你的手机震动了——一条匿名短信：「不要去。那不是给活人准备的信号。」',
  choices: [
    { id: 'dhm_investigate', text: '进入电梯——下到地下三层——你必须要知道那是什么', effects: { awareness: 8, erosion: 5, setFlag: { investigated_midnight_signal: true } }, resultText: '你走进电梯。门在你身后缓缓关闭。地下三层的走廊比上面更旧——墙壁上贴着几十年前的瓷砖——有几块已经脱落了。敲击声越来越清晰——你跟着声音走——来到了一个锁着的铁门前。门上贴着标签——「备用太平间·非紧急勿开。」', nextNodeId: '' },
    { id: 'dhm_leave', text: '听劝——离开医院——好奇心会害死猫', effects: { awareness: 3, setFlag: { left_hospital_at_midnight: true } }, resultText: '你转身走向出口。身后——敲击声变得更急促了——像是什么东西在催你回去。你加快了脚步。推开医院大门——夜风扑面而来——你深深吸了一口气。回头看——医院的窗户里——有一个影子正在三楼看着你。', nextNodeId: '' },
  ]
};

const daily_school_evening = {
  id: 'daily_school_evening',
  scene: 'school', dayMin: 3, dayMax: 7,
  title: '放学后的校园',
  narrative: '黄昏的学校空荡荡的。放学的铃声响过已经两个小时——大部分学生和老师都已经离开。但你听说——这座学校的旧校舍在夜晚会有些「不寻常的活动」。\n\n你穿过连接新校舍和旧校舍的天桥——旧校舍是一栋三层木制建筑——看起来已经有几十年历史了。走廊的地板踩上去会吱呀作响。\n\n某个教室里传来灯光。你走过去——透过门上的玻璃——你看到一个穿着旧式制服的女学生正坐在书桌前写东西。但当你揉揉眼睛再看时——那里只有一张空桌子和一本摊开的笔记本。\n\n你推开门——走进教室。笔记本上写满了重复的一句话：「我没有死——我只是被忘记了。」',
  choices: [
    { id: 'dse_read', text: '翻阅笔记本——寻找更多信息', effects: { awareness: 6, erosion: 3, setFlag: { read_ghost_notebook: true } }, resultText: '你翻开笔记——里面记录了一个女学生的日常——但日期是八十年前。最后一页写着：「今天——他们告诉我——我不存在。他们说——我的父母从来没有生过孩子。他们说——我是被夹在裂缝中的记忆。」你合上笔记本——感到一阵寒意。常识覆盖——连存在本身都可以抹去。', nextNodeId: '' },
    { id: 'dse_leave', text: '退出教室——打扰亡魂是不对的', effects: { awareness: 3, setFlag: { left_school_ghost: true } }, resultText: '你轻轻关上门——但门自己又开了一条缝。你透过门缝看到——那个女学生又出现了——她抬头看着你——指着笔记本——然后指了指窗外——市政厅的方向。她在告诉你去哪里。', nextNodeId: '' },
  ]
};

const daily_street_rain = {
  id: 'daily_street_rain',
  scene: 'town_center', dayMin: 3, dayMax: 7,
  title: '雨天的商店街',
  narrative: '暴雨毫无征兆地降临了。天空在几秒内从晴朗变成了铅灰色——豆大的雨点砸在柏油路面上——激起一片片白色的水雾。\n\n你躲进一家商店的屋檐下。雨水顺着屋檐流下——在你面前形成一道水帘。透过水帘——街对面的景象变得模糊而扭曲。\n\n你注意到——在雨中——所有的影子都消失了。行人没有影子——车辆也没有。雨水把倒影冲刷掉了——就像常识覆盖的程序在雨天会出现短路一样。\n\n一个同样在躲雨的老太太站在你旁边。她顺着你的目光看向街道——然后低声说：「雨天的时候——妖怪也会躲雨。你看那边。」她指了指街对面的电话亭——里面站着一个穿着和服的女人——但在雨幕中——她的脚——没有碰到地面。',
  choices: [
    { id: 'dsr_approach', text: '冒雨走向电话亭——你想到近处看清楚', effects: { awareness: 6, erosion: 4, setFlag: { approached_rain_spirit: true } }, resultText: '你冲进雨中。电话亭里的女人转过头——她的脸是透明的——你可以看到她身后的电话机。她对你微微一笑——然后像水中的墨迹一样消散了。电话亭里——只留下一朵白色的花。', nextNodeId: '' },
    { id: 'dsr_ask_old', text: '问老太太——她也看得见那些东西？', effects: { awareness: 5, setFlag: { talked_to_rain_old_woman: true } }, resultText: '老太太微微一笑——「我活了八十年——在这座城市里。看不看见——不是眼睛的问题——是愿不愿意看见的问题。」她从口袋里掏出一颗糖给你——「拿着吧。雨天容易着凉。」你接过糖——包装纸和第一天那个神秘妇人给的糖果一模一样。', nextNodeId: '' },
  ]
};

const daily_park = {
  id: 'daily_park',
  scene: 'town_center', dayMin: 2, dayMax: 7,
  title: '公园的偶遇',
  narrative: '城市中央的公园绿树成荫。你坐在长椅上——看着鸽子和孩子们在草坪上奔跑。这个角落看起来完全正常——没有异常——没有妖气——只有普普通通的城市午后。\n\n但在这座城市里——「正常」本身就是最不正常的事情。\n\n一个皮球滚到你脚下。你捡起来——一个小男孩跑过来——气喘吁吁地——「叔叔/阿姨——我的球！」\n\n你把球递给他——他接过去时——他的手指不小心碰到了你的手。那一瞬间——你感到一阵电流——不是静电——是某种精神层面的冲击。\n\n小男孩也愣住了。他抬头看着你——他的眼睛——不是普通小孩的眼睛——那里面有和狐铃一样的光芒。但他随即恢复了正常——笑着跑开了。\n\n那个孩子——不是普通人类。',
  choices: [
    { id: 'dp_follow', text: '跟上那个孩子——他可能是某种线索', effects: { awareness: 5, setFlag: { followed_mysterious_child: true } }, resultText: '你跟着小男孩穿过公园——他跑到一个女人的身边——他的母亲。女人正在打电话——你听到她说：「嗯……今晚的议会我会参加。」你停下脚步。这个女人——她是理事会的成员。她注意到你在看她——对你礼貌地点了点头——但她看你的眼神——和龙映一样——是把你看透了。', nextNodeId: '' },
    { id: 'dp_relax', text: '享受这难得的平静——在这座疯狂的城市里', effects: { setFlag: { relaxed_in_park: true } }, resultText: '你靠在长椅上——闭上眼睛。微风拂过你的脸——鸽子在你脚边咕咕叫。你告诉自己——即使这座城市是一个巨大的迷局——至少——此刻的阳光和微风是真实的。你让自己休息了十五分钟——然后睁开眼——继续前行。', nextNodeId: '' },
    { id: 'dp_examine', text: '检查小男孩留下的痕迹——他的脚印或气息', effects: { awareness: 6, setFlag: { examined_park_boy_trail: true } }, resultText: '你蹲下身检查地上的脚印——小孩的脚印——但在某些地方——变成了动物的爪印。你捡起一根他掉落的头发——它在阳光下呈现出淡金色的光泽——不是人类的发色。你收起头发——这可能是重要的证据。', nextNodeId: '' },
  ]
};


// ─── CYOA網絡導出 ───────────────────────────────────────────────────

const cyoaNetwork: CYOANetwork = {
  startNodeId: 'start',
  nodes: {
    // D1
    start, explore_room, read_letter, mirror_vision, leave_home,
    // D2
    town_arrival, observe_people, bulletin_board, shop_enter, talk_to_xiaocui,
    // D3
    shrine_arrival, shrine_pray, meet_kitsune, shrine_secret,
    // D4
    hospital_arrival, front_desk, doctor_vampire, basement, records_room,
    // D5
    school_arrival, library, roof, gymnasium,
    // D6
    alley_arrival, graffiti, bar_enter, secret_passage, mirror_dimension, bar_secret,
    // D7
    town_hall, face_dragon, final_choice,
    // Endings
    true_ending, normal_ending, bad_ending, hidden_ending,
    // TSF专属分支：年龄变化
    kindergarten, kindergarten_class, elementary_school,
    // TSF专属分支：附身
    possession_awakening, possessed_kitsune_route, kitsune_discovery, kitsune_consequence,
    possessed_slime_route, slime_basement_secret, slime_customer_insight,
    possessed_vampire_route, vampire_morgue_secret, vampire_treatment_choice,
    // TSF专属分支：催眠
    hypnosis_route, hypnosis_memory_reveal, hypnosis_qa,
    // TSF专属分支：史莱姆化
    slime_transformation, slime_secret_base, slime_infiltration,
    // TSF专属分支：吸血鬼
    vampire_awakening, vampire_guilt, vampire_coven,
    // TSF专属分支：猫又
    nekomata_awakening,
    // TSF专属分支：魅魔
    succubus_awakening, succubus_power,
    // TSF专属分支：龙娘
    dragon_awakening,
    // TSF专属分支：无性化
    neuter_perspective,
    // TSF专属分支：双性
    futanari_experience,

    // === 新增：规则警示节点（33个） ===
    candy_stranger, antique_shop, cousin_discovery, attic_warning,
    goddess_statue, choose_doctor, mystery_package, wizard_encounter,
    dressing_room, loitering, do_not_touch, cat_ear_drawing,
    new_position, unread_contract, radical_experiment, abandoned_shrine,
    friend_science, mirror_hand, alien_encounter, talking_cat,
    fairy_gold, witch_gift, nymph_kiss, forbidden_book,
    first_time, vr_app, hypnosis_gamble, summoning,
    strange_animals, teleporter, unknown_item, double_effect, defy_fate,

    // === 新增：共通线补充节点（D1-D3, 10个） ===
    d1_morning_routine, d1_letter_content, d1_mirror_talk,
    d2_street_explore, d2_convenience_talk, d2_bulletin_detail,
    d3_shrine_deep, d3_kitsune_truth, d3_branch_choice, d3_fateful_meeting,

    // === 新增：真相线节点（D4-D7, 15个） ===
    truth_hospital_start, truth_doctor_vampire, truth_morgue,
    truth_school_archive, truth_newspaper, truth_mayor_conspiracy,
    truth_dragon_confront, truth_police_coop, truth_evidence_public,
    truth_alley_graffiti, truth_mirror_world, truth_boundary_explore,
    truth_final_choice, truth_awakening,

    // === 新增：TSF线节点（D4-D7, 20个） ===
    tsf_basement_discover, tsf_serum_choice,
    tsf_slime_chain_1, tsf_slime_chain_2, tsf_slime_chain_3, tsf_slime_ending,
    tsf_kitsune_chain_1, tsf_kitsune_chain_2, tsf_kitsune_chain_3, tsf_kitsune_ending,
    tsf_vampire_chain_1, tsf_vampire_chain_2, tsf_vampire_chain_3, tsf_vampire_ending,
    tsf_succubus_chain_1, tsf_succubus_chain_2, tsf_succubus_chain_3, tsf_succubus_ending,
    tsf_nekomata_chain_1, tsf_nekomata_chain_2,

    // === 新增：日常线节点（D4-D7, 12个） ===
    daily_flower_help, daily_hana_friendly,
    daily_shrine_festival, daily_kitsune_date, daily_kitsune_confession,
    daily_hospital_shift, daily_vampire_night, daily_vampire_secret,
    daily_convenience_night, daily_cui_friendship, daily_cui_warning,
    daily_npc_ending,
    // === 追加节点：规则警示（27个） ===
    ad_watch, cousin_find, attic_search, crazy_doctor, shy_person,
    wizard_meet, dressing_change, loiter_danger, road_trip, forbidden_sign,
    gender_fantasy, wishing_well, fan_draw, new_pose, sign_contract,
    volunteer_exp, haunted_place, fan_mail, clumsy_lab, mirror_hand_out,
    alien_dna, talking_animal, other_people_stuff, fairy_gold_steal, wrong_bathroom,
    witch_gift_accept, nymph_kiss_danger,
    // === 追加节点：共通线（10个） ===
    d1_morning, d1_letter, d1_mirror, d2_street, d2_friend_call,
    d3_shrine_path, d3_kitsune_greeting, d3_choice_weight, d4_morning_recap, d4_letter_new,
    // === 追加节点：真相线（12个） ===
    truth_hospital_arrival, truth_doctor_meet, truth_morgue_explore,
    truth_old_newspaper, truth_alley_clue, truth_city_hall_infil, truth_dragon_meet,
    truth_police_help, truth_evidence_assemble, truth_final_confront,
    truth_awakening_end, truth_peace_end,
    // === 追加节点：TSF线（20个） ===
    tsf_slime_discover, tsf_slime_drink, tsf_slime_explore, tsf_slime_resolve,
    tsf_kitsune_discover, tsf_kitsune_drink, tsf_kitsune_explore, tsf_kitsune_resolve,
    tsf_vampire_discover, tsf_vampire_drink, tsf_vampire_hunt, tsf_vampire_resolve,
    tsf_succubus_discover, tsf_succubus_drink, tsf_succubus_charm, tsf_succubus_resolve,
    tsf_nekomata_discover, tsf_nekomata_drink, tsf_nekomata_night, tsf_nekomata_resolve,
    // === 追加节点：日常线（11个） ===
    daily_hana_help, daily_hana_talk, daily_hana_evening,
    daily_kitsune_festival, daily_kitsune_night, daily_kitsune_confess,
    daily_vampire_shift, daily_vampire_story, daily_vampire_trust,
    daily_cui_help, daily_cui_secret,
    // === 新增：附身深化线（15个节点） ===
    possessed_kitsune_deep, possessed_kitsune_memory, possessed_kitsune_choice, possessed_slime_basement, possessed_slime_customers, possessed_slime_transform, possessed_vampire_coven, possessed_vampire_hunt, possessed_vampire_eternity, possessed_succubus_bar, possessed_succubus_power, possessed_succubus_cost, possessed_dragon_authority, possessed_dragon_truth, possessed_dragon_choice,
    // === 新增：NPC个人结局线（10个节点） ===
    npc_kitsune_confession, npc_kitsune_leave, npc_kitsune_stay, npc_hana_feelings, npc_hana_flower_eternal, npc_vampire_regret, npc_vampire_cure, npc_cui_secret_reveal, npc_cui_protect,
    // === 新增：规则连锁线（8个节点） ===
    rule_chain_3_violations, rule_chain_witch, rule_chain_doctor, rule_chain_mirror, rule_chain_gender, rule_chain_cat, rule_chain_contract, rule_chain_madness,
    // === 新增：复合结局前置节点（8个节点） ===
    collector_tsf_check, collector_ending_check, harem_check, survivor_check, rule_counter, gender_identity_crisis, species_memory, true_awakening_prep,
    // === 新增：日常补充节点（7个节点） ===
    daily_nekomata, daily_bar_night, daily_shrine_morning, daily_hospital_midnight, daily_school_evening, daily_street_rain, daily_park,
      },
};

export default cyoaNetwork;