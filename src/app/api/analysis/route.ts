import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const PROMPT = (city: string) => `
אתה מומחה נדל"ן וחוקר עירוני ישראלי. בצע ניתוח מקיף על ${city} בישראל.

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
    "newApartment5rooms": "מחיר ממוצע דירה חדשה 5 חדרים",
    "newApartment6rooms": "מחיר ממוצע דירה חדשה 6 חדרים",
    "secondHandApartment5rooms": "מחיר ממוצע יד שניה (עד 10 שנים) 5 חדרים",
    "secondHandApartment6rooms": "מחיר ממוצע יד שניה (עד 10 שנים) 6 חדרים"
  },
  "ultraOrthodox": "כמה חרדים לעומת חילוניים, האם העיר מוגדרת חרדית",
  "recommendedNeighborhoods": "שכונות מומלצות לפי רמת השכלה",
  "newNeighborhoodsList": "רשימת שכונות חדשות",
  "academicEmployment": "תעסוקה לאקדמיים - אפשרויות ומרכזי תעסוקה סמוכים",
  "engineerEmployment": "תעסוקה למהנדסים - פארקי היי-טק סמוכים",
  "taxBenefits": "הטבות מס עירוניות/ממשלתיות",
  "borderProximity": "קרבה לגבול, בעיות חדירה לישוב, ביטחון"
}
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY חסר — הוסף את המפתח בהגדרות Vercel ופרסם מחדש' },
      { status: 503 }
    );
  }

  let city: string;
  try {
    ({ city } = await req.json());
    if (!city) return Response.json({ error: 'חסר שם עיר' }, { status: 400 });
  } catch {
    return Response.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  // Stream SSE so Vercel doesn't cut us off at 10 s
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      try {
        let fullText = '';

        const msgStream = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 2000,
          messages: [{ role: 'user', content: PROMPT(city) }],
        });

        for await (const event of msgStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullText += event.delta.text;
            // Heartbeat so the connection stays alive on slow networks
            send({ heartbeat: true });
          }
        }

        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('תשובה לא תקינה מה-AI');

        const analysis = JSON.parse(jsonMatch[0]);
        send({ analysis, done: true });
      } catch (e) {
        send({ error: (e as Error).message, done: true });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
