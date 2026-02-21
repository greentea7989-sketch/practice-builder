const themeToggle = document.getElementById('theme-toggle');
const drawButton = document.getElementById('draw-button');
const menuInput = document.getElementById('menu-input');
const clearInputButton = document.getElementById('clear-input');
const menuCount = document.getElementById('menu-count');
const filteredCount = document.getElementById('filtered-count');
const drawCountInput = document.getElementById('draw-count');
const allowDuplicateInput = document.getElementById('allow-duplicate');
const resultBox = document.getElementById('result-box');
const copyResultButton = document.getElementById('copy-result');
const clearHistoryButton = document.getElementById('clear-history');
const historyList = document.getElementById('history-list');
const statusMessage = document.getElementById('status-message');
const languageSelect = document.getElementById('language-select');

const themeStorageKey = 'theme-preference';
const languageStorageKey = 'language-preference';
const languageUrlParam = 'lang';
let lastResults = [];
let spinTimer = null;

const translations = {
    ko: {
        title: '식사 메뉴 추첨기',
        subtitle: '후보를 모아 한 번에 뽑아보세요. 오늘의 메뉴는 운명에 맡깁니다.',
        languageLabel: '언어 선택',
        inputTitle: '후보 입력',
        inputHelper: '줄마다 메뉴 1개씩 입력하세요. 콤마(,)로도 구분됩니다.',
        inputPlaceholder: '예: 김치찌개 #한식 #찌개\n초밥 #일식\n파스타 | 양식, 크리미',
        clearInput: '비우기',
        menuCount: '후보 {count}개',
        filteredCount: '정리 후 {count}개',
        optionTitle: '추첨 옵션',
        drawCountLabel: '뽑을 개수',
        allowDuplicateLabel: '중복 허용',
        drawNow: '지금 추첨',
        resultTitle: '오늘의 메뉴',
        copyResult: '결과 복사',
        clearHistory: '기록 지우기',
        resultPlaceholder: '아직 추첨 전입니다.',
        historyTitle: '추첨 기록',
        guideTitle: '메뉴 추천 가이드',
        guideHelper: '상황과 취향을 반영해 후보를 구성하면 추천이 더 만족스러워집니다.',
        guide1: '<strong>혼밥/바쁜 날:</strong> 김밥, 덮밥, 컵밥, 샐러드처럼 빠르게 먹을 수 있는 메뉴를 넣어 보세요.',
        guide2: '<strong>여럿이 함께:</strong> 치킨, 피자, 보쌈처럼 공유하기 좋은 메뉴를 후보로 추천합니다.',
        guide3: '<strong>날씨/기분:</strong> 비 오는 날은 국물, 더운 날은 냉면·샐러드처럼 컨디션에 맞는 키워드를 추가해 보세요.',
        guide4: '<strong>다이어트/건강:</strong> 단백질·채소 중심 메뉴를 모아두면 선택 부담이 줄어듭니다.',
        faqTitle: '자주 묻는 질문',
        faq1: '<strong>Q. 오늘 뭐 먹지 고민될 때 어떻게 쓰나요?</strong><br>후보 메뉴를 입력하고 “지금 추첨”을 누르면 랜덤 추천을 바로 받을 수 있습니다.',
        faq2: '<strong>Q. 메뉴는 어떤 형식으로 입력하나요?</strong><br>줄바꿈 또는 콤마로 구분해 입력하면 됩니다.',
        faq3: '<strong>Q. 여러 메뉴를 동시에 추천받을 수 있나요?</strong><br>“뽑을 개수”를 늘리면 여러 개가 한 번에 추첨됩니다.',
        faq4: '<strong>Q. 중복 추천이 나오게 할 수 있나요?</strong><br>“중복 허용” 옵션을 켜면 같은 메뉴가 다시 나올 수 있습니다.',
        faq5: '<strong>Q. 추천 결과를 저장할 수 있나요?</strong><br>추첨 기록이 남아 이전 결과를 확인하고 복사할 수 있습니다.',
        contactTitle: '제휴 문의',
        contactHelper: '제품/서비스 제휴, 공동 프로모션, 컨텐츠 협업 등 편하게 문의 주세요.',
        contactName: '이름',
        contactNamePlaceholder: '홍길동',
        contactEmail: '이메일',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: '회사/팀',
        contactCompanyPlaceholder: '회사명 또는 팀명',
        contactMessage: '문의 내용',
        contactMessagePlaceholder: '제휴 목적, 일정, 예산 범위 등을 알려주세요.',
        contactConsent: '제휴 문의 처리를 위해 이름, 이메일, 회사/팀, 문의 내용을 수집하는 것에 동의합니다.',
        contactConsentNote: '수집된 정보는 문의 응대 목적 외에는 사용하지 않으며, 처리 후 90일 내 파기합니다.',
        contactSubmit: '제휴 문의 보내기',
        contactNote: '제출 시 Formspree를 통해 이메일로 전달됩니다.',
        commentsTitle: '댓글',
        commentsHelper: '식사 메뉴 아이디어를 공유해 주세요.',
        commentsNoscript: '댓글을 보려면 자바스크립트를 활성화해 주세요.',
        themeDark: '다크모드',
        themeLight: '화이트모드',
        statusNoMenus: '추첨할 메뉴가 없습니다. 후보를 입력해 주세요.',
        statusTooMany: '중복 없이 {count}개를 뽑을 수 없어요. 최대 {max}개까지 가능합니다.',
        statusStart: '추첨을 시작합니다!',
        statusDone: '추첨 완료! 맛있게 드세요.',
        statusCleared: '후보가 비워졌습니다. 새 메뉴를 입력하세요.',
        statusCopyNone: '복사할 결과가 없습니다. 먼저 추첨해 주세요.',
        statusCopyOk: '결과를 복사했습니다!',
        statusCopyFail: '복사에 실패했습니다. 브라우저 권한을 확인해 주세요.',
        statusHistoryCleared: '추첨 기록을 지웠습니다.',
        formSending: '전송 중입니다. 잠시만 기다려 주세요...',
        formSuccess: '문의가 정상적으로 접수되었습니다. 빠르게 회신드릴게요!',
        formFail: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        formNetwork: '네트워크 오류가 발생했습니다. 연결을 확인해 주세요.',
        resultText: '오늘의 메뉴: {items}'
    },
    en: {
        title: 'Meal Raffle',
        subtitle: 'Collect options and draw at once. Let fate decide today’s menu.',
        languageLabel: 'Language',
        inputTitle: 'Enter Options',
        inputHelper: 'Enter one menu per line. Commas are also supported.',
        inputPlaceholder: 'e.g. Kimchi stew #Korean\nSushi #Japanese\nPasta | Creamy',
        clearInput: 'Clear',
        menuCount: 'Options {count}',
        filteredCount: 'After cleanup {count}',
        optionTitle: 'Draw Options',
        drawCountLabel: 'Number to draw',
        allowDuplicateLabel: 'Allow duplicates',
        drawNow: 'Draw Now',
        resultTitle: 'Today’s Menu',
        copyResult: 'Copy Result',
        clearHistory: 'Clear History',
        resultPlaceholder: 'No draw yet.',
        historyTitle: 'Draw History',
        guideTitle: 'Menu Guide',
        guideHelper: 'Tailor your list to your situation for better picks.',
        guide1: '<strong>Solo / busy:</strong> Try quick options like rolls, bowls, salads.',
        guide2: '<strong>Group meal:</strong> Add shareable foods like chicken, pizza, bossam.',
        guide3: '<strong>Weather / mood:</strong> Soup for rainy days, cold noodles for hot days.',
        guide4: '<strong>Diet / health:</strong> Protein and veggies reduce decision fatigue.',
        faqTitle: 'FAQ',
        faq1: '<strong>Q. How do I use this when I can’t decide?</strong><br>Enter options and tap “Draw Now” for a random pick.',
        faq2: '<strong>Q. How should I enter menus?</strong><br>Separate by new lines or commas.',
        faq3: '<strong>Q. Can I draw multiple menus?</strong><br>Increase “Number to draw”.',
        faq4: '<strong>Q. Can I allow duplicates?</strong><br>Enable “Allow duplicates”.',
        faq5: '<strong>Q. Can I save results?</strong><br>Draw history lets you review and copy.',
        contactTitle: 'Partnership',
        contactHelper: 'Reach out for product/service partnerships or co-promotions.',
        contactName: 'Name',
        contactNamePlaceholder: 'Jane Doe',
        contactEmail: 'Email',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: 'Company/Team',
        contactCompanyPlaceholder: 'Company or team name',
        contactMessage: 'Message',
        contactMessagePlaceholder: 'Tell us the purpose, timeline, and budget.',
        contactConsent: 'I agree to the collection of name, email, company/team, and message for inquiry handling.',
        contactConsentNote: 'Data is used only for inquiry response and deleted within 90 days.',
        contactSubmit: 'Send Inquiry',
        contactNote: 'Submissions are delivered by email via Formspree.',
        commentsTitle: 'Comments',
        commentsHelper: 'Share your menu ideas.',
        commentsNoscript: 'Enable JavaScript to view comments.',
        themeDark: 'Dark Mode',
        themeLight: 'Light Mode',
        statusNoMenus: 'No menus to draw. Please add options.',
        statusTooMany: 'Cannot draw {count} without duplicates. Max is {max}.',
        statusStart: 'Starting the draw!',
        statusDone: 'Draw complete! Enjoy your meal.',
        statusCleared: 'Options cleared. Add new menus.',
        statusCopyNone: 'No results to copy. Draw first.',
        statusCopyOk: 'Result copied!',
        statusCopyFail: 'Copy failed. Check browser permissions.',
        statusHistoryCleared: 'History cleared.',
        formSending: 'Sending... Please wait.',
        formSuccess: 'Inquiry received. We will respond soon!',
        formFail: 'Send failed. Please try again later.',
        formNetwork: 'Network error. Check your connection.',
        resultText: 'Today’s menu: {items}'
    },
    ja: {
        title: 'メニュー抽選',
        subtitle: '候補をまとめて一度に抽選。今日のメニューは運にお任せ。',
        languageLabel: '言語',
        inputTitle: '候補入力',
        inputHelper: '1行に1つ入力。カンマでも区切れます。',
        inputPlaceholder: '例: キムチチゲ #韓国\n寿司 #和食\nパスタ | クリーミー',
        clearInput: 'クリア',
        menuCount: '候補 {count}件',
        filteredCount: '整理後 {count}件',
        optionTitle: '抽選オプション',
        drawCountLabel: '抽選数',
        allowDuplicateLabel: '重複可',
        drawNow: '今すぐ抽選',
        resultTitle: '今日のメニュー',
        copyResult: '結果コピー',
        clearHistory: '履歴削除',
        resultPlaceholder: 'まだ抽選していません。',
        historyTitle: '抽選履歴',
        guideTitle: 'おすすめガイド',
        guideHelper: '状況や好みに合わせて候補を作ると満足度が上がります。',
        guide1: '<strong>ひとり/忙しい日:</strong> 巻き寿司、丼、サラダなど手軽なもの。',
        guide2: '<strong>みんなで:</strong> チキン、ピザ、ボッサムなどシェア向き。',
        guide3: '<strong>天気/気分:</strong> 雨はスープ、暑い日は冷麺やサラダ。',
        guide4: '<strong>ダイエット/健康:</strong> たんぱく質と野菜中心がおすすめ。',
        faqTitle: 'よくある質問',
        faq1: '<strong>Q. どう使うの？</strong><br>候補を入力して「今すぐ抽選」を押すだけ。',
        faq2: '<strong>Q. 入力形式は？</strong><br>改行かカンマ区切りでOK。',
        faq3: '<strong>Q. 複数抽選できる？</strong><br>「抽選数」を増やしてください。',
        faq4: '<strong>Q. 重複は可能？</strong><br>「重複可」をオンにしてください。',
        faq5: '<strong>Q. 結果は保存できる？</strong><br>履歴で確認・コピーできます。',
        contactTitle: '提携お問い合わせ',
        contactHelper: '提携、共同プロモーション、コンテンツ協業などお気軽に。',
        contactName: 'お名前',
        contactNamePlaceholder: '山田太郎',
        contactEmail: 'メール',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: '会社/チーム',
        contactCompanyPlaceholder: '会社名またはチーム名',
        contactMessage: 'お問い合わせ内容',
        contactMessagePlaceholder: '目的、日程、予算などをお知らせください。',
        contactConsent: '問い合わせ対応のため、氏名・メール・会社/チーム・内容の収集に同意します。',
        contactConsentNote: '情報は対応目的以外に使用せず、90日以内に破棄します。',
        contactSubmit: '送信する',
        contactNote: '送信内容はFormspree経由でメール送信されます。',
        commentsTitle: 'コメント',
        commentsHelper: 'メニューのアイデアを共有してください。',
        commentsNoscript: 'コメントを見るにはJavaScriptを有効にしてください。',
        themeDark: 'ダークモード',
        themeLight: 'ライトモード',
        statusNoMenus: '抽選するメニューがありません。候補を入力してください。',
        statusTooMany: '重複なしで{count}件は抽選できません。最大{max}件です。',
        statusStart: '抽選を開始します！',
        statusDone: '抽選完了！おいしく召し上がれ。',
        statusCleared: '候補をクリアしました。新しいメニューを入力してください。',
        statusCopyNone: 'コピーする結果がありません。先に抽選してください。',
        statusCopyOk: '結果をコピーしました！',
        statusCopyFail: 'コピーに失敗しました。権限を確認してください。',
        statusHistoryCleared: '履歴を削除しました。',
        formSending: '送信中です。少々お待ちください...',
        formSuccess: 'お問い合わせを受け付けました。すぐにご返信します！',
        formFail: '送信に失敗しました。後で再試行してください。',
        formNetwork: 'ネットワークエラーです。接続を確認してください。',
        resultText: '今日のメニュー: {items}'
    },
    'zh-Hans': {
        title: '菜单抽签',
        subtitle: '把候选一次抽完，今天吃什么交给运气。',
        languageLabel: '语言',
        inputTitle: '输入候选',
        inputHelper: '每行一个菜单，也可用逗号分隔。',
        inputPlaceholder: '例：泡菜汤 #韩式\n寿司 #日式\n意面 | 奶油',
        clearInput: '清空',
        menuCount: '候选 {count} 个',
        filteredCount: '整理后 {count} 个',
        optionTitle: '抽签选项',
        drawCountLabel: '抽取数量',
        allowDuplicateLabel: '允许重复',
        drawNow: '立即抽签',
        resultTitle: '今日菜单',
        copyResult: '复制结果',
        clearHistory: '清除记录',
        resultPlaceholder: '尚未抽签。',
        historyTitle: '抽签记录',
        guideTitle: '推荐指南',
        guideHelper: '根据场景与口味设置候选，满意度更高。',
        guide1: '<strong>独食/忙碌:</strong> 选择便捷餐，如饭团、盖饭、沙拉。',
        guide2: '<strong>多人共享:</strong> 加入鸡、披萨、五花肉等。',
        guide3: '<strong>天气/心情:</strong> 下雨喝汤，炎热吃冷面或沙拉。',
        guide4: '<strong>健康/减脂:</strong> 以蛋白质与蔬菜为主。',
        faqTitle: '常见问题',
        faq1: '<strong>Q. 纠结吃什么怎么用？</strong><br>输入候选后点击“立即抽签”。',
        faq2: '<strong>Q. 如何输入菜单？</strong><br>换行或逗号分隔即可。',
        faq3: '<strong>Q. 能抽多个吗？</strong><br>提高“抽取数量”。',
        faq4: '<strong>Q. 能允许重复吗？</strong><br>开启“允许重复”。',
        faq5: '<strong>Q. 结果能保存吗？</strong><br>抽签记录可查看与复制。',
        contactTitle: '合作咨询',
        contactHelper: '欢迎产品/服务合作、联合推广或内容合作。',
        contactName: '姓名',
        contactNamePlaceholder: '张三',
        contactEmail: '邮箱',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: '公司/团队',
        contactCompanyPlaceholder: '公司或团队名称',
        contactMessage: '咨询内容',
        contactMessagePlaceholder: '请说明目的、时间与预算范围。',
        contactConsent: '同意为处理咨询收集姓名、邮箱、公司/团队与内容。',
        contactConsentNote: '仅用于咨询回复，90天内删除。',
        contactSubmit: '发送咨询',
        contactNote: '提交内容将通过 Formspree 发送邮件。',
        commentsTitle: '评论',
        commentsHelper: '分享你的菜单灵感。',
        commentsNoscript: '请启用 JavaScript 以查看评论。',
        themeDark: '深色模式',
        themeLight: '浅色模式',
        statusNoMenus: '没有可抽取的菜单，请先输入。',
        statusTooMany: '不能在不重复的情况下抽取{count}个，最多{max}个。',
        statusStart: '开始抽签！',
        statusDone: '抽签完成！祝用餐愉快。',
        statusCleared: '已清空候选，请重新输入。',
        statusCopyNone: '没有可复制的结果，请先抽签。',
        statusCopyOk: '已复制结果！',
        statusCopyFail: '复制失败，请检查浏览器权限。',
        statusHistoryCleared: '已清除记录。',
        formSending: '正在发送，请稍候...',
        formSuccess: '已收到咨询，我们将尽快回复。',
        formFail: '发送失败，请稍后再试。',
        formNetwork: '网络错误，请检查连接。',
        resultText: '今日菜单：{items}'
    },
    'zh-Hant': {
        title: '菜單抽籤',
        subtitle: '把候選一次抽完，今天吃什麼交給運氣。',
        languageLabel: '語言',
        inputTitle: '輸入候選',
        inputHelper: '每行一個菜單，也可用逗號分隔。',
        inputPlaceholder: '例：泡菜湯 #韓式\n壽司 #日式\n義大利麵 | 奶油',
        clearInput: '清空',
        menuCount: '候選 {count} 個',
        filteredCount: '整理後 {count} 個',
        optionTitle: '抽籤選項',
        drawCountLabel: '抽取數量',
        allowDuplicateLabel: '允許重複',
        drawNow: '立即抽籤',
        resultTitle: '今日菜單',
        copyResult: '複製結果',
        clearHistory: '清除記錄',
        resultPlaceholder: '尚未抽籤。',
        historyTitle: '抽籤記錄',
        guideTitle: '推薦指南',
        guideHelper: '依情境與口味設定候選，滿意度更高。',
        guide1: '<strong>獨食/忙碌:</strong> 選擇方便餐，如飯糰、蓋飯、沙拉。',
        guide2: '<strong>多人共享:</strong> 加入炸雞、披薩、五花肉等。',
        guide3: '<strong>天氣/心情:</strong> 下雨喝湯，炎熱吃冷麵或沙拉。',
        guide4: '<strong>健康/減脂:</strong> 以蛋白質與蔬菜為主。',
        faqTitle: '常見問題',
        faq1: '<strong>Q. 猶豫吃什麼怎麼用？</strong><br>輸入候選後點「立即抽籤」。',
        faq2: '<strong>Q. 如何輸入菜單？</strong><br>換行或逗號分隔即可。',
        faq3: '<strong>Q. 能抽多個嗎？</strong><br>提高「抽取數量」。',
        faq4: '<strong>Q. 能允許重複嗎？</strong><br>開啟「允許重複」。',
        faq5: '<strong>Q. 結果能保存嗎？</strong><br>抽籤記錄可查看與複製。',
        contactTitle: '合作洽詢',
        contactHelper: '歡迎產品/服務合作、聯合推廣或內容合作。',
        contactName: '姓名',
        contactNamePlaceholder: '王小明',
        contactEmail: '信箱',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: '公司/團隊',
        contactCompanyPlaceholder: '公司或團隊名稱',
        contactMessage: '洽詢內容',
        contactMessagePlaceholder: '請說明目的、時程與預算範圍。',
        contactConsent: '同意為處理洽詢蒐集姓名、信箱、公司/團隊與內容。',
        contactConsentNote: '僅用於回覆洽詢，90天內刪除。',
        contactSubmit: '送出洽詢',
        contactNote: '提交內容將透過 Formspree 以Email寄送。',
        commentsTitle: '留言',
        commentsHelper: '分享你的菜單靈感。',
        commentsNoscript: '請啟用 JavaScript 以查看留言。',
        themeDark: '深色模式',
        themeLight: '淺色模式',
        statusNoMenus: '沒有可抽取的菜單，請先輸入。',
        statusTooMany: '不可在不重複情況下抽取{count}個，最多{max}個。',
        statusStart: '開始抽籤！',
        statusDone: '抽籤完成！祝用餐愉快。',
        statusCleared: '已清空候選，請重新輸入。',
        statusCopyNone: '沒有可複製的結果，請先抽籤。',
        statusCopyOk: '已複製結果！',
        statusCopyFail: '複製失敗，請確認瀏覽器權限。',
        statusHistoryCleared: '已清除記錄。',
        formSending: '送出中，請稍候...',
        formSuccess: '已收到洽詢，我們會盡快回覆。',
        formFail: '送出失敗，請稍後再試。',
        formNetwork: '網路錯誤，請檢查連線。',
        resultText: '今日菜單：{items}'
    },
    la: {
        title: 'Sortitio Ciborum',
        subtitle: 'Optiones colligite et simul sortimini. Menus hodiernos fortuna decernit.',
        languageLabel: 'Lingua',
        inputTitle: 'Optiones Inserere',
        inputHelper: 'Una optio per lineam. Comma quoque valet.',
        inputPlaceholder: 'ex: Kimchi #Koreana\nSushi #Iaponica\nPasta | Cremosa',
        clearInput: 'Purgare',
        menuCount: 'Optiones {count}',
        filteredCount: 'Post ordinem {count}',
        optionTitle: 'Optiones Sortitionis',
        drawCountLabel: 'Numerus extrahendi',
        allowDuplicateLabel: 'Duplicata sinere',
        drawNow: 'Nunc Sortire',
        resultTitle: 'Menu Hodiernum',
        copyResult: 'Exemplum Copiare',
        clearHistory: 'Historiam Delere',
        resultPlaceholder: 'Nondum sortitum est.',
        historyTitle: 'Historia Sortitionis',
        guideTitle: 'Dux Consiliorum',
        guideHelper: 'Aptate optiones ad condicionem ut melius eveniat.',
        guide1: '<strong>Solus / occupatus:</strong> Cibi celeres ut oryzae involutae, acetaria.',
        guide2: '<strong>Cum amicis:</strong> Cibi communes ut pullus, pizza, bossam.',
        guide3: '<strong>Tempestas / animus:</strong> Pluvia: ius; calor: acetaria.',
        guide4: '<strong>Valetudo:</strong> Proteina et olera praefer.',
        faqTitle: 'Quaestiones',
        faq1: '<strong>Q. Quomodo utor?</strong><br>Optiones inserite et “Nunc Sortire” premete.',
        faq2: '<strong>Q. Forma inputus?</strong><br>Lineis novis aut commatibus.',
        faq3: '<strong>Q. Plures optiones?</strong><br>Augere “Numerus extrahendi”.',
        faq4: '<strong>Q. Duplicata?</strong><br>Permitte “Duplicata sinere”.',
        faq5: '<strong>Q. Possum servare?</strong><br>Historia servatur et copiari potest.',
        contactTitle: 'Consociatio',
        contactHelper: 'De consociationibus et promotionibus scribite.',
        contactName: 'Nomen',
        contactNamePlaceholder: 'Marcus',
        contactEmail: 'Email',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: 'Societas/Grex',
        contactCompanyPlaceholder: 'Nomen societatis',
        contactMessage: 'Nuntius',
        contactMessagePlaceholder: 'Propositum, tempus, budget.',
        contactConsent: 'Consentio collectioni nominis, email, societatis, nuntii.',
        contactConsentNote: 'Data solum ad responsionem et intra 90 dies delentur.',
        contactSubmit: 'Mittere',
        contactNote: 'Per Formspree email mittitur.',
        commentsTitle: 'Commentarii',
        commentsHelper: 'Ideae tuae de menu.',
        commentsNoscript: 'JavaScript necessarium est ad commentarios.',
        themeDark: 'Modus Obscurus',
        themeLight: 'Modus Clarus',
        statusNoMenus: 'Nullae optiones. Inserite quaeso.',
        statusTooMany: 'Sine duplicatis {count} extrahi non potest. Max {max}.',
        statusStart: 'Sortitio incipit!',
        statusDone: 'Sortitio perfecta. Bonum appetitum.',
        statusCleared: 'Optiones purgatae sunt.',
        statusCopyNone: 'Nullum exemplar. Primum sortire.',
        statusCopyOk: 'Exemplum copiatum!',
        statusCopyFail: 'Copia defecit. Permissa inspice.',
        statusHistoryCleared: 'Historia deleta.',
        formSending: 'Mittitur... exspecta.',
        formSuccess: 'Acceptum est. Mox respondebimus!',
        formFail: 'Mittere non potuit. Postea tenta.',
        formNetwork: 'Error retis. Coniunctionem inspice.',
        resultText: 'Menu hodiernum: {items}'
    },
    vi: {
        title: 'Bốc Thăm Món Ăn',
        subtitle: 'Gom lựa chọn và bốc một lần. Hôm nay ăn gì để may mắn quyết định.',
        languageLabel: 'Ngôn ngữ',
        inputTitle: 'Nhập lựa chọn',
        inputHelper: 'Mỗi dòng một món. Có thể phân tách bằng dấu phẩy.',
        inputPlaceholder: 'vd: Canh kim chi #Hàn\nSushi #Nhật\nPasta | Kem',
        clearInput: 'Xóa',
        menuCount: 'Lựa chọn {count}',
        filteredCount: 'Sau lọc {count}',
        optionTitle: 'Tùy chọn bốc thăm',
        drawCountLabel: 'Số lượng bốc',
        allowDuplicateLabel: 'Cho phép trùng',
        drawNow: 'Bốc ngay',
        resultTitle: 'Món hôm nay',
        copyResult: 'Sao chép kết quả',
        clearHistory: 'Xóa lịch sử',
        resultPlaceholder: 'Chưa bốc thăm.',
        historyTitle: 'Lịch sử bốc thăm',
        guideTitle: 'Gợi ý chọn món',
        guideHelper: 'Điều chỉnh danh sách theo tình huống để hài lòng hơn.',
        guide1: '<strong>Một mình/bận rộn:</strong> Chọn món nhanh như cơm cuộn, bát cơm, salad.',
        guide2: '<strong>Ăn cùng nhóm:</strong> Thêm gà rán, pizza, bossam.',
        guide3: '<strong>Thời tiết/tâm trạng:</strong> Trời mưa ăn món nước, trời nóng ăn lạnh.',
        guide4: '<strong>Giảm cân/sức khỏe:</strong> Ưu tiên đạm và rau.',
        faqTitle: 'Câu hỏi thường gặp',
        faq1: '<strong>Q. Dùng thế nào khi phân vân?</strong><br>Nhập danh sách và bấm “Bốc ngay”.',
        faq2: '<strong>Q. Nhập theo định dạng nào?</strong><br>Xuống dòng hoặc dấu phẩy.',
        faq3: '<strong>Q. Bốc nhiều món được không?</strong><br>Tăng “Số lượng bốc”.',
        faq4: '<strong>Q. Cho phép trùng không?</strong><br>Bật “Cho phép trùng”.',
        faq5: '<strong>Q. Lưu kết quả được không?</strong><br>Lịch sử cho phép xem và sao chép.',
        contactTitle: 'Liên hệ hợp tác',
        contactHelper: 'Hợp tác sản phẩm/dịch vụ, đồng quảng bá hoặc nội dung.',
        contactName: 'Tên',
        contactNamePlaceholder: 'Nguyễn Văn A',
        contactEmail: 'Email',
        contactEmailPlaceholder: 'name@company.com',
        contactCompany: 'Công ty/nhóm',
        contactCompanyPlaceholder: 'Tên công ty hoặc nhóm',
        contactMessage: 'Nội dung',
        contactMessagePlaceholder: 'Mục tiêu, thời gian, ngân sách.',
        contactConsent: 'Tôi đồng ý cung cấp tên, email, công ty/nhóm và nội dung để xử lý.',
        contactConsentNote: 'Chỉ dùng để phản hồi và xóa trong 90 ngày.',
        contactSubmit: 'Gửi liên hệ',
        contactNote: 'Nội dung được gửi qua email bằng Formspree.',
        commentsTitle: 'Bình luận',
        commentsHelper: 'Chia sẻ ý tưởng món ăn.',
        commentsNoscript: 'Vui lòng bật JavaScript để xem bình luận.',
        themeDark: 'Chế độ tối',
        themeLight: 'Chế độ sáng',
        statusNoMenus: 'Không có món để bốc. Hãy nhập danh sách.',
        statusTooMany: 'Không thể bốc {count} khi không trùng. Tối đa {max}.',
        statusStart: 'Bắt đầu bốc thăm!',
        statusDone: 'Hoàn tất! Chúc ngon miệng.',
        statusCleared: 'Đã xóa danh sách. Hãy nhập mới.',
        statusCopyNone: 'Không có kết quả để sao chép. Hãy bốc trước.',
        statusCopyOk: 'Đã sao chép kết quả!',
        statusCopyFail: 'Sao chép thất bại. Kiểm tra quyền trình duyệt.',
        statusHistoryCleared: 'Đã xóa lịch sử.',
        formSending: 'Đang gửi... vui lòng đợi.',
        formSuccess: 'Đã nhận liên hệ. Chúng tôi sẽ phản hồi sớm!',
        formFail: 'Gửi thất bại. Vui lòng thử lại.',
        formNetwork: 'Lỗi mạng. Kiểm tra kết nối.',
        resultText: 'Món hôm nay: {items}'
    }
};

const languageLocales = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    'zh-Hans': 'zh-CN',
    'zh-Hant': 'zh-TW',
    la: 'la',
    vi: 'vi-VN'
};

function normalizeLanguage(value) {
    if (!value) {
        return 'ko';
    }
    const lower = value.toLowerCase();
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('en')) return 'en';
    if (lower.startsWith('ja')) return 'ja';
    if (lower.startsWith('vi')) return 'vi';
    if (lower.startsWith('la')) return 'la';
    if (lower.startsWith('zh-hant') || lower.startsWith('zh-tw') || lower.startsWith('zh-hk')) return 'zh-Hant';
    if (lower.startsWith('zh-hans') || lower.startsWith('zh-cn') || lower.startsWith('zh-sg') || lower.startsWith('zh')) return 'zh-Hans';
    return 'ko';
}

function getStoredValue(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function setStoredValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // Ignore storage errors (e.g., private mode restrictions).
    }
}

function getLanguageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get(languageUrlParam);
}

let currentLanguage = normalizeLanguage(
    getLanguageFromUrl()
    || getStoredValue(languageStorageKey)
    || 'ko'
);

function t(key, vars = {}) {
    const table = translations[currentLanguage] || translations.ko;
    const fallback = translations.ko;
    let text = table[key] || fallback[key] || key;
    Object.keys(vars).forEach(name => {
        text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(vars[name]));
    });
    return text;
}

function applyLanguage(lang) {
    currentLanguage = normalizeLanguage(lang);
    setStoredValue(languageStorageKey, currentLanguage);
    document.documentElement.lang = currentLanguage;

    const url = new URL(window.location.href);
    url.searchParams.set(languageUrlParam, currentLanguage);
    window.history.replaceState({}, '', url);

    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.setAttribute('aria-label', t('languageLabel'));
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            element.textContent = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
        const key = element.getAttribute('data-i18n-html');
        if (key) {
            element.innerHTML = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key) {
            element.setAttribute('placeholder', t(key));
        }
    });

    const currentTheme = document.body.getAttribute('data-theme') || getSystemTheme();
    applyTheme(currentTheme);
    updateCounts();
    renderResults(lastResults);
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeToggle) {
        const isDark = theme === 'dark';
        themeToggle.textContent = isDark ? t('themeLight') : t('themeDark');
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }
}

function initializeTheme() {
    const storedTheme = getStoredValue(themeStorageKey);
    const theme = storedTheme || getSystemTheme();
    applyTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || getSystemTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setStoredValue(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
}

function normalizeMenus(text) {
    const rawItems = text
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(Boolean);

    const uniqueItems = [];
    const seen = new Set();
    rawItems.forEach(item => {
        const key = item.toLowerCase();
        if (!seen.has(key)) {
            uniqueItems.push(item);
            seen.add(key);
        }
    });

    return uniqueItems;
}

function updateCounts() {
    const menus = normalizeMenus(menuInput.value);
    menuCount.textContent = t('menuCount', { count: menus.length });
    filteredCount.textContent = t('filteredCount', { count: menus.length });
}

function setStatus(message) {
    if (!statusMessage) {
        return;
    }
    statusMessage.textContent = message;
}

function renderResults(results) {
    resultBox.classList.remove('spinning');
    if (results.length === 0) {
        resultBox.innerHTML = `<p class="placeholder">${t('resultPlaceholder')}</p>`;
        return;
    }

    const list = document.createElement('ul');
    list.className = 'result-list';
    results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'result-item';
        li.textContent = item;
        list.appendChild(li);
    });

    resultBox.innerHTML = '';
    resultBox.appendChild(list);
}

function pushHistory(results) {
    const time = new Date();
    const entry = document.createElement('li');
    const summary = document.createElement('span');
    summary.textContent = results.join(' · ');
    const timestamp = document.createElement('time');
    const locale = languageLocales[currentLanguage] || 'ko-KR';
    timestamp.textContent = time.toLocaleString(locale, { hour: '2-digit', minute: '2-digit' });

    entry.appendChild(summary);
    entry.appendChild(timestamp);

    historyList.prepend(entry);
}

function startSpinAnimation(pool, onComplete) {
    resultBox.classList.add('spinning');
    const spinDuration = 1200;
    const spinInterval = 80;
    const startTime = Date.now();

    spinTimer = setInterval(() => {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        resultBox.textContent = randomItem;

        if (Date.now() - startTime > spinDuration) {
            clearInterval(spinTimer);
            spinTimer = null;
            onComplete();
        }
    }, spinInterval);
}

function drawMenus() {
    if (spinTimer) {
        return;
    }
    const menus = normalizeMenus(menuInput.value);

    updateCounts();

    if (menus.length === 0) {
        setStatus(t('statusNoMenus'));
        renderResults([]);
        return;
    }

    const drawCount = Math.max(1, Number(drawCountInput.value) || 1);
    const allowDuplicate = allowDuplicateInput.checked;

    if (!allowDuplicate && drawCount > menus.length) {
        setStatus(t('statusTooMany', { count: drawCount, max: menus.length }));
        renderResults([]);
        return;
    }

    setStatus(t('statusStart'));

    const pool = [...menus];

    drawButton.disabled = true;
    startSpinAnimation(pool, () => {
        const results = [];
        if (allowDuplicate) {
            for (let i = 0; i < drawCount; i += 1) {
                results.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        } else {
            for (let i = pool.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            results.push(...pool.slice(0, drawCount));
        }

        lastResults = results;
        renderResults(results);
        pushHistory(results);
        setStatus(t('statusDone'));
        drawButton.disabled = false;
    });
}

function clearInput() {
    menuInput.value = '';
    updateCounts();
    setStatus(t('statusCleared'));
}

function copyResult() {
    if (lastResults.length === 0) {
        setStatus(t('statusCopyNone'));
        return;
    }

    const text = t('resultText', { items: lastResults.join(', ') });
    navigator.clipboard.writeText(text).then(() => {
        setStatus(t('statusCopyOk'));
    }).catch(() => {
        setStatus(t('statusCopyFail'));
    });
}

function clearHistory() {
    historyList.innerHTML = '';
    setStatus(t('statusHistoryCleared'));
}

function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) {
        return;
    }
    const statusBox = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    const showStatus = (message, isError = false) => {
        if (!statusBox) {
            return;
        }
        statusBox.textContent = message;
        statusBox.classList.toggle('is-error', isError);
        statusBox.classList.add('is-visible');
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
        }
        showStatus(t('formSending'));

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                showStatus(t('formSuccess'));
            } else {
                let errorMessage = t('formFail');
                try {
                    const data = await response.json();
                    if (data && data.errors && data.errors.length > 0) {
                        errorMessage = data.errors.map(error => error.message).join(' ');
                    }
                } catch (error) {
                    // Ignore JSON parsing errors and use default message.
                }
                showStatus(errorMessage, true);
            }
        } catch (error) {
            showStatus(t('formNetwork'), true);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

initializeTheme();
applyLanguage(currentLanguage);
updateCounts();
setupContactForm();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (languageSelect) {
    const onLanguageChange = (event) => {
        applyLanguage(event.target.value);
    };
    languageSelect.addEventListener('change', onLanguageChange);
    languageSelect.addEventListener('input', onLanguageChange);
}

drawButton.addEventListener('click', drawMenus);
menuInput.addEventListener('input', updateCounts);
clearInputButton.addEventListener('click', clearInput);
copyResultButton.addEventListener('click', copyResult);
clearHistoryButton.addEventListener('click', clearHistory);
