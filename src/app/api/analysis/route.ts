import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT = (city: string) => `
אתה מומחה נדל"ן וחוקר עירוני ישראלי. בצע ניתוח מקיף ומפורט על ${city} בישראל.

ענה אך ורק ב-JSON תקני, ללא טקסט נוסף, בפורמט הבא:
{
  "city": "${city}",
  "population": "מספר תושבים משוער",
  "education": {
    "kindergartens": "כמות גנים ורמתם",
    "elementarySchools": "כמות בתי ספר יסודיים ורמתם",
    "highSchools": "כמות תיכונים ורמתם",
    "level": "ציון כולל לחינוך (גבוה/בינוני/נמוך) והסבר קצר"
  },
  "academics": "אחוז אקדמיים לעומת לא אקדמיים",
  "newNeighborhoods": "כמה שכונות חדשות הוקמו בשנים האחרונות",
  "crimeLevel": "רמת פשיעה (גבוהה/בינונית/נמוכה) עם הסבר",
  "schoolViolence": "רמת אלימות בבתי ספר וגנים",
  "cityViolence": "האם העיר בטוחה לילדים, רמת אלימות כללית",
  "arabBedouinPresence": "האם יש בדואים/ערבים בעיר, אחוז מהאוכלוסייה",
  "medicalCenters": "מרכזים רפואיים וקופות חולים",
  "classSize": "כמות תלמידים ממוצעת בכיתה",
  "specialEducation": "חינוך מיוחד - קיום ורמה",
  "prices": {
    "newApartment5rooms": "מחיר ממוצע דירה חדשה 5 חדרים (סטנדרטית, גן, פנטהאוז)",
    "newApartment6rooms": "מחיר ממוצע דירה חדשה 6 חדרים (סטנדרטית, גן, פנטהאוז)",
    "secondHandApartment5rooms": "מחיר ממוצע יד שניה (עד 10 שנים) 5 חדרים",
    "secondHandApartment6rooms": "מחיר ממוצע יד שניה (עד 10 שנים) 6 חדרים"
  },
  "ultraOrthodox": "כמה חרדים לעומת חילוניים, האם העיר מוגדרת חרדית",
  "recommendedNeighborhoods": "שכונות מומלצות לפי רמת השכלה (חדשות וישנות)",
  "newNeighborhoodsList": "רשימת שכונות חדשות",
  "academicEmployment": "תעסוקה לאקדמיים - אפשרויות ומרכזי תעסוקה סמוכים",
  "engineerEmployment": "תעסוקה למהנדסים - אפשרויות ופארקי היי-טק סמוכים",
  "taxBenefits": "הטבות מס עירוניות/ממשלתיות לתושבים",
  "borderProximity": "קרבה לגבול, בעיות חדירה לישוב, ביטחון"
}
`;

export async function POST(req: NextRequest) {
  try {
    const { city } = await req.json();
    if (!city) return NextResponse.json({ error: 'חסר שם עיר' }, { status: 400 });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: PROMPT(city) }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('תשובה לא תקינה');

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
