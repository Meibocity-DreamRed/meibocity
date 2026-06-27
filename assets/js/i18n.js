/**
 * Guangzhou Meibo City - Multi-Language i18n Engine
 * Languages: English (en) / Français (fr) / Русский (ru) / العربية (ar)
 * Data-i18n attribute approach + localStorage persistence + auto-detection
 */
(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'fr', 'ru', 'ar'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'meibo_lang';

  /* ================================================================
     Translation Dictionary
     ================================================================ */
  const dict = {
    /* ---- Navigation ---- */
    'nav.home': { en: 'Home', fr: 'Accueil', ru: 'Главная', ar: 'الرئيسية' },
    'nav.about': { en: 'About', fr: 'À propos', ru: 'О нас', ar: 'من نحن' },
    'nav.products': { en: 'Products', fr: 'Produits', ru: 'Продукция', ar: 'المنتجات' },
    'nav.contact': { en: 'Contact', fr: 'Contact', ru: 'Контакты', ar: 'اتصل بنا' },

    /* ---- Language Switcher ---- */
    'lang.label': { en: 'Language', fr: 'Langue', ru: 'Язык', ar: 'اللغة' },

    /* ---- Footer (Shared) ---- */
    'footer.about.title': { en: 'Meibo City', fr: 'Meibo City', ru: 'Meibo City', ar: 'مييبو سيتي' },
    'footer.about.desc': {
      en: "China's largest dedicated beauty and cosmetics wholesale complex. Connecting global buyers with premium manufacturers since 2008.",
      fr: "Le plus grand complexe de vente en gros de produits de beauté et cosmétiques en Chine. Connectant les acheteurs du monde entier avec des fabricants de premier plan depuis 2008.",
      ru: "Крупнейший в Китае специализированный оптовый комплекс косметики и товаров для красоты. Связываем покупателей со всего мира с ведущими производителями с 2008 года.",
      ar: "أكبر مجمع تجزئة متخصص في مستحضرات التجميل والعناية بالجمال في الصين. نربط المشترين العالميين بأفضل المصنعين منذ عام 2008."
    },
    'footer.quick.title': { en: 'Quick Links', fr: 'Liens rapides', ru: 'Быстрые ссылки', ar: 'روابط سريعة' },
    'footer.quick.home': { en: 'Home', fr: 'Accueil', ru: 'Главная', ar: 'الرئيسية' },
    'footer.quick.about': { en: 'About Us', fr: 'À propos', ru: 'О нас', ar: 'من نحن' },
    'footer.quick.products': { en: 'Products', fr: 'Produits', ru: 'Продукция', ar: 'المنتجات' },
    'footer.quick.contact': { en: 'Contact', fr: 'Contact', ru: 'Контакты', ar: 'اتصل بنا' },
    'footer.cat.title': { en: 'Categories', fr: 'Catégories', ru: 'Категории', ar: 'الفئات' },
    'footer.cat.hair': { en: 'Hair & Styling', fr: 'Coiffure & Styling', ru: 'Волосы и укладка', ar: 'العناية بالشعر' },
    'footer.cat.skincare': { en: 'Skincare', fr: 'Soins de la peau', ru: 'Уход за кожей', ar: 'العناية بالبشرة' },
    'footer.cat.cosmetics': { en: 'Cosmetics', fr: 'Cosmétiques', ru: 'Косметика', ar: 'مستحضرات التجميل' },
    'footer.cat.fragrance': { en: 'Fragrance', fr: 'Parfums', ru: 'Парфюмерия', ar: 'العطور' },
    'footer.cat.nail': { en: 'Nail & Lashes', fr: 'Ongles & Cils', ru: 'Ногти и ресницы', ar: 'الأظافر والرموش' },
    'footer.cat.machines': { en: 'Machines & Consumables', fr: 'Machines & Consommables', ru: 'Оборудование и расходники', ar: 'الأجهزة والمستلزمات' },
    'footer.contact.title': { en: 'Contact', fr: 'Contact', ru: 'Контакты', ar: 'اتصل بنا' },
    'footer.contact.address': { en: 'No.121 Guangyuan West Road, Yuexiu District, Guangzhou', fr: 'No.121 Guangyuan West Road, Yuexiu District, Guangzhou', ru: 'No.121 Guangyuan West Road, Yuexiu District, Guangzhou', ar: 'رقم 121 طريق قوانغيوان الغربي، منطقة يويكسيو، قوانغتشو' },
    'footer.contact.phone': { en: '+86 135 0302 5361 (WhatsApp)', fr: '+86 135 0302 5361 (WhatsApp)', ru: '+86 135 0302 5361 (WhatsApp)', ar: '+86 135 0302 5361 (واتساب)' },
    'footer.contact.email': { en: 'info@meibo-city.com', fr: 'info@meibo-city.com', ru: 'info@meibo-city.com', ar: 'info@meibo-city.com' },
    'footer.contact.web': { en: 'meibo-city.com', fr: 'meibo-city.com', ru: 'meibo-city.com', ar: 'meibo-city.com' },
    'footer.copyright': {
      en: '\u00a9 2026 Guangzhou Meibo City. All rights reserved.',
      fr: '\u00a9 2026 Guangzhou Meibo City. Tous droits r\u00e9serv\u00e9s.',
      ru: '\u00a9 2026 Guangzhou Meibo City. Все права защищены.',
      ar: '\u00a9 2026 مجموعة قوانغتشو مييبو سيتي. جميع الحقوق محفوظة.'
    },

    /* ======================== INDEX.HTML ======================== */
    'index.hero.tag': { en: 'Guangzhou \u2022 China', fr: 'Canton \u2022 Chine', ru: 'Гуанчжоу \u2022 Китай', ar: 'قوانغتشو \u2022 الصين' },
    'index.hero.title': {
      en: 'Your Gateway to<br>Premium Beauty Sourcing',
      fr: 'Votre passerelle vers<br>un sourcing beaut\u00e9 premium',
      ru: 'Ваш путь к<br>премиальному бьюти-сорсингу',
      ar: 'بوابتك إلى<br>أفضل مصادر منتجات التجميل'
    },
    'index.hero.subtitle': {
      en: "China's premier B2B wholesale complex dedicated to hair, beauty, cosmetics, fragrance, nail, and professional salon equipment. Trusted by brands and salons across 100+ countries.",
      fr: "Le premier complexe B2B chinois d\u00e9di\u00e9 aux produits capillaires, de beaut\u00e9, cosm\u00e9tiques, parfums, ongles et \u00e9quipements professionnels pour salons. Approuv\u00e9 par des marques et salons dans plus de 100 pays.",
      ru: "Ведущий B2B оптовый комплекс Китая, специализирующийся на товарах для волос, косметике, парфюмерии, ногтевом сервисе и профессиональном оборудовании для салонов. Нам доверяют бренды и салоны из более чем 100 стран.",
      ar: "أكبر مجمع تجاري B2B في الصين متخصص في منتجات الشعر، التجميل، مستحضرات التجميل، العطور، الأظافر، ومعدات الصالونات الاحترافية. نحن موضع ثقة العلامات التجارية والصالونات في أكثر من 100 دولة."
    },
    'index.hero.cta1': { en: 'Explore Products', fr: 'Explorer les produits', ru: 'Смотреть продукцию', ar: 'استكشف المنتجات' },
    'index.hero.cta2': { en: 'Inquire Now', fr: 'Demander maintenant', ru: 'Отправить запрос', ar: 'استفسر الآن' },
    'index.hero.scroll': { en: 'Scroll', fr: 'D\u00e9filer', ru: 'Прокрутить', ar: 'اسحب للأسفل' },
    /* Stats */
    'index.stats.sqm': { en: 'Square Meters', fr: 'M\u00e8tres carr\u00e9s', ru: 'Квадратных метров', ar: 'متر مربع' },
    'index.stats.suppliers': { en: 'Verified Suppliers', fr: 'Fournisseurs v\u00e9rifi\u00e9s', ru: 'Проверенных поставщиков', ar: 'مورد موثق' },
    'index.stats.countries': { en: 'Export Countries', fr: 'Pays d\u2019exportation', ru: 'Стран экспорта', ar: 'دولة تصدير' },
    'index.stats.sku': { en: 'Product SKUs', fr: 'R\u00e9f\u00e9rences produits', ru: 'Товарных позиций', ar: 'منتج متنوع' },
    /* Categories Section */
    'index.cat.tag': { en: 'Product Categories', fr: 'Cat\u00e9gories de produits', ru: 'Категории продукции', ar: 'فئات المنتجات' },
    'index.cat.title': { en: 'Six Core Verticals', fr: 'Six secteurs cl\u00e9s', ru: 'Шесть ключевых направлений', ar: 'ستة قطاعات أساسية' },
    'index.cat.subtitle': {
      en: 'Covering the entire beauty supply chain, from professional salon products to retail-ready cosmetics.',
      fr: "Couvrant toute la cha\u00eene d'approvisionnement beaut\u00e9, des produits professionnels pour salons aux cosm\u00e9tiques pr\u00eats \u00e0 la vente.",
      ru: 'Охватываем всю цепочку поставок бьюти-индустрии: от профессиональных салонных продуктов до готовой розничной косметики.',
      ar: 'تغطية سلسلة توريد التجميل بالكامل، من منتجات الصالونات الاحترافية إلى مستحضرات التجميل الجاهزة للبيع بالتجزئة.'
    },
    'index.cat.hair': { en: 'Hair & Styling', fr: 'Coiffure & Styling', ru: 'Волосы и укладка', ar: 'العناية بالشعر والتصفيف' },
    'index.cat.hair.desc': { en: 'Professional shampoos, treatments, coloring, wigs, extensions, and salon tools', fr: 'Shampooings professionnels, traitements, coloration, perruques, extensions et outils de salon', ru: 'Профессиональные шампуни, уход, окрашивание, парики, наращивание и салонные инструменты', ar: 'شامبوهات احترافية، علاجات، صبغات، شعر مستعار، وصلات شعر، وأدوات الصالونات' },
    'index.cat.skincare': { en: 'Skincare & Beauty', fr: 'Soins de la peau & Beaut\u00e9', ru: 'Уход за кожей и красота', ar: 'العناية بالبشرة والجمال' },
    'index.cat.skincare.desc': { en: 'Facial care, body treatments, serums, masks, and dermatological devices', fr: 'Soins du visage, soins corporels, s\u00e9rums, masques et appareils dermatologiques', ru: 'Уход за лицом, телом, сыворотки, маски и дерматологические аппараты', ar: 'عناية بالوجه، علاجات الجسم، أمصال، أقنعة، وأجهزة جلدية' },
    'index.cat.cosmetics': { en: 'Cosmetics & Makeup', fr: 'Cosm\u00e9tiques & Maquillage', ru: 'Косметика и макияж', ar: 'مستحضرات التجميل والمكياج' },
    'index.cat.cosmetics.desc': { en: 'Foundations, lipsticks, eye palettes, professional makeup lines and OEM solutions', fr: 'Fonds de teint, rouges \u00e0 l\u00e8vres, palettes pour les yeux, lignes de maquillage professionnel et solutions OEM', ru: 'Тональные средства, помады, палетки для глаз, профессиональные линии макияжа и OEM-решения', ar: 'كريمات أساس، أحمر شفاه، لوحات ظلال العيون، خطوط مكياج احترافية وحلول OEM' },
    'index.cat.fragrance': { en: 'Fragrance', fr: 'Parfums', ru: 'Парфюмерия', ar: 'العطور' },
    'index.cat.fragrance.desc': { en: 'Eau de parfum, essential oils, home fragrance, and custom scent development', fr: 'Eaux de parfum, huiles essentielles, parfums d\u2019int\u00e9rieur et d\u00e9veloppement de senteurs sur mesure', ru: 'Парфюмерная вода, эфирные масла, ароматы для дома и разработка индивидуальных ароматов', ar: 'ماء عطر، زيوت عطرية، عطور منزلية، وتطوير روائح مخصصة' },
    'index.cat.nail': { en: 'Nail & Lashes', fr: 'Ongles & Cils', ru: 'Ногти и ресницы', ar: 'الأظافر والرموش' },
    'index.cat.nail.desc': { en: 'Gel polishes, nail art supplies, acrylic systems, eyelash extensions, and tools', fr: 'Vernis gel, fournitures de nail art, syst\u00e8mes acryliques, extensions de cils et outils', ru: 'Гель-лаки, материалы для нейл-арта, акриловые системы, наращивание ресниц и инструменты', ar: 'طلاء جل، مستلزمات فن الأظافر، أنظمة أكريليك، وصلات الرموش، وأدوات' },
    'index.cat.machines': { en: 'Machines & Consumables', fr: 'Machines & Consommables', ru: 'Оборудование и расходные материалы', ar: 'الأجهزة والمستلزمات' },
    'index.cat.machines.desc': { en: 'Laser machines, facial devices, salon furniture, disposables, and packaging', fr: 'Appareils laser, appareils pour le visage, mobilier de salon, consommables et emballages', ru: 'Лазерные аппараты, устройства для лица, салонная мебель, расходные материалы и упаковка', ar: 'أجهزة ليزر، أجهزة للوجه، أثاث صالونات، مستلزمات استهلاكية، وتغليف' },
    /* Partners Section */
    'index.partners.tag': { en: 'Trusted Worldwide', fr: 'Une confiance mondiale', ru: 'Доверие во всем мире', ar: 'موثوقون عالمياً' },
    'index.partners.title': { en: 'Global Brand Partners', fr: 'Partenaires mondiaux', ru: 'Глобальные бренды-партнеры', ar: 'شركاء العلامات التجارية العالمية' },
    'index.partners.subtitle': {
      en: 'Our suppliers manufacture for leading international beauty brands and retail chains across Europe, Americas, Middle East, and Southeast Asia.',
      fr: "Nos fournisseurs fabriquent pour les plus grandes marques de beaut\u00e9 internationales et cha\u00eenes de distribution en Europe, aux Am\u00e9riques, au Moyen-Orient et en Asie du Sud-Est.",
      ru: 'Наши поставщики производят продукцию для ведущих международных бьюти-брендов и розничных сетей в Европе, Америке, на Ближнем Востоке и в Юго-Восточной Азии.',
      ar: 'يقوم موردونا بالتصنيع لأبرز العلامات التجارية العالمية في مجال التجميل وسلاسل التجزئة في أوروبا والأمريكتين والشرق الأوسط وجنوب شرق آسيا.'
    },
    /* Partners Names */
    'index.partner.eu': { en: 'European Brands', fr: 'Marques europ\u00e9ennes', ru: 'Европейские бренды', ar: 'علامات تجارية أوروبية' },
    'index.partner.me': { en: 'Middle East Chains', fr: 'Cha\u00eenes Moyen-Orient', ru: 'Сети Ближнего Востока', ar: 'سلاسل الشرق الأوسط' },
    'index.partner.am': { en: 'Americas Distribution', fr: 'Distribution Am\u00e9riques', ru: 'Дистрибуция в Америке', ar: 'توزيع في الأمريكتين' },
    'index.partner.sea': { en: 'SEA Retail Groups', fr: 'Groupes Asie du Sud-Est', ru: 'Розничные группы ЮВА', ar: 'مجموعات تجزئة جنوب شرق آسيا' },
    'index.partner.af': { en: 'African Importers', fr: 'Importateurs africains', ru: 'Африканские импортеры', ar: 'مستوردون أفارقة' },
    'index.partner.sa': { en: 'South Asian Traders', fr: 'N\u00e9gociants d\u2019Asie du Sud', ru: 'Трейдеры Южной Азии', ar: 'تجار جنوب آسيا' },
    'index.partner.cis': { en: 'CIS Distributors', fr: 'Distributeurs CEI', ru: 'Дистрибьюторы СНГ', ar: 'موزعو رابطة الدول المستقلة' },
    'index.partner.oc': { en: 'Oceania Retailers', fr: 'D\u00e9taillants Oc\u00e9anie', ru: 'Ритейлеры Океании', ar: 'تجار تجزئة أوقيانوسيا' },
    /* CTA Section */
    'index.cta.tag': { en: 'Start Sourcing Today', fr: 'Commencez d\u00e8s aujourd\u2019hui', ru: 'Начните сорсинг сегодня', ar: 'ابدأ التوريد اليوم' },
    'index.cta.title': {
      en: 'Ready to Elevate Your<br>Beauty Business?',
      fr: 'Pr\u00eat \u00e0 d\u00e9velopper votre<br>activit\u00e9 beaut\u00e9 ?',
      ru: 'Готовы вывести ваш<br>бьюти-бизнес на новый уровень?',
      ar: 'هل أنت مستعد لتطوير<br>أعمال التجميل الخاصة بك؟'
    },
    'index.cta.subtitle': {
      en: 'Connect with verified suppliers, access 500,000+ SKUs, and get dedicated sourcing support for your market.',
      fr: 'Connectez-vous avec des fournisseurs v\u00e9rifi\u00e9s, acc\u00e9dez \u00e0 plus de 500 000 r\u00e9f\u00e9rences et b\u00e9n\u00e9ficiez d\u2019un support sourcing d\u00e9di\u00e9 \u00e0 votre march\u00e9.',
      ru: 'Свяжитесь с проверенными поставщиками, получите доступ к 500 000+ товарных позиций и индивидуальную поддержку сорсинга для вашего рынка.',
      ar: 'تواصل مع موردين موثقين، واستفد من أكثر من 500,000 منتج، واحصل على دعم مخصص للتوريد يناسب سوقك.'
    },
    'index.cta.btn1': { en: 'Send Inquiry', fr: 'Envoyer une demande', ru: 'Отправить запрос', ar: 'أرسل استفساراً' },
    'index.cta.btn2': { en: 'Browse Products', fr: 'Parcourir les produits', ru: 'Смотреть продукцию', ar: 'تصفح المنتجات' },

    /* ======================== ABOUT.HTML ======================== */
    'about.hero.tag': { en: 'Our Story', fr: 'Notre histoire', ru: 'Наша история', ar: 'قصتنا' },
    'about.hero.title': { en: 'About Meibo City', fr: '\u00c0 propos de Meibo City', ru: 'О Meibo City', ar: 'عن مييبو سيتي' },
    'about.hero.subtitle': {
      en: 'The epicenter of global beauty sourcing \u2014 where world-class manufacturing meets international trade.',
      fr: "L'\u00e9picentre du sourcing beaut\u00e9 mondial \u2014 l\u00e0 o\u00f9 la fabrication de classe mondiale rencontre le commerce international.",
      ru: 'Эпицентр глобального бьюти-сорсинга \u2014 где производство мирового уровня встречается с международной торговлей.',
      ar: 'مركز التوريد العالمي لمنتجات التجميل \u2014 حيث يلتقي التصنيع العالمي بالتجارة الدولية.'
    },
    'about.who.tag': { en: 'Who We Are', fr: 'Qui sommes-nous', ru: 'Кто мы', ar: 'من نحن' },
    'about.who.title': { en: "China's Largest Dedicated Beauty Wholesale Complex", fr: "Le plus grand complexe de vente en gros de beaut\u00e9 en Chine", ru: 'Крупнейший в Китае специализированный оптовый бьюти-комплекс', ar: 'أكبر مجمع متخصص لتجارة التجميل بالجملة في الصين' },
    'about.who.p1': {
      en: "Strategically located in Guangzhou, the capital of Guangdong province and the heart of China's manufacturing ecosystem, Meibo City spans over 300,000 square meters of curated wholesale space. Since our inception, we have grown to house over 3,000 verified suppliers representing every segment of the global beauty supply chain.",
      fr: "Strat\u00e9giquement situ\u00e9 \u00e0 Canton, capitale de la province du Guangdong et c\u0153ur de l'\u00e9cosyst\u00e8me manufacturier chinois, Meibo City s'\u00e9tend sur plus de 300 000 m\u00e8tres carr\u00e9s d'espace de vente en gros. Depuis notre cr\u00e9ation, nous avons rassembl\u00e9 plus de 3 000 fournisseurs v\u00e9rifi\u00e9s repr\u00e9sentant chaque segment de la cha\u00eene d'approvisionnement beaut\u00e9 mondiale.",
      ru: 'Стратегически расположенный в Гуанчжоу, столице провинции Гуандун и центре производственной экосистемы Китая, Meibo City занимает более 300 000 квадратных метров оптовых площадей. С момента основания мы объединили более 3 000 проверенных поставщиков, представляющих все сегменты глобальной цепочки поставок бьюти-индустрии.',
      ar: 'يقع مييبو سيتي في موقع استراتيجي بمدينة قوانغتشو، عاصمة مقاطعة قوانغدونغ وقلب النظام الصناعي الصيني، ويمتد على مساحة تزيد عن 300,000 متر مربع من مساحات البيع بالجملة المنسقة. منذ تأسيسنا، نمونا لنضم أكثر من 3,000 مورد موثق يمثلون كل قطاع من سلسلة توريد التجميل العالمية.'
    },
    'about.who.p2': {
      en: 'We are more than a marketplace \u2014 we are a full-service B2B ecosystem that connects international buyers with premium Chinese manufacturers. Our platform facilitates everything from product discovery and sampling to contract negotiation and logistics coordination.',
      fr: "Nous sommes plus qu'un march\u00e9 \u2014 nous sommes un \u00e9cosyst\u00e8me B2B complet qui connecte les acheteurs internationaux avec les meilleurs fabricants chinois. Notre plateforme facilite tout, de la d\u00e9couverte de produits et l'\u00e9chantillonnage \u00e0 la n\u00e9gociation de contrats et la coordination logistique.",
      ru: 'Мы больше, чем просто торговая площадка — мы полноценная B2B-экосистема, соединяющая международных покупателей с ведущими китайскими производителями. Наша платформа обеспечивает все — от поиска продуктов и образцов до переговоров по контрактам и координации логистики.',
      ar: 'نحن أكثر من مجرد سوق — نحن منظومة B2B متكاملة تربط المشترين الدوليين بأفضل المصنعين الصينيين. تسهّل منصتنا كل شيء بدءاً من اكتشاف المنتجات وأخذ العينات وصولاً إلى التفاوض على العقود وتنسيق الخدمات اللوجستية.'
    },
    'about.who.feat1.title': { en: 'Verified Suppliers', fr: 'Fournisseurs v\u00e9rifi\u00e9s', ru: 'Проверенные поставщики', ar: 'موردون موثقون' },
    'about.who.feat1.desc': { en: 'All 3,000+ suppliers undergo rigorous quality and compliance checks', fr: 'Plus de 3 000 fournisseurs soumis \u00e0 des contr\u00f4les rigoureux de qualit\u00e9 et de conformit\u00e9', ru: 'Все 3 000+ поставщиков проходят строгие проверки качества и соответствия', ar: 'يخضع جميع الموردين البالغ عددهم أكثر من 3,000 لفحوصات صارمة للجودة والامتثال' },
    'about.who.feat2.title': { en: 'One-Stop Sourcing', fr: 'Sourcing tout-en-un', ru: 'Комплексный сорсинг', ar: 'توريد شامل' },
    'about.who.feat2.desc': { en: 'Full product spectrum under one roof with multilingual trade support', fr: 'Gamme compl\u00e8te de produits sous un m\u00eame toit avec support commercial multilingue', ru: 'Полный спектр продуктов под одной крышей с многоязычной торговой поддержкой', ar: 'مجموعة كاملة من المنتجات تحت سقف واحد مع دعم تجاري متعدد اللغات' },
    'about.who.feat3.title': { en: 'Global Logistics', fr: 'Logistique mondiale', ru: 'Глобальная логистика', ar: 'خدمات لوجستية عالمية' },
    'about.who.feat3.desc': { en: 'Dedicated export processing, customs clearance, and shipping partners', fr: 'Traitement des exportations, d\u00e9douanement et partenaires d\u2019exp\u00e9dition d\u00e9di\u00e9s', ru: 'Специализированная обработка экспорта, таможенное оформление и партнеры по доставке', ar: 'معالجة مخصصة للتصدير، تخليص جمركي، وشركاء شحن' },
    'about.who.feat4.title': { en: 'Trade Services', fr: 'Services commerciaux', ru: 'Торговые услуги', ar: 'خدمات تجارية' },
    'about.who.feat4.desc': { en: 'Inspection, certification, OEM/ODM consulting, and payment facilitation', fr: "Inspection, certification, conseil OEM/ODM et facilitation des paiements", ru: 'Инспекция, сертификация, консалтинг OEM/ODM и содействие в оплате', ar: 'فحص، شهادات، استشارات OEM/ODM، وتسهيل المدفوعات' },
    'about.image1': { en: 'Meibo City Complex', fr: 'Complexe Meibo City', ru: 'Комплекс Meibo City', ar: 'مجمع مييبو سيتي' },
    /* Scale Section */
    'about.scale.tag': { en: 'By the Numbers', fr: 'En chiffres', ru: 'В цифрах', ar: 'بالأرقام' },
    'about.scale.title': { en: 'Scale That Matters', fr: 'Une envergure qui compte', ru: 'Масштаб, который имеет значение', ar: 'حجم يُحدث فرقاً' },
    'about.scale.subtitle': { en: 'Industry-leading infrastructure designed for serious B2B trade.', fr: 'Une infrastructure de pointe con\u00e7ue pour le commerce B2B s\u00e9rieux.', ru: 'Инфраструктура отраслевого уровня, созданная для серьезной B2B-торговли.', ar: 'بنية تحتية رائدة في القطاع مصممة للتجارة الجادة بين الشركات.' },
    'about.scale.num1.label': { en: 'Square Meters', fr: 'M\u00e8tres carr\u00e9s', ru: 'Квадратных метров', ar: 'متر مربع' },
    'about.scale.num2.label': { en: 'Verified Suppliers', fr: 'Fournisseurs v\u00e9rifi\u00e9s', ru: 'Проверенных поставщиков', ar: 'مورد موثق' },
    'about.scale.num3.label': { en: 'Product SKUs', fr: 'R\u00e9f\u00e9rences produits', ru: 'Товарных позиций', ar: 'منتج متنوع' },
    'about.scale.num4.label': { en: 'Core Verticals', fr: 'Secteurs cl\u00e9s', ru: 'Ключевых направлений', ar: 'قطاعات أساسية' },
    'about.scale.num5.label': { en: 'Export Countries', fr: "Pays d'exportation", ru: 'Стран экспорта', ar: 'دولة تصدير' },
    'about.scale.num6.label': { en: 'Trade Support', fr: 'Support commercial', ru: 'Торговая поддержка', ar: 'دعم تجاري' },
    'about.scale.num7.label': { en: 'Years of Operation', fr: "Ann\u00e9es d'activit\u00e9", ru: 'Лет работы', ar: 'عاماً من التشغيل' },
    'about.scale.num8.label': { en: 'Monthly Buyers', fr: 'Acheteurs mensuels', ru: 'Покупателей в месяц', ar: 'مشترٍ شهرياً' },
    /* Location Section */
    'about.location.tag': { en: 'Location', fr: 'Emplacement', ru: 'Расположение', ar: 'الموقع' },
    'about.location.title': { en: 'The Guangzhou Advantage', fr: "L'avantage de Canton", ru: 'Преимущество Гуанчжоу', ar: 'ميزة قوانغتشو' },
    'about.location.subtitle': { en: "Positioned in the world's most dynamic manufacturing region with unmatched logistics connectivity.", fr: "Positionn\u00e9 dans la r\u00e9gion manufacturi\u00e8re la plus dynamique du monde avec une connectivit\u00e9 logistique in\u00e9gal\u00e9e.", ru: 'Расположен в самом динамичном производственном регионе мира с непревзойденной логистической связностью.', ar: 'موقعنا في أكثر مناطق التصنيع ديناميكية في العالم مع اتصال لوجستي لا مثيل له.' },
    'about.location.heading': { en: 'Gateway to Global Trade', fr: 'Porte d\u2019entr\u00e9e du commerce mondial', ru: 'Ворота в мировую торговлю', ar: 'بوابة التجارة العالمية' },
    'about.location.p1': {
      en: "Guangzhou is the capital of Guangdong province, China's largest manufacturing and export hub. The city is home to the Canton Fair, the country's largest trade exhibition, and boasts one of the world's busiest container ports.",
      fr: "Canton est la capitale de la province du Guangdong, le plus grand centre de fabrication et d'exportation de la Chine. La ville accueille la Foire de Canton, la plus grande exposition commerciale du pays, et poss\u00e8de l'un des ports \u00e0 conteneurs les plus actifs au monde.",
      ru: 'Гуанчжоу — столица провинции Гуандун, крупнейшего производственного и экспортного центра Китая. Здесь проходит Кантонская ярмарка, крупнейшая торговая выставка страны, и находится один из самых загруженных контейнерных портов мира.',
      ar: 'قوانغتشو هي عاصمة مقاطعة قوانغدونغ، أكبر مركز تصنيع وتصدير في الصين. تحتضن المدينة معرض كانتون، أكبر معرض تجاري في البلاد، وتضم أحد أكثر موانئ الحاويات ازدحاماً في العالم.'
    },
    'about.location.p2': {
      en: 'Meibo City is strategically located with direct access to major highways, Baiyun International Airport (35 minutes), and Guangzhou Port (45 minutes). This prime positioning enables efficient sample dispatch, container loading, and international shipping to every corner of the globe.',
      fr: "Meibo City est strat\u00e9giquement situ\u00e9 avec un acc\u00e8s direct aux principales autoroutes, \u00e0 l'a\u00e9roport international de Baiyun (35 minutes) et au port de Canton (45 minutes). Ce positionnement privil\u00e9gi\u00e9 permet une exp\u00e9dition efficace des \u00e9chantillons, le chargement des conteneurs et l'exp\u00e9dition internationale vers tous les coins du globe.",
      ru: 'Meibo City стратегически расположен с прямым доступом к основным автомагистралям, международному аэропорту Байюнь (35 минут) и порту Гуанчжоу (45 минут). Это выгодное расположение обеспечивает эффективную отправку образцов, загрузку контейнеров и международную доставку в любую точку мира.',
      ar: 'يتمتع مييبو سيتي بموقع استراتيجي مع وصول مباشر إلى الطرق السريعة الرئيسية، ومطار بايون الدولي (35 دقيقة)، وميناء قوانغتشو (45 دقيقة). يتيح هذا الموقع المتميز إرسال العينات بكفاءة، وتحميل الحاويات، والشحن الدولي إلى كل ركن من أركان العالم.'
    },
    'about.loc.feat1.title': { en: 'Air Freight Hub', fr: 'Plateforme de fret a\u00e9rien', ru: 'Авиагрузовой хаб', ar: 'مركز الشحن الجوي' },
    'about.loc.feat1.desc': { en: '35 minutes to Baiyun International Airport, serving 200+ global destinations', fr: "35 minutes de l'a\u00e9roport international de Baiyun, desservant plus de 200 destinations mondiales", ru: '35 минут до международного аэропорта Байюнь, обслуживающего 200+ направлений по всему миру', ar: '35 دقيقة إلى مطار بايون الدولي، يخدم أكثر من 200 وجهة عالمية' },
    'about.loc.feat2.title': { en: 'Sea Freight Hub', fr: 'Plateforme de fret maritime', ru: 'Морской грузовой хаб', ar: 'مركز الشحن البحري' },
    'about.loc.feat2.desc': { en: "45 minutes to Guangzhou Port, one of the world's top 5 container ports", fr: "45 minutes du port de Canton, l'un des 5 plus grands ports \u00e0 conteneurs au monde", ru: '45 минут до порта Гуанчжоу, одного из 5 крупнейших контейнерных портов мира', ar: '45 دقيقة إلى ميناء قوانغتشو، أحد أكبر 5 موانئ حاويات في العالم' },
    'about.loc.feat3.title': { en: 'Canton Fair Access', fr: 'Acc\u00e8s \u00e0 la Foire de Canton', ru: 'Доступ к Кантонской ярмарке', ar: 'الوصول إلى معرض كانتون' },
    'about.loc.feat3.desc': { en: "20 minutes to the Canton Fair Complex, the world's largest trade exhibition", fr: "20 minutes du complexe de la Foire de Canton, la plus grande exposition commerciale au monde", ru: '20 минут до комплекса Кантонской ярмарки, крупнейшей торговой выставки в мире', ar: '20 دقيقة إلى مجمع معرض كانتون، أكبر معرض تجاري في العالم' },
    'about.loc.feat4.title': { en: 'Supply Chain Depth', fr: "Profondeur de la cha\u00eene d'approvisionnement", ru: 'Глубина цепочки поставок', ar: 'عمق سلسلة التوريد' },
    'about.loc.feat4.desc': { en: "Within 2 hours of China's major cosmetics and packaging manufacturing clusters", fr: "\u00c0 moins de 2 heures des principaux p\u00f4les chinois de fabrication de cosm\u00e9tiques et d'emballages", ru: 'В пределах 2 часов от основных китайских кластеров по производству косметики и упаковки', ar: 'على بُعد ساعتين من أكبر تجمعات تصنيع مستحضرات التجميل والتغليف في الصين' },
    'about.image2': { en: 'Guangzhou Location Map', fr: 'Carte de Canton', ru: 'Карта расположения Гуанчжоу', ar: 'خريطة موقع قوانغتشو' },
    /* CTA */
    'about.cta.tag': { en: 'Visit Us', fr: 'Visitez-nous', ru: 'Посетите нас', ar: 'زورونا' },
    'about.cta.title': {
      en: 'Experience Meibo City<br>Firsthand',
      fr: 'D\u00e9couvrez Meibo City<br>en personne',
      ru: 'Посетите Meibo City<br>лично',
      ar: 'اختبر مييبو سيتي<br>بنفسك'
    },
    'about.cta.subtitle': {
      en: 'Plan your sourcing trip with dedicated buyer support, supplier matching, and on-ground logistics assistance.',
      fr: "Planifiez votre voyage d'approvisionnement avec un support acheteur d\u00e9di\u00e9, la mise en relation avec les fournisseurs et une assistance logistique sur place.",
      ru: 'Спланируйте свою поездку для сорсинга с персональной поддержкой покупателя, подбором поставщиков и помощью в логистике на месте.',
      ar: 'خطط لرحلتك التجارية مع دعم مخصص للمشتري، ومطابقة الموردين، ومساعدة لوجستية على الأرض.'
    },
    'about.cta.btn1': { en: 'Plan Your Visit', fr: 'Planifiez votre visite', ru: 'Спланировать визит', ar: 'خطط لزيارتك' },
    'about.cta.btn2': { en: 'Explore Products', fr: 'Explorer les produits', ru: 'Смотреть продукцию', ar: 'استكشف المنتجات' },

    /* ======================== PRODUCTS.HTML ======================== */
    'products.hero.tag': { en: 'Sourcing Categories', fr: 'Cat\u00e9gories de sourcing', ru: 'Категории сорсинга', ar: 'فئات التوريد' },
    'products.hero.title': { en: 'Product Center', fr: 'Centre de produits', ru: 'Центр продукции', ar: 'مركز المنتجات' },
    'products.hero.subtitle': {
      en: 'Six core verticals, 500,000+ SKUs, and 3,000+ verified suppliers across the complete beauty supply chain.',
      fr: "Six secteurs cl\u00e9s, plus de 500 000 r\u00e9f\u00e9rences et plus de 3 000 fournisseurs v\u00e9rifi\u00e9s couvrant toute la cha\u00eene d'approvisionnement beaut\u00e9.",
      ru: 'Шесть ключевых направлений, 500 000+ товарных позиций и 3 000+ проверенных поставщиков по всей цепочке поставок бьюти-индустрии.',
      ar: 'ستة قطاعات أساسية، أكثر من 500,000 منتج، وأكثر من 3,000 مورد موثق عبر سلسلة توريد التجميل الكاملة.'
    },
    /* Product Category Cards */
    'products.cat1.title': { en: 'Hair & Styling', fr: 'Coiffure & Styling', ru: 'Волосы и укладка', ar: 'العناية بالشعر والتصفيف' },
    'products.cat1.desc': {
      en: 'Professional salon-grade shampoos, conditioners, hair treatments, coloring systems, perm solutions, styling products, wigs, hair extensions, toupees, and professional salon tools including blow dryers, flat irons, curling wands, and hair clippers.',
      fr: 'Shampooings, apr\u00e8s-shampooings, traitements capillaires, syst\u00e8mes de coloration, solutions de permanente, produits coiffants, perruques, extensions capillaires, postiches de qualit\u00e9 professionnelle et outils de salon professionnels, y compris s\u00e8che-cheveux, fers \u00e0 lisser, fers \u00e0 boucler et tondeuses.',
      ru: 'Профессиональные салонные шампуни, кондиционеры, средства для ухода за волосами, системы окрашивания, составы для завивки, стайлинговые продукты, парики, наращивание волос, шиньоны и профессиональные салонные инструменты, включая фены, утюжки, плойки и машинки для стрижки.',
      ar: 'شامبوهات احترافية، بلسم، علاجات الشعر، أنظمة تلوين، محاليل التجعيد، منتجات تصفيف، شعر مستعار، وصلات شعر، وشينيونات، وأدوات صالونات احترافية تشمل مجففات الشعر، مكواة فرد، عصا تجعيد، وماكينات قص الشعر.'
    },
    'products.cat1.count': { en: '20,000+ Products', fr: 'Plus de 20 000 produits', ru: '20 000+ продуктов', ar: 'أكثر من 20,000 منتج' },

    'products.cat2.title': { en: 'Skincare & Beauty', fr: 'Soins de la peau & Beaut\u00e9', ru: 'Уход за кожей и красота', ar: 'العناية بالبشرة والجمال' },
    'products.cat2.desc': {
      en: 'Comprehensive facial and body care lines: cleansers, toners, serums, essences, moisturizers, eye creams, sheet masks, peel-off masks, sunscreens, BB/CC creams, anti-aging formulations, acne treatments, whitening products, and professional derma devices.',
      fr: 'Gammes compl\u00e8tes de soins du visage et du corps : nettoyants, toniques, s\u00e9rums, essences, hydratants, cr\u00e8mes pour les yeux, masques en tissu, masques peel-off, \u00e9crans solaires, cr\u00e8mes BB/CC, formulations anti-\u00e2ge, traitements contre l\u2019acn\u00e9, produits blanchissants et appareils dermiques professionnels.',
      ru: 'Комплексные линии по уходу за лицом и телом: очищающие средства, тоники, сыворотки, эссенции, увлажняющие средства, кремы для век, тканевые маски, пилинг-маски, солнцезащитные средства, BB/CC-кремы, антивозрастные формулы, средства от акне, отбеливающие продукты и профессиональные дерма-устройства.',
      ar: 'خطوط شاملة للعناية بالوجه والجسم: منظفات، تونر، أمصال، إسنس، مرطبات، كريمات العين، أقنعة ورقية، أقنعة تقشير، واقيات شمس، كريمات BB/CC، تركيبات مضادة للشيخوخة، علاجات حب الشباب، منتجات تبييض، وأجهزة جلدية احترافية.'
    },
    'products.cat2.count': { en: '35,000+ Products', fr: 'Plus de 35 000 produits', ru: '35 000+ продуктов', ar: 'أكثر من 35,000 منتج' },

    'products.cat3.title': { en: 'Cosmetics & Makeup', fr: 'Cosm\u00e9tiques & Maquillage', ru: 'Косметика и макияж', ar: 'مستحضرات التجميل والمكياج' },
    'products.cat3.desc': {
      en: 'Full-range color cosmetics: liquid and powder foundations, concealers, setting powders, blushes, bronzers, highlighters, eyeshadow palettes, eyeliners, mascaras, brow products, lipsticks, lip glosses, lip liners, makeup brushes, sponges, and professional makeup kits.',
      fr: 'Gamme compl\u00e8te de cosm\u00e9tiques couleur : fonds de teint liquides et en poudre, correcteurs, poudres fixatrices, blushs, bronzers, highlighters, palettes de fards \u00e0 paupi\u00e8res, eye-liners, mascaras, produits pour les sourcils, rouges \u00e0 l\u00e8vres, gloss, crayons \u00e0 l\u00e8vres, pinceaux de maquillage, \u00e9ponges et kits de maquillage professionnels.',
      ru: 'Полный ассортимент цветной косметики: жидкие и пудровые тональные основы, консилеры, фиксирующие пудры, румяна, бронзеры, хайлайтеры, палетки теней для век, подводки, туши, продукты для бровей, помады, блески для губ, карандаши для губ, кисти для макияжа, спонжи и профессиональные наборы.',
      ar: 'مجموعة كاملة من مستحضرات التجميل الملونة: كريمات أساس سائلة وبودرة، كونسيلر، بودرة تثبيت، أحمر خدود، برونزر، هايلايتر، لوحات ظلال العيون، آيلاينر، ماسكارا، منتجات الحواجب، أحمر شفاه، ملمع شفاه، محدد شفاه، فرش مكياج، إسفنج، وأطقم مكياج احترافية.'
    },
    'products.cat3.count': { en: '40,000+ Products', fr: 'Plus de 40 000 produits', ru: '40 000+ продуктов', ar: 'أكثر من 40,000 منتج' },

    'products.cat4.title': { en: 'Fragrance', fr: 'Parfums', ru: 'Парфюмерия', ar: 'العطور' },
    'products.cat4.desc': {
      en: 'Eau de parfum, eau de toilette, cologne, perfume oils, essential oils, aromatherapy blends, home fragrance diffusers, scented candles, car fresheners, and custom scent development for private label brands. OEM formulation and packaging available.',
      fr: 'Eaux de parfum, eaux de toilette, cologne, huiles de parfum, huiles essentielles, m\u00e9langes d\u2019aromath\u00e9rapie, diffuseurs de parfum d\u2019int\u00e9rieur, bougies parfum\u00e9es, d\u00e9sodorisants pour voiture et d\u00e9veloppement de senteurs sur mesure pour les marques de distributeur. Formulation et emballage OEM disponibles.',
      ru: 'Парфюмерная вода, туалетная вода, одеколон, парфюмерные масла, эфирные масла, смеси для ароматерапии, диффузоры для дома, ароматические свечи, автомобильные освежители и разработка индивидуальных ароматов для собственных брендов. Доступны OEM-формулы и упаковка.',
      ar: 'ماء عطر، ماء تواليت، كولونيا، زيوت عطرية، زيوت أساسية، خلطات علاج عطري، موزعات عطور منزلية، شموع معطرة، معطرات سيارات، وتطوير روائح مخصصة للعلامات التجارية الخاصة. تتوفر تركيبات وتغليف OEM.'
    },
    'products.cat4.count': { en: '15,000+ Products', fr: 'Plus de 15 000 produits', ru: '15 000+ продуктов', ar: 'أكثر من 15,000 منتج' },

    'products.cat5.title': { en: 'Nail & Lashes', fr: 'Ongles & Cils', ru: 'Ногти и ресницы', ar: 'الأظافر والرموش' },
    'products.cat5.desc': {
      en: 'UV/LED gel polishes, soak-off gels, acrylic powder and liquid systems, dip powder, nail art decorations, rhinestones, stickers, stamping kits, nail drills, UV/LED lamps, manicure and pedicure tools, false eyelashes, lash extensions, lash adhesives, and lash tools.',
      fr: 'Vernis gel UV/LED, gels soak-off, syst\u00e8mes de poudre et liquide acryliques, poudre \u00e0 tremper, d\u00e9corations nail art, strass, autocollants, kits de stamping, fraises \u00e0 ongles, lampes UV/LED, outils de manucure et p\u00e9dicure, faux cils, extensions de cils, colles pour cils et outils pour cils.',
      ru: 'УФ/LED гель-лаки, размачиваемые гели, акриловая пудра и жидкостные системы, дип-пудра, украшения для нейл-арта, стразы, наклейки, наборы для стемпинга, фрезы для ногтей, УФ/LED лампы, инструменты для маникюра и педикюра, накладные ресницы, наращивание ресниц, клей для ресниц и инструменты.',
      ar: 'طلاء جل UV/LED، جل قابل للنقع، أنظمة بودرة وسائل أكريليك، بودرة غمس، زخارف فن الأظافر، كريستالات، ملصقات، أطقم ختم، مثاقب أظافر، مصابيح UV/LED، أدوات مانيكير وباديكير، رموش صناعية، وصلات رموش، مواد لاصقة للرموش، وأدوات الرموش.'
    },
    'products.cat5.count': { en: '25,000+ Products', fr: 'Plus de 25 000 produits', ru: '25 000+ продуктов', ar: 'أكثر من 25,000 منتج' },

    'products.cat6.title': { en: 'Machines & Consumables', fr: 'Machines & Consommables', ru: 'Оборудование и расходные материалы', ar: 'الأجهزة والمستلزمات' },
    'products.cat6.desc': {
      en: 'IPL laser machines, diode laser hair removal, RF skin tightening, cavitation machines, hydra facial devices, microdermabrasion, oxygen therapy, LED light therapy, salon beds and chairs, trolleys, magnifying lamps, steamers, wax heaters, and all professional consumables.',
      fr: 'Appareils laser IPL, \u00e9pilation au laser \u00e0 diode, raffermissement cutan\u00e9 RF, appareils \u00e0 cavitation, appareils hydra facial, microdermabrasion, oxyg\u00e9noth\u00e9rapie, th\u00e9rapie par LED, lits et fauteuils de salon, chariots, lampes-loupes, appareils \u00e0 vapeur, chauffe-cire et tous les consommables professionnels.',
      ru: 'IPL лазерные аппараты, диодная лазерная эпиляция, RF лифтинг кожи, кавитационные аппараты, устройства для гидропилинга, микродермабразия, кислородная терапия, LED светотерапия, салонные кровати и кресла, тележки, лампы-лупы, отпариватели, воскоплавы и все профессиональные расходные материалы.',
      ar: 'أجهزة ليزر IPL، إزالة الشعر بالليزر الثنائي، شد البشرة بالترددات الراديوية، أجهزة التجويف، أجهزة هيدرا فيشل، تقشير الجلد الدقيق، العلاج بالأكسجين، العلاج بالضوء LED، أسرة وكراسي الصالونات، عربات، مصابيح مكبرة، أجهزة بخار، سخانات شمع، وجميع المستلزمات الاحترافية.'
    },
    'products.cat6.count': { en: '12,000+ Products', fr: 'Plus de 12 000 produits', ru: '12 000+ продуктов', ar: 'أكثر من 12,000 منتج' },
    /* Sourcing Process */
    'products.process.tag': { en: 'Sourcing Process', fr: 'Processus de sourcing', ru: 'Процесс сорсинга', ar: 'عملية التوريد' },
    'products.process.title': { en: 'How to Source from Meibo City', fr: 'Comment sourcer depuis Meibo City', ru: 'Как закупать в Meibo City', ar: 'كيفية التوريد من مييبو سيتي' },
    'products.process.subtitle': { en: 'A streamlined process designed for international B2B buyers.', fr: 'Un processus simplifi\u00e9 con\u00e7u pour les acheteurs B2B internationaux.', ru: 'Оптимизированный процесс, разработанный для международных B2B-покупателей.', ar: 'عملية مبسطة مصممة للمشترين الدوليين من الشركات.' },
    'products.process.step1.title': { en: 'Submit Inquiry', fr: 'Soumettre une demande', ru: 'Отправить запрос', ar: 'تقديم استفسار' },
    'products.process.step1.desc': { en: 'Tell us your product requirements, target market, and volume expectations.', fr: 'Indiquez vos exigences produits, votre march\u00e9 cible et vos attentes en volume.', ru: 'Сообщите нам ваши требования к продукции, целевой рынок и ожидаемые объемы.', ar: 'أخبرنا بمتطلبات منتجك، وسوقك المستهدف، وتوقعات الحجم.' },
    'products.process.step2.title': { en: 'Supplier Matching', fr: 'Mise en relation fournisseurs', ru: 'Подбор поставщиков', ar: 'مطابقة الموردين' },
    'products.process.step2.desc': { en: 'We match you with pre-vetted suppliers that meet your quality and price criteria.', fr: 'Nous vous mettons en relation avec des fournisseurs pr\u00e9-v\u00e9rifi\u00e9s r\u00e9pondant \u00e0 vos crit\u00e8res de qualit\u00e9 et de prix.', ru: 'Мы подбираем для вас предварительно проверенных поставщиков, соответствующих вашим критериям качества и цены.', ar: 'نقوم بمطابقتك مع موردين تم فحصهم مسبقاً يلبون معايير الجودة والسعر الخاصة بك.' },
    'products.process.step3.title': { en: 'Sample & Negotiate', fr: '\u00c9chantillonner et n\u00e9gocier', ru: 'Образцы и переговоры', ar: 'العينات والتفاوض' },
    'products.process.step3.desc': { en: 'Request samples, negotiate terms, and finalize specifications directly with suppliers.', fr: 'Demandez des \u00e9chantillons, n\u00e9gociez les conditions et finalisez les sp\u00e9cifications directement avec les fournisseurs.', ru: 'Запросите образцы, согласуйте условия и утвердите спецификации напрямую с поставщиками.', ar: 'اطلب عينات، وتفاوض على الشروط، وأتم المواصفات مباشرة مع الموردين.' },
    'products.process.step4.title': { en: 'Ship Worldwide', fr: 'Exp\u00e9dition mondiale', ru: 'Доставка по всему миру', ar: 'الشحن حول العالم' },
    'products.process.step4.desc': { en: 'Our logistics partners handle customs, documentation, and global delivery.', fr: 'Nos partenaires logistiques g\u00e8rent les douanes, la documentation et la livraison mondiale.', ru: 'Наши логистические партнеры занимаются таможней, документацией и глобальной доставкой.', ar: 'يتولى شركاؤنا اللوجستيون إجراءات الجمارك والتوثيق والتسليم العالمي.' },
    /* CTA */
    'products.cta.tag': { en: 'Get Started', fr: 'Commencez', ru: 'Начните', ar: 'ابدأ الآن' },
    'products.cta.title': { en: 'Ready to Source?', fr: 'Pr\u00eat \u00e0 sourcer ?', ru: 'Готовы к сорсингу?', ar: 'هل أنت مستعد للتوريد؟' },
    'products.cta.subtitle': { en: 'Share your requirements and get matched with the best suppliers for your market.', fr: 'Partagez vos exigences et soyez mis en relation avec les meilleurs fournisseurs pour votre march\u00e9.', ru: 'Поделитесь своими требованиями и получите подборку лучших поставщиков для вашего рынка.', ar: 'شارك متطلباتك واحصل على أفضل الموردين المناسبين لسوقك.' },
    'products.cta.btn1': { en: 'Send Inquiry Now', fr: 'Envoyer une demande', ru: 'Отправить запрос сейчас', ar: 'أرسل استفسارك الآن' },

    /* ======================== CONTACT.HTML ======================== */
    'contact.hero.tag': { en: 'Get In Touch', fr: 'Contactez-nous', ru: 'Свяжитесь с нами', ar: 'تواصل معنا' },
    'contact.hero.title': { en: 'Contact Us', fr: 'Contactez-nous', ru: 'Контакты', ar: 'اتصل بنا' },
    'contact.hero.subtitle': {
      en: 'Ready to source premium beauty products? Our trade team is here to assist buyers from around the world.',
      fr: "Pr\u00eat \u00e0 sourcer des produits de beaut\u00e9 premium ? Notre \u00e9quipe commerciale est l\u00e0 pour aider les acheteurs du monde entier.",
      ru: 'Готовы закупать премиальные бьюти-продукты? Наша торговая команда готова помочь покупателям со всего мира.',
      ar: 'هل أنت مستعد لتوريد منتجات التجميل الفاخرة؟ فريقنا التجاري هنا لمساعدة المشترين من جميع أنحاء العالم.'
    },
    'contact.reach.tag': { en: 'Reach Out', fr: 'Contactez-nous', ru: 'Обратитесь к нам', ar: 'تواصل معنا' },
    'contact.reach.heading': {
      en: "Let's Start a<br>Conversation",
      fr: 'Commen\u00e7ons une<br>conversation',
      ru: 'Давайте начнем<br>разговор',
      ar: 'لنبدأ<br>محادثة'
    },
    'contact.reach.p': {
      en: "Whether you're a beauty salon chain looking for reliable suppliers, a brand seeking OEM/ODM partners, or a distributor expanding your product range \u2014 our international trade team is ready to help.",
      fr: "Que vous soyez une cha\u00eene de salons de beaut\u00e9 \u00e0 la recherche de fournisseurs fiables, une marque cherchant des partenaires OEM/ODM ou un distributeur souhaitant \u00e9largir sa gamme de produits \u2014 notre \u00e9quipe de commerce international est pr\u00eate \u00e0 vous aider.",
      ru: 'Являетесь ли вы сетью салонов красоты в поиске надежных поставщиков, брендом, ищущим OEM/ODM партнеров, или дистрибьютором, расширяющим ассортимент — наша международная торговая команда готова помочь.',
      ar: 'سواء كنت سلسلة صالونات تجميل تبحث عن موردين موثوقين، أو علامة تجارية تبحث عن شركاء OEM/ODM، أو موزعاً يوسع نطاق منتجاته — فريقنا التجاري الدولي مستعد للمساعدة.'
    },
    'contact.addr.title': { en: 'Address', fr: 'Adresse', ru: 'Адрес', ar: 'العنوان' },
    'contact.addr.line1': { en: 'Guangzhou Meibo City', fr: 'Guangzhou Meibo City', ru: 'Guangzhou Meibo City', ar: 'مييبو سيتي قوانغتشو' },
    'contact.addr.line2': { en: 'Guangzhou, Guangdong Province', fr: 'Canton, Province du Guangdong', ru: 'Гуанчжоу, провинция Гуандун', ar: 'قوانغتشو، مقاطعة قوانغدونغ' },
    'contact.addr.line3': { en: "People's Republic of China", fr: 'R\u00e9publique populaire de Chine', ru: 'Китайская Народная Республика', ar: 'جمهورية الصين الشعبية' },
    'contact.email.title': { en: 'Email', fr: 'E-mail', ru: 'Эл. почта', ar: 'البريد الإلكتروني' },
    'contact.email.desc': { en: 'General & Trade Inquiries', fr: 'Demandes g\u00e9n\u00e9rales et commerciales', ru: 'Общие и торговые запросы', ar: 'استفسارات عامة وتجارية' },
    'contact.phone.title': { en: 'Phone', fr: 'T\u00e9l\u00e9phone', ru: 'Телефон', ar: 'الهاتف' },
    'contact.phone.desc': { en: 'International Trade Department', fr: 'D\u00e9partement du commerce international', ru: 'Отдел международной торговли', ar: 'قسم التجارة الدولية' },
    'contact.hours.title': { en: 'Business Hours', fr: 'Heures d\u2019ouverture', ru: 'Часы работы', ar: 'ساعات العمل' },
    'contact.hours.desc': {
      en: 'Monday \u2013 Saturday<br>9:00 AM \u2013 6:00 PM (GMT+8)',
      fr: 'Lundi \u2013 Samedi<br>9h00 \u2013 18h00 (GMT+8)',
      ru: 'Понедельник \u2013 Суббота<br>9:00 \u2013 18:00 (GMT+8)',
      ar: 'الاثنين \u2013 السبت<br>9:00 صباحاً \u2013 6:00 مساءً (GMT+8)'
    },
    /* Contact Form */
    'contact.form.title': { en: 'Send an Inquiry', fr: 'Envoyer une demande', ru: 'Отправить запрос', ar: 'أرسل استفساراً' },
    'contact.form.name.label': { en: 'Full Name *', fr: 'Nom complet *', ru: 'Полное имя *', ar: 'الاسم الكامل *' },
    'contact.form.name.placeholder': { en: 'Your full name', fr: 'Votre nom complet', ru: 'Ваше полное имя', ar: 'اسمك الكامل' },
    'contact.form.company.label': { en: 'Company Name', fr: 'Nom de l\u2019entreprise', ru: 'Название компании', ar: 'اسم الشركة' },
    'contact.form.company.placeholder': { en: 'Your company name', fr: 'Nom de votre entreprise', ru: 'Название вашей компании', ar: 'اسم شركتك' },
    'contact.form.email.label': { en: 'Email Address *', fr: 'Adresse e-mail *', ru: 'Адрес эл. почты *', ar: 'البريد الإلكتروني *' },
    'contact.form.email.placeholder': { en: 'your@email.com', fr: 'votre@email.com', ru: 'votre@email.com', ar: 'your@email.com' },
    'contact.form.phone.label': { en: 'Phone / WhatsApp', fr: 'T\u00e9l\u00e9phone / WhatsApp', ru: 'Телефон / WhatsApp', ar: 'الهاتف / واتساب' },
    'contact.form.phone.placeholder': { en: '+[country code] [number]', fr: '+[indicatif] [num\u00e9ro]', ru: '+[код страны] [номер]', ar: '+[رمز الدولة] [رقم]' },
    'contact.form.interest.label': { en: 'Area of Interest', fr: "Secteur d'int\u00e9r\u00eat", ru: 'Сфера интереса', ar: 'مجال الاهتمام' },
    'contact.form.interest.opt0': { en: 'Select a category', fr: 'S\u00e9lectionnez une cat\u00e9gorie', ru: 'Выберите категорию', ar: 'اختر فئة' },
    'contact.form.interest.opt1': { en: 'Hair & Styling', fr: 'Coiffure & Styling', ru: 'Волосы и укладка', ar: 'العناية بالشعر والتصفيف' },
    'contact.form.interest.opt2': { en: 'Skincare & Beauty', fr: 'Soins de la peau & Beaut\u00e9', ru: 'Уход за кожей и красота', ar: 'العناية بالبشرة والجمال' },
    'contact.form.interest.opt3': { en: 'Cosmetics & Makeup', fr: 'Cosm\u00e9tiques & Maquillage', ru: 'Косметика и макияж', ar: 'مستحضرات التجميل والمكياج' },
    'contact.form.interest.opt4': { en: 'Fragrance', fr: 'Parfums', ru: 'Парфюмерия', ar: 'العطور' },
    'contact.form.interest.opt5': { en: 'Nail & Lashes', fr: 'Ongles & Cils', ru: 'Ногти и ресницы', ar: 'الأظافر والرموش' },
    'contact.form.interest.opt6': { en: 'Machines & Consumables', fr: 'Machines & Consommables', ru: 'Оборудование и расходники', ar: 'الأجهزة والمستلزمات' },
    'contact.form.interest.opt7': { en: 'General / Multiple Categories', fr: 'G\u00e9n\u00e9ral / Plusieurs cat\u00e9gories', ru: 'Общее / Несколько категорий', ar: 'عام / فئات متعددة' },
    'contact.form.interest.opt8': { en: 'Planning a Visit', fr: 'Planification d\u2019une visite', ru: 'Планирование визита', ar: 'التخطيط لزيارة' },
    'contact.form.msg.label': { en: 'Your Message *', fr: 'Votre message *', ru: 'Ваше сообщение *', ar: 'رسالتك *' },
    'contact.form.msg.placeholder': {
      en: 'Tell us about your sourcing needs, target market, and any specific product requirements...',
      fr: 'Parlez-nous de vos besoins de sourcing, de votre march\u00e9 cible et de vos exigences produits sp\u00e9cifiques...',
      ru: 'Расскажите нам о ваших потребностях в сорсинге, целевом рынке и конкретных требованиях к продукции...',
      ar: 'أخبرنا عن احتياجاتك في التوريد، وسوقك المستهدف، وأي متطلبات منتج محددة...'
    },
    'contact.form.submit': { en: 'Submit Inquiry', fr: 'Envoyer la demande', ru: 'Отправить запрос', ar: 'إرسال الاستفسار' },
    'contact.map': { en: 'Map \u2014 Guangzhou Meibo City, Guangdong, China', fr: 'Carte \u2014 Guangzhou Meibo City, Guangdong, Chine', ru: 'Карта \u2014 Guangzhou Meibo City, Гуандун, Китай', ar: 'الخريطة \u2014 مييبو سيتي، قوانغتشو، قوانغدونغ، الصين' }
  };

  /* ================================================================
     i18n Engine
     ================================================================ */

  /** Get stored or detected language */
  function getLang() {
    // 1. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    // 2. Detect from browser
    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0];
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

    // Special cases: ar-* => ar, fr-* => fr, ru-* => ru
    for (const sl of SUPPORTED_LANGS) {
      if (navigator.language && navigator.language.startsWith(sl)) return sl;
    }

    return DEFAULT_LANG;
  }

  let currentLang = getLang();

  /** Translate a key */
  function t(key) {
    const entry = dict[key];
    if (!entry) return key;
    return entry[currentLang] || entry[DEFAULT_LANG] || key;
  }

  /** Apply translations to all data-i18n elements */
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key);
      if (translated !== key) {
        // For elements that contain HTML (like <br>), use innerHTML
        if (translated.includes('<br>') || translated.includes('<') && translated.includes('>')) {
          el.innerHTML = translated;
        } else {
          el.textContent = translated;
        }
      }
    });

    // Translate placeholder attributes
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translated = t(key);
      if (translated !== key) {
        el.setAttribute('placeholder', translated);
      }
    });

    // Translate option text for select elements
    const options = document.querySelectorAll('[data-i18n-option]');
    options.forEach(el => {
      const key = el.getAttribute('data-i18n-option');
      const translated = t(key);
      if (translated !== key) {
        el.textContent = translated;
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // RTL for Arabic
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }

    // Update SEO meta tags
    updateMetaTags();
  }

  /** Update SEO-relevant meta tags */
  function updateMetaTags() {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descKey = getPageDescKey();
      if (descKey) {
        const translated = t(descKey);
        if (translated !== descKey) metaDesc.setAttribute('content', translated);
      }
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && currentLang !== 'en') {
      const localeMap = { fr: 'fr_FR', ru: 'ru_RU', ar: 'ar_SA' };
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute('content', localeMap[currentLang] || 'en_US');
    }

    // hreflang links
    updateHreflang();
  }

  function getPageDescKey() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about.hero.subtitle';
    if (path.includes('products')) return 'products.hero.subtitle';
    if (path.includes('contact')) return 'contact.hero.subtitle';
    return 'index.hero.subtitle';
  }

  /** Add hreflang alternate links */
  function updateHreflang() {
    // Remove existing hreflang links
    document.querySelectorAll('link[hreflang]').forEach(l => l.remove());

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const base = 'https://meibo-city.com/';

    SUPPORTED_LANGS.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = base + currentPage + '?lang=' + lang;
      document.head.appendChild(link);
    });

    // x-default
    const xdef = document.createElement('link');
    xdef.rel = 'alternate';
    xdef.hreflang = 'x-default';
    xdef.href = base + currentPage;
    document.head.appendChild(xdef);
  }

  /** Build the language switcher UI */
  function buildLangSwitcher() {
    const container = document.getElementById('lang-switcher');
    if (!container) return;

    const langNames = {
      en: 'English',
      fr: 'Fran\u00e7ais',
      ru: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
      ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
    };

    const langFlags = {
      en: '\uD83C\uDDEC\uD83C\uDDE7',
      fr: '\uD83C\uDDEB\uD83C\uDDF7',
      ru: '\uD83C\uDDF7\uD83C\uDDFA',
      ar: '\uD83C\uDDE6\uD83C\uDDEA'
    };

    let html = '<button class="lang-btn" id="langBtn" aria-label="Switch language">';
    html += '<span class="lang-current">' + langFlags[currentLang] + ' ' + langNames[currentLang] + '</span>';
    html += '<span class="lang-arrow">\u25BC</span>';
    html += '</button>';
    html += '<ul class="lang-dropdown" id="langDropdown">';
    SUPPORTED_LANGS.forEach(lang => {
      html += '<li><a href="#" data-lang="' + lang + '" class="' + (lang === currentLang ? 'active' : '') + '">';
      html += langFlags[lang] + ' ' + langNames[lang];
      html += '</a></li>';
    });
    html += '</ul>';

    container.innerHTML = html;

    // Event listeners
    const btn = document.getElementById('langBtn');
    const dropdown = document.getElementById('langDropdown');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        if (lang && SUPPORTED_LANGS.includes(lang)) {
          switchLang(lang);
          dropdown.classList.remove('open');
        }
      });
    });
  }

  /** Switch language */
  function switchLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    buildLangSwitcher();
  }

  /** Initialize on DOM ready */
  function init() {
    applyTranslations();
    buildLangSwitcher();

    // Expose API
    window.MeiboI18n = {
      t: t,
      getLang: function () { return currentLang; },
      switchLang: switchLang,
      getSupported: function () { return SUPPORTED_LANGS.slice(); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
