/* * PROJECT: Universal Engine - Multi-Language Alphabet Repository
 * DEVELOPER: Kevin Frutiger (Werewolf3788 / DJ Werewolf)
 * TIMESTAMP: Wednesday, May 6, 2026 | 04:39 PM ET
 * * WORKFLOW & INTEGRITY PROTOCOL:
 * - Compatible with GitHub Pages, Firebase, CodePen, StreamElements.
 * - GitHack Integration: Use relative paths for assets.
 * - Branding (KF Signature): K = #FF4500, F = #000000.
 * - Analytics: Personal (G-Z9M5LXQ5XN).
 * * DYNAMIC LOCALIZATION PROTOCOL:
 * - Implement logic to fully transition UI/content on language change request.
 * - Conditional Typography: Outline rendered only if valid color is present.
 * - If no outline color, font-weight must NOT default to bold.
 * * NO STRIPPING, NO COMPRESSING. DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE.
 */

const LANGUAGE_ALPHABETS = {
    "en": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "es": "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz",
    "fr": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÆÇÈÉÊËÎÏÔŒÙÛÜŸàâæçèéêëîïôœùûüÿ",
    "de": "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜßabcdefghijklmnopqrstuvwxyzäöüß",
    "it": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÈÉÌÒÙàèéìòù",
    "pt": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÂÃÀÇÉÊÍÓÔÕÚáâãàçéêíóôõú",
    "ru": "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    "el": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω",
    "ar": "ابتثجحخدذرزسشصضطظعغفقكلمنهوي",
    "hi": "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह",
    "ja_hiragana": "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
    "ja_katakana": "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
    "ko": "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ",
    "zh_pinyin": "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ",
    "tr": "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijk-lmnoöprsştuüvyz",
    "vi": "AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXYaăâbcdđeêghiklmn-oôơpqrstuưvxy",
    "he": "אבגדהוזחטיכלמנסעפצקרשת",
    "th": "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ",
    "pl": "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻaąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż",
    "uk": "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя"
};

/**
 * Global State for Typography Preferences
 * Saves to cookies for persistence across sessions.
 */
const updateTypographyPreferences = (outlineColor, fontFamily) => {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1); // 1 year persistence
    
    if (outlineColor) document.cookie = `ui_outline_color=${outlineColor}; expires=${expiry.toUTCString()}; path=/`;
    if (fontFamily) document.cookie = `ui_font_family=${fontFamily}; expires=${expiry.toUTCString()}; path=/`;
};

/**
 * Protocol Function: Apply Language Alphabet & Styling
 * This handles the logic for outline-based font weight and language switching.
 * * @param {string} langCode - ISO 639-1 code (e.g., 'en', 'es', 'ru')
 * @param {string|null} outlineColor - Hex or CSS color string for text outline
 */
function applyLanguageProtocol(langCode, outlineColor = null) {
    const alphabet = LANGUAGE_ALPHABETS[langCode] || LANGUAGE_ALPHABETS['en'];
    console.log(`[Master Protocol] Language initialized: ${langCode}`);
    
    // Select all elements designated for dynamic protocol styling
    const dynamicElements = document.querySelectorAll('.dynamic-text, .outlined-text, h1, h2, h3, p');
    
    dynamicElements.forEach(el => {
        if (outlineColor && outlineColor !== 'transparent' && outlineColor !== '') {
            // Apply high-contrast outline logic
            el.style.webkitTextStroke = `1px ${outlineColor}`;
            el.style.textStroke = `1px ${outlineColor}`;
            // If color is present, font weight follows standard/bold as defined by specific UI settings
        } else {
            // CONDITIONAL TYPOGRAPHY: No color = No outline and NO default bolding.
            el.style.webkitTextStroke = "0px";
            el.style.textStroke = "0px";
            el.style.fontWeight = "normal"; 
        }
    });

    // Branding Watermark (KF Signature) Logic
    const ensureBranding = () => {
        if (!document.getElementById('kf-signature')) {
            const footer = document.createElement('div');
            footer.id = 'kf-signature';
            footer.style.position = 'fixed';
            footer.style.bottom = '10px';
            footer.style.left = '10px';
            footer.style.display = 'flex';
            footer.style.alignItems = 'center';
            footer.style.fontFamily = 'Arial, sans-serif';
            footer.style.fontSize = '24px';
            footer.style.fontWeight = 'bold';
            footer.style.zIndex = '9999';
            footer.innerHTML = `
                <span style="color: #FF4500; transform: scaleX(-1); display: inline-block; z-index: 2;">K</span>
                <span style="color: #000000; margin-left: -0.22em; z-index: 1;">F</span>
            `;
            document.body.appendChild(footer);
        }
    };
    
    ensureBranding();

    return alphabet;
}

// Export for module-based environments (Firebase/Node)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGE_ALPHABETS, applyLanguageProtocol };
} else {
    // Global availability for GitHub Pages/CodePen
    window.LANGUAGE_ALPHABETS = LANGUAGE_ALPHABETS;
    window.applyLanguageProtocol = applyLanguageProtocol;
}
