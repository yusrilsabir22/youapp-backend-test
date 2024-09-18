export function getZodiacSign(day: number, month: number, year: number) {
    const chineseSign = getChineseZodiacSign(year);
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return { horoscope: 'Aries', zodiac: chineseSign };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return { horoscope: 'Taurus', zodiac: chineseSign };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
        return { horoscope: 'Gemini', zodiac: chineseSign };
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
        return { horoscope: 'Cancer', zodiac: chineseSign };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return { horoscope: 'Leo', zodiac: chineseSign };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return { horoscope: 'Virgo', zodiac: chineseSign };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
        return { horoscope: 'Libra', zodiac: chineseSign };
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
        return { horoscope: 'Scorpio', zodiac: chineseSign };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return { horoscope: 'Sagittarius', zodiac: chineseSign };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return { horoscope: 'Capricorn', zodiac: chineseSign };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return { horoscope: 'Aquarius', zodiac: chineseSign };
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
        return { horoscope: 'Pisces', zodiac: chineseSign };
    }
    return { error: 'Invalid date' };
}

function getChineseZodiacSign(year: number): string {
    const zodiacSigns = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat',
        'Monkey', 'Rooster', 'Dog', 'Pig'
    ];

    // Chinese zodiac is based on a 12-year cycle
    const index = (year - 4) % 12; // 4 is the base year (Year of the Rat in 1924)
    return zodiacSigns[index];
}
