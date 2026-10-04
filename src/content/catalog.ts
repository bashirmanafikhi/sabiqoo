// The heart of Sabiqoo: a curated, bilingual catalog of good-deed ideas.
// Static app content (not user data) — the user's own data lives only in the
// `history` table. Each deed is self-contained: title + one-line description
// in both Arabic and English.

export interface DeedCategory {
  id: string;
  ar: string;
  en: string;
  /** Ionicons name */
  icon: string;
}

export interface DeedSuggestion {
  key: string;
  category: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
}

export const CATEGORIES: DeedCategory[] = [
  { id: 'charity', ar: 'صدقة وعطاء', en: 'Charity & Giving', icon: 'gift-outline' },
  { id: 'family', ar: 'صلة الأهل', en: 'Family Ties', icon: 'people-outline' },
  { id: 'kindness', ar: 'معاملة الناس', en: 'Kindness to People', icon: 'hand-left-outline' },
  { id: 'dhikr', ar: 'أذكار وذكر', en: 'Dhikr & Dua', icon: 'sparkles-outline' },
  { id: 'quran', ar: 'قرآن وتدبّر', en: 'Quran & Reflection', icon: 'book-outline' },
  { id: 'prayer', ar: 'صلاة ومساجد', en: 'Prayer & Mosques', icon: 'moon-outline' },
  { id: 'community', ar: 'خدمة المجتمع', en: 'Serving Community', icon: 'people-circle-outline' },
  { id: 'nature', ar: 'بيئة وحيوان', en: 'Nature & Animals', icon: 'leaf-outline' },
];

export const SUGGESTIONS: DeedSuggestion[] = [
  // ─── Charity & Giving ───────────────────────────────────────────────────────
  { key: 'ch-sadaqah-little', category: 'charity', ar: 'تصدّق ولو بالقليل', en: 'Give charity, even a little', descAr: 'لا تنتظر كثرة المال؛ الصدقة الصغيرة الدائمة أحب إلى الله.', descEn: "Don't wait for wealth — small, steady charity is dearest to Allah." },
  { key: 'ch-feed-hungry', category: 'charity', ar: 'أطعم شخصًا جائعًا', en: 'Feed a hungry person', descAr: 'وجبة بسيطة قد تكون فرجًا لكرب عائلة كاملة.', descEn: "One simple meal can relieve a whole family's hardship." },
  { key: 'ch-give-water', category: 'charity', ar: 'سقِّ الناس ماءً', en: 'Offer water to people', descAr: 'سُنّة قائمة: مبرد ماء في مكان يمرّ به الناس يؤجَّر لك طالما شُرب منه.', descEn: 'A lasting sunnah: a water cooler where people pass by keeps earning you reward.' },
  { key: 'ch-sponsor-orphan', category: 'charity', ar: 'كفّل يتيمًا', en: 'Sponsor an orphan', descAr: 'وعد كبير لمن كفّل يتيمًا: القرابة في الجنة.', descEn: 'A great promise for the orphan’s sponsor: closeness in Paradise.' },
  { key: 'ch-gift-someone', category: 'charity', ar: 'أهدِ هدية بسيطة لأحدهم', en: 'Give someone a simple gift', descAr: 'هدية صغيرة تصلح القلوب وتحبّ الناس.', descEn: 'Small gifts mend hearts and warm relationships.' },
  { key: 'ch-join-campaign', category: 'charity', ar: 'شارك في حملة خيرية', en: 'Join a charity campaign', descAr: 'دعمك بالمال أو الوقت يجعل لك نصيبًا في كل خير ينتج.', descEn: 'Giving money or time earns you a share of every good it produces.' },
  { key: 'ch-sadaqah-jariyah', category: 'charity', ar: 'ابدأ صدقة جارية', en: 'Start a perpetual charity', descAr: 'كتاب مفيد أو بئر أو علم يُنتفع به: أثر يستمر بعدك.', descEn: 'A useful book, a well, knowledge that helps — impact that outlives you.' },
  { key: 'ch-donate-clothes', category: 'charity', ar: 'تبرّع بملابس لا تحتاجها', en: 'Donate clothes you no longer need', descAr: 'في خزانتك فائض يدفي أهلًا محتاجين.', descEn: 'Your closet holds surplus that can warm someone in need.' },
  { key: 'ch-food-neighbor', category: 'charity', ar: 'أرسل طعامًا لجارك', en: 'Send food to your neighbour', descAr: 'أفضل الهدية الطعام؛ حوّل طبقًا زائدًا إلى جوارك.', descEn: 'The best gift is food — turn an extra dish into neighbourly love.' },
  { key: 'ch-micro-donation', category: 'charity', ar: 'تبرّع بمبلغ صغير عبر الإنترنت', en: 'Make a small online donation', descAr: 'مبلغ يسير عندك قد يكون مشروعًا كاملًا عند أهل الحاجة.', descEn: 'A tiny amount for you can fund a whole project for someone in need.' },
  { key: 'ch-feed-fasting', category: 'charity', ar: 'أطعم صائمًا', en: 'Feed a fasting person', descAr: 'من أطعم صائمًا كان له مثل أجره بغير نقص.', descEn: 'Whoever feeds a fasting person earns the same reward, without any decrease.' },
  { key: 'ch-donation-box', category: 'charity', ar: 'ضع شيئًا في صندوق تبرعات', en: 'Put something in a donation box', descAr: 'ثوانٍ من وقتك، عمل يدوم في ميزانك.', descEn: 'Seconds of your time; a deed that stays on your scale.' },
  { key: 'ch-lend-tools', category: 'charity', ar: 'أعرِ أدواتك مجانًا', en: 'Lend your tools for free', descAr: 'أدواتك تنفع الناس وأنت نائم.', descEn: 'Your tools keep helping people while you sleep.' },
  { key: 'ch-support-student', category: 'charity', ar: 'ساهم في مصروف طالب', en: "Help pay a student's expenses", descAr: 'علم نافع ينتج من دعمك ويستمر بالأجر.', descEn: 'Supporting a student keeps producing beneficial knowledge — and reward.' },
  { key: 'ch-help-treatment', category: 'charity', ar: 'ساعد في تكاليف علاج', en: "Help cover someone's medical cost", descAr: 'من فرّج عن مؤمن كربة فرّج الله عنه.', descEn: "Relieve a believer's hardship and Allah will relieve yours." },
  { key: 'ch-early-zakat', category: 'charity', ar: 'قدّم زكاتك مبكرًا', en: 'Give your zakat early', descAr: 'لا تؤجّل ما جعله الله حقًا لغيرك؛ بادِر بالخير.', descEn: "Don't delay what Allah made others' due — be early, not on time." },
  { key: 'ch-give-secretly', category: 'charity', ar: 'تصدّق سرًّا دون أن تعلَم', en: 'Give secretly without being known', descAr: 'من السبعة الذين يظلهم الله: رجل تصدّق باستارته حتى لا تعلم شماله ما تنفق يمينه.', descEn: 'Among the seven shaded by Allah: the one who gives so secretly his left hand ignores his right.' },
  { key: 'ch-share-campaign', category: 'charity', ar: 'انشر حملة خيرية موثوقة', en: 'Share a trustworthy charity campaign', descAr: 'الدال على الخير كفاعله؛ مشاركتك قد تصل لقلب محتاج.', descEn: 'The one who points to good is like its doer — your share can reach a needy heart.' },
  { key: 'ch-free-ride', category: 'charity', ar: 'وسّل شخصًا مجانًا', en: 'Give someone a free ride', descAr: 'وقود ورحلة قصيرة تصنع لك أجرًا وله فرجًا.', descEn: 'Fuel and a short trip: reward for you, relief for them.' },
  { key: 'ch-family-basket', category: 'charity', ar: 'غطِّ احتياج أسرة محتاجة', en: "Fulfil a family's needs list", descAr: 'اسأل جمعية عن أسرة واحدة وغطِّ احتياجها الشهري كاملًا.', descEn: 'Ask a charity about one family and cover their whole monthly list.' },
  { key: 'ch-orphan-eid', category: 'charity', ar: 'أعد ليتيم فرحة عيد', en: 'Bring an orphan Eid joy', descAr: 'من فرّه يتيمًا فرّه الله يوم يقابله.', descEn: 'Bring joy to an orphan and Allah will bring you joy on the Day you meet Him.' },
  { key: 'ch-sacrifice-share', category: 'charity', ar: 'شارك في ذبيحة تُوزَّع', en: 'Join a sacrifice and its distribution', descAr: 'جزء من ذبيحة يُطعم عائلات نادرًا ما تتذوق اللحم.', descEn: 'A share of a sacrifice feeds families who rarely taste meat.' },

  // ─── Family Ties ────────────────────────────────────────────────────────────
  { key: 'fam-call-parents', category: 'family', ar: 'اتصل بوالديك واسأل عليهما', en: 'Call your parents and check on them', descAr: 'دقيقة صوت تفرحهما أكثر من هدية مؤجلة.', descEn: 'A minute of your voice delights them more than a delayed gift.' },
  { key: 'fam-visit-parents', category: 'family', ar: 'زر والديك اليوم', en: 'Visit your parents today', descAr: 'جلسة وجهًا لوجه لا يعوّضها اتصال.', descEn: 'Face-to-face time no phone call can replace.' },
  { key: 'fam-reconnect-relative', category: 'family', ar: 'اتصل بقريب منقطعت صلتك به', en: "Reach out to a relative you've lost touch with", descAr: 'الرحم تنقطع بالمرور الزمن؛ كن من يُعيد الخيط.', descEn: 'Ties fray with time — be the one who re-threads them.' },
  { key: 'fam-honour-elder', category: 'family', ar: 'اجلس مع كبير سن وكرّمه', en: 'Sit with an elder and honour them', descAr: 'ساعة مع كبير السن حكمة سنوات في حكاية واحدة.', descEn: 'An hour with an elder gives you years of wisdom in one story.' },
  { key: 'fam-forgive-relative', category: 'family', ar: 'سامح قريبًا أخطأ في حقك', en: 'Forgive a relative who wronged you', descAr: 'الصلح بين الأرحام من أعظم الأعمال عند الله.', descEn: 'Mending kinship is among the greatest of deeds.' },
  { key: 'fam-gift-mother', category: 'family', ar: 'أهدِ أمك شيئًا تحبّه', en: 'Give your mother something she loves', descAr: 'رضا الرب في رضا الوالدة؛ تفصيل صغير يصنع فرحة كبيرة.', descEn: 'A small detail makes a big joy — and Allah is pleased with her pleasure.' },
  { key: 'fam-listen-father', category: 'family', ar: 'اسمع لوالدك دون مقاطعة', en: 'Listen to your father without interrupting', descAr: 'الإنصات احترام أعلى من كل كلام.', descEn: 'Listening is a higher honour than any words.' },
  { key: 'fam-family-meal', category: 'family', ar: 'اجمع العائلة على مائدة', en: 'Gather the family at one table', descAr: 'وجبة مشتركة أسبوعيًا تبني بيتًا لا ينشطر.', descEn: 'A weekly shared meal builds a home that does not split.' },
  { key: 'fam-help-home', category: 'family', ar: 'ساعد في أعمال البيت دون طلب', en: 'Help at home without being asked', descAr: 'سهم صغير يخفّف عن أغلى الناس.', descEn: 'A small hand eases the dearest people’s load.' },
  { key: 'fam-visit-sick', category: 'family', ar: 'زر قريبًا مريضًا', en: 'Visit a sick relative', descAr: 'زيارة المريض رحمة تشفي القلب قبل الجسد.', descEn: 'Visiting the sick is a mercy that heals the heart before the body.' },
  { key: 'fam-teach-kids', category: 'family', ar: 'علّم أبناءك درسًا دينيًا قصيرًا', en: 'Teach your kids a short faith lesson', descAr: 'عشر دقائق قرآن أو حديث كل مساء تُبنى عليها شخصيتهم.', descEn: 'Ten minutes of Quran or hadith each evening shapes who they become.' },
  { key: 'fam-play-kids', category: 'family', ar: 'العب مع أبنائك دون هاتف', en: 'Play with your children, phone away', descAr: 'نصف ساعة اهتمام كامل أثمن من هدية غالية.', descEn: 'Half an hour of full attention beats a lavish gift.' },
  { key: 'fam-call-grandparents', category: 'family', ar: 'اتصل بجدّك أو جدّتك', en: 'Call your grandparents', descAr: 'صوتهم عندك اليوم أغلى مما تظن؛ لا تؤجّل.', descEn: 'Their voice is dearer than you think — do not postpone.' },
  { key: 'fam-reconnect-sibling', category: 'family', ar: 'صلح مع أخيك أو أختك', en: 'Reconnect with a sibling', descAr: 'صاحب طفولتك يستحق خطوة صغيرة تعيد السنين.', descEn: 'The one who knew your childhood deserves a small step that brings it back.' },
  { key: 'fam-dua-deceased', category: 'family', ar: 'ادعُ لوالديك المتوفّيين', en: 'Pray for your departed parents', descAr: 'هدية لا تتوقف: صدقة وقراءة ودعاء يصل إليهم.', descEn: 'A gift that never stops: charity, recitation, and dua reaching them.' },
  { key: 'fam-share-care', category: 'family', ar: 'شارك أخيك رعاية الوالدين', en: "Share your sibling's care duties", descAr: 'تقاسم العبء يعني ألّا ينكسر أحدكم.', descEn: 'Sharing the load means no one of you breaks.' },
  { key: 'fam-print-memory', category: 'family', ar: 'اطبع صورة عائلية قديمة وأهدِها', en: 'Print an old family photo as a gift', descAr: 'ذاكرة مجسّدة تفرح القلب أكثر من أحدث الهدايا.', descEn: 'A printed memory gladdens hearts more than the newest gift.' },
  { key: 'fam-favorite-dish', category: 'family', ar: 'اطبخ طبقًا يحبّه أحدهم', en: "Cook someone's favourite dish", descAr: 'الطبق المفضّل رسالة حب بلا كلام.', descEn: 'A favourite dish is a love letter without words.' },
  { key: 'fam-thank-spouse', category: 'family', ar: 'اشكر زوجك أو زوجتك اليوم', en: 'Thank your spouse today', descAr: 'كلمة شكر أمام الأبناء تعلّمهم الامتنان عمليًا.', descEn: 'A thank-you said in front of the children teaches gratitude by example.' },
  { key: 'fam-check-elder-neighbor', category: 'family', ar: 'اسأل عن جارك المسنّ', en: 'Check on your elderly neighbour', descAr: 'طرق باب كل يومين يطمئن قلبًا وحيدًا.', descEn: 'A knock every couple of days comforts a lonely heart.' },

  // ─── Kindness to People ─────────────────────────────────────────────────────
  { key: 'kind-smile', category: 'kindness', ar: 'ابتسم لمن تقابله', en: 'Smile at the people you meet', descAr: 'تبسّمك في وجه أخيك صدقة؛ أخف الأعمال وأسهلها.', descEn: 'Your smile is charity — the lightest deed and the easiest habit.' },
  { key: 'kind-good-word', category: 'kindness', ar: 'قل كلمة طيبة لمن تحدثه', en: 'Say a good word to whoever you talk to', descAr: 'الكلمة الطيبة صدقة؛ اختر ألطف تعبير في موقفك القادم.', descEn: 'A good word is charity — choose the kindest phrasing in your next conversation.' },
  { key: 'kind-ease-debt', category: 'kindness', ar: 'أجّل دينًا أو تنازل عنه', en: "Postpone or waive someone's debt", descAr: 'يوم الظل ظل الله لمن يسهر على مدينه.', descEn: "On the Day with no shade, Allah shades those who ease their debtors' burden." },
  { key: 'kind-apologize', category: 'kindness', ar: 'اعتذر لمن ظلمته', en: 'Apologise to someone you wronged', descAr: 'اعتذارك يفتح قلبه ويغلق باب الحساب.', descEn: 'Your apology opens their heart and closes the ledger.' },
  { key: 'kind-thank-teacher', category: 'kindness', ar: 'اشكر معلّمًا من ماضيك', en: 'Thank a teacher from your past', descAr: 'رسالة قصيرة إلى من علّمك تجعل أجره مستمرًا.', descEn: 'A short message to whoever taught you keeps earning them reward.' },
  { key: 'kind-return-favor', category: 'kindness', ar: 'ردّ جميلًا لمن أحسن إليك', en: 'Return a kindness done to you', descAr: 'الجميل يذبل إذا لم يُرَدّ؛ حدّد اليوم موعد الرد.', descEn: 'Kindness wilts if not returned — make today the day.' },
  { key: 'kind-defend-absent', category: 'kindness', ar: 'انتصر لغائب يُظلم', en: 'Defend someone who is absent', descAr: 'الدفاع عن غائب شجاعة عالية الأجر.', descEn: 'Defending the absent is a brave deed with high reward.' },
  { key: 'kind-end-feud', category: 'kindness', ar: 'اقطع خصومة قديمة', en: 'End an old feud', descAr: 'الهدنة الأولى كلمة واحدة: السلام عليكم.', descEn: 'The first ceasefire is one word: peace be upon you.' },
  { key: 'kind-help-carry', category: 'kindness', ar: 'ساعد أحدهم في حمل حاجته', en: 'Help someone carry their things', descAr: 'مهمة بسيطة في السوق قد تكون فرجًا لأم كبيرة.', descEn: 'A simple task at the market can relieve an elderly mother.' },
  { key: 'kind-kind-to-staff', category: 'kindness', ar: 'تعامل بلطف مع موظف خدمة', en: 'Be kind and patient with service workers', descAr: 'كلمة لطيفة لموظف متعب تُصلح يومه كله.', descEn: 'A kind word to a tired employee can fix their whole day.' },
  { key: 'kind-give-seat', category: 'kindness', ar: 'أعط مقعدك لمن يحتاجه', en: 'Give up your seat', descAr: 'ثانية من الوقوف تنفع كبيرة سنّ أو حاملًا.', descEn: 'A second of standing means the world to the elderly or pregnant.' },
  { key: 'kind-guide-beginner', category: 'kindness', ar: 'أرشد مبتدئًا في مجالك', en: 'Guide a beginner in your field', descAr: 'نصيحة مجانية منك توفّر عليهم شهورًا من الضياع.', descEn: 'One free tip from you saves them months of being lost.' },
  { key: 'kind-appreciation-note', category: 'kindness', ar: 'اكتب رسالة تقدير لمن أثّر فيك', en: 'Write an appreciation note to someone who shaped you', descAr: 'كلمة مكتوبة تبقى في الدرج سنين.', descEn: 'A written word stays in a drawer for years.' },
  { key: 'kind-listen-patiently', category: 'kindness', ar: 'أصغِ بصبر لمن يحتاج حديثًا', en: 'Listen patiently to someone who needs to talk', descAr: 'الإنصات هدية لا تُشترى بالمال.', descEn: 'Listening is a gift money cannot buy.' },
  { key: 'kind-reward-worker', category: 'kindness', ar: 'أكرم عاملًا متعبًا', en: 'Reward a tired worker', descAr: 'وجبة أو مبلغ يسير لعامل تلمس تعب يومه.', descEn: 'A meal or a small amount for a worker having a hard day.' },
  { key: 'kind-ask-neighbor', category: 'kindness', ar: 'اسأل جارك: هل تحتاج شيئًا؟', en: "Ask your neighbour: 'Do you need anything?'", descAr: 'سؤال واحد يفتح باب خير لا يعلمه أحد.', descEn: 'One question opens a door of good nobody knows about.' },
  { key: 'kind-sincere-praise', category: 'kindness', ar: 'امدح عملًا صادقًا وجهًا لوجه', en: 'Praise someone sincerely, face to face', descAr: 'المديح الصادق يشجّع على الإتقان.', descEn: 'Sincere praise encourages excellence.' },
  { key: 'kind-hold-door', category: 'kindness', ar: 'احبس الباب لمن خلفك', en: 'Hold the door for the person behind you', descAr: 'أدق عادات الكرم تعيش في التفاصيل.', descEn: 'The finest habits of generosity live in the details.' },
  { key: 'kind-share-knowledge', category: 'kindness', ar: 'اشرح معلومة يجهلها أحدهم', en: "Explain something someone doesn't know", descAr: 'معرفتك الصغيرة عندك كبيرة عند سائلها.', descEn: 'Your small knowledge is big to whoever needs it.' },
  { key: 'kind-reconcile-friends', category: 'kindness', ar: 'صلح بين متخاصمين', en: 'Reconcile two people in dispute', descAr: 'إصلاح ذات البين أفضل من صيام أيام وقيام ليالٍ.', descEn: 'Mending what is between people outweighs days of fasting and nights of prayer.' },

  // ─── Dhikr & Dua ────────────────────────────────────────────────────────────
  { key: 'dh-morning-adhkar', category: 'dhikr', ar: 'احفظ أذكار الصباح', en: 'Recite the morning adhkar', descAr: 'حصنك اليومي يبدأ من الفجر؛ دقائق تقي طول اليوم.', descEn: 'Your daily fortress starts at dawn — minutes that protect the whole day.' },
  { key: 'dh-evening-adhkar', category: 'dhikr', ar: 'أتمّ أذكار المساء', en: 'Complete the evening adhkar', descAr: 'خاتمة يوم مؤمن: دقائق تحمي ليلتك.', descEn: "A believer's day ends in minutes of protection for the night." },
  { key: 'dh-istighfar-100', category: 'dhikr', ar: 'استغفر مئة مرة', en: 'Say istighfar 100 times', descAr: 'كلمة تخفف الهم وتفتح الأبواب: أستغفر الله وأتوب إليه.', descEn: 'One phrase that lifts worry and opens doors: Astaghfirullah wa atoobu ilayh.' },
  { key: 'dh-salawat-100', category: 'dhikr', ar: 'صلِّ على النبي ﷺ مئة مرة', en: 'Send 100 salawat on the Prophet ﷺ', descAr: 'من صلّى عليك صلاة صلّى الله عليه بها عشرًا.', descEn: 'Whoever sends one salawat, Allah sends ten upon him.' },
  { key: 'dh-post-prayer', category: 'dhikr', ar: 'احفظ الأدعية بعد الصلاة', en: 'Learn the post-prayer adhkar', descAr: 'دقائق بعد كل صلاة تضاعف أجرها وتحفظ قلبها.', descEn: 'A few minutes after each prayer multiply its reward and guard its light.' },
  { key: 'dh-tasbih-fatimah', category: 'dhikr', ar: 'سبّح بعد كل صلاة', en: 'Do Tasbih Fatimah after prayer', descAr: '٣٣ و٣٣ و٣٤: الوصفة التي علّمها النبي ﷺ.', descEn: '33, 33, 34 — the prescription the Prophet ﷺ taught.' },
  { key: 'dh-la-hawla', category: 'dhikr', ar: 'كثر من «لا حول ولا قوة إلا بالله»', en: "Repeat 'la hawla wala quwwata illa billah'", descAr: 'كنز من كنوز الجنة؛ قلها عند كل تعب وهمّ.', descEn: 'A treasure of Paradise — say it at every fatigue and worry.' },
  { key: 'dh-commute-dhikr', category: 'dhikr', ar: 'اجعل تنقّلك ذكرًا', en: 'Turn your commute into dhikr', descAr: 'طريقك اليومي قد يكون أطول جلسة ذكر لديك.', descEn: 'Your daily route can become your longest dhikr session.' },
  { key: 'dh-dua-list', category: 'dhikr', ar: 'اكتب قائمة أدعية شخصية', en: 'Write a personal dua list', descAr: 'قائمة تُحدَّث؛ لا تنسَ أهل الحاجة ولا نفسك.', descEn: "A living list — don't forget those in need, or yourself." },
  { key: 'dh-dua-secretly', category: 'dhikr', ar: 'ادعُ لأخيك بظهر الغيب', en: 'Pray for a friend in secret', descAr: 'دعوة المرء لأخيه بظهر الغيب مستجابة، والملك يقلّ: ولك بمثلها.', descEn: "The angel answers: 'and for you the same.' — that is the power of a hidden dua." },
  { key: 'dh-good-ending', category: 'dhikr', ar: 'ادعُ لنفسك حسن الخاتمة', en: 'Ask Allah for a good ending', descAr: 'أعظم دعوة تسألها لنفسك كل يوم.', descEn: 'The greatest daily dua you can make for yourself.' },
  { key: 'dh-names-99', category: 'dhikr', ar: 'تعلّم اسمًا من أسماء الله الحسنى', en: "Learn one of Allah's 99 names", descAr: 'اسم جديد كل أسبوع مع معناه ودعائه.', descEn: 'One name a week, with its meaning and how to call upon it.' },
  { key: 'dh-gratitude', category: 'dhikr', ar: 'عدّ نعمك واشكر الله', en: 'Count your blessings and thank Him', descAr: 'لئن شكرتم لأزيدنكم؛ ابدأ بثلاث نعم تكتبها الآن.', descEn: 'If you are grateful, He will give you more — start by writing three.' },
  { key: 'dh-sleep-tasbih', category: 'dhikr', ar: 'سبّح قبل النوم ٣٣ مرة', en: 'Say SubhanAllah 33 times before sleep', descAr: 'ذكر يطرد الوسواس ويهدّئ النوم.', descEn: 'Dhikr quiets whispers and settles sleep.' },
  { key: 'dh-replace-complaint', category: 'dhikr', ar: 'استبدل الشكوى بالحمد', en: 'Replace complaint with praise', descAr: 'اللسان يدرّب القلب؛ حوّل «تعبان» إلى «الحمد لله على كل حال».', descEn: "The tongue trains the heart: swap 'I'm exhausted' for 'Alhamdulillah anyway'." },
  { key: 'dh-dua-parents-name', category: 'dhikr', ar: 'ادعُ لوالديك بالاسم', en: 'Make dua for your parents by name', descAr: 'أعلى صلة رحم تصل دون سفر: دعوة صادقة.', descEn: 'The highest family tie you can reach without travel: a sincere dua.' },
  { key: 'dh-friday-salawat', category: 'dhikr', ar: 'أكثر من الصلاة على النبي يوم الجمعة', en: 'Multiply salawat on Friday', descAr: 'في الجمعة ساعة تستجاب؛ اجعل لسانك رطبًا بذكره.', descEn: 'There is an hour on Friday when duas are answered — keep your tongue moist with salawat.' },
  { key: 'dh-teach-child', category: 'dhikr', ar: 'علّم طفلًا ذكرًا واحدًا', en: 'Teach a child one dhikr', descAr: 'كلمة صغيرة تلاحق صاحبتها في كل مكان.', descEn: 'One little phrase that follows its owner everywhere.' },

  // ─── Quran & Reflection ─────────────────────────────────────────────────────
  { key: 'qr-page-daily', category: 'quran', ar: 'اقرأ صفحة قرآن اليوم', en: 'Read one Quran page today', descAr: 'صفحة بثبات أفضل من اجتهاد متقطع؛ ابدأ بخمس دقائق.', descEn: 'A steady page beats an occasional marathon — start with five minutes.' },
  { key: 'qr-surah-mulk', category: 'quran', ar: 'اقرأ سورة الملك قبل النوم', en: 'Read Surah Al-Mulk before bed', descAr: 'سورة تشفع لصاحبها كل ليلة.', descEn: 'A surah that intercedes for its reader every night.' },
  { key: 'qr-tadabbur', category: 'quran', ar: 'تدبّر آية واحدة بعمق', en: 'Reflect deeply on one verse', descAr: 'قلب حاضر مع آية واحدة خير من لسان سريع.', descEn: 'A present heart with one verse outweighs a racing tongue.' },
  { key: 'qr-memorize-ayah', category: 'quran', ar: 'احفظ آية جديدة', en: 'Memorise a new verse', descAr: 'خطوة صغيرة نحو حفظ كتاب الله؛ كرّرها عشرين مرة.', descEn: 'A small step toward hifdh — repeat it twenty times.' },
  { key: 'qr-listen-attentive', category: 'quran', ar: 'استمع لقارئ بتركيز', en: 'Listen to a reciter attentively', descAr: 'استماع واعٍ يحاسب القلب خير من سماع عابر.', descEn: 'Listening with your heart engaged counts more than passing hearing.' },
  { key: 'qr-tafsir', category: 'quran', ar: 'اقرأ تفسير آية واحدة', en: 'Read the tafsir of one verse', descAr: 'فهم كلمة واحدة قد يغيّر نظرتك لكل السورة.', descEn: 'Understanding a single word can change how you see the whole surah.' },
  { key: 'qr-teach-surah', category: 'quran', ar: 'علّم أحدهم سورة', en: 'Teach someone a surah', descAr: 'خيركم من تعلّم القرآن وعلّمه؛ أجرك يجري في كل تلاوة له.', descEn: 'The best of you learn and teach it — your reward flows in every recitation they make.' },
  { key: 'qr-fix-recitation', category: 'quran', ar: 'صحّح تلاوتك مع مُقرئ', en: 'Fix your recitation with a teacher', descAr: 'حرف واحد قد يغيّر المعنى؛ درس واحد يهذّب لسانك.', descEn: 'One letter can change the meaning; one lesson polishes your tongue.' },
  { key: 'qr-read-translation', category: 'quran', ar: 'اقرأ معنى الآيات بترجمة تفهمها', en: 'Read the meanings in a translation you understand', descAr: 'اقرأ المعنى بلغة تفهمها لتشارك أهل بيتك التدبّر.', descEn: 'Reading the meaning in your own tongue lets you share reflection with your family.' },
  { key: 'qr-recite-parents', category: 'quran', ar: 'اقرأ القرآن على والديك', en: 'Recite Quran to your parents', descAr: 'صوتك يقرأ كلام الله يخلّد لحظة لا تُنسى.', descEn: 'Your voice reciting Allah’s words makes a moment they will never forget.' },
  { key: 'qr-complete-juz', category: 'quran', ar: 'أنهِ جزءًا هذا الأسبوع', en: 'Complete a juz this week', descAr: 'قسّم الجزء على أيامه؛ خمس صفحات في اليوم تكفي.', descEn: 'Split a juz across the week — five pages a day is enough.' },
  { key: 'qr-reading-plan', category: 'quran', ar: 'ابدأ خطة ورد يومية', en: 'Start a daily Quran reading plan', descAr: 'خطة مكتوبة تحوّل النية إلى سيرة يومية.', descEn: 'A written plan turns intention into a daily habit.' },
  { key: 'qr-gift-mushaf', category: 'quran', ar: 'أهدِ مصحفًا لأحدهم', en: 'Gift someone a mushaf', descAr: 'من هدى إلى خير فله مثل أجر عاملها.', descEn: 'Whoever guides to good gets its reward — a mushaf opens doors of it.' },
  { key: 'qr-dua-after', category: 'quran', ar: 'ادعُ بعد التلاوة', en: 'Make dua after reciting', descAr: 'بعد المعنى سؤال؛ اسأله أن يجعل القرآن ربيع قلبك.', descEn: 'After meaning comes asking — ask Him to make it the spring of your heart.' },
  { key: 'qr-kids-circle', category: 'quran', ar: 'شارك في حلقة قرآن للأطفال', en: "Join a children's Quran circle", descAr: 'طفل يحفظ اليوم يقرأ عليك بعد عشرين سنة.', descEn: 'A child memorising today may recite over you twenty years from now.' },
  { key: 'qr-night-recite', category: 'quran', ar: 'قم قبل الفجر واقرأ', en: 'Wake before dawn and recite', descAr: 'ورد الليل أنقى أثرًا؛ جرّب عشر دقائق قبل الفجر.', descEn: 'The night portion leaves the deepest mark — try ten minutes before dawn.' },
  { key: 'qr-words-5', category: 'quran', ar: 'احفظ معاني ٥ كلمات قرآنية', en: 'Learn the meaning of 5 Quranic words', descAr: 'خمس كلمات في اليوم تفتح لك لغة القرآن في سنة.', descEn: "Five words a day unlocks the Quran's vocabulary within a year." },
  { key: 'qr-home-corner', category: 'quran', ar: 'خصّص ركنًا للقرآن في بيتك', en: 'Set a Quran corner at home', descAr: 'مكان ثابت للمصحف يدعو أهل البيت إلى ورد منتظم.', descEn: 'A fixed spot for the mushaf invites the whole household to daily reading.' },

  // ─── Prayer & Mosques ───────────────────────────────────────────────────────
  { key: 'pr-early-time', category: 'prayer', ar: 'صلِّ في أول وقتها', en: 'Pray at the very start of its time', descAr: 'أفضل الأعمال الصلاة على وقتها؛ اجعل تنبيهك قبل الأذان.', descEn: 'The dearest deed to Allah is prayer on time — set your alert before the adhan.' },
  { key: 'pr-mosque', category: 'prayer', ar: 'صلِّ في المسجد', en: 'Pray at the mosque', descAr: 'صلاة الجماعة تفوق صلاة الفذ بسبع وعشرين درجة.', descEn: 'Congregation surpasses praying alone by twenty-seven degrees.' },
  { key: 'pr-duha', category: 'prayer', ar: 'صلِّ سنة الضحى', en: 'Pray Duha', descAr: 'ركعتان صباح تفتح بهما يومك برحابة الرزق.', descEn: 'Two rak’ahs that open your morning with generosity.' },
  { key: 'pr-witr', category: 'prayer', ar: 'حافظ على الوتر', en: 'Keep Witr every night', descAr: 'وتر قبل أن تنام: أقصر عادة ليلية بأجرها الأطول.', descEn: 'Witr before sleep: the shortest nightly habit with the longest reward.' },
  { key: 'pr-tahajjud', category: 'prayer', ar: 'استيقظ لركعتين قبل الفجر', en: "Wake for two rak'ahs before Fajr", descAr: 'أفضل الصلاة بعد الفريضة قيام الليل؛ جرّبها ليلة واحدة.', descEn: 'The best prayer after the obligatory is the night prayer — try it one night.' },
  { key: 'pr-early-jumaa', category: 'prayer', ar: 'باكِر إلى الجمعة', en: "Go early to Jumu'ah", descAr: 'لكل خطوة نحوها أجر يوم كامل.', descEn: 'Every step toward it earns the reward of a full day.' },
  { key: 'pr-teach-child', category: 'prayer', ar: 'علّم ابنك صلاته الأولى', en: "Teach your child their first prayer", descAr: 'أول ورد يُبنى عليه بيت الصلاة في قلبه.', descEn: 'The first seed of a lifelong habit of prayer.' },
  { key: 'pr-travel-sunnahs', category: 'prayer', ar: 'حافظ على السنن أثناء السفر', en: 'Keep the sunnah prayers while travelling', descAr: 'سنن خفيفة ترفع رصيدك في أوقات التعب.', descEn: 'Light sunnahs that keep your balance on tiring travel days.' },
  { key: 'pr-visit-mosque', category: 'prayer', ar: 'زر مسجدًا لم تصل فيه من قبل', en: "Visit a mosque you've never prayed in", descAr: 'مسجد جديد يعني وجوهًا جديدة وروحًا مختلفة.', descEn: 'A new mosque means new faces and a fresh spirit.' },
  { key: 'pr-donate-mosque', category: 'prayer', ar: 'ساهم في صيانة مسجد', en: 'Donate to mosque upkeep', descAr: 'من بنى لله مسجدًا بنى الله له بيتًا في الجنة؛ والصيانة جزء من البناء.', descEn: 'Whoever builds a mosque, Allah builds a house in Paradise — upkeep is part of it.' },
  { key: 'pr-clean-mosque', category: 'prayer', ar: 'نظّف زاوية في المسجد', en: 'Clean a corner of the mosque', descAr: 'أدنى خدمة للمسجد عظيمة الأجر في السر.', descEn: 'The humblest service to the mosque carries great reward in secret.' },
  { key: 'pr-sit-after', category: 'prayer', ar: 'اجلس بعد الصلاة للذكر', en: 'Sit for dhikr after prayer', descAr: 'لا تنهض فورًا؛ الجلوس يختم الصلاة بالأذكار.', descEn: 'Do not rush up — sitting seals the prayer with remembrance.' },
  { key: 'pr-organize-times', category: 'prayer', ar: 'رتّب جدول صلواتك', en: 'Organise your prayer schedule', descAr: 'خمس مواقيت مكتوبة في هاتفك تعيد ترتيب يومك كله.', descEn: 'Five written times reorder your entire day around them.' },
  { key: 'pr-family-together', category: 'prayer', ar: 'شجّع أهل بيتك على الصلاة معًا', en: 'Encourage your household to pray together', descAr: 'صلاة العائلة معًا تصنع ذاكرة إيمانية للبيت كله.', descEn: 'A family praying together builds the home’s spiritual memory.' },
  { key: 'pr-thursday-qiyam', category: 'prayer', ar: 'قم ليلة الجمعة', en: "Pray Qiyam on Thursday night", descAr: 'ليلة يُتلى فيها القرآن بهدوء قبل صباح مشرق.', descEn: 'A quiet night of recitation before a bright morning.' },
  { key: 'pr-mindful-wudu', category: 'prayer', ar: 'تدبّر وضوءك', en: 'Be mindful in wudu', descAr: 'الوضوء نور؛ كل غسلة تسقط عنك خطية.', descEn: 'Wudu is light — each washing lets a sin fall away.' },
  { key: 'pr-ride-neighbor', category: 'prayer', ar: 'أوصل جارك إلى المسجد', en: 'Give a neighbour a ride to the mosque', descAr: 'خطوة واحدة لك وخطوة له نحو الجماعة.', descEn: 'One step for you and one for him toward congregation.' },
  { key: 'pr-sujood-dua', category: 'prayer', ar: 'أطل الدعاء في سجودك', en: 'Lengthen your dua in sujood', descAr: 'أقرب ما يكون العبد من ربه وهو ساجد؛ فأكثِر من السؤال.', descEn: 'The closest you will ever be to your Lord is in sujood — ask much.' },

  // ─── Serving Community ──────────────────────────────────────────────────────
  { key: 'com-blood-donation', category: 'community', ar: 'تبرّع بالدم', en: 'Donate blood', descAr: 'دمك يسري في عروق غريب عنك وتُنقذ حياة.', descEn: 'It flows in a stranger’s veins — and a life is saved.' },
  { key: 'com-volunteer-hour', category: 'community', ar: 'تطوّع ساعة في جمعية', en: 'Volunteer an hour at a charity', descAr: 'ساعة في الفرز أو التنظيم تفعل ما لا يفعله المال وحده.', descEn: 'An hour of sorting or organising does what money alone cannot.' },
  { key: 'com-give-direction', category: 'community', ar: 'دلّ ضائعًا على طريقه', en: 'Give directions to someone lost', descAr: 'إشارة قصيرة توصِل غريبًا إلى بيته.', descEn: 'A short gesture delivers a stranger safely home.' },
  { key: 'com-free-class', category: 'community', ar: 'قدّم درسًا مجانيًا في تخصصك', en: 'Offer a free class in your specialty', descAr: 'أجر يجري في كل طالب تعلّم منك.', descEn: 'Reward flows with every student who learns from you.' },
  { key: 'com-clean-park', category: 'community', ar: 'نظّف حديقة أو شاطئًا', en: 'Clean a park or a beach', descAr: 'كل قطعة نفايات ترفعها صدقة تسقط عنك الخطايا.', descEn: 'Every piece of litter you pick up is charity wiping away sins.' },
  { key: 'com-help-newcomer', category: 'community', ar: 'ساعد وافدًا جديدًا على بلده', en: 'Help a newcomer settle in', descAr: 'شرح بسيط للحياة اليومية يختصر عنهم سنة ضياع.', descEn: 'A simple guide to daily life saves them a year of confusion.' },
  { key: 'com-groceries-elder', category: 'community', ar: 'اشترِ احتياجات جارك المسنّ', en: 'Buy groceries for an elderly neighbour', descAr: 'سوق نيابة عنه: كرمة وأجر معًا.', descEn: 'Groceries on their behalf: kindness and reward together.' },
  { key: 'com-donate-books', category: 'community', ar: 'تبرّع بكتبك للمكتبات', en: 'Donate books to a library', descAr: 'كتاب قرأته يبدأ في رف آخر حياة جديدة.', descEn: 'A book you have finished lives again on another shelf.' },
  { key: 'com-mentor-youth', category: 'community', ar: 'أرشد شابًا في مساره', en: "Mentor a young person's path", descAr: 'كلمة توجيه في وقتها تغيّر مسار حياة.', descEn: 'One well-timed word of guidance changes a life’s direction.' },
  { key: 'com-fix-free', category: 'community', ar: 'أصلح شيئًا مجانًا لجارك', en: 'Fix something for a neighbour for free', descAr: 'مهارتك الفنية تُسعد بيتًا كاملًا.', descEn: 'Your technical skill can gladden a whole household.' },
  { key: 'com-summer-water', category: 'community', ar: 'وزّع ماءً في حر الصيف', en: 'Hand out water in the summer heat', descAr: 'كوب ماء بارد في الظهيرة أجر عظيم.', descEn: 'A cold cup of water at noon carries great reward.' },
  { key: 'com-visit-home', category: 'community', ar: 'زر دار مسنين أو أيتام', en: 'Visit a nursing or orphanage home', descAr: 'ابتسامات من لا يزورهم أحد تفوق ما تتخيل.', descEn: 'Smiles from people nobody visits exceed anything you imagine.' },
  { key: 'com-public-project', category: 'community', ar: 'ساهم في مشروع نفع عام', en: 'Contribute to a public-benefit project', descAr: 'حديقة أو سقف مدرسة؛ نصيبك يبقى يشهد لك.', descEn: 'A garden or a school roof — your share keeps testifying for you.' },
  { key: 'com-report-hazard', category: 'community', ar: 'بلّغ عن خطر في الطريق', en: 'Report a hazard on the road', descAr: 'إزالة الأذى عن الطريق شعبة من الإيمان.', descEn: 'Removing harm from the path is a branch of faith.' },
  { key: 'com-food-surplus', category: 'community', ar: 'وزّع فائض مطعم أو بقالة', en: 'Distribute surplus food from shops', descAr: 'اتفق مع بائع قريب لتوصيل الفائض لمن يحتاجه.', descEn: 'Arrange with a nearby shop to deliver surplus to those in need.' },
  { key: 'com-job-referral', category: 'community', ar: 'ساعد أحدهم في إيجاد عمل', en: 'Help someone find a job', descAr: 'توصية واحدة قد تكون رزق عائلة لسنوات.', descEn: 'One referral can feed a family for years.' },
  { key: 'com-watch-neighbor', category: 'community', ar: 'احرس بيت جارك في غيبته', en: "Look after an absent neighbour's home", descAr: 'ريّ نباتاته وجمع بريده أمانة تُؤدّى.', descEn: 'Watering his plants and collecting his mail is a trust honoured.' },
  { key: 'com-masjid-talk', category: 'community', ar: 'قدّم نصيحة قصيرة في مسجدك', en: 'Give a short talk at your mosque', descAr: 'عشر دقائق من خبرتك تنفع المصلّين جميعًا.', descEn: 'Ten minutes of your expertise can benefit the whole congregation.' },
  { key: 'com-carpool', category: 'community', ar: 'نظّم مشاركة سيارات', en: 'Organise a carpool', descAr: 'توفير وقود وراحة للجميع وأجر لكل راكب.', descEn: 'Shared fuel, shared comfort, and reward for every rider.' },
  { key: 'com-anonymous-help', category: 'community', ar: 'ساعد أحدهم دون أن تعلَم', en: 'Help someone without them knowing who', descAr: 'إحسان مخفي يعظم الأجر ويحفظ القصد.', descEn: 'Hidden kindness maximises reward and protects the intention.' },

  // ─── Nature & Animals ───────────────────────────────────────────────────────
  { key: 'nat-water-animal', category: 'nature', ar: 'اسقِ حيوانًا عطشان', en: 'Give water to a thirsty animal', descAr: 'غُفر لمن سقى كلبًا؛ فكيف بإنسان أو طير؟', descEn: 'A man was forgiven for giving a dog water — what of people and birds?' },
  { key: 'nat-plant-tree', category: 'nature', ar: 'ازرع شجرة', en: 'Plant a tree', descAr: 'كل طير أو إنسان أو بهيمة أكلت منها كانت لك صدقة.', descEn: 'Every bird, person, or animal that eats from it is charity for you.' },
  { key: 'nat-feed-strays', category: 'nature', ar: 'أطعم الطيور أو القطط الشاردة', en: 'Feed birds or stray cats', descAr: 'لقمة في فمها تُحسب لك صدقة كل يوم.', descEn: 'A morsel in their mouth counts as charity every single day.' },
  { key: 'nat-sort-recycling', category: 'nature', ar: 'فرّز نفاياتك القابلة للتدوير', en: 'Sort your recyclables today', descAr: 'عادة خمس دقائق تحفظ أرضًا تسكنها أجيال.', descEn: 'A five-minute habit that protects land for generations.' },
  { key: 'nat-home-plant', category: 'nature', ar: 'ازرع نبتة في بيتك', en: 'Grow a plant at home', descAr: 'غرس صغير يعلّم أبناءك رعاية الحياة.', descEn: 'Growing a small plant teaches your children to care for life.' },
  { key: 'nat-fix-leak', category: 'nature', ar: 'أصلح تسريب ماء في بيتك', en: 'Fix a water leak at home', descAr: 'لا تُسرف في الماء ولو كنت على نهر جار.', descEn: 'Do not waste water even at a flowing river.' },
  { key: 'nat-stray-shelter', category: 'nature', ar: 'جهّز مأوى لحيوان شارد في الشتاء', en: 'Make a winter shelter for a stray animal', descAr: 'صندوق وبطانية تنقذ حياة في ليلة باردة.', descEn: 'A box and a blanket can save a life on a cold night.' },
  { key: 'nat-shared-commute', category: 'nature', ar: 'شارك سيارة أو استخدم النقل العام', en: 'Carpool or take public transport', descAr: 'وقود أقل وأثر كربون أنقى وأجر للمشاركة.', descEn: 'Less fuel, cleaner air, and shared reward.' },
  { key: 'nat-walk-cleanup', category: 'nature', ar: 'احمل كيسًا ونظّف أثناء مشيك', en: 'Carry a bag and clean as you walk', descAr: 'خطواتك اليومية تتحول إلى تلاوة أفعال.', descEn: 'Your daily walk turns into a prayer of action.' },
  { key: 'nat-off-devices', category: 'nature', ar: 'أطفئ الأجهزة غير المستخدمة', en: 'Switch off unused devices', descAr: 'هدر الطاقة هدر لنعمة تُحاسب عليها.', descEn: 'Wasted energy is a squandered blessing you will answer for.' },
  { key: 'nat-plastic-free', category: 'nature', ar: 'جرّب يومًا بلا بلاستيك أحادي', en: 'Try a day without single-use plastic', descAr: 'تجربة يوم تفتح عينيك على عادات يمكن تغييرها.', descEn: 'One day opens your eyes to habits you can change.' },
  { key: 'nat-help-injured', category: 'nature', ar: 'ساعد طيرًا أو حيوانًا مصابًا', en: 'Help an injured bird or animal', descAr: 'رحمة صغيرة قد تنقذ حياة كاملة.', descEn: 'A small mercy may save a whole life.' },
  { key: 'nat-share-harvest', category: 'nature', ar: 'شارك محصول حديقتك', en: "Share your garden's harvest", descAr: 'طماطم زائدة عندك، وجائع قريب منك.', descEn: 'Your surplus tomatoes are someone’s meal nearby.' },
  { key: 'nat-water-street-tree', category: 'nature', ar: 'اسقِ شجرة شارع ظمأى', en: 'Water a thirsty street tree', descAr: 'شجرة البلد تبرّد المارّة وتنتظر يدك.', descEn: 'Street trees cool everyone — they are waiting for your hand.' },
  { key: 'nat-meal-plan', category: 'nature', ar: 'خطط لوجباتك لتقلّل هدر الطعام', en: 'Plan meals to cut food waste', descAr: 'نعمة الطعام تُحاسب عليها؛ خطة أسبوع تكفي.', descEn: 'Food is a blessing you will answer for — a weekly plan is enough.' },
  { key: 'nat-buy-local', category: 'nature', ar: 'اشترِ من مزارع محلي', en: 'Buy from a local farmer', descAr: 'تدعم رزق مشروعًا محليًا وتأكل طازجًا.', descEn: 'Support local livelihood and eat fresher food.' },
];

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
const SUGGESTION_BY_KEY = new Map(SUGGESTIONS.map((s) => [s.key, s]));

export function categoryById(id: string): DeedCategory | undefined {
  return CATEGORY_BY_ID.get(id);
}

export function suggestionByKey(key: string): DeedSuggestion | undefined {
  return SUGGESTION_BY_KEY.get(key);
}

export type Lang = 'ar' | 'en';

export function deedTitle(deed: DeedSuggestion, lang: Lang): string {
  return lang === 'ar' ? deed.ar : deed.en;
}

export function deedDesc(deed: DeedSuggestion, lang: Lang): string {
  return lang === 'ar' ? deed.descAr : deed.descEn;
}

export function deedsByCategory(categoryId: string | 'all'): DeedSuggestion[] {
  if (categoryId === 'all') return SUGGESTIONS;
  return SUGGESTIONS.filter((s) => s.category === categoryId);
}
