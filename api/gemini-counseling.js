export default async function handler(req, res) {
  // 2. Gemini API 호출은 Vercel Serverless Function에서 처리한다.
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { studentAlias, gradeSummary, learningTraits, teacherConcern } = req.body;

  if (!studentAlias || !gradeSummary || !learningTraits || !teacherConcern) {
    return res.status(400).json({ success: false, error: '필수 값이 누락되었습니다.' });
  }

  // 4. Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 한다.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.' });
  }

  const prompt = `당신은 교사를 돕는 AI 학생 상담 전략 도우미입니다. 
다음 원칙을 반드시 지켜주세요:
1. 학생을 단정적으로 판단하거나 진단하지 마세요. (예: "의지가 부족하다", "주의력 문제가 있다", "심리적 문제가 있다" 등)
2. 교사가 학생을 이해하고 대화할 수 있도록 돕는 방향으로 응답하세요.

다음 데이터를 바탕으로 상담 전략을 제안해 주세요.
- 학생 가명: ${studentAlias}
- 성적 요약: ${gradeSummary}
- 학습 특성: ${learningTraits}
- 교사 고민: ${teacherConcern}

응답은 반드시 다음 형식으로 표시하세요:
1. 현재 상황 요약
2. 학생 데이터 기반 해석
3. 상담 접근 전략
4. 교사가 던질 수 있는 질문 3개
5. 피해야 할 말 또는 주의점
6. 다음 수업에서 해볼 수 있는 작은 지원`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ success: false, error: `Gemini API 오류: ${errorText}` });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "응답을 생성할 수 없습니다.";

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
